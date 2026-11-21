import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/CartContext'
import { crearBoleta } from '../api/boletas'
import { mensajeErrorApi } from '../api/http'
import { formatearPrecio, obtenerPrecioFinal } from '../data/productos'
import { guardarOrden } from '../data/ordenes'
import { descargarComprobante } from '../utils/emailService'
import '../styles/carrito.css'

function Checkout() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { carrito, totalProductos, totalPrecio, vaciarCarrito } = useCart()
  const [datosCompra, setDatosCompra] = useState(() => ({
    email: usuario?.email || '',
    tipoComprobante: 'boleta',
  }))
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const simularPago = async (aprobado) => {
    if (!aprobado) {
      const resumen = { total: totalPrecio, productos: totalProductos }
      navigate('/pago/rechazado', { state: resumen })
      return
    }

    const items = carrito.map((item) => ({
      id: String(item.backendId || item.id),
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: obtenerPrecioFinal(item),
    }))

    const clienteEmail = datosCompra.email.trim()
    const nombreCliente = usuario.nombre
    const tipoComprobante = datosCompra.tipoComprobante
    setEnviando(true)
    setError('')

    let boleta
    try {
      boleta = await crearBoleta({
        clienteNombre: nombreCliente,
        email: clienteEmail,
        tipoComprobante: tipoComprobante.toUpperCase(),
        items,
      })
    } catch (errorApi) {
      setError(mensajeErrorApi(errorApi, 'No se pudo registrar la boleta. Conservamos tu carrito.'))
      setEnviando(false)
      return
    }

    const comprobanteData = {
      clienteNombre: nombreCliente,
      email: clienteEmail,
      tipoComprobante,
      items,
      total: Number(boleta.total),
      numeroPedido: boleta.numeroPedido,
    }

    let errorGuardadoOrden = ''
    try {
      guardarOrden({
        ...comprobanteData,
        usuarioEmail: usuario?.email?.trim().toLowerCase() || clienteEmail.toLowerCase(),
        fecha: new Date().toISOString(),
      })
    } catch (errorGuardado) {
      errorGuardadoOrden = `No se pudo actualizar el historial local: ${errorGuardado.message}`
    }

    try {
      await descargarComprobante(comprobanteData)
    } catch (errorDescarga) {
      errorGuardadoOrden = [
        errorGuardadoOrden,
        `No se pudo descargar el comprobante: ${errorDescarga.message}`,
      ].filter(Boolean).join(' ')
    }

    vaciarCarrito()
    navigate('/pago/aprobado', {
      state: {
        total: comprobanteData.total,
        productos: totalProductos,
        email: clienteEmail,
        tipoComprobante,
        numeroPedido: boleta.numeroPedido,
        comprobanteData,
        errorGuardadoOrden,
      },
    })
    setEnviando(false)
  }

  if (carrito.length === 0) {
    return (
      <section className="seccion-carrito seccion-pago" aria-labelledby="titulo-checkout">
        <p className="etiqueta-seccion">PAGO DE DEMOSTRACIÓN</p>
        <h1 id="titulo-checkout">No hay productos para pagar</h1>
        <p>Agrega productos al carrito antes de iniciar una simulación.</p>
        <Link className="boton-continuar-pago" to="/productos">Ver productos</Link>
      </section>
    )
  }

  if (!usuario) {
    return (
      <section className="seccion-carrito seccion-pago" aria-labelledby="titulo-checkout">
        <h1 id="titulo-checkout">Inicia sesión para continuar</h1>
        <p>Necesitamos tu cuenta para asociar la boleta a tu perfil.</p>
        <Link className="boton-continuar-pago" to="/iniciar-sesion">Iniciar sesión</Link>
      </section>
    )
  }

  return (
    <section className="seccion-carrito seccion-pago" aria-labelledby="titulo-checkout">
      <div className="encabezado-carrito">
        <p className="etiqueta-seccion">PAGO DE DEMOSTRACIÓN</p>
        <h1 id="titulo-checkout">Revisar compra</h1>
      </div>
      <div className="aviso-pago-demo" role="note">
        Esta es una simulación: no se realizará ningún cobro. No ingreses datos bancarios ni de tarjeta.
      </div>
      <div className="resumen-checkout">
        <div className="campo-compra">
          <label htmlFor="email-compra">Correo del cliente</label>
          <input
            id="email-compra"
            type="email"
            required
            value={datosCompra.email}
            onChange={(event) => setDatosCompra((actual) => ({ ...actual, email: event.target.value }))}
            placeholder="cliente@correo.com"
          />
        </div>
        <div className="campo-compra">
          <label htmlFor="tipo-comprobante">Tipo de comprobante</label>
          <select
            id="tipo-comprobante"
            value={datosCompra.tipoComprobante}
            onChange={(event) => setDatosCompra((actual) => ({ ...actual, tipoComprobante: event.target.value }))}
          >
            <option value="boleta">Boleta</option>
            <option value="factura">Factura</option>
          </select>
        </div>
        {carrito.map((item) => (
          <div className="fila-checkout" key={item.id}>
            <span>{item.nombre} × {item.cantidad}</span>
            <strong>{formatearPrecio(obtenerPrecioFinal(item) * item.cantidad)}</strong>
          </div>
        ))}
        <div className="fila-checkout total-checkout">
          <span>Total de demostración</span>
          <strong>{formatearPrecio(totalPrecio)}</strong>
        </div>
      </div>
      <div className="acciones-pago-demo">
        <button className="boton-pago-aprobado" type="button" disabled={enviando} onClick={() => simularPago(true)}>
          {enviando ? 'Registrando boleta...' : 'Confirmar compra'}
        </button>
        <button className="boton-pago-rechazado" type="button" disabled={enviando} onClick={() => simularPago(false)}>
          Simular pago rechazado
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <Link className="enlace-volver-carrito" to="/carrito">Volver al carrito</Link>
    </section>
  )
}

export default Checkout
