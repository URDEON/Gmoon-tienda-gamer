import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { validarEmail, validarPassword } from '../utils/validaciones'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'

const validadores = { email: validarEmail, password: validarPassword }

function IniciarSesion() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuth()
  const [datos, setDatos] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({ email: '', password: '' })
  const [verPassword, setVerPassword] = useState(false)
  const [estado, setEstado] = useState('')

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setDatos((actual) => ({ ...actual, [name]: value }))
  }

  // Valida el campo cuando el usuario sale de él
  const manejarBlur = (evento) => {
    const { name, value } = evento.target
    setErrores((actual) => ({ ...actual, [name]: validadores[name](value) }))
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const nuevosErrores = {
      email: validarEmail(datos.email),
      password: validarPassword(datos.password),
    }
    setErrores(nuevosErrores)

    if (nuevosErrores.email || nuevosErrores.password) {
      setEstado('')
      return
    }

    const resultado = iniciarSesion(datos.email, datos.password)
    if (!resultado.ok) {
      setEstado(resultado.error)
      return
    }

    setEstado(`¡Bienvenido, ${resultado.usuario.nombre}!`)
    // El admin va al panel; los clientes, al inicio
    setTimeout(() => navigate(resultado.usuario.rol === 'admin' ? '/admin' : '/'), 1000)
  }

  return (
    <section className="seccion-login">
      <div className="tarjeta-login">
        <div className="panel-formulario">
          <p className="etiqueta-seccion">ACCEDE A TU CUENTA</p>
          <h1>Bienvenido de nuevo</h1>
          <p>Inicia sesión para seguir gestionando tus compras y pedidos.</p>

          <form id="formulario-login" onSubmit={manejarEnvio} noValidate>
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
              type={verPassword ? 'text' : 'password'}
              placeholder="Al menos 8 caracteres"
              value={datos.password}
              onChange={manejarCambio}
              onBlur={manejarBlur}
              error={errores.password}
            >
              <button type="button" id="boton-mostrar-contrasena" onClick={() => setVerPassword(!verPassword)}>
                {verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </button>
            </CampoFormulario>

            <button type="submit" className="boton-enviar-login">Iniciar sesión</button>
            <p id="mensaje-estado-login">{estado}</p>
          </form>

          <p className="texto-separador">O continúa con</p>
          <div className="acciones-sociales">
            <button type="button" className="boton-social">Google</button>
            <button type="button" className="boton-social">Facebook</button>
          </div>
          <p className="texto-registro">
            ¿Aún no tienes cuenta? <Link to="/registrar">Regístrate</Link>
          </p>
        </div>

        <div className="panel-visual">
          <img src="/img/Imagen_Bienvenida.png" alt="Gmoon Gamer Store" />
        </div>
      </div>
    </section>
  )
}

export default IniciarSesion