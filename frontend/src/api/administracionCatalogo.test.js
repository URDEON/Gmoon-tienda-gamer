import { beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('./http', () => ({ api }))

import {
  actualizarProductoApi,
  crearProductoApi,
  listarCategoriasAdminApi,
} from './administracionCatalogo'

describe('administración del catálogo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('carga categorías HAL y reporta respuestas con formato inválido', async () => {
    api.get.mockResolvedValueOnce({
      data: { _embedded: { categoriaList: [{ id: 8, nombre: 'Consolas' }] } },
    })
    await expect(listarCategoriasAdminApi()).resolves.toEqual([
      { id: 8, nombre: 'Consolas' },
    ])

    api.get.mockResolvedValueOnce({ data: { unexpected: [] } })
    await expect(listarCategoriasAdminApi()).rejects.toThrow(
      'El catálogo del backend tiene un formato inesperado.',
    )
  })

  it('envía producto con la categoría y nombres de campos del backend', async () => {
    const producto = {
      nombre: 'Teclado',
      descripcion: 'Mecánico',
      imagen: '/teclado.png',
      imagenInicio: '',
      precio: '50000',
      stock: '4',
      descuento: '10',
      categoriaId: '8',
    }
    api.post.mockResolvedValueOnce({ data: { id: 14 } })

    await crearProductoApi(producto)

    expect(api.post).toHaveBeenCalledWith('/api/v1/productos', {
      nombre: 'Teclado',
      descripcion: 'Mecánico',
      imagenUrl: '/teclado.png',
      imagenInicio: null,
      precio: 50000,
      stock: 4,
      descuento: 10,
      activo: true,
      categoria: { id: 8 },
    })
  })

  it('actualiza el recurso usando su ID de backend', async () => {
    api.put.mockResolvedValueOnce({ data: { id: 14 } })

    await actualizarProductoApi(14, {
      nombre: 'Teclado',
      descripcion: '',
      imagen: '/teclado.png',
      precio: 50000,
      stock: 4,
      descuento: 0,
      categoriaId: 8,
    })

    expect(api.put).toHaveBeenCalledWith('/api/v1/productos/14', expect.objectContaining({
      nombre: 'Teclado',
      categoria: { id: 8 },
    }))
  })
})
