import { beforeEach, describe, expect, it, vi } from 'vitest'

const interceptors = vi.hoisted(() => {
  const client = vi.fn().mockResolvedValue({ status: 200 })
  client.interceptors = {
    request: { use: vi.fn((success) => { interceptors.request = success }) },
    response: {
      use: vi.fn((success, error) => {
        interceptors.responseSuccess = success
        interceptors.responseError = error
      }),
    },
  }
  return {
    request: null,
    responseSuccess: null,
    responseError: null,
    client,
    post: vi.fn(),
  }
})

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => interceptors.client),
    post: interceptors.post,
  },
}))

import { establecerTokenAcceso, renovarSesionHttp } from './http'

describe('HTTP client authentication', () => {
  beforeEach(() => {
    localStorage.clear()
    interceptors.client.mockClear()
    interceptors.post.mockReset()
    establecerTokenAcceso(null)
  })

  it('keeps the access token in memory and attaches it only to protected requests', () => {
    establecerTokenAcceso('jwt')

    expect(interceptors.request({
      url: '/api/v1/boletas',
      method: 'post',
      headers: {},
    }).headers.Authorization).toBe('Bearer jwt')
    expect(interceptors.request({
      url: '/auth/login',
      method: 'post',
      headers: {},
    }).headers.Authorization).toBeUndefined()
    expect(localStorage.getItem('gmoon-react-token')).toBeNull()
  })

  it('keeps the access token on authenticated profile creation', () => {
    establecerTokenAcceso('admin-jwt')

    expect(interceptors.request({
      url: '/api/v1/usuarios',
      method: 'post',
      headers: {},
    }).headers.Authorization).toBe('Bearer admin-jwt')
  })

  it('shares one rotation request between simultaneous session restorations', async () => {
    let completarRenovacion
    interceptors.post.mockReturnValueOnce(new Promise((resolve) => {
      completarRenovacion = resolve
    }))

    const primera = renovarSesionHttp()
    const segunda = renovarSesionHttp()
    expect(interceptors.post).toHaveBeenCalledTimes(1)

    completarRenovacion({ data: { token: 'restored-jwt' } })
    await expect(Promise.all([primera, segunda])).resolves.toEqual([
      { token: 'restored-jwt' },
      { token: 'restored-jwt' },
    ])
  })

  it('rotates the session and retries an expired protected request', async () => {
    interceptors.post.mockResolvedValueOnce({ data: { token: 'renewed-jwt' } })
    const config = {
      url: '/api/v1/boletas',
      method: 'get',
      headers: { Authorization: 'Bearer expired-jwt' },
    }

    await interceptors.responseError({
      response: { status: 401 },
      config,
    })

    expect(interceptors.post).toHaveBeenCalledWith(
      'http://localhost:5050/auth/refresh',
      null,
      expect.objectContaining({ withCredentials: true }),
    )
    expect(interceptors.client).toHaveBeenCalledWith(expect.objectContaining({
      _retry: true,
      headers: { Authorization: 'Bearer renewed-jwt' },
    }))
  })

  it('clears only session metadata after refresh is rejected', async () => {
    interceptors.post.mockRejectedValueOnce(new Error('refresh rechazado'))
    localStorage.setItem('gmoon-react-sesion', '{}')
    const error = {
      response: { status: 401 },
      config: { headers: { Authorization: 'Bearer expired' } },
    }

    await expect(interceptors.responseError(error)).rejects.toBe(error)
    expect(localStorage.getItem('gmoon-react-token')).toBeNull()
    expect(localStorage.getItem('gmoon-react-sesion')).toBeNull()
  })
})
