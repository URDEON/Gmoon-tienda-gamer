import { api, mensajeErrorApi } from './http'

export async function iniciarSesionApi(email, password) {
  const { data } = await api.post('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  })
  return data
}

export async function registrarCuentaApi({ nombre, email, password }) {
  const correo = email.trim().toLowerCase()
  const { data: perfil } = await api.post('/api/v1/usuarios', {
    nombre: nombre.trim(),
    email: correo,
    rol: 'CLIENTE',
  })

  try {
    const { data } = await api.post('/auth/registrar', {
      usuarioId: perfil.id,
      email: correo,
      password,
    })
    return { ...data, nombre: perfil.nombre || nombre.trim() }
  } catch (error) {
    error.message = `El perfil se creó, pero no se pudieron crear las credenciales. ${mensajeErrorApi(error, 'Intenta nuevamente o contacta al administrador.')}`
    error.perfilCreado = true
    throw error
  }
}
