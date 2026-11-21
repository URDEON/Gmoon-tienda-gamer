import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api, mensajeErrorApi } = vi.hoisted(() => ({
  api: { post: vi.fn() },
  mensajeErrorApi: vi.fn((error) => error.message),
}))

vi.mock('./http', () => ({ api, mensajeErrorApi }))

import { registrarCuentaApi } from './auth'

describe('registrarCuentaApi', () => {
  beforeEach(() => {
    api.post.mockReset()
    mensajeErrorApi.mockClear()
  })

  it('creates the public profile before registering its credentials', async () => {
    api.post
      .mockResolvedValueOnce({ data: { id: 12, nombre: 'Ana' } })
      .mockResolvedValueOnce({ data: { token: 'jwt', email: 'ana@example.com', rol: 'CLIENTE', usuarioId: 12 } })

    const result = await registrarCuentaApi({
      nombre: ' Ana ',
      email: ' ANA@EXAMPLE.COM ',
      password: 'segura123',
    })

    expect(api.post.mock.calls).toEqual([
      ['/api/v1/usuarios', { nombre: 'Ana', email: 'ana@example.com', rol: 'CLIENTE' }],
      ['/auth/registrar', { usuarioId: 12, email: 'ana@example.com', password: 'segura123' }],
    ])
    expect(result).toMatchObject({ token: 'jwt', nombre: 'Ana' })
  })

  it('reports when the profile was created but credentials failed', async () => {
    const error = new Error('MS-seguridad no disponible')
    api.post
      .mockResolvedValueOnce({ data: { id: 12, nombre: 'Ana' } })
      .mockRejectedValueOnce(error)

    await expect(registrarCuentaApi({
      nombre: 'Ana',
      email: 'ana@example.com',
      password: 'segura123',
    })).rejects.toMatchObject({
      perfilCreado: true,
      message: expect.stringContaining('El perfil se creó'),
    })
  })
})
