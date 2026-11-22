import { useEffect, useState } from 'react'
import { listarBoletasApi } from '../api/boletas'
import { mensajeErrorApi } from '../api/http'
import { useAuth } from '../context/useAuth'
import '../styles/admin.css'

function MisCompras() {
  const { usuario } = useAuth()
  const [boletas, setBoletas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    listarBoletasApi(usuario.id)
      .then((resultado) => {
        if (activo) setBoletas(resultado)
      })
      .catch((errorCarga) => {
        if (activo) setError(mensajeErrorApi(errorCarga, 'No se pudieron cargar tus compras.'))
      })
    return () => {
      activo = false
    }
  }, [usuario.id])

  return (
    <main className="seccion-admin" aria-labelledby="titulo-mis-compras">
      <header className="encabezado-admin">
        <p className="etiqueta-seccion">TU CUENTA</p>
        <h1 id="titulo-mis-compras">Mis compras</h1>
      </header>
      {error && <p className="mensaje-error-admin" role="alert">{error}</p>}
      {boletas.length === 0 ? (
        <p className="vacio-admin">Todavía no tienes boletas registradas.</p>
      ) : (
        <div className="tabla-admin-contenedor">
          <table className="tabla-admin">
            <thead>
              <tr><th>Número</th><th>Fecha</th><th>Estado</th><th>Total</th></tr>
            </thead>
            <tbody>
              {boletas.map((boleta) => (
                <tr key={boleta.id}>
                  <td>{boleta.numeroPedido}</td>
                  <td>{boleta.createdAt ? new Date(boleta.createdAt).toLocaleString('es-CL') : '—'}</td>
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
    </main>
  )
}

export default MisCompras
