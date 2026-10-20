import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productos, formatearPrecio } from '../data/productos'
import { useCart } from '../context/CartContext'
import '../styles/detalle-producto.css'

function ProductoDetalle() {
  const { id } = useParams() // lee el :id de la dirección /producto/:id
  const { agregarAlCarrito } = useCart()
  const [idAgregado, setIdAgregado] = useState(null)

  const producto = productos.find((p) => p.id === id)

  if (!producto) {
    return (
      <>
        <Link className="boton-volver-productos" to="/productos">
          <span aria-hidden="true">←</span> Volver a productos
        </Link>
        <section className="detalle-producto">
          <div className="contenido-detalle-producto">
            <h1>Producto no encontrado</h1>
            <p>El producto que buscas no existe o fue retirado del catálogo.</p>
          </div>
        </section>
      </>
    )
  }

  const manejarAgregar = () => {
    agregarAlCarrito(producto)
    setIdAgregado(producto.id)
  }

  return (
    <>
      <Link className="boton-volver-productos" to="/productos">
        <span aria-hidden="true">←</span> Volver a productos
      </Link>

      <section className="detalle-producto" aria-labelledby="nombre-producto">
        <div className="visual-detalle-producto">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="contenido-detalle-producto">
          <p className="categoria-producto">{producto.categoria}</p>
          <h1 id="nombre-producto">{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          <strong>{formatearPrecio(producto.precio)}</strong>
          <button className="boton-anadir-carrito" type="button" onClick={manejarAgregar}>
            {idAgregado === producto.id ? 'Añadido al carrito ✓' : 'Añadir al carrito'}
          </button>
        </div>
      </section>
    </>
  )
}

export default ProductoDetalle