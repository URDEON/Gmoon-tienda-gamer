const CLAVE_SESION = 'gmoon-react-sesion'
const CLAVE_TOKEN = 'gmoon-react-token'

export function obtenerSesion() {
  const token = localStorage.getItem(CLAVE_TOKEN)
  if (!token) {
    localStorage.removeItem(CLAVE_SESION)
    return null
  }

  try {
    const usuario = JSON.parse(localStorage.getItem(CLAVE_SESION))
    if (usuario && usuario.email && usuario.rol) return usuario
  } catch {
    localStorage.removeItem(CLAVE_TOKEN)
  }

  localStorage.removeItem(CLAVE_SESION)
  return null
}

export function cerrarSesionLocal() {
  localStorage.removeItem(CLAVE_TOKEN)
  localStorage.removeItem(CLAVE_SESION)
}
