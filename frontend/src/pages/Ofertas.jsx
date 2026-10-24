import ProductCard from '../components/ProductCard'
import { obtenerOferta } from '../data/productos'
import { useProductos } from '../hooks/useProductos'
import '../styles/productos.css'

function Ofertas() {
  const productos = useProductos()
  const productosEnOferta = productos.filter((producto) => obtenerOferta(producto))

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
        {productosEnOferta.length > 0
          ? productosEnOferta.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))
          : <p className="texto-catalogo">Todavía no hay productos en oferta.</p>}
      </div>
    </section>
  )
}

export default Ofertas
