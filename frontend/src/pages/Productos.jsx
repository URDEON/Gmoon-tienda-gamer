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

      {grupos.map((grupo) => (
        <section key={grupo} className="grupo-categoria">
          <h2 className="titulo-categoria">{grupo}</h2>
          {/* Bootstrap: 1 columna en móvil, 2 en tablet, 3 en laptop, 4 en pantalla grande */}
          <div className="row g-4">
            {productos
              .filter((producto) => producto.grupo === grupo)
              .map((producto) => (
                <div key={producto.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <ProductCard producto={producto} />
                </div>
              ))}
          </div>
        </section>
      ))}
    </section>
  )
}

export default Productos