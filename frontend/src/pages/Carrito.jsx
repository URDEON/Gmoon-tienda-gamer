import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatearPrecio, obtenerOferta, obtenerPrecioFinal } from '../data/productos'
import '../styles/carrito.css'

function Carrito() {
  const { carrito, cambiarCantidad, eliminarDelCarrito, subtotal, totalDescuento, totalPrecio } = useCart()

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
                <strong>
                  {obtenerOferta(item) && <del>{formatearPrecio(item.precio)} </del>}
                  {formatearPrecio(obtenerPrecioFinal(item))}
                  {obtenerOferta(item) && <small>Oferta demo aplicada</small>}
                </strong>
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
        <div className="totales-carrito">
          <span>Subtotal <strong>{formatearPrecio(subtotal)}</strong></span>
          {totalDescuento > 0 && (
            <span className="ahorro-carrito">Descuentos demo <strong>-{formatearPrecio(totalDescuento)}</strong></span>
          )}
          <span>Total de la compra <strong>{formatearPrecio(totalPrecio)}</strong></span>
        </div>
        {carrito.length > 0 && (
          <Link className="boton-continuar-pago" to="/checkout">Continuar al pago</Link>
        )}
      </div>
    </section>
  )
}

export default Carrito