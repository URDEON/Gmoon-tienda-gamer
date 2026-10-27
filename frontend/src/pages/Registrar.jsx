import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { validarNombre, validarEmail, validarPassword, validarConfirmacion } from '../utils/validaciones'
import { registrarUsuario } from '../utils/usuarios'
import '../styles/login.css'

const VACIO = { nombre: '', email: '', password: '', confirmacion: '' }

// Elige qué validación aplicar según el campo
const validarCampo = (name, value, datos) => {
  if (name === 'nombre') return validarNombre(value)
  if (name === 'email') return validarEmail(value)
  if (name === 'password') return validarPassword(value)
  return validarConfirmacion(datos.password, value)
}

function Registrar() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState(VACIO)
  const [verPassword, setVerPassword] = useState(false)
  const [estado, setEstado] = useState('')

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setDatos((actual) => ({ ...actual, [name]: value }))
  }

  const manejarBlur = (evento) => {
    const { name, value } = evento.target
    setErrores((actual) => ({ ...actual, [name]: validarCampo(name, value, datos) }))
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const nuevosErrores = {
      nombre: validarNombre(datos.nombre),
      email: validarEmail(datos.email),
      password: validarPassword(datos.password),
      confirmacion: validarConfirmacion(datos.password, datos.confirmacion),
    }
    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some((error) => error)) {
      setEstado('')
      return
    }

    const resultado = registrarUsuario(datos)
    if (!resultado.ok) {
      setEstado(resultado.error)
      return
    }

    setEstado('¡Cuenta creada! Te llevamos a iniciar sesión...')
    setDatos(VACIO)
    setTimeout(() => navigate('/iniciar-sesion'), 1200)
  }

  const tipoPassword = verPassword ? 'text' : 'password'

  return (
    <section className="seccion-login">
      <div className="tarjeta-login">
        <div className="panel-formulario">
          <p className="etiqueta-seccion">CREA TU CUENTA</p>
          <h1>Únete a Gmoon</h1>
          <p>Regístrate para comprar, hacer seguimiento a tus pedidos y más.</p>

          <form id="formulario-registro" onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
              name="nombre"
              label="Nombre completo"
              placeholder="Tu nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              onBlur={manejarBlur}
              error={errores.nombre}
            />
            <CampoFormulario
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              value={datos.email}
              onChange={manejarCambio}
              onBlur={manejarBlur}
              error={errores.email}
            />
            <CampoFormulario
              name="password"
              label="Contraseña"
              type={tipoPassword}
              placeholder="Al menos 8 caracteres"
              value={datos.password}
              onChange={manejarCambio}
              onBlur={manejarBlur}
              error={errores.password}
            />
            <CampoFormulario
              name="confirmacion"
              label="Confirmar contraseña"
              type={tipoPassword}
              placeholder="Repite tu contraseña"
              value={datos.confirmacion}
              onChange={manejarCambio}
              onBlur={manejarBlur}
              error={errores.confirmacion}
            >
              <button type="button" id="boton-mostrar-contrasena-registro" onClick={() => setVerPassword(!verPassword)}>
                {verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </button>
            </CampoFormulario>

            <button type="submit" className="boton-enviar-login">Crear cuenta</button>
            <p id="mensaje-estado-registro">{estado}</p>
          </form>

          <p className="texto-registro">
            ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
          </p>
        </div>

        <div className="panel-visual">
          <img src="/img/Imagen_Bienvenida.png" alt="Gmoon Gamer Store" />
        </div>
      </div>
    </section>
  )
}

export default Registrar