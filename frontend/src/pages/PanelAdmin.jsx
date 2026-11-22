import { useEffect, useRef, useState } from 'react'
import { formatearPrecio, obtenerOferta } from '../data/productos'
import {
  registrarCuentaDesdeAdminApi,
} from '../api/auth'
import { actualizarUsuarioApi, listarUsuariosApi } from '../api/usuarios'
import {
  actualizarProductoApi,
  actualizarCategoriaApi,
  crearCategoriaApi,
  crearProductoApi,
  desactivarCategoriaApi,
  desactivarProductoApi,
  listarCategoriasAdminApi,
} from '../api/administracionCatalogo'
import { listarBoletasApi } from '../api/boletas'
import { mensajeErrorApi } from '../api/http'
import { obtenerEstadoCatalogo, reintentarCargaCatalogo } from '../api/catalogoStore'
import { useProductos } from '../hooks/useProductos'
import { useGrupos } from '../hooks/useGrupos'
import { generarHtmlComprobante } from '../utils/emailService'
import { useAuth } from '../context/useAuth'
import '../styles/admin.css'

const UMBRAL_STOCK_CRITICO = 3

const crearFormularioVacio = (grupos, categorias = []) => ({
  nombre: '',
  grupo: categorias[0]?.grupo || grupos[0]?.nombre || '',
  categoria: categorias[0]?.nombre || '',
  categoriaId: categorias[0]?.id == null ? '' : String(categorias[0].id),
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

function PanelAdmin() {
  const { usuario, actualizarPerfilAdmin } = useAuth()
  const productos = useProductos()
  const grupos = useGrupos()
  const [categoriasBackend, setCategoriasBackend] = useState([])
  const [boletasBackend, setBoletasBackend] = useState([])
  const [clientes, setClientes] = useState([])
  const [vista, setVista] = useState('productos')
  const [productoEditando, setProductoEditando] = useState(null)
  const [formulario, setFormulario] = useState(() => crearFormularioVacio(grupos))
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [formularioCategoria, setFormularioCategoria] = useState({ nombre: '', grupo: '' })
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [formularioUsuario, setFormularioUsuario] = useState({ nombre: '', email: '' })
  const [vistaUsuarios, setVistaUsuarios] = useState('lista')
  const [usuarioHistorial, setUsuarioHistorial] = useState(null)
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmacion: '',
    rol: 'cliente',
  })
  const [perfilAdmin, setPerfilAdmin] = useState(() => {
    return { nombre: usuario?.nombre || '', email: usuario?.email || '' }
  })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ordenMostrada, setOrdenMostrada] = useState(null)
  const [htmlBoleta, setHtmlBoleta] = useState('')
  const [cargandoBoleta, setCargandoBoleta] = useState(false)
  const iframeBoleta = useRef(null)

  useEffect(() => {
    let activo = true
    listarUsuariosApi()
      .then((usuarios) => {
        if (activo) {
          setClientes(usuarios.map((cliente) => ({
            ...cliente,
            rol: cliente.rol.toLowerCase(),
          })))
          const perfilActual = usuarios.find((cliente) => cliente.id === usuario?.id)
          if (perfilActual) {
            setPerfilAdmin({ nombre: perfilActual.nombre, email: perfilActual.email })
          }
        }
      })
      .catch((errorCarga) => {
        if (activo) setError(mensajeErrorApi(errorCarga, 'No se pudieron cargar los usuarios.'))
      })
    return () => {
      activo = false
    }
  }, [usuario?.id])

  useEffect(() => {
    let activo = true
    Promise.all([listarCategoriasAdminApi(), listarBoletasApi()])
      .then(([categorias, boletas]) => {
        if (activo) {
          setCategoriasBackend(categorias)
          setBoletasBackend(boletas)
          setFormulario((actual) => actual.categoriaId
            ? actual
            : crearFormularioVacio(grupos, categorias))
        }
      })
      .catch((errorCarga) => {
        if (activo) setError(mensajeErrorApi(
          errorCarga,
          'No se pudieron cargar las categorías y boletas del backend.',
        ))
      })
    return () => {
      activo = false
    }
  }, [grupos])

  const productosCriticos = productos.filter((producto) => producto.stock <= UMBRAL_STOCK_CRITICO)
  const productosEnOferta = productos.filter((producto) => obtenerOferta(producto))
  const ordenesUsuario = usuarioHistorial
    ? boletasBackend.filter((boleta) => String(boleta.usuarioId) === String(usuarioHistorial.id))
    : []
  const unidadesEnStock = productos.reduce((total, producto) => total + producto.stock, 0)
  const valorInventario = productos.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0,
  )

  const cambiarVista = (id) => {
    setVista(id)
    setProductoEditando(null)
    setFormulario(crearFormularioVacio(grupos, categoriasBackend))
    setUsuarioEditando(null)
    setFormularioUsuario({ nombre: '', email: '' })
    setVistaUsuarios('lista')
    setUsuarioHistorial(null)
    setNuevoUsuario({ nombre: '', email: '', password: '', confirmacion: '', rol: 'cliente' })
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
      categoriaId: producto.categoriaBackendId || '',
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

  const recargarCatalogoBackend = async () => {
    await reintentarCargaCatalogo()
    const estado = obtenerEstadoCatalogo()
    if (estado.error) throw new Error(estado.error)
  }

  const guardarFormulario = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const precio = Number(formulario.precio)
    const descuento = Number(formulario.descuento)
    const stock = Number(formulario.stock)
    if (!formulario.nombre.trim() || !formulario.categoriaId || !formulario.imagen.trim()) {
      setError('Completa el nombre, selecciona una categoría y agrega la ruta de la imagen.')
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
      descripcion: formulario.descripcion.trim(),
      precio,
      descuento,
      stock,
      imagen: formulario.imagen.trim(),
      ...(formulario.imagenInicio.trim() ? { imagenInicio: formulario.imagenInicio.trim() } : {}),
    }
    try {
      if (productoEditando) {
        const producto = productos.find((actual) => actual.id === productoEditando)
        if (!producto?.backendId) throw new Error('No se encontró el ID del producto en el backend.')
        await actualizarProductoApi(producto.backendId, {
          ...datosProducto,
          categoriaId: formulario.categoriaId,
        })
      } else {
        await crearProductoApi({
          ...datosProducto,
          categoriaId: formulario.categoriaId,
        })
      }
      await recargarCatalogoBackend()
      setFormulario(crearFormularioVacio(grupos, categoriasBackend))
      setProductoEditando(null)
      setVista('productos')
      setMensaje(productoEditando ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
    } catch (errorGuardado) {
      setError(mensajeErrorApi(errorGuardado, 'No se pudo guardar el producto en el backend.'))
    }
  }

  const crearCategoria = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    try {
      const nombre = nombreCategoria.trim().replace(/\s+/g, ' ')
      const creada = await crearCategoriaApi({
        nombre,
        grupo: nombre,
        descripcion: '',
        imagenUrl: null,
        activo: true,
      })
      setCategoriasBackend((actuales) => [...actuales, creada])
      setNombreCategoria('')
      setMensaje('Categoría creada correctamente en el backend.')
    } catch (errorGuardado) {
      setError(mensajeErrorApi(errorGuardado, 'No se pudo crear la categoría en el backend.'))
    }
  }

  const eliminarProducto = async (producto) => {
    setError('')
    setMensaje('')
    try {
      await desactivarProductoApi(producto.backendId)
      await recargarCatalogoBackend()
      setMensaje('Producto desactivado correctamente.')
    } catch (errorEliminacion) {
      setError(mensajeErrorApi(errorEliminacion, 'No se pudo desactivar el producto.'))
    }
  }

  const eliminarCategoria = async (categoria) => {
    setError('')
    setMensaje('')
    try {
      await desactivarCategoriaApi(categoria.id)
      setCategoriasBackend((actuales) => actuales.filter((item) => item.id !== categoria.id))
      await recargarCatalogoBackend()
      setMensaje('Categoría desactivada correctamente.')
    } catch (errorEliminacion) {
      setError(mensajeErrorApi(errorEliminacion, 'No se pudo desactivar la categoría.'))
    }
  }

  const guardarEdicionCategoria = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')
    try {
      const actualizada = await actualizarCategoriaApi(categoriaEditando, {
        nombre: formularioCategoria.nombre.trim(),
        grupo: formularioCategoria.grupo.trim(),
        descripcion: '',
        imagenUrl: null,
        activo: true,
      })
      setCategoriasBackend((actuales) => actuales.map((categoria) => (
        categoria.id === actualizada.id ? actualizada : categoria
      )))
      await recargarCatalogoBackend()
      setCategoriaEditando(null)
      setMensaje('Categoría actualizada correctamente.')
    } catch (errorActualizacion) {
      setError(mensajeErrorApi(errorActualizacion, 'No se pudo actualizar la categoría.'))
    }
  }

  const iniciarEdicionUsuario = (cliente) => {
    setUsuarioEditando(cliente.email)
    setFormularioUsuario({ nombre: cliente.nombre, email: cliente.email })
    setMensaje('')
    setError('')
  }

  const guardarEdicionUsuario = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const cliente = clientes.find((actual) => actual.email === usuarioEditando)
    if (!cliente) {
      setError('No se encontró el usuario que quieres editar.')
      return
    }

    try {
      const actualizado = await actualizarUsuarioApi(cliente.id, {
        nombre: formularioUsuario.nombre,
        email: cliente.email,
        rol: cliente.rol,
      })
      setClientes((actuales) => actuales.map((item) => item.id === actualizado.id
        ? { ...actualizado, rol: actualizado.rol.toLowerCase() }
        : item))
      setUsuarioEditando(null)
      setFormularioUsuario({ nombre: '', email: '' })
      setMensaje('Datos del usuario actualizados correctamente.')
    } catch (errorActualizacion) {
      setError(mensajeErrorApi(errorActualizacion, 'No se pudo actualizar el usuario.'))
    }
  }

  const crearUsuario = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    if (nuevoUsuario.password !== nuevoUsuario.confirmacion) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      await registrarCuentaDesdeAdminApi(nuevoUsuario)
      const usuarios = await listarUsuariosApi()
      setClientes(usuarios.map((cliente) => ({
        ...cliente,
        rol: cliente.rol.toLowerCase(),
      })))
      setNuevoUsuario({ nombre: '', email: '', password: '', confirmacion: '', rol: 'cliente' })
      setVistaUsuarios('lista')
      setMensaje('Usuario y credenciales creados correctamente.')
    } catch (errorCreacion) {
      setError(mensajeErrorApi(errorCreacion, 'No se pudo crear el usuario.'))
    }
  }

  const guardarPerfil = async (event) => {
    event.preventDefault()
    setError('')
    setMensaje('')

    const resultado = await actualizarPerfilAdmin(perfilAdmin)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setPerfilAdmin((actual) => ({ ...actual, ...resultado.usuario }))
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

  const mostrarBoletaBackend = (boleta) => mostrarBoleta({
    ...boleta,
    tipoComprobante: (boleta.tipoComprobante || 'BOLETA').toLowerCase(),
    fecha: boleta.createdAt,
    total: Number(boleta.total),
    items: Array.isArray(boleta.items)
      ? boleta.items.map((item) => ({
        ...item,
        precioUnitario: Number(item.precioUnitario),
      }))
      : [],
  })

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
          Categoría
          <select
            required
            value={formulario.categoriaId}
            onChange={(event) => {
              const seleccionada = categoriasBackend.find(
                (categoria) => String(categoria.id) === event.target.value,
              )
              setFormulario({
                ...formulario,
                categoriaId: event.target.value,
                categoria: seleccionada?.nombre || '',
                grupo: seleccionada?.grupo || '',
              })
            }}
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categoriasBackend.filter((categoria) => categoria.activo !== false).map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.grupo} / {categoria.nombre}
              </option>
            ))}
          </select>
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
                  <button
                    className="boton-admin-secundario"
                    type="button"
                    disabled={!producto.backendId}
                    onClick={() => eliminarProducto(producto)}
                  >
                    Desactivar
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
            Boletas consultadas desde el microservicio de pedidos.
          </p>
          {boletasBackend.length === 0 ? (
            <p className="vacio-admin">Todavía no hay boletas en el backend.</p>
          ) : (
            <div className="tabla-admin-contenedor">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {boletasBackend.map((boleta) => (
                    <tr key={boleta.id}>
                      <td>{boleta.numeroPedido}</td>
                      <td>{boleta.createdAt ? new Date(boleta.createdAt).toLocaleString('es-CL') : '—'}</td>
                      <td>{boleta.clienteNombre}<br /><small>{boleta.email}</small></td>
                      <td>{formatearPrecio(Number(boleta.total))}</td>
                      <td>{boleta.estado}</td>
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
            Administra las categorías del backend y asígnalas a los productos del catálogo.
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
            {categoriasBackend.map((categoria) => {
              const cantidadProductos = productos.filter(
                (producto) => producto.categoriaBackendId === String(categoria.id),
              ).length
              return (
                <li key={categoria.id}>
                  {categoriaEditando === categoria.id ? (
                    <form className="formulario-producto-admin" onSubmit={guardarEdicionCategoria}>
                      <label>
                        Nombre
                        <input
                          required
                          maxLength="100"
                          value={formularioCategoria.nombre}
                          onChange={(event) => setFormularioCategoria({
                            ...formularioCategoria,
                            nombre: event.target.value,
                          })}
                        />
                      </label>
                      <label>
                        Grupo
                        <input
                          required
                          maxLength="100"
                          value={formularioCategoria.grupo}
                          onChange={(event) => setFormularioCategoria({
                            ...formularioCategoria,
                            grupo: event.target.value,
                          })}
                        />
                      </label>
                      <button className="boton-admin-principal" type="submit">Guardar</button>
                      <button
                        className="boton-admin-secundario"
                        type="button"
                        onClick={() => setCategoriaEditando(null)}
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <span>{categoria.grupo} / {categoria.nombre}</span>
                      <small>{cantidadProductos} producto{cantidadProductos === 1 ? '' : 's'}</small>
                      <button
                        className="boton-editar-admin"
                        type="button"
                        onClick={() => {
                          setCategoriaEditando(categoria.id)
                          setFormularioCategoria({
                            nombre: categoria.nombre,
                            grupo: categoria.grupo,
                          })
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="boton-admin-secundario"
                        type="button"
                        onClick={() => eliminarCategoria(categoria)}
                      >
                        Desactivar
                      </button>
                    </>
                  )}
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
              <h3 className="subtitulo-reporte-admin">Crear una cuenta de cliente o vendedor</h3>
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
                  Rol
                  <select
                    value={nuevoUsuario.rol}
                    onChange={(event) => setNuevoUsuario({ ...nuevoUsuario, rol: event.target.value })}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
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
                                setUsuarioHistorial({
                                  id: cliente.id,
                                  nombre: cliente.nombre,
                                  email: cliente.email,
                                })
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
                        type="email"
                        readOnly
                        value={formularioUsuario.email}
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
                    Boletas del backend vinculadas a {usuarioHistorial.email}.
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
                              <td>{orden.createdAt ? new Date(orden.createdAt).toLocaleString('es-CL') : '—'}</td>
                              <td>{(orden.items || []).reduce((total, item) => total + item.cantidad, 0)}</td>
                              <td>{orden.tipoComprobante === 'FACTURA' ? 'Factura' : 'Boleta'}</td>
                              <td>{formatearPrecio(Number(orden.total))}</td>
                              <td>
                                <button
                                  className="boton-editar-admin"
                                  type="button"
                                  onClick={() => {
                                    setVista('ordenes')
                                    mostrarBoletaBackend(orden)
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
                                  id: cliente.id,
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
            Actualiza el nombre de tu perfil. El correo y las credenciales se administran en el backend.
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
                  type="email"
                  readOnly
                  value={perfilAdmin.email}
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
