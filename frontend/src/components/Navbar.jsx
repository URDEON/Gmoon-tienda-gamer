import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const botonRef = useRef(null)
  const menuRef = useRef(null)

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

          <form className="formulario-busqueda" role="search" onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Busca aquí la tecnología para ti" aria-label="Buscar productos" />
            <button type="submit" aria-label="Buscar">⌕</button>
          </form>

          <Link className="enlace-cuenta" to="/iniciar-sesion" aria-label="Iniciar sesión">
            <span className="icono-cuenta" aria-hidden="true">👤</span>
            <span className="texto-cuenta">Hola, ingresa aquí!</span>
          </Link>
          <div className="acciones-compras">
            <Link className="enlace-compras" to="/mis-compras">Mis compras</Link>
            <Link className="enlace-carrito" to="/carrito" aria-label="Ver carrito">🛒</Link>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`menu-categorias ${menuAbierto ? 'abierto' : ''}`}
          id="menu-categorias"
          aria-label="Categorías de productos"
        >
          <Link className="todas-categorias" to="/productos">Todas las categorías <span>›</span></Link>
          <Link to="/productos">Explora la Tienda<span>›</span></Link>
          <Link to="/productos">Computadores gamer <span>›</span></Link>
          <a href="/#Nosotros">Nosotros <span>›</span></a>
          <a href="/#Blog">Blog gamer <span>›</span></a>
          <a href="/#Contacto">Contacto <span>›</span></a>
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