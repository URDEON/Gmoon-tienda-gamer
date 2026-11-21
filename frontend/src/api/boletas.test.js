import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api } = vi.hoisted(() => ({ api: { post: vi.fn() } }))
vi.mock('./http', () => ({ api }))

import { crearBoleta } from './boletas'

describe('crearBoleta', () => {
  beforeEach(() => api.post.mockReset())

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
})
