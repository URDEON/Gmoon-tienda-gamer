import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api, mensajeErrorApi, renovarSesionHttp } = vi.hoisted(() => ({
  api: { post: vi.fn() },
  mensajeErrorApi: vi.fn((error) => error.message),
  renovarSesionHttp: vi.fn(),
}))

vi.mock('./http', () => ({ api, mensajeErrorApi, renovarSesionHttp }))

import {
  registrarClienteAdministrativoApi,
  registrarCuentaApi,
  registrarCuentaDesdeAdminApi,
} from './auth'

describe('registrarCuentaApi', () => {
  beforeEach(() => {
    api.post.mockReset()
    mensajeErrorApi.mockClear()
    renovarSesionHttp.mockReset()
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

  it('creates an administrative client account without invoking login registration', async () => {
    api.post.mockResolvedValueOnce({ data: { usuarioId: 12, rol: 'CLIENTE' } })

    await registrarClienteAdministrativoApi({
      usuarioId: 12,
      email: ' CLIENTE@EXAMPLE.COM ',
      password: 'segura123',
    })

    expect(api.post).toHaveBeenCalledWith('/auth/registrar-cliente', {
      usuarioId: 12,
      email: 'cliente@example.com',
      password: 'segura123',
    })
  })

  it('creates a vendor profile before its privileged credentials', async () => {
    api.post
      .mockResolvedValueOnce({ data: { id: 21, email: 'vendedor@example.com' } })
      .mockResolvedValueOnce({ data: { rol: 'VENDEDOR' } })

    await registrarCuentaDesdeAdminApi({
      nombre: 'Vendedor Uno',
      email: ' VENDEDOR@EXAMPLE.COM ',
      password: 'segura123',
      rol: 'vendedor',
    })

    expect(api.post.mock.calls).toEqual([
      ['/api/v1/usuarios', {
        nombre: 'Vendedor Uno',
        email: 'vendedor@example.com',
        rol: 'VENDEDOR',
      }],
      ['/auth/registrar-privilegiado', {
        usuarioId: 21,
        email: 'vendedor@example.com',
        password: 'segura123',
        rol: 'VENDEDOR',
      }],
    ])
  })

  it('explains that a profile already exists when credential registration fails', async () => {
    api.post
      .mockResolvedValueOnce({ data: { id: 21, email: 'vendedor@example.com' } })
      .mockRejectedValueOnce(new Error('Seguridad no disponible'))

    await expect(registrarCuentaDesdeAdminApi({
      nombre: 'Vendedor Uno',
      email: 'vendedor@example.com',
      password: 'segura123',
      rol: 'VENDEDOR',
    })).rejects.toMatchObject({
      perfilCreado: true,
      message: expect.stringContaining('El perfil se creó'),
    })
  })
})
