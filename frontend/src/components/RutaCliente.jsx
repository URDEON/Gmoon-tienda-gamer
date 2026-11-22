import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function RutaCliente({ children }) {
  const { usuario, esCliente, cargando } = useAuth()

  if (cargando) {
    return <p role="status">Validando sesión…</p>
  }
  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }
  if (!esCliente) {
    return <Navigate to="/" replace />
  }
  return children
}

export default RutaCliente
