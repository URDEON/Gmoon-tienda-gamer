import { validarEmail, validarNombre, validarPassword } from './validaciones'

const CLAVE_USUARIOS = 'gmoon-react-usuarios'
const CLAVE_SESION = 'gmoon-react-sesion'
const CLAVE_PERFIL_ADMIN = 'gmoon-react-perfil-admin'

// Cuenta de administrador de demostración (en un sistema real vive en el backend)
const ADMIN = { nombre: 'Administrador Gmoon', email: 'admin@gmoon.cl', password: 'Admin12345', rol: 'admin' }

export function obtenerPerfilAdministrador() {
  const guardado = localStorage.getItem(CLAVE_PERFIL_ADMIN)
  return guardado ? { ...ADMIN, ...JSON.parse(guardado), rol: 'admin' } : ADMIN
}

// Devuelve solo los clientes registrados
export function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []
  } catch {
    return []
  }
}

export function registrarUsuario({ nombre, email, password }) {
  const errorNombre = validarNombre(nombre)
  if (errorNombre) return { ok: false, error: errorNombre }

  const errorEmail = validarEmail(email)
  if (errorEmail) return { ok: false, error: errorEmail }

  const errorPassword = validarPassword(password)
  if (errorPassword) return { ok: false, error: errorPassword }

  const usuarios = obtenerUsuarios()
  const correo = email.trim().toLowerCase()

  if (correo === obtenerPerfilAdministrador().email || usuarios.some((usuario) => usuario.email === correo)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const nuevo = { nombre: nombre.trim(), email: correo, password, rol: 'cliente' }
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, nuevo]))
  } catch (error) {
    return { ok: false, error: `No se pudo guardar el usuario: ${error.message}` }
  }
  return { ok: true }
}

export function actualizarUsuario(emailOriginal, cambios) {
  const errorNombre = validarNombre(cambios.nombre)
  if (errorNombre) return { ok: false, error: errorNombre }

  const errorEmail = validarEmail(cambios.email)
  if (errorEmail) return { ok: false, error: errorEmail }

  if (cambios.password && validarPassword(cambios.password)) {
    return { ok: false, error: validarPassword(cambios.password) }
  }

  const correoOriginal = emailOriginal.trim().toLowerCase()
  const correoNuevo = cambios.email.trim().toLowerCase()
  if (correoNuevo === obtenerPerfilAdministrador().email) {
    return { ok: false, error: 'Ese correo está reservado para la cuenta de administración.' }
  }

  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex((usuario) => usuario.email === correoOriginal)
  if (indice === -1) {
    return { ok: false, error: 'No se encontró el usuario que quieres editar.' }
  }
  if (usuarios.some((usuario) => usuario.email !== correoOriginal && usuario.email === correoNuevo)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const usuariosActualizados = usuarios.map((usuario) => (
    usuario.email === correoOriginal
      ? {
        ...usuario,
        nombre: cambios.nombre.trim(),
        email: correoNuevo,
        ...(cambios.password ? { password: cambios.password } : {}),
      }
      : usuario
  ))

  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosActualizados))
  } catch (error) {
    return { ok: false, error: `No se pudieron guardar los cambios: ${error.message}` }
  }

  return { ok: true }
}

export function guardarPerfilAdministrador(cambios) {
  const errorNombre = validarNombre(cambios.nombre)
  if (errorNombre) return { ok: false, error: errorNombre }

  const errorEmail = validarEmail(cambios.email)
  if (errorEmail) return { ok: false, error: errorEmail }

  if (cambios.password && validarPassword(cambios.password)) {
    return { ok: false, error: validarPassword(cambios.password) }
  }

  const correoNuevo = cambios.email.trim().toLowerCase()
  if (obtenerUsuarios().some((usuario) => usuario.email === correoNuevo)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const perfilActualizado = {
    ...obtenerPerfilAdministrador(),
    nombre: cambios.nombre.trim(),
    email: correoNuevo,
    ...(cambios.password ? { password: cambios.password } : {}),
    rol: 'admin',
  }
  const sesion = {
    nombre: perfilActualizado.nombre,
    email: perfilActualizado.email,
    rol: 'admin',
  }

  try {
    localStorage.setItem(CLAVE_PERFIL_ADMIN, JSON.stringify(perfilActualizado))
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  } catch (error) {
    return { ok: false, error: `No se pudo guardar el perfil: ${error.message}` }
  }

  return { ok: true, usuario: sesion }
}

export function iniciarSesionLocal(email, password) {
  const correo = email.trim().toLowerCase()
  const usuario = [obtenerPerfilAdministrador(), ...obtenerUsuarios()]
    .find((u) => u.email === correo && u.password === password)

  if (!usuario) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  const sesion = { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol || 'cliente' }
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return { ok: true, usuario: sesion }
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null
  } catch {
    return null
  }
}

export function cerrarSesionLocal() {
  localStorage.removeItem(CLAVE_SESION)
}