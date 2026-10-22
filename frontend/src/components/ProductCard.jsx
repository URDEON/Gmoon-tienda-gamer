import { Link } from 'react-router-dom'
import { formatearPrecio, obtenerOferta, obtenerPrecioFinal } from '../data/productos'

// Recibe un producto por props y solo se encarga de mostrarlo
function ProductCard({ producto }) {
  const { id, categoria, nombre, precio, imagen } = producto
  const oferta = obtenerOferta(producto)

  return (
    <article className="tarjeta-producto h-100">
      <div className="visual-producto">
        <img src={imagen} alt={nombre} />
        {oferta && <span className="etiqueta-oferta">-{oferta.descuento}%</span>}
      </div>
      <div className="contenido-producto">
        <p className="categoria-producto">{categoria}</p>
        <h3>{nombre}</h3>
        <p className="precio-producto">
          {oferta && <del>{formatearPrecio(precio)}</del>}
          <span>{formatearPrecio(obtenerPrecioFinal(producto))}</span>
        </p>
        <Link className="boton-producto" to={`/producto/${id}`}>Ver producto</Link>
      </div>
    </article>
  )
}

export default ProductCard