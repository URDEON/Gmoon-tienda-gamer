import { createContext, useContext, useEffect, useState } from 'react'

const CLAVE_CARRITO = 'gmoon-react-carrito'
const CartContext = createContext(null)

// Lee el carrito guardado en el navegador (si no hay nada, parte vacío)
function leerCarritoGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoGuardado)

  // Cada vez que el carrito cambia, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  }, [carrito])

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id)
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...actual, { ...producto, cantidad: 1 }]
    })
  }

  // cambio = +1 o -1. Si la cantidad llega a 0, el producto se quita
  const cambiarCantidad = (id, cambio) => {
    setCarrito((actual) =>
      actual
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item))
        .filter((item) => item.cantidad > 0)
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((actual) => actual.filter((item) => item.id !== id))
  }

  const totalProductos = carrito.reduce((suma, item) => suma + item.cantidad, 0)
  const totalPrecio = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{ carrito, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, totalProductos, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook para usar el carrito desde cualquier componente
export function useCart() {
  const contexto = useContext(CartContext)
  if (!contexto) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return contexto
}