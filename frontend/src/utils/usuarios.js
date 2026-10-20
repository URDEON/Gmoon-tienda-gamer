const CLAVE_USUARIOS = 'gmoon-react-usuarios'
const CLAVE_SESION = 'gmoon-react-sesion'

// Cuenta de administrador de demostración (en un sistema real vive en el backend)
const ADMIN = { nombre: 'Administrador Gmoon', email: 'admin@gmoon.cl', password: 'Admin12345', rol: 'admin' }

// Devuelve solo los clientes registrados
export function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []
  } catch {
    return []
  }
}

export function registrarUsuario({ nombre, email, password }) {
  const usuarios = obtenerUsuarios()
  const correo = email.trim().toLowerCase()

  if (correo === ADMIN.email || usuarios.some((usuario) => usuario.email === correo)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const nuevo = { nombre: nombre.trim(), email: correo, password, rol: 'cliente' }
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, nuevo]))
  return { ok: true }
}

export function iniciarSesionLocal(email, password) {
  const correo = email.trim().toLowerCase()
  const usuario = [ADMIN, ...obtenerUsuarios()].find((u) => u.email === correo && u.password === password)

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