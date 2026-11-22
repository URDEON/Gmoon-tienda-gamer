import { useEffect, useState } from 'react'
import { listarBoletasApi } from '../api/boletas'
import { mensajeErrorApi } from '../api/http'
import { useProductos } from '../hooks/useProductos'
import '../styles/admin.css'

function PanelVendedor() {
  const productos = useProductos()
  const [boletas, setBoletas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    listarBoletasApi()
      .then((resultado) => {
        if (activo) setBoletas(resultado)
      })
      .catch((errorCarga) => {
        if (activo) setError(mensajeErrorApi(errorCarga, 'No se pudieron cargar las boletas.'))
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <main className="contenedor-admin" aria-labelledby="titulo-panel-vendedor">
      <header className="encabezado-admin">
        <p className="etiqueta-seccion">OPERACIÓN DE TIENDA</p>
        <h1 id="titulo-panel-vendedor">Panel de vendedor</h1>
        <p>Consulta el catálogo y las boletas. La edición y administración de cuentas están reservadas a ADMIN.</p>
      </header>

      {error && <p className="mensaje-error-admin" role="alert">{error}</p>}

      <section aria-labelledby="titulo-catalogo-vendedor">
        <h2 id="titulo-catalogo-vendedor" className="titulo-tabla-admin">Productos del catálogo</h2>
        {productos.length === 0 ? (
          <p className="vacio-admin">No hay productos disponibles.</p>
        ) : (
          <div className="tabla-admin-contenedor">
            <table className="tabla-admin">
              <thead>
                <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.backendId || producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>{new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      maximumFractionDigits: 0,
                    }).format(producto.precio)}</td>
                    <td>{producto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="titulo-boletas-vendedor">
        <h2 id="titulo-boletas-vendedor" className="titulo-tabla-admin">Boletas</h2>
        {boletas.length === 0 ? (
          <p className="vacio-admin">No hay boletas registradas.</p>
        ) : (
          <div className="tabla-admin-contenedor">
            <table className="tabla-admin">
              <thead>
                <tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th></tr>
              </thead>
              <tbody>
                {boletas.map((boleta) => (
                  <tr key={boleta.id}>
                    <td>{boleta.numeroPedido}</td>
                    <td>{boleta.createdAt ? new Date(boleta.createdAt).toLocaleString('es-CL') : '—'}</td>
                    <td>{boleta.clienteNombre || boleta.email || boleta.usuarioId}</td>
                    <td>{boleta.estado}</td>
                    <td>{new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      maximumFractionDigits: 0,
                    }).format(Number(boleta.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default PanelVendedor
