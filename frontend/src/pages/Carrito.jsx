import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../data/productos'
import '../styles/carrito.css'

function Carrito() {
  const { carrito, cambiarCantidad, eliminarDelCarrito, totalPrecio } = useCart()

  return (
    <section className="seccion-carrito" aria-labelledby="titulo-carrito">
      <div className="encabezado-carrito">
        <p className="etiqueta-seccion">TU COMPRA</p>
        <h1 id="titulo-carrito">Carrito de compras</h1>
      </div>

      {carrito.length === 0 ? (
        <p id="carrito-vacio">
          Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
        </p>
      ) : (
        <div className="lista-carrito">
          {carrito.map((item) => (
            <article key={item.id} className="item-carrito">
              <img src={item.imagen} alt={item.nombre} />
              <div className="datos-item-carrito">
                <p>{item.categoria}</p>
                <h2>{item.nombre}</h2>
                <strong>{formatearPrecio(item.precio)}</strong>
              </div>
              <div className="controles-carrito">
                <button type="button" onClick={() => cambiarCantidad(item.id, -1)} aria-label="Restar una unidad">−</button>
                <span>{item.cantidad}</span>
                <button type="button" onClick={() => cambiarCantidad(item.id, 1)} aria-label="Sumar una unidad">+</button>
              </div>
              <button className="boton-eliminar-carrito" type="button" onClick={() => eliminarDelCarrito(item.id)}>
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="resumen-carrito">
        <span>Total de la compra</span>
        <strong>{formatearPrecio(totalPrecio)}</strong>
      </div>
    </section>
  )
}

export default Carrito