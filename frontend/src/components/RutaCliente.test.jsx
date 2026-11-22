import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/useAuth'
import RutaCliente from './RutaCliente'

afterEach(cleanup)

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}))

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

describe('RutaCliente', () => {
  it('redirige al cliente autenticado y bloquea otros roles', () => {
    useAuth.mockReturnValue({ usuario: { rol: 'admin' }, esCliente: false })
    render(
      <MemoryRouter initialEntries={['/mis-compras']}>
        <Routes>
          <Route path="/mis-compras" element={<RutaCliente><h1>Mis compras</h1></RutaCliente>} />
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('location').textContent).toBe('/')

    cleanup()
    useAuth.mockReturnValue({ usuario: { rol: 'cliente' }, esCliente: true })
    render(
      <MemoryRouter initialEntries={['/mis-compras']}>
        <Routes>
          <Route path="/mis-compras" element={<RutaCliente><h1>Mis compras</h1></RutaCliente>} />
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Mis compras' })).toBeTruthy()
  })
})
