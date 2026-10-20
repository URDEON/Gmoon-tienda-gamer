import ProductCard from '../components/ProductCard'
import { productos, grupos } from '../data/productos'
import '../styles/productos.css'

function Productos() {
  return (
    <section className="seccion-catalogo" id="productos" aria-labelledby="titulo-productos">
      <div className="encabezado-catalogo">
        <div>
          <p className="etiqueta-seccion">CATÁLOGO GMOON</p>
          <h1 id="titulo-productos">Productos gamer</h1>
        </div>
        <p className="texto-catalogo">
          Encuentra el equipo, juego o accesorio que necesitas para tu próxima partida.
        </p>
      </div>

      {grupos.map(({ nombre, titulo, id }) => (
        <section key={id} id={id} className="grupo-categoria">
          <h2 className="titulo-categoria">{titulo || nombre}</h2>
          <div className="rejilla-productos">
            {productos
              .filter((producto) => producto.grupo === nombre)
              .map((producto) => <ProductCard key={producto.id} producto={producto} />)}
          </div>
        </section>
      ))}
    </section>
  )
}

export default Productos