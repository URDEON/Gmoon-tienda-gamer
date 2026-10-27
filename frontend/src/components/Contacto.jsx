const URL_MAPA =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6639.140427629687!2d-71.22170143622245!3d-33.69419122649975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x966255eae610cb2f%3A0xc3fdb55ead51065b!2sDuoc%20UC%3A%20Sede%20Melipilla!5e0!3m2!1ses!2scl!4v1788715573711!5m2!1ses!2scl'

function Contacto() {
  return (
    <section className="seccion-contacto" id="Contacto" aria-labelledby="titulo-contacto">
      <div className="encabezado-contacto">
        <p className="etiqueta-seccion">ESTAMOS PARA AYUDARTE</p>
        <h2 id="titulo-contacto">Visítanos y sigamos jugando</h2>
        <p>
          ¿Tienes dudas sobre un producto? Escríbenos o ven a conocernos. Estamos listos para
          ayudarte a encontrar tu próximo upgrade.
        </p>
      </div>

      <div className="rejilla-contacto">
        <div className="datos-contacto">
          <a className="dato-contacto" href="tel:+56912345678">
            <span className="icono-contacto" aria-hidden="true">☎</span>
            <span><strong>+56 9 1234 5678</strong><small>Llámanos o escríbenos</small></span>
          </a>
          <a className="dato-contacto" href="mailto:contacto@gmoon.cl">
            <span className="icono-contacto" aria-hidden="true">@</span>
            <span><strong>contacto@gmoon.cl</strong><small>Respondemos tus consultas</small></span>
          </a>
          <div className="dato-contacto">
            <span className="icono-contacto" aria-hidden="true">◷</span>
            <span><strong>Lun. a sáb. · 10:00 a 19:00</strong><small>Horario de atención</small></span>
          </div>
        </div>

        <div className="ubicacion-contacto">
          <div className="visual-mapa" aria-label="Mapa de ubicación">
            <iframe
              src={URL_MAPA}
              title="Ubicación de Gmoon Gamer Store"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
          <div className="contenido-ubicacion">
            <div>
              <p className="etiqueta-seccion">ENCUÉNTRANOS</p>
              <h3>Gmoon Gamer Store</h3>
              <p>Dirección pendiente de actualizar<br />Chile</p>
            </div>
            <a className="boton-ubicacion" href={URL_MAPA} target="_blank" rel="noopener noreferrer">
              Abrir ubicación <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="redes-contacto" aria-label="Redes sociales">
        <span>Síguenos en</span>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">TikTok</a>
      </div>
    </section>
  )
}

export default Contacto