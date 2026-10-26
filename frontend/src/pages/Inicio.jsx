import { Link } from 'react-router-dom'
import { formatearPrecio, obtenerOferta, obtenerPrecioFinal } from '../data/productos'
import { useProductos } from '../hooks/useProductos'

const categorias = [
  {
    nombre: 'Consolas modernas',
    id: 'consolas-modernas',
    descripcion: 'Potencia para jugar hoy',
    imagen: '/img/StickerConsolas_Modernas.png',
    clase: 'tarjeta-categoria-consolas',
    icono: '◆',
  },
  {
    nombre: 'Consolas retro',
    id: 'consolas-retro',
    descripcion: 'Clásicos que siguen vivos',
    imagen: '/img/StickerConsolas_Retro.png',
    clase: 'tarjeta-categoria-retro',
    icono: '◈',
  },
  {
    nombre: 'Videojuegos',
    id: 'videojuegos',
    descripcion: 'Nuevas historias por descubrir',
    imagen: '/img/Stiker_Videojuegos.png',
    clase: 'tarjeta-categoria-juegos',
    icono: '✦',
  },
  {
    nombre: 'Periféricos',
    id: 'accesorios',
    descripcion: 'Equipa tu zona de juego',
    imagen: '/img/StickerPereferico.png',
    clase: 'tarjeta-categoria-perifericos',
    icono: '+',
  },
]

function Inicio() {
  const productos = useProductos()
  return (
    <>
      <section className="seccion-bienvenida">
        <div className="contenido-bienvenida">
          <p className="etiqueta-seccion">GMOON GAMER STORE</p>
          <h1>Tu próxima partida empieza aquí</h1>
          <p>Encuentra juegos, accesorios y tecnología para llevar tu experiencia gamer al siguiente nivel.</p>
          <div className="acciones-bienvenida">
            <Link to="/productos" className="boton-principal">Explora nuestros productos</Link>
            <Link to="/ofertas" className="boton-principal boton-ofertas">Ver ofertas demo</Link>
          </div>
        </div>
      </section>

      <section className="seccion-categorias container" id="Explora" aria-labelledby="titulo-categorias">
        <div className="encabezado-computadores">
          <div>
            <p className="etiqueta-seccion">EXPLORA LA TIENDA</p>
            <h2 id="titulo-categorias">Encuentra tu próxima partida</h2>
          </div>
          <Link className="enlace-seccion" to="/productos">Ver todo el catálogo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="rejilla-categorias row g-3">
          {categorias.map((categoria) => (
            <Link
              key={categoria.nombre}
              className={`tarjeta-categoria col-12 col-sm-6 col-lg-3 ${categoria.clase}`}
              to={`/productos#${categoria.id}`}
            >
              <span className="icono-categoria" aria-hidden="true">{categoria.icono}</span>
              <span className="marcador-imagen">
                <img src={categoria.imagen} alt="" />
              </span>
              <span className="contenido-categoria">
                <strong>{categoria.nombre}</strong>
                <small>{categoria.descripcion}</small>
              </span>
              <span className="flecha-categoria" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion-computadores container" id="Computadores" aria-labelledby="titulo-computadores">
        <div className="encabezado-computadores">
          <div>
            <p className="etiqueta-seccion">PARA TU SETUP</p>
            <h2 id="titulo-computadores">Computadores gamer</h2>
          </div>
          <Link className="enlace-seccion" to="/productos#pc-gamer">Ver todos los productos <span aria-hidden="true">→</span></Link>
        </div>
        <div className="rejilla-computadores row g-4">
          {productos.filter((producto) => producto.grupo === 'PC Gamer').map((producto) => {
            const oferta = obtenerOferta(producto)
            return (
              <div className="col-12 col-lg-4" key={producto.id}>
                <article className="tarjeta-computador h-100">
                  <div
                    className={`visual-computador ${
                      producto.categoria === 'PC Gamer Pro'
                        ? 'visual-computador-morado'
                        : producto.categoria === 'PC Gamer Ultra'
                          ? 'visual-computador-cyan'
                          : 'visual-computador-azul'
                    }`}
                    aria-hidden="true"
                  >
                    <span className="marcador-imagen-computador">
                      <img src={producto.imagenInicio || producto.imagen} alt="" />
                    </span>
                    <span>GMOON</span>
                    <strong>
                      {producto.categoria === 'PC Gamer'
                        ? 'STARTER'
                        : producto.categoria.replace('PC Gamer ', '').toUpperCase()}
                    </strong>
                  </div>
                  <div className="contenido-computador">
                    <p>PC Gamer</p>
                    <h3>{producto.nombre}</h3>
                    <span className="precio-computador">
                      {oferta && <del>{formatearPrecio(producto.precio)} </del>}
                      {formatearPrecio(obtenerPrecioFinal(producto))}
                    </span>
                    <Link to={`/producto/${producto.id}`}>Ver producto</Link>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </section>

      <section className="seccion-nosotros" id="Nosotros" aria-labelledby="titulo-nosotros">
        <div className="contenido-nosotros">
          <div className="visual-nosotros">
            <img src="/img/Imagen_Bienvenida.png" alt="Bienvenida a Gmoon Gamer Store" />
          </div>
          <div>
            <p className="etiqueta-seccion">CONOCE GMOON</p>
            <h2 id="titulo-nosotros">Más que una tienda, somos parte de tu partida</h2>
            <p>
              En Gmoon Gamer Store reunimos juegos, consolas y accesorios para que armes tu
              experiencia ideal. Nos mueve la pasión por jugar y las ganas de ayudarte a encontrar
              el equipo que realmente necesitas.
            </p>
            <p>
              Trabajamos para ofrecer una atención cercana, productos confiables y un espacio donde
              cada gamer pueda sentirse en casa.
            </p>
          </div>
        </div>
      </section>

      <section className="seccion-blog" id="Blog" aria-labelledby="titulo-blog">
        <div className="encabezado-blog">
          <div>
            <p className="etiqueta-seccion">BLOG GMOON</p>
            <h2 id="titulo-blog">Ideas para mejorar tu partida</h2>
          </div>
          <Link className="enlace-seccion" to="/blog">Ver todos los artículos <span aria-hidden="true">→</span></Link>
        </div>
        <div className="rejilla-blog">
          <article className="tarjeta-blog">
            <div className="visual-blog">
              <img src="/img/Stiker_Aqui_te_explicamos.png" alt="" />
            </div>
            <div className="contenido-blog">
              <p>Guías gamer</p>
              <h3>Cómo elegir tu próxima consola</h3>
              <p>Comparamos opciones para que encuentres la consola que mejor se adapta a tu forma de jugar.</p>
              <Link to="/blog/guias-consolas">Leer artículo <span aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article className="tarjeta-blog">
            <div className="visual-blog visual-blog-pink">
              <img src="/img/Stiker_setup_gamer.png" alt="" />
            </div>
            <div className="contenido-blog">
              <p>Setup gamer</p>
              <h3>Arma un espacio cómodo para jugar</h3>
              <p>Consejos simples para ordenar tus periféricos y disfrutar sesiones más cómodas.</p>
              <Link to="/blog/setup-gamer">Leer artículo <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default Inicio