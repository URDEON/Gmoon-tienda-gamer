import { beforeEach, describe, expect, it, vi } from 'vitest'

const interceptors = vi.hoisted(() => ({
  request: null,
  responseError: null,
  client: {
    interceptors: {
      request: { use: vi.fn((success) => { interceptors.request = success }) },
      response: { use: vi.fn((success, error) => { interceptors.responseError = error }) },
    },
  },
}))

vi.mock('axios', () => ({
  default: { create: vi.fn(() => interceptors.client) },
}))

import { TOKEN_KEY } from './http'

describe('HTTP client authentication', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('attaches the stored JWT only to protected requests', () => {
    localStorage.setItem(TOKEN_KEY, 'jwt')

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
  })

  it('clears the session after an authenticated request expires', async () => {
    localStorage.setItem(TOKEN_KEY, 'expired')
    localStorage.setItem('gmoon-react-sesion', '{}')
    const error = {
      response: { status: 401 },
      config: { headers: { Authorization: 'Bearer expired' } },
    }

    await expect(interceptors.responseError(error)).rejects.toBe(error)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem('gmoon-react-sesion')).toBeNull()
  })
})
