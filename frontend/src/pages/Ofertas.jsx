import ProductCard from '../components/ProductCard'
import { obtenerOferta } from '../data/productos'
import { useProductos } from '../hooks/useProductos'
import '../styles/productos.css'

function Ofertas() {
  const productos = useProductos()
  const productosEnOferta = productos.filter((producto) => obtenerOferta(producto))

  return (
    <section className="seccion-catalogo seccion-ofertas container" aria-labelledby="titulo-ofertas">
      <div className="encabezado-catalogo">
        <div>
          <p className="etiqueta-seccion">PROMOCIONES DE EJEMPLO</p>
          <h1 id="titulo-ofertas">Ofertas gamer</h1>
        </div>
        <p className="texto-catalogo">
          Estas ofertas son demostrativas y no representan precios comerciales vigentes.
        </p>
      </div>
      <div className="rejilla-productos row g-4">
        {productosEnOferta.length > 0
          ? productosEnOferta.map((producto) => (
            <div className="col-12 col-sm-6 col-lg-3" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))
          : <p className="texto-catalogo col-12">Todavía no hay productos en oferta.</p>}
      </div>
    </section>
  )
}

export default Ofertas
