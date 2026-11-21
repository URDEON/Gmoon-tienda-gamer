import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api } = vi.hoisted(() => ({
  api: { get: vi.fn(), put: vi.fn() },
}))
vi.mock('./http', () => ({ api }))

import { actualizarUsuarioApi, listarUsuariosApi } from './usuarios'

describe('usuarios API', () => {
  beforeEach(() => {
    api.get.mockReset()
    api.put.mockReset()
  })

  it('unwraps the HATEOAS user list', async () => {
    api.get.mockResolvedValue({
      data: { _embedded: { usuarioList: [{ id: 8, nombre: 'Ana', rol: 'CLIENTE' }] } },
    })

    await expect(listarUsuariosApi()).resolves.toEqual([
      { id: 8, nombre: 'Ana', rol: 'CLIENTE' },
    ])
  })

  it('preserves the existing email, phone, and role when updating a profile', async () => {
    api.get.mockResolvedValue({
      data: { id: 8, email: 'ana@example.com', telefono: '123456789', rol: 'CLIENTE' },
    })
    api.put.mockResolvedValue({ data: { id: 8, nombre: 'Ana Nueva' } })

    await actualizarUsuarioApi(8, { nombre: 'Ana Nueva' })

    expect(api.put).toHaveBeenCalledWith('/api/v1/usuarios/8', {
      nombre: 'Ana Nueva',
      email: 'ana@example.com',
      telefono: '123456789',
      rol: 'CLIENTE',
    })
  })
})
