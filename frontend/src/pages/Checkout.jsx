import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatearPrecio, obtenerPrecioFinal } from '../data/productos'
import { guardarOrden } from '../data/ordenes'
import { descargarComprobante, enviarCorreoCompra } from '../utils/emailService'
import '../styles/carrito.css'

function Checkout() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { carrito, totalProductos, totalPrecio, vaciarCarrito } = useCart()
  const [datosCompra, setDatosCompra] = useState(() => ({
    email: usuario?.email || '',
    tipoComprobante: 'boleta',
  }))

  const simularPago = async (aprobado) => {
    if (!aprobado) {
      const resumen = { total: totalPrecio, productos: totalProductos }
      navigate('/pago/rechazado', { state: resumen })
      return
    }

    const items = carrito.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: obtenerPrecioFinal(item),
    }))

    const clienteEmail = datosCompra.email.trim() || usuario?.email || 'cliente@demo.com'
    const nombreCliente = usuario?.nombre || 'Cliente'
    const tipoComprobante = datosCompra.tipoComprobante || 'boleta'

    const envio = await enviarCorreoCompra({
      clienteNombre: nombreCliente,
      email: clienteEmail,
      tipoComprobante,
      items,
      total: totalPrecio,
    })

    const comprobanteData = {
      clienteNombre: nombreCliente,
      email: clienteEmail,
      tipoComprobante,
      items,
      total: totalPrecio,
      numeroPedido: envio.numeroPedido,
    }

    let errorGuardadoOrden = ''
    try {
      guardarOrden({
        ...comprobanteData,
        usuarioEmail: usuario?.email?.trim().toLowerCase() || clienteEmail.toLowerCase(),
        fecha: new Date().toISOString(),
      })
    } catch (errorGuardado) {
      errorGuardadoOrden = errorGuardado.message
    }

    descargarComprobante(comprobanteData)
    vaciarCarrito()

    navigate('/pago/aprobado', {
      state: {
        total: totalPrecio,
        productos: totalProductos,
        email: clienteEmail,
        tipoComprobante,
        envio,
        comprobanteData,
        errorGuardadoOrden,
      },
    })
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
        <button className="boton-pago-aprobado" type="button" onClick={() => simularPago(true)}>
          Simular pago aprobado
        </button>
        <button className="boton-pago-rechazado" type="button" onClick={() => simularPago(false)}>
          Simular pago rechazado
        </button>
      </div>
      <Link className="enlace-volver-carrito" to="/carrito">Volver al carrito</Link>
    </section>
  )
}

export default Checkout
