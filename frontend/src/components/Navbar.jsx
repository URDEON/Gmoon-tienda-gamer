import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { buscarProductos } from '../data/productos'
import { useGrupos } from '../hooks/useGrupos'
import { useProductos } from '../hooks/useProductos'

const apartadosInicio = [
  { nombre: 'Explora la Tienda', id: 'Explora' },
  { nombre: 'Computadores gamer', id: 'Computadores' },
  { nombre: 'Nosotros', id: 'Nosotros' },
  { nombre: 'Blog gamer', id: 'Blog', ruta: '/blog' },
  { nombre: 'Contacto', id: 'Contacto' },
]

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const botonRef = useRef(null)
  const menuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  const { totalProductos } = useCart()
  const { usuario, esAdmin, cerrarSesion } = useAuth()
  const grupos = useGrupos()
  const productos = useProductos()
  const estaEnInicio = pathname === '/'

  // Cierra el menú al hacer clic fuera (reemplaza a menu.js)
  useEffect(() => {
    const cerrarSiClicFuera = (event) => {
      const fueraDelMenu = menuRef.current && !menuRef.current.contains(event.target)
      const fueraDelBoton = botonRef.current && !botonRef.current.contains(event.target)
      if (fueraDelMenu && fueraDelBoton) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('click', cerrarSiClicFuera)
    return () => document.removeEventListener('click', cerrarSiClicFuera)
  }, [])

  const buscar = (event) => {
    event.preventDefault()
    const consulta = new FormData(event.currentTarget).get('buscar')?.toString().trim() || ''

    if (!consulta) {
      navigate('/productos')
      return
    }

    const texto = consulta.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const apartado = apartadosInicio.find(({ id }) => {
      const nombre = id.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      const alias = {
        Explora: ['explora', 'tienda', 'categoria', 'categorias', 'inicio'],
        Computadores: ['computador', 'computadores', 'computadora', 'computadoras', 'setup'],
        Nosotros: ['nosotros', 'quienes somos', 'quienessomos'],
        Blog: ['blog', 'guias', 'guia'],
        Contacto: ['contacto', 'ayuda', 'soporte'],
      }[id]
      return texto.includes(nombre.toLowerCase()) || alias.some((palabra) => texto.includes(palabra))
    })

    if (apartado) {
      navigate(`/#${apartado.id}`)
      return
    }

    const resultados = buscarProductos(consulta, productos)
    if (resultados.length > 0) {
      navigate(`/productos?buscar=${encodeURIComponent(consulta)}`)
      return
    }

    navigate(`/productos?buscar=${encodeURIComponent(consulta)}`)
  }

  return (
    <header className="encabezado-sitio">
      <div className="barra-superior">
        <div className="ancho-encabezado contenido-barra-superior">
          <a href="#">Tiendas</a>
          <a href="#">Centro de ayuda</a>
        </div>
      </div>

      <div className="barra-principal">
        <div className="ancho-encabezado contenido-barra-principal">
          <Link to="/" aria-label="Ir a la página principal">
            <img className="logo" src="/img/Portada_Gmoon.png" alt="Logo de Gmoon" />
          </Link>
          <span className="eslogan">Tu tienda gamer</span>

          <button
            ref={botonRef}
            className="boton-categorias"
            type="button"
            aria-controls="menu-categorias"
            aria-expanded={menuAbierto}
            aria-label="Abrir categorías"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="icono-menu"><i></i><i></i><i></i></span>
            <span>Categorías</span>
          </button>

          <form key={location.key} className="formulario-busqueda" role="search" onSubmit={buscar}>
            <input
              type="search"
              name="buscar"
              placeholder="Busca productos o apartados"
              aria-label="Buscar productos o apartados"
              defaultValue={new URLSearchParams(location.search).get('buscar') || ''}
            />
            <button type="submit" aria-label="Buscar">⌕</button>
          </form>

          <Link
            className="enlace-cuenta"
            to={usuario ? (esAdmin ? '/admin' : '/') : '/iniciar-sesion'}
            aria-label={usuario ? 'Mi cuenta' : 'Iniciar sesión'}
          >
            <svg
              className="icono-cuenta"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            <span className="texto-cuenta">
              {usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : 'Hola, ingresa aquí!'}
            </span>
          </Link>

          <div className="acciones-compras">
            {usuario ? (
              <button className="boton-accion-sesion" type="button" onClick={cerrarSesion}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 17l5-5-5-5M15 12H3m9-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                </svg>
                Cerrar sesión
              </button>
            ) : (
              <Link className="boton-accion-sesion boton-registro" to="/registrar">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m5-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11-3v6m-3-3h6" />
                </svg>
                Registrarse
              </Link>
            )}
            <Link className="enlace-carrito" to="/carrito" aria-label={`Ver carrito, ${totalProductos} productos`}>
              🛒
              {totalProductos > 0 && <span className="contador-carrito">{totalProductos}</span>}
            </Link>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`menu-categorias ${menuAbierto ? 'abierto' : ''}`}
          id="menu-categorias"
          aria-label={estaEnInicio ? 'Apartados de inicio' : 'Categorías de productos'}
        >
          {estaEnInicio ? (
            apartadosInicio.map(({ nombre, id, ruta }) => (
              <Link key={id} to={ruta || `/#${id}`} onClick={() => setMenuAbierto(false)}>
                {nombre} <span>›</span>
              </Link>
            ))
          ) : (
            <>
              <Link className="todas-categorias" to="/productos" onClick={() => setMenuAbierto(false)}>
                Todas las categorías <span>›</span>
              </Link>
              {grupos.map(({ nombre, titulo, id }) => (
                <Link key={id} to={`/productos#${id}`} onClick={() => setMenuAbierto(false)}>
                  {titulo || nombre} <span>›</span>
                </Link>
              ))}
              <Link to="/ofertas" onClick={() => setMenuAbierto(false)}>
                Ofertas de ejemplo <span>›</span>
              </Link>
            </>
          )}
        </div>

        <nav className="menu-movil ancho-encabezado" id="menu" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <a href="/#Contacto">Contacto</a>
        </nav>
      </div>

      <div className="barra-promocion">
        Únicos con compra online y retiro <strong>inmediato</strong> en tienda Gmoon en todo Chile.
      </div>
    </header>
  )
}

export default Navbar