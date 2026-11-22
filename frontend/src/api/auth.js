
import { api, mensajeErrorApi, renovarSesionHttp } from './http'

export async function iniciarSesionApi(email, password) {
  const { data } = await api.post('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  })
  return data
}

export async function renovarSesionApi() {
  return renovarSesionHttp()
}

export async function cerrarSesionApi() {
  await api.post('/auth/logout')
}

export async function registrarCuentaApi({ nombre, email, password }) {
  const correo = email.trim().toLowerCase()
  const { data: perfil } = await api.post('/api/v1/usuarios', {
    nombre: nombre.trim(),
    email: correo,
    rol: 'CLIENTE',
  }, { skipAuth: true })

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

export async function registrarCuentaPrivilegiadaApi({ usuarioId, email, password, rol }) {
  const { data } = await api.post('/auth/registrar-privilegiado', {
    usuarioId,
    email: email.trim().toLowerCase(),
    password,
    rol: rol.toUpperCase(),
  })
  return data
}

export async function registrarClienteAdministrativoApi({ usuarioId, email, password }) {
  const { data } = await api.post('/auth/registrar-cliente', {
    usuarioId,
    email: email.trim().toLowerCase(),
    password,
  })
  return data
}

export async function registrarCuentaDesdeAdminApi({ nombre, email, password, rol }) {
  const rolNormalizado = rol.toUpperCase()
  if (!['CLIENTE', 'VENDEDOR'].includes(rolNormalizado)) {
    throw new Error('El panel solo puede crear cuentas CLIENTE o VENDEDOR.')
  }

  const correo = email.trim().toLowerCase()
  const { data: perfil } = await api.post('/api/v1/usuarios', {
    nombre: nombre.trim(),
    email: correo,
    rol: rolNormalizado,
  })

  try {
    if (rolNormalizado === 'CLIENTE') {
      return await registrarClienteAdministrativoApi({
        usuarioId: perfil.id,
        email: perfil.email,
        password,
      })
    }
    return await registrarCuentaPrivilegiadaApi({
      usuarioId: perfil.id,
      email: perfil.email,
      password,
      rol: rolNormalizado,
    })
  } catch (error) {
    error.message = `El perfil se creó, pero no se pudieron crear las credenciales. ${mensajeErrorApi(
      error,
      'Contacta al administrador antes de volver a intentarlo.',
    )}`
    error.perfilCreado = true
    throw error
  }
}
