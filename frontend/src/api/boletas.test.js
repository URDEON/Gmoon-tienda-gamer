import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api } = vi.hoisted(() => ({ api: { get: vi.fn(), post: vi.fn() } }))
vi.mock('./http', () => ({ api }))

import { crearBoleta, listarBoletasApi } from './boletas'

describe('crearBoleta', () => {
  beforeEach(() => {
    api.get.mockReset()
    api.post.mockReset()
  })

  it('posts the authenticated checkout to the boletas endpoint', async () => {
    const payload = {
      clienteNombre: 'Ana',
      email: 'ana@example.com',
      tipoComprobante: 'BOLETA',
      items: [{ id: '42', nombre: 'Producto', cantidad: 1, precioUnitario: 1000 }],
    }
    api.post.mockResolvedValue({ data: { numeroPedido: 'GM-1' } })

    await expect(crearBoleta(payload)).resolves.toEqual({ numeroPedido: 'GM-1' })
    expect(api.post).toHaveBeenCalledWith('/api/v1/boletas', payload)
  })

  it('lists all boletas and recognizes an empty HAL collection', async () => {
    api.get
      .mockResolvedValueOnce({
        data: { _embedded: { pedidoList: [{ id: 2 }] } },
      })
      .mockResolvedValueOnce({ data: { _links: { self: { href: '/api/v1/boletas' } } } })

    await expect(listarBoletasApi()).resolves.toEqual([{ id: 2 }])
    await expect(listarBoletasApi()).resolves.toEqual([])
    expect(api.get).toHaveBeenNthCalledWith(1, '/api/v1/boletas')
  })

  it('limits customer boleta history to the requested user endpoint', async () => {
    api.get.mockResolvedValueOnce({ data: null })

    await expect(listarBoletasApi(7)).resolves.toEqual([])
    expect(api.get).toHaveBeenCalledWith('/api/v1/boletas/usuario/7')
  })
})
