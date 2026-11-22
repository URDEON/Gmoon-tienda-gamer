const CLAVE_SESION = 'gmoon-react-sesion'
const TOKEN_ANTIGUO = 'gmoon-react-token'

export function obtenerSesion() {
  localStorage.removeItem(TOKEN_ANTIGUO)
  try {
    const usuario = JSON.parse(localStorage.getItem(CLAVE_SESION))
    if (usuario && usuario.email && usuario.rol) return usuario
  } catch {
    localStorage.removeItem(CLAVE_SESION)
  }

  return null
}

export function cerrarSesionLocal() {
  localStorage.removeItem(TOKEN_ANTIGUO)
  localStorage.removeItem(CLAVE_SESION)
}
