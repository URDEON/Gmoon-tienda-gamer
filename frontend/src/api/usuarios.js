import { api } from './http'

export async function listarUsuariosApi() {
  const { data } = await api.get('/api/v1/usuarios')
  const usuarios = data?._embedded?.usuarioList ?? (data ? null : [])
  if (!Array.isArray(usuarios)) {
    throw new Error('La lista de usuarios del backend tiene un formato inesperado.')
  }
  return usuarios
}

export async function actualizarUsuarioApi(id, cambios) {
  const { data: actual } = await api.get(`/api/v1/usuarios/${id}`)
  const { data } = await api.put(`/api/v1/usuarios/${id}`, {
    nombre: cambios.nombre,
    email: cambios.email || actual.email,
    telefono: actual.telefono || null,
    rol: cambios.rol || actual.rol,
  })
  return data
}
