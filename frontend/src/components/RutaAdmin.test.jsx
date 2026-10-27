import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import RutaAdmin from './RutaAdmin'

afterEach(cleanup)

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

function renderRutaAdmin(auth) {
  useAuth.mockReturnValue(auth)

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <h1>Panel de administración</h1>
            </RutaAdmin>
          }
        />
        <Route path="/iniciar-sesion" element={<LocationDisplay />} />
        <Route path="/" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RutaAdmin', () => {
  it('redirige al inicio de sesión cuando no hay usuario', () => {
    renderRutaAdmin({ usuario: null, esAdmin: false })

    expect(screen.getByTestId('location').textContent).toBe('/iniciar-sesion')
  })

  it('redirige al inicio cuando el usuario no es administrador', () => {
    renderRutaAdmin({ usuario: { id: 'usuario-1' }, esAdmin: false })

    expect(screen.getByTestId('location').textContent).toBe('/')
  })

  it('muestra el contenido protegido para administradores', () => {
    renderRutaAdmin({ usuario: { id: 'admin-1' }, esAdmin: true })

    expect(
      screen.getByRole('heading', { name: 'Panel de administración' }),
    ).toBeTruthy()
  })
})
