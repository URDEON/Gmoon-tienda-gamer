import { Link } from 'react-router-dom'
import { formatearPrecio } from '../data/productos'

// Recibe un producto por props y solo se encarga de mostrarlo
function ProductCard({ producto }) {
  const { id, categoria, nombre, precio, imagen } = producto

  return (
    <article className="tarjeta-producto h-100">
      <div className="visual-producto">
        <img src={imagen} alt={nombre} />
      </div>
      <div className="contenido-producto">
        <p className="categoria-producto">{categoria}</p>
        <h3>{nombre}</h3>
        <p className="precio-producto">{formatearPrecio(precio)}</p>
        <Link className="boton-producto" to={`/producto/${id}`}>Ver producto</Link>
      </div>
    </article>
  )
}

export default ProductCard