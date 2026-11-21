import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { buscarProductos } from '../data/productos'
import { useGrupos } from '../hooks/useGrupos'
import { useCatalogoEstado, useProductos } from '../hooks/useProductos'
import '../styles/productos.css'

function Productos() {
  const productos = useProductos()
  const estadoCatalogo = useCatalogoEstado()
  const grupos = useGrupos()
  const [searchParams] = useSearchParams()
  const busqueda = searchParams.get('buscar')?.trim() || ''
  const resultados = busqueda ? buscarProductos(busqueda, productos) : productos

  return (
    <section className="seccion-catalogo container" id="productos" aria-labelledby="titulo-productos">
      <div className="encabezado-catalogo">
        <div>
          <p className="etiqueta-seccion">{busqueda ? 'RESULTADOS DE BÚSQUEDA' : 'CATÁLOGO GMOON'}</p>
          <h1 id="titulo-productos">{busqueda ? `Resultados para “${busqueda}”` : 'Productos gamer'}</h1>
        </div>
        <p className="texto-catalogo">
          {busqueda
            ? `${resultados.length} producto${resultados.length === 1 ? '' : 's'} relacionado${resultados.length === 1 ? '' : 's'} con tu búsqueda.`
            : 'Encuentra el equipo, juego o accesorio que necesitas para tu próxima partida.'}
        </p>
      </div>

      {estadoCatalogo.cargando && <p role="status">Cargando catálogo...</p>}
      {estadoCatalogo.error && (
        <div role="alert">
          <p>No se pudo cargar el catálogo: {estadoCatalogo.error}</p>
          <button type="button" onClick={estadoCatalogo.reintentar}>Reintentar</button>
        </div>
      )}
      {!estadoCatalogo.cargando && !estadoCatalogo.error && productos.length === 0 && (
        <p role="status">Aún no hay productos publicados.</p>
      )}

      {busqueda && resultados.length === 0 ? (
        <p className="mensaje-sin-resultados" role="status">
          No encontramos productos parecidos. Prueba con otro nombre, consola o categoría.
        </p>
      ) : grupos.map(({ nombre, titulo, id }) => {
        const productosDelGrupo = resultados.filter((producto) => producto.grupo === nombre)
        if (productosDelGrupo.length === 0) return null

        return (
        <section key={id} id={id} className="grupo-categoria">
          <h2 className="titulo-categoria">{titulo || nombre}</h2>
          <div className="rejilla-productos row g-4">
            {productosDelGrupo.map((producto) => (
              <div className="col-12 col-sm-6 col-lg-3" key={producto.id}>
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
        </section>
        )
      })}
    </section>
  )
}

export default Productos