import { beforeEach, describe, expect, it } from 'vitest'
import { cerrarSesionLocal, obtenerSesion } from './usuarios'

describe('persistencia de sesión', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('elimina tokens antiguos del localStorage y conserva solo los metadatos de sesión', () => {
    localStorage.setItem('gmoon-react-token', 'jwt-antiguo')
    localStorage.setItem('gmoon-react-sesion', JSON.stringify({
      id: 3,
      email: 'cliente@example.com',
      rol: 'cliente',
    }))

    expect(obtenerSesion()).toMatchObject({ email: 'cliente@example.com' })
    expect(localStorage.getItem('gmoon-react-token')).toBeNull()

    cerrarSesionLocal()
    expect(localStorage.getItem('gmoon-react-sesion')).toBeNull()
  })
})
