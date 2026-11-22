import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/useAuth'
import RutaVendedor from './RutaVendedor'

afterEach(cleanup)

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}))

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

function renderRuta(auth) {
  useAuth.mockReturnValue(auth)
  return render(
    <MemoryRouter initialEntries={['/vendedor']}>
      <Routes>
        <Route path="/vendedor" element={<RutaVendedor><h1>Panel vendedor</h1></RutaVendedor>} />
        <Route path="/iniciar-sesion" element={<LocationDisplay />} />
        <Route path="/" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RutaVendedor', () => {
  it('solo permite vendedor y administrador', () => {
    renderRuta({ usuario: { rol: 'cliente' }, esAdmin: false, esVendedor: false })
    expect(screen.getByTestId('location').textContent).toBe('/')

    cleanup()
    renderRuta({ usuario: { rol: 'vendedor' }, esAdmin: false, esVendedor: true })
    expect(screen.getByRole('heading', { name: 'Panel vendedor' })).toBeTruthy()
  })

  it('espera la restauración de la sesión antes de redirigir', () => {
    renderRuta({ usuario: null, esAdmin: false, esVendedor: false, cargando: true })
    expect(screen.getByRole('status').textContent).toContain('Validando sesión')
  })
})
