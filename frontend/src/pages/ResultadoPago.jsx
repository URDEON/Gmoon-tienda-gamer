import { Link, useLocation, useParams } from 'react-router-dom'
import { formatearPrecio } from '../data/productos'
import { descargarComprobante } from '../utils/emailService'
import '../styles/carrito.css'

function ResultadoPago() {
  const { estado } = useParams()
  const location = useLocation()
  const aprobado = estado === 'aprobado'
  const resultadoValido = aprobado || estado === 'rechazado'
  const resumen = location.state || {}

  if (!resultadoValido) {
    return (
      <section className="seccion-carrito resultado-pago" aria-labelledby="titulo-resultado">
        <h1 id="titulo-resultado">Resultado no disponible</h1>
        <Link className="boton-continuar-pago" to="/carrito">Volver al carrito</Link>
      </section>
    )
  }

  return (
    <section className={`seccion-carrito resultado-pago ${aprobado ? 'pago-exitoso' : 'pago-fallido'}`} aria-labelledby="titulo-resultado">
      <p className="etiqueta-seccion">RESULTADO DE DEMOSTRACIÓN</p>
      <h1 id="titulo-resultado">{aprobado ? 'Pago aprobado' : 'Pago rechazado'}</h1>
      <p>
        {aprobado
          ? 'La simulación terminó correctamente. No se realizó ningún cobro real.'
          : 'La simulación rechazó el pago. Tus productos siguen guardados en el carrito.'}
      </p>
      {resumen && (
        <p>
          {resumen.productos} producto{resumen.productos === 1 ? '' : 's'} · Total simulado: {formatearPrecio(resumen.total)}
        </p>
      )}
      {aprobado && resumen?.tipoComprobante && (
        <p>
          Comprobante enviado a {resumen.email} · {resumen.tipoComprobante === 'factura' ? 'Factura' : 'Boleta'}
        </p>
      )}
      <div className="acciones-resultado-pago">
        {aprobado && resumen?.comprobanteData && (
          <button
            className="boton-continuar-pago"
            type="button"
            onClick={() => descargarComprobante(resumen.comprobanteData)}
          >
            Descargar comprobante
          </button>
        )}
        {!aprobado && <Link className="boton-continuar-pago" to="/checkout">Intentar de nuevo</Link>}
        <Link className="enlace-volver-carrito" to={aprobado ? '/productos' : '/carrito'}>
          {aprobado ? 'Seguir comprando' : 'Volver al carrito'}
        </Link>
      </div>
    </section>
  )
}

export default ResultadoPago
