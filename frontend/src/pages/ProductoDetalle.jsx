import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatearPrecio, obtenerOferta, obtenerPrecioFinal } from '../data/productos'
import { useProductos } from '../hooks/useProductos'
import { useCart } from '../context/CartContext'
import '../styles/detalle-producto.css'

function ProductoDetalle() {
  const productos = useProductos()
  const { id } = useParams() // lee el :id de la dirección /producto/:id
  const { agregarAlCarrito } = useCart()
  const [productoAgregado, setProductoAgregado] = useState(null)
  const [cantidad, setCantidad] = useState(1)

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
    agregarAlCarrito(producto, cantidad)
    setProductoAgregado({ id: producto.id, cantidad })
  }
  const oferta = obtenerOferta(producto)

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
          {oferta && <span className="etiqueta-oferta">Oferta demo -{oferta.descuento}%</span>}
          <strong className={oferta ? 'precio-con-oferta' : undefined}>
            {oferta && <del>{formatearPrecio(producto.precio)} </del>}
            {formatearPrecio(obtenerPrecioFinal(producto))}
          </strong>
          <div className="selector-cantidad">
            <span id="etiqueta-cantidad">Unidades</span>
            <div className="control-cantidad">
              <button
                type="button"
                aria-label="Restar una unidad"
                disabled={cantidad <= 1}
                onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={cantidad}
                aria-labelledby="etiqueta-cantidad"
                onChange={(event) => {
                  const valor = Number.parseInt(event.target.value, 10)
                  setCantidad(Number.isNaN(valor) ? 1 : Math.max(1, valor))
                }}
              />
              <button
                type="button"
                aria-label="Sumar una unidad"
                onClick={() => setCantidad((actual) => actual + 1)}
              >
                +
              </button>
            </div>
          </div>
          <button className="boton-anadir-carrito" type="button" onClick={manejarAgregar}>
            {productoAgregado?.id === producto.id
              ? `Añadidas ${productoAgregado.cantidad} unidades ✓`
              : 'Añadir al carrito'}
          </button>
        </div>
      </section>
    </>
  )
}

export default ProductoDetalle