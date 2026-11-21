import { beforeEach, describe, expect, it, vi } from 'vitest'

const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }))
vi.mock('./http', () => ({
  api,
  mensajeErrorApi: (error) => error.message,
}))

import { cargarCatalogoApi } from './catalogo'

describe('cargarCatalogoApi', () => {
  beforeEach(() => {
    api.get.mockReset()
    localStorage.clear()
  })

  it('maps backend product IDs and prices while preserving matching storefront IDs', async () => {
    api.get.mockResolvedValue({
      data: {
        _embedded: {
          productoList: [{
            id: 42,
            nombre: 'FC 2027 PS5',
            descripcion: 'Juego',
            precio: 80000,
            stock: 3,
            descuento: 10,
            imagenUrl: '/fc.png',
            categoria: { id: 2, nombre: 'Deportes', grupo: 'Videojuegos' },
          }],
        },
      },
    })

    const [producto] = await cargarCatalogoApi()

    expect(api.get).toHaveBeenCalledWith('/api/v1/productos')
    expect(producto).toMatchObject({
      id: 'fc-2027-ps5',
      backendId: '42',
      grupo: 'Videojuegos',
      categoria: 'Deportes',
      precio: 80000,
      stock: 3,
      descuento: 10,
    })
  })

  it('rejects a response that does not contain a HAL product collection', async () => {
    api.get.mockResolvedValue({ data: { products: [] } })

    await expect(cargarCatalogoApi()).rejects.toThrow('formato inesperado')
  })

  it('creates unique storefront IDs when backend products share the same name', async () => {
    api.get.mockResolvedValue({
      data: {
        _embedded: {
          productoList: [1, 2].map((id) => ({
            id,
            nombre: 'Monopoly',
            precio: 10000,
            stock: 1,
            descuento: 0,
            categoria: { nombre: 'Juegos', grupo: 'Juegos' },
          })),
        },
      },
    })

    const productos = await cargarCatalogoApi()

    expect(productos.map((producto) => producto.backendId)).toEqual(['1', '2'])
    expect(new Set(productos.map((producto) => producto.id)).size).toBe(2)
  })
})
