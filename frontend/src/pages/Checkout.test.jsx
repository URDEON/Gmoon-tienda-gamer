import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  crearBoleta: vi.fn(),
  descargarComprobante: vi.fn(),
  guardarOrden: vi.fn(),
  vaciarCarrito: vi.fn(),
}))

vi.mock('../api/boletas', () => ({ crearBoleta: mocks.crearBoleta }))
vi.mock('../utils/emailService', () => ({ descargarComprobante: mocks.descargarComprobante }))
vi.mock('../data/ordenes', () => ({ guardarOrden: mocks.guardarOrden }))
vi.mock('../context/useAuth', () => ({
  useAuth: () => ({ usuario: { id: 8, nombre: 'Ana', email: 'ana@example.com' } }),
}))
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    carrito: [{
      id: 'fc-2027-ps5',
      backendId: '42',
      nombre: 'FC 2027 PS5',
      cantidad: 1,
      precio: 80000,
    }],
    totalProductos: 1,
    totalPrecio: 80000,
    vaciarCarrito: mocks.vaciarCarrito,
  }),
}))

import Checkout from './Checkout'

function renderCheckout() {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago/aprobado" element={<p>Boleta registrada</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Checkout', () => {
  beforeEach(() => {
    mocks.crearBoleta.mockReset()
    mocks.descargarComprobante.mockReset().mockResolvedValue(undefined)
    mocks.guardarOrden.mockReset()
    mocks.vaciarCarrito.mockReset()
  })

  it('creates a backend boleta and clears the cart only after it succeeds', async () => {
    mocks.crearBoleta.mockResolvedValue({
      total: 80000,
      numeroPedido: 'GM-123',
    })
    renderCheckout()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(await screen.findByText('Boleta registrada')).toBeTruthy()
    expect(mocks.crearBoleta).toHaveBeenCalledWith({
      clienteNombre: 'Ana',
      email: 'ana@example.com',
      tipoComprobante: 'BOLETA',
      items: [{
        id: '42',
        nombre: 'FC 2027 PS5',
        cantidad: 1,
        precioUnitario: 80000,
      }],
    })
    expect(mocks.vaciarCarrito).toHaveBeenCalledOnce()
  })

  it('keeps the cart and reports an API error when boleta creation fails', async () => {
    mocks.crearBoleta.mockRejectedValue({
      response: { data: { error: 'Token no proporcionado' } },
      message: 'Request failed',
    })
    renderCheckout()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('Token no proporcionado')
    expect(mocks.vaciarCarrito).not.toHaveBeenCalled()
  })
})
