import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Solo deja pasar a administradores. Los demás son redirigidos.
function RutaAdmin({ children }) {
  const { usuario, esAdmin } = useAuth()

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }
  if (!esAdmin) {
    return <Navigate to="/" replace />
  }
  return children
}

export default RutaAdmin