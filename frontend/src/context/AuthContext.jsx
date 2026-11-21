import { useEffect, useState } from 'react'
import { iniciarSesionApi, registrarCuentaApi } from '../api/auth'
import { TOKEN_KEY, mensajeErrorApi } from '../api/http'
import { actualizarUsuarioApi } from '../api/usuarios'
import { AuthContext } from './AuthContextValue'
import {
  obtenerSesion,
  cerrarSesionLocal,
} from '../utils/usuarios'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerSesion)

  useEffect(() => {
    const cerrarSesionExpirada = () => setUsuario(null)
    window.addEventListener('gmoon:session-expired', cerrarSesionExpirada)
    return () => window.removeEventListener('gmoon:session-expired', cerrarSesionExpirada)
  }, [])

  const guardarSesion = (respuesta, nombre = '') => {
    if (!respuesta?.token || !respuesta.email || !respuesta.rol || respuesta.usuarioId == null) {
      throw new Error('El backend devolvió una respuesta de autenticación incompleta.')
    }

    const sesion = {
      id: respuesta.usuarioId,
      nombre: nombre || respuesta.nombre || respuesta.email.split('@')[0],
      email: respuesta.email,
      rol: respuesta.rol.toLowerCase(),
    }
    try {
      localStorage.setItem(TOKEN_KEY, respuesta.token)
      localStorage.setItem('gmoon-react-sesion', JSON.stringify(sesion))
    } catch (error) {
      cerrarSesionLocal()
      throw new Error(`No se pudo guardar la sesión: ${error.message}`, { cause: error })
    }
    setUsuario(sesion)
    return sesion
  }

  const iniciarSesion = async (email, password) => {
    const respuesta = await iniciarSesionApi(email, password)
    return guardarSesion(respuesta)
  }

  const registrar = async (datos) => {
    const respuesta = await registrarCuentaApi(datos)
    return guardarSesion(respuesta, datos.nombre.trim())
  }

  const cerrarSesion = () => {
    cerrarSesionLocal()
    setUsuario(null)
  }

  const actualizarPerfilAdmin = async (cambios) => {
    if (!usuario?.id) {
      return { ok: false, error: 'No se encontró el ID del perfil de administrador.' }
    }

    try {
      const perfil = await actualizarUsuarioApi(usuario.id, {
        nombre: cambios.nombre.trim(),
        email: usuario.email,
        rol: 'ADMIN',
      })
      const sesion = { ...usuario, nombre: perfil.nombre }
      localStorage.setItem('gmoon-react-sesion', JSON.stringify(sesion))
      setUsuario(sesion)
      return { ok: true, usuario: sesion }
    } catch (error) {
      return { ok: false, error: mensajeErrorApi(error, 'No se pudo actualizar el perfil.') }
    }
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, iniciarSesion, registrar, cerrarSesion, actualizarPerfilAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}