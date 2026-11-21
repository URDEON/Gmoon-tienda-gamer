import { api } from './http'

export async function crearBoleta(datos) {
  const { data } = await api.post('/api/v1/boletas', datos)
  return data
}
