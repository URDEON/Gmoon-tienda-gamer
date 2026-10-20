import { createContext, useContext, useState } from 'react'
import { iniciarSesionLocal, obtenerSesion, cerrarSesionLocal } from '../utils/usuarios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerSesion)

  const iniciarSesion = (email, password) => {
    const resultado = iniciarSesionLocal(email, password)
    if (resultado.ok) {
      setUsuario(resultado.usuario)
    }
    return resultado
  }

  const cerrarSesion = () => {
    cerrarSesionLocal()
    setUsuario(null)
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return contexto
}