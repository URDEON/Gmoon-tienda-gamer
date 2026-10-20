import { productos, grupos, formatearPrecio } from '../data/productos'
import { obtenerUsuarios } from '../utils/usuarios'
import { useAuth } from '../context/AuthContext'
import '../styles/admin.css'

function PanelAdmin() {
  const { usuario } = useAuth()
  const clientes = obtenerUsuarios()

  return (
    <section className="seccion-admin" aria-labelledby="titulo-admin">
      <div className="encabezado-admin">
        <p className="etiqueta-seccion">PANEL DE ADMINISTRACIÓN</p>
        <h1 id="titulo-admin">Hola, {usuario.nombre}</h1>
      </div>

      <div className="resumen-admin">
        <div className="tarjeta-admin">
          <span>Productos</span>
          <strong>{productos.length}</strong>
        </div>
        <div className="tarjeta-admin">
          <span>Categorías</span>
          <strong>{grupos.length}</strong>
        </div>
        <div className="tarjeta-admin">
          <span>Clientes registrados</span>
          <strong>{clientes.length}</strong>
        </div>
      </div>

      <h2 className="titulo-tabla-admin">Catálogo</h2>
      <div className="tabla-admin-contenedor">
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{formatearPrecio(producto.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="titulo-tabla-admin">Clientes registrados</h2>
      {clientes.length === 0 ? (
        <p className="vacio-admin">Aún no hay clientes registrados.</p>
      ) : (
        <div className="tabla-admin-contenedor">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.email}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default PanelAdmin