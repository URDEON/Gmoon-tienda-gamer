import { cargarCatalogoApi, mensajeErrorCatalogo } from './catalogo'

const suscriptores = new Set()
let estado = { cargando: false, error: '' }
let cargaIniciada = false
let cargaActual = null

function notificar() {
  suscriptores.forEach((suscriptor) => suscriptor())
}

function actualizarEstado(nuevoEstado) {
  estado = nuevoEstado
  notificar()
}

export function obtenerEstadoCatalogo() {
  return estado
}

export function suscribirseAlEstadoCatalogo(suscriptor) {
  suscriptores.add(suscriptor)
  return () => suscriptores.delete(suscriptor)
}

export function cargarCatalogo() {
  if (cargaActual) return cargaActual
  if (cargaIniciada) return Promise.resolve()

  cargaIniciada = true
  actualizarEstado({ cargando: true, error: '' })
  cargaActual = cargarCatalogoApi()
    .then(() => actualizarEstado({ cargando: false, error: '' }))
    .catch((error) => actualizarEstado({
      cargando: false,
      error: mensajeErrorCatalogo(error),
    }))
    .finally(() => {
      cargaActual = null
    })
  return cargaActual
}

export function reintentarCargaCatalogo() {
  cargaIniciada = false
  return cargarCatalogo()
}
