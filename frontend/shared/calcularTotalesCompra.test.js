import { expect, it } from 'vitest'
import { calcularTotalesCompra } from './calcularTotalesCompra.js'

it('calcularTotalesCompra suma el IVA al neto para el total a pagar', () => {
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
