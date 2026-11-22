import axios from 'axios'

const SESSION_KEY = 'gmoon-react-sesion'
let accessToken = null
let refreshPromise = null

const baseURL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5050'

export const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
})

function esRutaSinAutenticacion(config) {
  if (config.skipAuth) return true
  const metodo = config.method?.toUpperCase()
  const ruta = (config.url || '').split('?')[0].replace(/\/$/, '')
  if (metodo === 'POST' && [
    '/auth/login',
    '/auth/registrar',
    '/auth/validar',
    '/auth/refresh',
    '/auth/logout',
  ].includes(ruta)) {
    return true
  }
  return metodo === 'GET' && (
    ruta === '/api/v1/productos'
    || ruta.startsWith('/api/v1/productos/')
    || ruta === '/api/v1/categorias'
    || ruta.startsWith('/api/v1/categorias/')
  )
}

export function establecerTokenAcceso(token) {
  accessToken = token || null
}

export function limpiarTokenAcceso() {
  accessToken = null
}

export function renovarSesionHttp() {
  if (!refreshPromise) {
    refreshPromise = axios.post(`${baseURL}/auth/refresh`, null, {
      timeout: 15000,
      withCredentials: true,
    }).then(({ data }) => data).finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function renovarTokenAcceso() {
  const data = await renovarSesionHttp()
  if (!data?.token) {
    throw new Error('El backend no devolvió un token de acceso al renovar la sesión.')
  }
  establecerTokenAcceso(data.token)
  return data.token
}

api.interceptors.request.use((config) => {
  if (!esRutaSinAutenticacion(config) && accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use((response) => response, async (error) => {
  const config = error.config
  if (error.response?.status !== 401 || !config || config._retry || esRutaSinAutenticacion(config)) {
    return Promise.reject(error)
  }

  config._retry = true
  try {
    const token = await renovarTokenAcceso()
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
    return await api(config)
  } catch (refreshError) {
    limpiarTokenAcceso()
    localStorage.removeItem(SESSION_KEY)
    const mensaje = refreshError.response?.status === 401
      ? 'Tu sesión expiró. Inicia sesión nuevamente.'
      : 'No se pudo renovar la sesión. Comprueba la conexión e inicia sesión de nuevo.'
    window.dispatchEvent(new CustomEvent('gmoon:session-expired', { detail: { mensaje } }))
    return Promise.reject(error)
  }
})

export function mensajeErrorApi(error, mensajePredeterminado) {
  if (error.perfilCreado) return error.message
  return error.response?.data?.error
    || error.response?.data?.message
    || error.message
    || mensajePredeterminado
}
