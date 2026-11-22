import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Solo deja pasar a administradores. Los demás son redirigidos.
function RutaAdmin({ children }) {
  const { usuario, esAdmin, cargando } = useAuth()

  if (cargando) {
    return <p role="status">Validando sesión…</p>
  }
  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }
  if (!esAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

export default RutaAdmin