import { Link, useParams } from 'react-router-dom'
import { articulos } from '../data/articulos'
import '../styles/blog.css'

function Blog() {
  const { id } = useParams()

  if (id) {
    const articulo = articulos.find((item) => item.id === id)

    if (!articulo) {
      return (
        <section className="detalle-articulo" aria-labelledby="titulo-articulo">
          <Link className="boton-volver-blog" to="/blog">← Volver al blog</Link>
          <h1 id="titulo-articulo">Artículo no encontrado</h1>
          <p className="resumen-articulo">La noticia que buscas no está disponible.</p>
        </section>
      )
    }

    return (
      <article className="detalle-articulo" aria-labelledby="titulo-articulo">
        <Link className="boton-volver-blog" to="/#Blog">
          <span aria-hidden="true">←</span> Volver al blog
        </Link>
        <div className="encabezado-articulo">
          <p className="etiqueta-seccion">{articulo.categoria}</p>
          <h1 id="titulo-articulo">{articulo.titulo}</h1>
          <p className="resumen-articulo">{articulo.resumen}</p>
        </div>
        <div className="visual-articulo">
          <img src={articulo.imagen} alt={articulo.titulo} />
        </div>
        <p className="contenido-articulo">{articulo.contenido}</p>
      </article>
    )
  }

  return (
    <section className="pagina-blog" aria-labelledby="titulo-blog">
      <div className="encabezado-blog">
        <div>
          <p className="etiqueta-seccion">BLOG GMOON</p>
          <h1 id="titulo-blog">Ideas para mejorar tu partida</h1>
        </div>
        <p>Guías y consejos para disfrutar más tu espacio y tus juegos.</p>
      </div>
      <div className="rejilla-blog">
        {articulos.map((articulo, index) => (
          <article className="tarjeta-blog" key={articulo.id}>
            <div className={`visual-blog ${index === 1 ? 'visual-blog-pink' : ''}`}>
              <img src={articulo.imagen} alt="" />
            </div>
            <div className="contenido-blog">
              <p>{articulo.categoria}</p>
              <h2>{articulo.titulo}</h2>
              <p>{articulo.resumen}</p>
              <Link to={`/blog/${articulo.id}`}>
                Leer artículo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Blog
