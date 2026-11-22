import { useEffect, useState } from 'react'
import { cerrarSesionApi, iniciarSesionApi, registrarCuentaApi, renovarSesionApi } from '../api/auth'
import { establecerTokenAcceso, limpiarTokenAcceso, mensajeErrorApi } from '../api/http'
import { actualizarUsuarioApi } from '../api/usuarios'
import { AuthContext } from './AuthContextValue'
import {
  obtenerSesion,
  cerrarSesionLocal,
} from '../utils/usuarios'

function crearDatosSesion(respuesta, nombre = '') {
  if (!respuesta?.token || !respuesta.email || !respuesta.rol || respuesta.usuarioId == null) {
    throw new Error('El backend devolvió una respuesta de autenticación incompleta.')
  }

  return {
    id: respuesta.usuarioId,
    nombre: nombre || respuesta.nombre || respuesta.email.split('@')[0],
    email: respuesta.email,
    rol: respuesta.rol.toLowerCase(),
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorSesion, setErrorSesion] = useState('')

  useEffect(() => {
    let activo = true
    const cerrarSesionExpirada = (event) => {
      if (activo) {
        setUsuario(null)
        setCargando(false)
        setErrorSesion(event.detail?.mensaje || 'La sesión ya no es válida. Inicia sesión nuevamente.')
      }
    }
    window.addEventListener('gmoon:session-expired', cerrarSesionExpirada)

    const restaurarSesion = async () => {
      const sesionAnterior = obtenerSesion()
      try {
        const respuesta = await renovarSesionApi()
        if (activo) {
          const sesion = crearDatosSesion(respuesta, sesionAnterior?.nombre)
          establecerTokenAcceso(respuesta.token)
          localStorage.setItem('gmoon-react-sesion', JSON.stringify(sesion))
          setUsuario(sesion)
        }
      } catch (error) {
        cerrarSesionLocal()
        limpiarTokenAcceso()
        if (activo) {
          setUsuario(null)
          if (error.response?.status !== 401) {
            setErrorSesion(mensajeErrorApi(
              error,
              'No se pudo restaurar la sesión. Comprueba que el backend esté disponible.',
            ))
          }
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    void restaurarSesion()
    return () => {
      activo = false
      window.removeEventListener('gmoon:session-expired', cerrarSesionExpirada)
    }
  }, [])

  const guardarSesion = (respuesta, nombre = '') => {
    const sesion = crearDatosSesion(respuesta, nombre)
    try {
      establecerTokenAcceso(respuesta.token)
      localStorage.setItem('gmoon-react-sesion', JSON.stringify(sesion))
    } catch (error) {
      cerrarSesionLocal()
      limpiarTokenAcceso()
      throw new Error(`No se pudo guardar la sesión: ${error.message}`, { cause: error })
    }
    setUsuario(sesion)
    return sesion
  }

  const iniciarSesion = async (email, password) => {
    const respuesta = await iniciarSesionApi(email, password)
    setErrorSesion('')
    return guardarSesion(respuesta)
  }

  const registrar = async (datos) => {
    const respuesta = await registrarCuentaApi(datos)
    setErrorSesion('')
    return guardarSesion(respuesta, datos.nombre.trim())
  }

  const cerrarSesion = async () => {
    await cerrarSesionApi()
    cerrarSesionLocal()
    limpiarTokenAcceso()
    setUsuario(null)
    setErrorSesion('')
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
  const esVendedor = usuario?.rol === 'vendedor'
  const esCliente = usuario?.rol === 'cliente'

  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      errorSesion,
      esAdmin,
      esVendedor,
      esCliente,
      iniciarSesion,
      registrar,
      cerrarSesion,
      actualizarPerfilAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}