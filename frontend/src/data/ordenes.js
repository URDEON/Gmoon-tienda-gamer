const CLAVE_ORDENES = 'gmoon-react-ordenes'
const suscriptoresOrdenes = new Set()
let ordenesInicializadas = false
let ordenes = []
let revisionOrdenes = 0

function validarOrdenes(valor) {
  if (!Array.isArray(valor) || valor.some((orden) => (
    !orden
    || typeof orden.numeroPedido !== 'string'
    || !orden.numeroPedido
    || typeof orden.clienteNombre !== 'string'
    || typeof orden.email !== 'string'
    || (orden.usuarioEmail !== undefined && typeof orden.usuarioEmail !== 'string')
    || !['boleta', 'factura'].includes(orden.tipoComprobante)
    || !Array.isArray(orden.items)
    || !Number.isFinite(orden.total)
    || orden.total < 0
    || typeof orden.fecha !== 'string'
    || !Number.isFinite(Date.parse(orden.fecha))
    || orden.items.some((item) => (
      !item
      || typeof item.id !== 'string'
      || typeof item.nombre !== 'string'
      || !Number.isInteger(item.cantidad)
      || item.cantidad <= 0
      || !Number.isFinite(item.precioUnitario)
      || item.precioUnitario < 0
    ))
  ))) {
    throw new Error('Las órdenes guardadas no tienen un formato válido.')
  }

  return valor
}

export function obtenerOrdenes() {
  if (!ordenesInicializadas) {
    const guardadas = localStorage.getItem(CLAVE_ORDENES)
    ordenes = guardadas ? validarOrdenes(JSON.parse(guardadas)) : []
    ordenesInicializadas = true
  }

  return ordenes
}

export function obtenerOrdenesPorCorreo(email) {
  const correoNormalizado = email.trim().toLowerCase()
  return obtenerOrdenes().filter((orden) => (
    (orden.usuarioEmail || orden.email).trim().toLowerCase() === correoNormalizado
  ))
}

export function guardarOrden(nuevaOrden) {
  const ordenValidada = validarOrdenes([nuevaOrden])[0]
  const ordenesActuales = obtenerOrdenes()
  const ordenesActualizadas = [
    ordenValidada,
    ...ordenesActuales.filter((orden) => orden.numeroPedido !== ordenValidada.numeroPedido),
  ]

  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenesActualizadas))
  ordenes = ordenesActualizadas
  ordenesInicializadas = true
  revisionOrdenes += 1
  suscriptoresOrdenes.forEach((suscriptor) => suscriptor())
}

export function suscribirseAOrdenes(suscriptor) {
  suscriptoresOrdenes.add(suscriptor)
  return () => suscriptoresOrdenes.delete(suscriptor)
}

export function obtenerRevisionOrdenes() {
  obtenerOrdenes()
  return revisionOrdenes
}
