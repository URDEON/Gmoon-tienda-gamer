import axios from 'axios'

export const TOKEN_KEY = 'gmoon-react-token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5050',
  timeout: 15000,
})

function esRutaPublica(config) {
  const metodo = config.method?.toUpperCase()
  const ruta = (config.url || '').split('?')[0].replace(/\/$/, '')
  if (metodo === 'POST' && (
    ruta === '/auth/login'
    || ruta === '/auth/registrar'
    || ruta === '/api/v1/usuarios'
  )) {
    return true
  }
  return metodo === 'GET' && (
    ruta === '/api/v1/productos'
    || ruta.startsWith('/api/v1/productos/')
    || ruta === '/api/v1/categorias'
    || ruta.startsWith('/api/v1/categorias/')
  )
}

api.interceptors.request.use((config) => {
  const token = esRutaPublica(config) ? null : localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('gmoon-react-sesion')
    window.dispatchEvent(new Event('gmoon:session-expired'))
  }
  return Promise.reject(error)
})

export function mensajeErrorApi(error, mensajePredeterminado) {
  if (error.perfilCreado) return error.message
  return error.response?.data?.error
    || error.response?.data?.message
    || error.message
    || mensajePredeterminado
}
