import ProductCard from '../components/ProductCard'
import { ofertas } from '../data/productos'
import { useProductos } from '../hooks/useProductos'
import '../styles/productos.css'

function Ofertas() {
  const productos = useProductos()
  const productosEnOferta = ofertas
    .map(({ productoId }) => productos.find((producto) => producto.id === productoId))
    .filter(Boolean)

  return (
    <section className="seccion-catalogo seccion-ofertas" aria-labelledby="titulo-ofertas">
      <div className="encabezado-catalogo">
        <div>
          <p className="etiqueta-seccion">PROMOCIONES DE EJEMPLO</p>
          <h1 id="titulo-ofertas">Ofertas gamer</h1>
        </div>
        <p className="texto-catalogo">
          Estas ofertas son demostrativas y no representan precios comerciales vigentes.
        </p>
      </div>
      <div className="rejilla-productos">
        {productosEnOferta.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}

export default Ofertas
