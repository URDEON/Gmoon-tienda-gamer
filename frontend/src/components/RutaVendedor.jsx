import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function RutaVendedor({ children }) {
  const { usuario, esAdmin, esVendedor, cargando } = useAuth()

  if (cargando) {
    return <p role="status">Validando sesión…</p>
  }
  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />
  }
  if (!esAdmin && !esVendedor) {
    return <Navigate to="/" replace />
  }
  return children
}

export default RutaVendedor
