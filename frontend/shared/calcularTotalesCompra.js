export function calcularTotalesCompra(items = [], total) {
  const subtotal = items.reduce((suma, item) => suma + Number(item.precioUnitario || item.precio || 0) * Number(item.cantidad || 1), 0)
  const neto = Number(total ?? subtotal)
  const iva = Number((neto * 0.19).toFixed(2))
  const totalFinal = Number((neto + iva).toFixed(2))

  return { subtotal, neto, iva, totalFinal }
}
