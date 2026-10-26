import { describe, expect, it } from 'vitest'
import { calcularTotalesCompra } from './calcularTotalesCompra.js'

describe('calcularTotalesCompra', () => {
  it('suma el IVA al neto para obtener el total a pagar', () => {
    const resultado = calcularTotalesCompra(
      [
        { precioUnitario: 1000, cantidad: 2 },
        { precioUnitario: 500, cantidad: 3 },
      ],
      2750
    )

    expect(resultado.neto).toBe(2750)
    expect(resultado.iva).toBe(522.5)
    expect(resultado.totalFinal).toBe(3272.5)
  })

  it('calcula el neto sumando precio y cantidad de los productos', () => {
    const resultado = calcularTotalesCompra([
      { precio: 1500, cantidad: 2 },
      { precioUnitario: 800, cantidad: 1 },
    ])

    expect(resultado.subtotal).toBe(3800)
    expect(resultado.neto).toBe(3800)
    expect(resultado.iva).toBe(722)
    expect(resultado.totalFinal).toBe(4522)
  })

  it('devuelve totales en cero cuando no hay productos', () => {
    expect(calcularTotalesCompra()).toEqual({
      subtotal: 0,
      neto: 0,
      iva: 0,
      totalFinal: 0,
    })
  })
})
