import { useRef, useState } from 'react'
import { guardarGrupo, guardarProductos, formatearPrecio, obtenerOferta } from '../data/productos'
import { obtenerOrdenesPorCorreo } from '../data/ordenes'
import { useOrdenes } from '../hooks/useOrdenes'
import { useProductos } from '../hooks/useProductos'
import { useGrupos } from '../hooks/useGrupos'
import { generarHtmlComprobante } from '../utils/emailService'
import {
  actualizarUsuario,
  obtenerPerfilAdministrador,
  obtenerUsuarios,
  registrarUsuario,
} from '../utils/usuarios'
import { useAuth } from '../context/AuthContext'
import '../styles/admin.css'

const UMBRAL_STOCK_CRITICO = 3

const crearFormularioVacio = (grupos) => ({
  nombre: '',
  grupo: grupos[0]?.nombre || '',
  categoria: grupos[0]?.nombre || '',
  descripcion: '',
  precio: '',
  descuento: '0',
  stock: '0',
  imagen: '',
  imagenInicio: '',
})

const vistas = [
  { id: 'nuevo', nombre: 'Nuevo producto' },
  { id: 'productos', nombre: 'Mostrar productos' },
  { id: 'ofertas', nombre: 'Ofertas' },
  { id: 'ordenes', nombre: 'Órdenes/Boletas' },
  { id: 'criticos', nombre: 'Productos críticos' },
  { id: 'reportes', nombre: 'Reportes' },
  { id: 'categorias', nombre: 'Categorías' },
  { id: 'usuarios', nombre: 'Usuarios' },
  { id: 'perfil', nombre: 'Perfil' },
]

const obtenerClientes = () => obtenerUsuarios().map(({ nombre, email, rol }) => ({ nombre, email, rol }))

function crearId(nombre, catalogo) {
  const slug = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  let id = `${slug}-${Date.now()}`
  let sufijo = 1
  while (catalogo.some((producto) => producto.id === id)) {
    id = `${slug}-${Date.now()}-${sufijo}`
    sufijo += 1
  }
  return id
}

