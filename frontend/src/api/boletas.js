import { api } from './http'

export async function crearBoleta(datos) {
  const { data } = await api.post('/api/v1/boletas', datos)
  return data
}

export async function listarBoletasApi(usuarioId = null) {
  const ruta = usuarioId == null
    ? '/api/v1/boletas'
    : `/api/v1/boletas/usuario/${usuarioId}`
  const { data } = await api.get(ruta)
  const boletas = data?._embedded?.pedidoList
    ?? (data?._links ? [] : data ? null : [])
  if (!Array.isArray(boletas)) {
    throw new Error('La lista de boletas del backend tiene un formato inesperado.')
  }
  return boletas
}
