import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularTotalesCompra } from './calcularTotalesCompra.js'

test('calcularTotalesCompra suma el IVA al neto para el total a pagar', () => {
  const resultado = calcularTotalesCompra(
    [
      { precioUnitario: 1000, cantidad: 2 },
      { precioUnitario: 500, cantidad: 3 },
    ],
    2750
  )

  assert.equal(resultado.neto, 2750)
  assert.equal(resultado.iva, 522.5)
  assert.equal(resultado.totalFinal, 3272.5)
})