function PanelAdmin() {
  const { usuario, actualizarPerfilAdmin } = useAuth()
  const productos = useProductos()
  const ordenes = useOrdenes()
  const grupos = useGrupos()
  const [clientes, setClientes] = useState(obtenerClientes)
  const [vista, setVista] = useState('productos')
  const [productoEditando, setProductoEditando] = useState(null)
  const [formulario, setFormulario] = useState(() => crearFormularioVacio(grupos))
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [formularioUsuario, setFormularioUsuario] = useState({ nombre: '', email: '', password: '' })
  const [vistaUsuarios, setVistaUsuarios] = useState('lista')
  const [usuarioHistorial, setUsuarioHistorial] = useState(null)
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', password: '', confirmacion: '' })
  const [perfilAdmin, setPerfilAdmin] = useState(() => {
    const perfil = obtenerPerfilAdministrador()
    return { nombre: perfil.nombre, email: perfil.email, password: '' }
  })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ordenMostrada, setOrdenMostrada] = useState(null)
  const [htmlBoleta, setHtmlBoleta] = useState('')
  const [cargandoBoleta, setCargandoBoleta] = useState(false)
  const iframeBoleta = useRef(null)

  const productosCriticos = productos.filter((producto) => producto.stock <= UMBRAL_STOCK_CRITICO)
  const productosEnOferta = productos.filter((producto) => obtenerOferta(producto))
  const ordenesUsuario = usuarioHistorial ? obtenerOrdenesPorCorreo(usuarioHistorial.email) : []
  const unidadesEnStock = productos.reduce((total, producto) => total + producto.stock, 0)
  const valorInventario = productos.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0,
  )

  const cambiarVista = (id) => {
    setVista(id)
    setProductoEditando(null)
    setFormulario(crearFormularioVacio(grupos))
    setUsuarioEditando(null)
    setFormularioUsuario({ nombre: '', email: '', password: '' })
    setVistaUsuarios('lista')
    setUsuarioHistorial(null)
    setNuevoUsuario({ nombre: '', email: '', password: '', confirmacion: '' })
    setMensaje('')
    setError('')
    setOrdenMostrada(null)
    setHtmlBoleta('')
  }

  const editarProducto = (producto) => {
    setFormulario({
      nombre: producto.nombre,
      grupo: producto.grupo,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      descuento: String(obtenerOferta(producto)?.descuento || 0),
      stock: String(producto.stock),
      imagen: producto.imagen,
      imagenInicio: producto.imagenInicio || '',
    })
    setProductoEditando(producto.id)
    setVista('nuevo')
    setMensaje('')
    setError('')
  }

  const guardarFormulario = (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const precio = Number(formulario.precio)
    const descuento = Number(formulario.descuento)
    const stock = Number(formulario.stock)
    if (!formulario.nombre.trim() || !formulario.categoria.trim() || !formulario.imagen.trim()) {
      setError('Completa el nombre, la categoría y la ruta de la imagen.')
      return
    }
    if (!Number.isInteger(precio) || precio <= 0) {
      setError('Ingresa un precio entero mayor que cero.')
      return
    }
    if (!Number.isInteger(descuento) || descuento < 0 || descuento > 100) {
      setError('El descuento debe ser un número entero entre 0 y 100.')
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError('El stock debe ser un número entero igual o mayor que cero.')
      return
    }

    const datosProducto = {
      nombre: formulario.nombre.trim(),
      grupo: formulario.grupo,
      categoria: formulario.categoria.trim(),
      descripcion: formulario.descripcion.trim(),
      precio,
      descuento,
      stock,
      imagen: formulario.imagen.trim(),
      ...(formulario.imagenInicio.trim() ? { imagenInicio: formulario.imagenInicio.trim() } : {}),
    }
    const catalogoActualizado = productoEditando
      ? productos.map((producto) => (
        producto.id === productoEditando ? { ...producto, ...datosProducto } : producto
      ))
      : [...productos, { id: crearId(datosProducto.nombre, productos), ...datosProducto }]

    try {
      guardarProductos(catalogoActualizado)
      setFormulario(crearFormularioVacio(grupos))
      setProductoEditando(null)
      setVista('productos')
      setMensaje(productoEditando ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
    } catch (errorGuardado) {
      setError(`No se pudo guardar el catálogo: ${errorGuardado.message}`)
    }
  }

  const crearCategoria = (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    try {
      guardarGrupo(nombreCategoria)
      setNombreCategoria('')
      setMensaje('Categoría creada correctamente y disponible en el catálogo.')
    } catch (errorGuardado) {
      setError(errorGuardado.message)
    }
  }

  const iniciarEdicionUsuario = (cliente) => {
    setUsuarioEditando(cliente.email)
    setFormularioUsuario({ nombre: cliente.nombre, email: cliente.email, password: '' })
    setMensaje('')
    setError('')
  }

  const guardarEdicionUsuario = (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const resultado = actualizarUsuario(usuarioEditando, formularioUsuario)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setClientes(obtenerClientes())
    setUsuarioEditando(null)
    setFormularioUsuario({ nombre: '', email: '', password: '' })
    setMensaje('Datos del usuario actualizados correctamente.')
  }

  const crearUsuario = (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    if (nuevoUsuario.password !== nuevoUsuario.confirmacion) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const resultado = registrarUsuario(nuevoUsuario)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setClientes(obtenerClientes())
    setNuevoUsuario({ nombre: '', email: '', password: '', confirmacion: '' })
    setVistaUsuarios('lista')
    setMensaje('Usuario creado correctamente.')
  }

  const guardarPerfil = (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const resultado = actualizarPerfilAdmin(perfilAdmin)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setPerfilAdmin((actual) => ({ ...actual, ...resultado.usuario, password: '' }))
    setMensaje('Perfil de administrador actualizado correctamente.')
  }

  const mostrarBoleta = async (orden) => {
    setOrdenMostrada(orden)
    setHtmlBoleta('')
    setCargandoBoleta(true)
    setError('')
    setMensaje('')

    try {
      setHtmlBoleta(await generarHtmlComprobante(orden))
    } catch (errorGeneracion) {
      setError(`No se pudo mostrar el comprobante: ${errorGeneracion.message}`)
    } finally {
      setCargandoBoleta(false)
    }
  }

  const renderFormulario = () => (
    <form className="formulario-producto-admin" onSubmit={guardarFormulario}>
      <div className="campos-producto-admin">
        <label>
          Nombre
          <input
            required
            maxLength="100"
            value={formulario.nombre}
            onChange={(event) => setFormulario({ ...formulario, nombre: event.target.value })}
          />
        </label>
        <label>
          Grupo
          <select
            value={formulario.grupo}
            onChange={(event) => {
              const grupo = event.target.value
              setFormulario({
                ...formulario,
                grupo,
                categoria: formulario.categoria === formulario.grupo ? grupo : formulario.categoria,
              })
            }}
          >
            {grupos.map((grupo) => <option key={grupo.id} value={grupo.nombre}>{grupo.nombre}</option>)}
          </select>
        </label>
        <label>
          Categoría
          <input
            required
            maxLength="100"
            value={formulario.categoria}
            onChange={(event) => setFormulario({ ...formulario, categoria: event.target.value })}
          />
        </label>
        <label>
          Precio (CLP)
          <input
            required
            type="number"
            min="1"
            step="1"
            value={formulario.precio}
            onChange={(event) => setFormulario({ ...formulario, precio: event.target.value })}
          />
        </label>
        <label>
          Descuento (%, 0 para quitar)
          <input
            required
            type="number"
            min="0"
            max="100"
            step="1"
            value={formulario.descuento}
            onChange={(event) => setFormulario({ ...formulario, descuento: event.target.value })}
          />
        </label>
        <label>
          Stock disponible
          <input
            required
            type="number"
            min="0"
            step="1"
            value={formulario.stock}
            onChange={(event) => setFormulario({ ...formulario, stock: event.target.value })}
          />
        </label>
        <label className="campo-producto-completo">
          Descripción
          <textarea
            maxLength="500"
            rows="3"
            value={formulario.descripcion}
            onChange={(event) => setFormulario({ ...formulario, descripcion: event.target.value })}
          />
        </label>
        <label className="campo-producto-completo">
          Ruta o URL de imagen
          <input
            required
            value={formulario.imagen}
            placeholder="/img/Accesorios/producto.png"
            onChange={(event) => setFormulario({ ...formulario, imagen: event.target.value })}
          />
        </label>
        {formulario.grupo === 'PC Gamer' && (
          <label className="campo-producto-completo">
            Imagen de portada para inicio (opcional)
            <input
              value={formulario.imagenInicio}
              placeholder="/img/PC/portada_pc.png"
              onChange={(event) => setFormulario({ ...formulario, imagenInicio: event.target.value })}
            />
          </label>
        )}
      </div>
      <div className="acciones-formulario-admin">
        <button className="boton-admin-principal" type="submit">
          {productoEditando ? 'Guardar cambios' : 'Crear producto'}
        </button>
        {productoEditando && (
          <button className="boton-admin-secundario" type="button" onClick={() => cambiarVista('productos')}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  )

  const tablaProductos = (lista) => lista.length === 0 ? (
    <p className="vacio-admin">No hay productos para mostrar.</p>
  ) : (
    <div className="tabla-admin-contenedor">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Grupo / Categoría</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((producto) => {
            const oferta = obtenerOferta(producto)
            return (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.grupo} / {producto.categoria}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>{oferta ? `-${oferta.descuento}%` : 'Sin oferta'}</td>
                <td>
                  <span className={producto.stock <= UMBRAL_STOCK_CRITICO ? 'stock-critico-admin' : ''}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <button
                    className="boton-editar-admin"
                    type="button"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <section className="seccion-admin" aria-labelledby="titulo-admin">
      <div className="encabezado-admin">
        <p className="etiqueta-seccion">PANEL DE ADMINISTRACIÓN</p>
        <h1 id="titulo-admin">Hola, {usuario.nombre}</h1>
        <p className="descripcion-dashboard">Administra productos, inventario y revisa el resumen de tu tienda.</p>
      </div>

      <div className="resumen-admin">
        <article className="tarjeta-admin">
          <span className="etiqueta-tarjeta-admin">CATÁLOGO</span>
          <h2>Productos</h2>
          <strong>{productos.length}</strong>
        </article>
        <article className="tarjeta-admin">
          <span className="etiqueta-tarjeta-admin">INVENTARIO</span>
          <h2>Unidades disponibles</h2>
          <strong>{unidadesEnStock}</strong>
        </article>
        <article className="tarjeta-admin">
          <span className="etiqueta-tarjeta-admin">ATENCIÓN</span>
          <h2>Stock crítico (≤ {UMBRAL_STOCK_CRITICO})</h2>
          <strong>{productosCriticos.length}</strong>
        </article>
        <article className="tarjeta-admin">
          <span className="etiqueta-tarjeta-admin">PROMOCIONES</span>
          <h2>Productos en oferta</h2>
          <strong>{productosEnOferta.length}</strong>
        </article>
      </div>

      <nav className="navegacion-admin" aria-label="Administración de productos">
        {vistas.map(({ id, nombre }) => (
          <button
            key={id}
            className={vista === id ? 'activo' : ''}
            type="button"
            aria-current={vista === id ? 'page' : undefined}
            onClick={() => cambiarVista(id)}
          >
            {nombre}
          </button>
        ))}
      </nav>

      {mensaje && <p className="mensaje-admin mensaje-exito-admin" role="status">{mensaje}</p>}
      {error && <p className="mensaje-admin mensaje-error-admin" role="alert">{error}</p>}

      {vista === 'nuevo' && (
        <section aria-labelledby="titulo-formulario-producto">
          <h2 className="titulo-tabla-admin" id="titulo-formulario-producto">
            {productoEditando ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          {renderFormulario()}
        </section>
      )}

      {vista === 'productos' && (
        <section aria-labelledby="titulo-listado-productos">
          <h2 className="titulo-tabla-admin" id="titulo-listado-productos">Productos del catálogo</h2>
          {tablaProductos(productos)}
        </section>
      )}

      {vista === 'ofertas' && (
        <section aria-labelledby="titulo-ofertas-admin">
          <h2 className="titulo-tabla-admin" id="titulo-ofertas-admin">Descuentos de productos</h2>
          <p className="descripcion-dashboard">
            Edita cualquier producto para agregar, cambiar o quitar su descuento. Los cambios también se verán en la tienda.
          </p>
          {tablaProductos(productos)}
        </section>
      )}

      {vista === 'ordenes' && (
        <section aria-labelledby="titulo-ordenes-admin">
          <h2 className="titulo-tabla-admin" id="titulo-ordenes-admin">Órdenes y boletas</h2>
          <p className="descripcion-dashboard">
            Compras aprobadas guardadas en este navegador. Selecciona “Mostrar boleta” para consultar o imprimir un comprobante.
          </p>
          {ordenes.length === 0 ? (
            <p className="vacio-admin">Todavía no hay órdenes registradas en este navegador.</p>
          ) : (
            <div className="tabla-admin-contenedor">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Comprobante</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.numeroPedido}>
                      <td>{orden.numeroPedido}</td>
                      <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                      <td>{orden.clienteNombre}<br /><small>{orden.email}</small></td>
                      <td>{orden.tipoComprobante === 'factura' ? 'Factura' : 'Boleta'}</td>
                      <td>{formatearPrecio(orden.total)}</td>
                      <td>
                        <button
                          className="boton-editar-admin"
                          type="button"
                          onClick={() => mostrarBoleta(orden)}
                        >
                          Mostrar boleta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ordenMostrada && (
            <section className="vista-boleta-admin" aria-labelledby="titulo-vista-boleta">
              <div className="encabezado-boleta-admin">
                <h3 id="titulo-vista-boleta">
                  {ordenMostrada.tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} {ordenMostrada.numeroPedido}
                </h3>
                <div className="acciones-formulario-admin">
                  <button
                    className="boton-admin-principal"
                    type="button"
                    disabled={!htmlBoleta}
                    onClick={() => iframeBoleta.current?.contentWindow?.print()}
                  >
                    Imprimir
                  </button>
                  <button
                    className="boton-admin-secundario"
                    type="button"
                    onClick={() => {
                      setOrdenMostrada(null)
                      setHtmlBoleta('')
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              {cargandoBoleta && <p className="descripcion-dashboard">Generando comprobante…</p>}
              {htmlBoleta && (
                <iframe
                  ref={iframeBoleta}
                  className="iframe-boleta-admin"
                  title={`Comprobante ${ordenMostrada.numeroPedido}`}
                  sandbox="allow-same-origin"
                  srcDoc={htmlBoleta}
                />
              )}
            </section>
          )}
        </section>
      )}

      {vista === 'criticos' && (
        <section aria-labelledby="titulo-productos-criticos">
          <h2 className="titulo-tabla-admin" id="titulo-productos-criticos">
            Productos con stock crítico
          </h2>
          <p className="descripcion-dashboard">
            Se muestran productos con {UMBRAL_STOCK_CRITICO} unidades o menos. Ajusta su stock desde “Editar”.
          </p>
          {tablaProductos(productosCriticos)}
        </section>
      )}

      {vista === 'reportes' && (
        <section aria-labelledby="titulo-reportes-admin">
          <h2 className="titulo-tabla-admin" id="titulo-reportes-admin">Reporte de catálogo e inventario</h2>
          <p className="descripcion-dashboard">
            Resumen calculado con los precios y el stock actual. No incluye ventas ni órdenes.
          </p>
          <div className="resumen-reportes-admin">
            <article className="tarjeta-admin">
              <span className="etiqueta-tarjeta-admin">INVENTARIO</span>
              <h3>Valor referencial</h3>
              <strong>{formatearPrecio(valorInventario)}</strong>
              <p>Precio de catálogo multiplicado por unidades en stock.</p>
            </article>
            <article className="tarjeta-admin">
              <span className="etiqueta-tarjeta-admin">CLIENTES</span>
              <h3>Cuentas registradas</h3>
              <strong>{clientes.length}</strong>
              <p>Usuarios cliente guardados en este navegador.</p>
            </article>
          </div>
          <h3 className="subtitulo-reporte-admin">Productos por grupo</h3>
          <div className="tabla-admin-contenedor">
            <table className="tabla-admin">
              <thead>
                <tr><th>Grupo</th><th>Productos</th><th>Unidades</th></tr>
              </thead>
              <tbody>
                {grupos.map((grupo) => {
                  const productosDelGrupo = productos.filter((producto) => producto.grupo === grupo.nombre)
                  const unidades = productosDelGrupo.reduce((total, producto) => total + producto.stock, 0)
                  return (
                    <tr key={grupo.id}>
                      <td>{grupo.nombre}</td>
                      <td>{productosDelGrupo.length}</td>
                      <td>{unidades}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {vista === 'categorias' && (
        <section aria-labelledby="titulo-categorias-admin">
          <h2 className="titulo-tabla-admin" id="titulo-categorias-admin">Categorías del catálogo</h2>
          <p className="descripcion-dashboard">
            Cada categoría crea una sección para organizar productos y aparece en el catálogo de la tienda.
          </p>
          <form className="formulario-producto-admin formulario-categoria-admin" onSubmit={crearCategoria}>
            <label>
              Nombre de la nueva categoría
              <input
                required
                minLength="2"
                maxLength="60"
                value={nombreCategoria}
                onChange={(event) => setNombreCategoria(event.target.value)}
                placeholder="Ej. Monitores Gamer"
              />
            </label>
            <button className="boton-admin-principal" type="submit">Crear categoría</button>
          </form>
          <h3 className="subtitulo-reporte-admin">Categorías actuales</h3>
          <ul className="lista-categorias-admin">
            {grupos.map((grupo) => {
              const cantidadProductos = productos.filter((producto) => producto.grupo === grupo.nombre).length
              return (
                <li key={grupo.id}>
                  <span>{grupo.nombre}</span>
                  <small>{cantidadProductos} producto{cantidadProductos === 1 ? '' : 's'}</small>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {vista === 'usuarios' && (
        <section aria-labelledby="titulo-usuarios-admin">
          <h2 className="titulo-tabla-admin" id="titulo-usuarios-admin">Administración de usuarios</h2>
          <nav className="subnavegacion-admin" aria-label="Opciones de usuarios">
            {[
              { id: 'nuevo', nombre: 'Nuevo usuario' },
              { id: 'lista', nombre: 'Mostrar usuarios' },
              { id: 'historial', nombre: 'Historial de compras' },
            ].map(({ id, nombre }) => (
              <button
                key={id}
                className={vistaUsuarios === id ? 'activo' : ''}
                type="button"
                aria-current={vistaUsuarios === id ? 'page' : undefined}
                onClick={() => {
                  setVistaUsuarios(id)
                  setUsuarioEditando(null)
                  setUsuarioHistorial(null)
                  setError('')
                  setMensaje('')
                }}
              >
                {nombre}
              </button>
            ))}
          </nav>

          {vistaUsuarios === 'nuevo' && (
            <form className="formulario-producto-admin" onSubmit={crearUsuario}>
              <h3 className="subtitulo-reporte-admin">Crear una cuenta de cliente</h3>
              <div className="campos-producto-admin">
                <label>
                  Nombre completo
                  <input
                    required
                    minLength="3"
                    maxLength="100"
                    value={nuevoUsuario.nombre}
                    onChange={(event) => setNuevoUsuario({ ...nuevoUsuario, nombre: event.target.value })}
                  />
                </label>
                <label>
                  Correo electrónico
                  <input
                    required
                    type="email"
                    value={nuevoUsuario.email}
                    onChange={(event) => setNuevoUsuario({ ...nuevoUsuario, email: event.target.value })}
                  />
                </label>
                <label>
                  Contraseña
                  <input
                    required
                    type="password"
                    minLength="8"
                    autoComplete="new-password"
                    value={nuevoUsuario.password}
                    onChange={(event) => setNuevoUsuario({ ...nuevoUsuario, password: event.target.value })}
                  />
                </label>
                <label>
                  Confirmar contraseña
                  <input
                    required
                    type="password"
                    minLength="8"
                    autoComplete="new-password"
                    value={nuevoUsuario.confirmacion}
                    onChange={(event) => setNuevoUsuario({
                      ...nuevoUsuario,
                      confirmacion: event.target.value,
                    })}
                  />
                </label>
              </div>
              <div className="acciones-formulario-admin">
                <button className="boton-admin-principal" type="submit">Crear usuario</button>
              </div>
            </form>
          )}

          {vistaUsuarios === 'lista' && (
            <>
              <p className="descripcion-dashboard">
                Selecciona una acción para editar los datos del usuario o revisar su historial.
              </p>
              {clientes.length === 0 ? (
                <p className="vacio-admin">Todavía no hay usuarios registrados.</p>
              ) : (
                <div className="tabla-admin-contenedor">
                  <table className="tabla-admin">
                    <thead>
                      <tr><th>Nombre</th><th>Correo</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente) => (
                        <tr key={cliente.email}>
                          <td>{cliente.nombre}</td>
                          <td>{cliente.email}</td>
                          <td className="acciones-tabla-admin">
                            <button
                              className="boton-editar-admin"
                              type="button"
                              onClick={() => iniciarEdicionUsuario(cliente)}
                            >
                              Editar
                            </button>
                            <button
                              className="boton-admin-secundario"
                              type="button"
                              onClick={() => {
                                setUsuarioHistorial({ nombre: cliente.nombre, email: cliente.email })
                                setVistaUsuarios('historial')
                                setUsuarioEditando(null)
                              }}
                            >
                              Historial
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {usuarioEditando && (
                <form className="formulario-producto-admin formulario-edicion-usuario-admin" onSubmit={guardarEdicionUsuario}>
                  <h3 className="subtitulo-reporte-admin">Actualizando cuenta</h3>
                  <div className="campos-producto-admin">
                    <label>
                      Nombre completo
                      <input
                        required
                        minLength="3"
                        maxLength="100"
                        value={formularioUsuario.nombre}
                        onChange={(event) => setFormularioUsuario({
                          ...formularioUsuario,
                          nombre: event.target.value,
                        })}
                      />
                    </label>
                    <label>
                      Correo electrónico
                      <input
                        required
                        type="email"
                        value={formularioUsuario.email}
                        onChange={(event) => setFormularioUsuario({
                          ...formularioUsuario,
                          email: event.target.value,
                        })}
                      />
                    </label>
                    <label className="campo-producto-completo">
                      Nueva contraseña (opcional)
                      <input
                        type="password"
                        minLength="8"
                        autoComplete="new-password"
                        value={formularioUsuario.password}
                        onChange={(event) => setFormularioUsuario({
                          ...formularioUsuario,
                          password: event.target.value,
                        })}
                        placeholder="Deja vacío para no cambiarla"
                      />
                    </label>
                  </div>
                  <div className="acciones-formulario-admin">
                    <button className="boton-admin-principal" type="submit">Guardar cambios</button>
                    <button
                      className="boton-admin-secundario"
                      type="button"
                      onClick={() => {
                        setUsuarioEditando(null)
                        setError('')
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {vistaUsuarios === 'historial' && (
            <section aria-live="polite">
              <h3 className="subtitulo-reporte-admin">
                {usuarioHistorial ? `Compras de ${usuarioHistorial.nombre}` : 'Historial de compras'}
              </h3>
              {usuarioHistorial ? (
                <>
                  <p className="descripcion-dashboard">
                    Órdenes vinculadas al correo {usuarioHistorial.email}.
                  </p>
                  {ordenesUsuario.length === 0 ? (
                    <p className="vacio-admin">Este usuario todavía no tiene compras registradas.</p>
                  ) : (
                    <div className="tabla-admin-contenedor">
                      <table className="tabla-admin">
                        <thead>
                          <tr>
                            <th>Número</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Comprobante</th>
                            <th>Total</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesUsuario.map((orden) => (
                            <tr key={orden.numeroPedido}>
                              <td>{orden.numeroPedido}</td>
                              <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                              <td>{orden.items.reduce((total, item) => total + item.cantidad, 0)}</td>
                              <td>{orden.tipoComprobante === 'factura' ? 'Factura' : 'Boleta'}</td>
                              <td>{formatearPrecio(orden.total)}</td>
                              <td>
                                <button
                                  className="boton-editar-admin"
                                  type="button"
                                  onClick={() => {
                                    setVista('ordenes')
                                    mostrarBoleta(orden)
                                  }}
                                >
                                  Mostrar boleta
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="acciones-formulario-admin">
                    <button
                      className="boton-admin-secundario"
                      type="button"
                      onClick={() => setUsuarioHistorial(null)}
                    >
                      Ver otro usuario
                    </button>
                  </div>
                </>
              ) : clientes.length === 0 ? (
                <p className="vacio-admin">Todavía no hay usuarios registrados para consultar.</p>
              ) : (
                <>
                  <p className="descripcion-dashboard">Selecciona un usuario para ver sus boletas.</p>
                  <div className="tabla-admin-contenedor">
                    <table className="tabla-admin">
                      <thead>
                        <tr><th>Nombre</th><th>Correo</th><th>Acción</th></tr>
                      </thead>
                      <tbody>
                        {clientes.map((cliente) => (
                          <tr key={cliente.email}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>
                              <button
                                className="boton-editar-admin"
                                type="button"
                                onClick={() => setUsuarioHistorial({
                                  nombre: cliente.nombre,
                                  email: cliente.email,
                                })}
                              >
                                Ver historial
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          )}
        </section>
      )}

      {vista === 'perfil' && (
        <section aria-labelledby="titulo-perfil-admin">
          <h2 className="titulo-tabla-admin" id="titulo-perfil-admin">Perfil de administrador</h2>
          <p className="descripcion-dashboard">
            Actualiza tus datos de acceso. Si no deseas cambiar la contraseña, deja el campo vacío.
          </p>
          <form className="formulario-producto-admin" onSubmit={guardarPerfil}>
            <div className="campos-producto-admin">
              <label>
                Nombre completo
                <input
                  required
                  minLength="3"
                  maxLength="100"
                  value={perfilAdmin.nombre}
                  onChange={(event) => setPerfilAdmin({ ...perfilAdmin, nombre: event.target.value })}
                />
              </label>
              <label>
                Correo electrónico
                <input
                  required
                  type="email"
                  value={perfilAdmin.email}
                  onChange={(event) => setPerfilAdmin({ ...perfilAdmin, email: event.target.value })}
                />
              </label>
              <label className="campo-producto-completo">
                Nueva contraseña (opcional)
                <input
                  type="password"
                  minLength="8"
                  autoComplete="new-password"
                  value={perfilAdmin.password}
                  onChange={(event) => setPerfilAdmin({ ...perfilAdmin, password: event.target.value })}
                  placeholder="Deja vacío para no cambiarla"
                />
              </label>
            </div>
            <div className="acciones-formulario-admin">
              <button className="boton-admin-principal" type="submit">Guardar perfil</button>
            </div>
          </form>
        </section>
      )}
    </section>
  )
}

export default PanelAdmin
