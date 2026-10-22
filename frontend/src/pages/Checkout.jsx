import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatearPrecio, obtenerPrecioFinal } from '../data/productos'
import '../styles/carrito.css'

function Checkout() {
  const navigate = useNavigate()
  const { carrito, totalProductos, totalPrecio, vaciarCarrito } = useCart()

  const simularPago = (aprobado) => {
    const resumen = { total: totalPrecio, productos: totalProductos }
    if (aprobado) vaciarCarrito()
    navigate(`/pago/${aprobado ? 'aprobado' : 'rechazado'}`, { state: resumen })
  }

  if (carrito.length === 0) {
    return (
      <section className="seccion-carrito seccion-pago" aria-labelledby="titulo-checkout">
        <p className="etiqueta-seccion">PAGO DE DEMOSTRACIÓN</p>
        <h1 id="titulo-checkout">No hay productos para pagar</h1>
        <p>Agrega productos al carrito antes de iniciar una simulación.</p>
        <Link className="boton-continuar-pago" to="/productos">Ver productos</Link>
      </section>
    )
  }

  return (
    <section className="seccion-carrito seccion-pago" aria-labelledby="titulo-checkout">
      <div className="encabezado-carrito">
        <p className="etiqueta-seccion">PAGO DE DEMOSTRACIÓN</p>
        <h1 id="titulo-checkout">Revisar compra</h1>
      </div>
      <div className="aviso-pago-demo" role="note">
        Esta es una simulación: no se realizará ningún cobro. No ingreses datos bancarios ni de tarjeta.
      </div>
      <div className="resumen-checkout">
        {carrito.map((item) => (
          <div className="fila-checkout" key={item.id}>
            <span>{item.nombre} × {item.cantidad}</span>
            <strong>{formatearPrecio(obtenerPrecioFinal(item) * item.cantidad)}</strong>
          </div>
        ))}
        <div className="fila-checkout total-checkout">
          <span>Total de demostración</span>
          <strong>{formatearPrecio(totalPrecio)}</strong>
        </div>
      </div>
      <div className="acciones-pago-demo">
        <button className="boton-pago-aprobado" type="button" onClick={() => simularPago(true)}>
          Simular pago aprobado
        </button>
        <button className="boton-pago-rechazado" type="button" onClick={() => simularPago(false)}>
          Simular pago rechazado
        </button>
      </div>
      <Link className="enlace-volver-carrito" to="/carrito">Volver al carrito</Link>
    </section>
  )
}

export default Checkout
