import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
import { calcularTotalesCompra } from '../frontend/shared/calcularTotalesCompra.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const formatearPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`

const crearHtmlComprobante = async ({ clienteNombre, email, tipoComprobante, items, total, numeroPedido }) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>${formatearPrecio(item.precioUnitario)}</td>
          <td>${formatearPrecio(item.precioUnitario * item.cantidad)}</td>
        </tr>
      `
    )
    .join('')

  const subtotal = items.reduce((suma, item) => suma + item.precioUnitario * item.cantidad, 0)
  const netoBase = Number(total ?? subtotal)
  const { neto, iva, totalFinal } = calcularTotalesCompra(items, netoBase)
  const fecha = new Date().toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })
  const codigoBarras = `${(numeroPedido || 'GM-00000').replace(/[^0-9]/g, '').slice(0, 18).padEnd(18, '0')}`
  const qrValor = `${numeroPedido}|${tipoComprobante}|${clienteNombre}|${email}|${totalFinal}`
  const qrDataUrl = await QRCode.toDataURL(qrValor, {
    width: 220,
    margin: 1,
    color: { dark: '#111827', light: '#ffffff' },
  })

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} de compra</title>
        <style>
          body { margin: 0; padding: 32px; background: linear-gradient(135deg, #0b1020 0%, #111827 25%, #1f2937 60%, #0f172a 100%); font-family: Arial, sans-serif; color: #e5e7eb; }
          .contenedor { max-width: 860px; margin: 0 auto; background: #f8fafc; border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 28px; overflow: hidden; box-shadow: 0 28px 70px rgba(15, 23, 42, 0.55); }
          .topbar { background: linear-gradient(90deg, #0f172a 0%, #1d4ed8 20%, #7c3aed 60%, #14b8a6 100%); padding: 28px 32px; }
          .topbar-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
          .brand { font-size: 34px; font-weight: 800; letter-spacing: 1px; color: #fff; }
          .badge { background: rgba(15, 23, 42, 0.35); border: 1px solid rgba(255,255,255,0.3); color: #fff; border-radius: 999px; padding: 10px 18px; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; }
          .contenido { padding: 28px 32px 10px; color: #111827; }
          .header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 20px; }
          .titulo { font-size: 26px; margin: 0; color: #111827; }
          .subtitulo { margin: 6px 0 0; color: #475569; font-size: 14px; }
          .codigo-barras-box { background: #fff; border: 1px solid #dfe7f1; border-radius: 16px; padding: 12px 16px; min-width: 240px; }
          .codigo-barras { font-family: 'Courier New', monospace; font-size: 18px; letter-spacing: 2px; color: #111827; font-weight: 700; }
          .resumen-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-bottom: 24px; }
          .tarjeta-info { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #dfe7f1; border-radius: 16px; padding: 18px; }
          .tarjeta-info .label { display: block; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
          .tarjeta-info .valor { font-size: 17px; color: #0f172a; font-weight: 700; word-break: break-word; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%); color: #0f172a; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
          td { color: #0f172a; }
          .totales { margin-top: 22px; padding: 18px 20px; background: linear-gradient(135deg, #ecfeff 0%, #eef2ff 100%); border: 1px solid #bfdbfe; border-radius: 16px; }
          .fila-total { display: flex; justify-content: space-between; gap: 16px; padding: 8px 0; color: #0f172a; }
          .total-final { font-size: 28px; font-weight: 800; color: #0f766e; }
          .qr-row { display: grid; grid-template-columns: 1fr 170px; gap: 20px; align-items: center; margin-top: 26px; }
          .qr-box { display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #dfe7f1; border-radius: 18px; min-height: 150px; }
          .qr-image { width: 110px; height: 110px; display: block; }
          .footer-note { color: #475569; font-size: 12px; text-align: center; padding: 20px 32px 30px; }
        </style>
      </head>
      <body>
        <div class="contenedor">
          <div class="topbar">
            <div class="topbar-inner">
              <div class="brand">Gmoon</div>
              <div class="badge">${tipoComprobante === 'factura' ? 'FACTURA' : 'BOLETA'}</div>
            </div>
          </div>
          <div class="contenido">
            <div class="header-row">
              <div>
                <h1 class="titulo">${tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} de compra</h1>
                <p class="subtitulo">Emitida por Gmoon Tienda Gamer</p>
              </div>
              <div class="codigo-barras-box">
                <div style="font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;">Código de barras</div>
                <div class="codigo-barras">${codigoBarras}</div>
              </div>
            </div>

            <div class="resumen-grid">
              <div class="tarjeta-info">
                <span class="label">Número</span>
                <div class="valor">${numeroPedido}</div>
              </div>
              <div class="tarjeta-info">
                <span class="label">Fecha</span>
                <div class="valor">${fecha}</div>
              </div>
              <div class="tarjeta-info">
                <span class="label">Cliente</span>
                <div class="valor">${clienteNombre}</div>
              </div>
              <div class="tarjeta-info">
                <span class="label">Correo</span>
                <div class="valor">${email}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totales">
              <div class="fila-total"><span>Neto</span><strong>${formatearPrecio(neto)}</strong></div>
              <div class="fila-total"><span>IVA (19%)</span><strong>${formatearPrecio(iva)}</strong></div>
              <div class="fila-total"><span>Total a pagar</span><strong class="total-final">${formatearPrecio(totalFinal)}</strong></div>
            </div>

            <div class="qr-row">
              <div>
                <div style="font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;">Código QR</div>
                <div style="color: #0f172a; font-weight: 700;">Gmoon • ${tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} emitida</div>
                <div style="margin-top: 8px; color: #475569; font-size: 13px;">ID: ${numeroPedido}</div>
              </div>
              <div class="qr-box">
                <img class="qr-image" src="${qrDataUrl}" alt="Código QR de la compra" />
              </div>
            </div>
          </div>
          <div class="footer-note">Gracias por elegir Gmoon. Este comprobante confirma tu compra exitosa. Código verificador: ${qrValor}</div>
        </div>
      </body>
    </html>
  `
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API de emails funcionando' })
})

app.post('/api/compras/enviar-correo', async (req, res) => {
  try {
    const { clienteNombre, email, tipoComprobante, items, total, numeroPedido } = req.body || {}

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos de la compra o el correo del cliente.',
      })
    }

    const correoDestino = String(email).trim()
    const tipo = tipoComprobante === 'factura' ? 'Factura' : 'Boleta'
    const numero = numeroPedido || `GM-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        ok: false,
        message: 'Falta la configuración del SMTP. Debes definir SMTP_USER y SMTP_PASS en el backend.',
      })
    }

    const html = await crearHtmlComprobante({
      clienteNombre: clienteNombre || 'Cliente',
      email: correoDestino,
      tipoComprobante: tipoComprobante === 'factura' ? 'factura' : 'boleta',
      items,
      total,
      numeroPedido: numero,
    })

    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'Gmoon Tienda Gamer'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: correoDestino,
      subject: `Gmoon - ${tipo} confirmada #${numero}`,
      html,
    })

    return res.json({ ok: true, message: 'Correo enviado correctamente.', numeroPedido: numero, info })
  } catch (error) {
    console.error('Error enviando correo:', error)
    return res.status(500).json({
      ok: false,
      message: 'No se pudo enviar el correo de la compra.',
      error: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Backend de correos activo en http://localhost:${port}`)
})
