
const botonCategorias = document.querySelector('.boton-categorias');
const menuCategorias = document.querySelector('.menu-categorias');

botonCategorias.addEventListener('click', () => {
	const estaAbierto = menuCategorias.classList.toggle('abierto');
	botonCategorias.setAttribute('aria-expanded', estaAbierto);
});

document.addEventListener('click', (event) => {
	if (!menuCategorias.contains(event.target) && !botonCategorias.contains(event.target)) {
		menuCategorias.classList.remove('abierto');
		botonCategorias.setAttribute('aria-expanded', 'false');
	}
});




function obtenerUsuarios() {
	const datos = localStorage.getItem('gmoonUsuarios');
	return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(listaUsuarios) {
	localStorage.setItem('gmoonUsuarios', JSON.stringify(listaUsuarios));
}

function obtenerSesion() {
	const datos = localStorage.getItem('gmoonSesion');
	return datos ? JSON.parse(datos) : null;
}

function iniciarSesionLocal(usuario) {
	localStorage.setItem('gmoonSesion', JSON.stringify(usuario));
}

function cerrarSesionLocal() {
	localStorage.removeItem('gmoonSesion');
	window.location.href = 'index.html';
}



const enlaceCuenta = document.querySelector('.enlace-cuenta');

if (enlaceCuenta) {
	const sesion = obtenerSesion();

	if (sesion) {
		enlaceCuenta.textContent = 'Hola, ' + sesion.nombre + ' · Cerrar sesión';
		enlaceCuenta.setAttribute('href', '#');
		enlaceCuenta.addEventListener('click', function (evento) {
			evento.preventDefault();
			cerrarSesionLocal();
		});
	}
}


const formularioLogin = document.getElementById('formulario-login');

if (formularioLogin) {

	// Elementos del formulario
	const campoEmail = document.getElementById('email-login');
	const campoPassword = document.getElementById('password-login');
	const errorEmail = document.getElementById('error-email');
	const errorPassword = document.getElementById('error-password');
	const mensajeEstado = document.getElementById('mensaje-estado-login');
	const botonMostrarContrasena = document.getElementById('boton-mostrar-contrasena');

	botonMostrarContrasena.addEventListener('click', function () {
		if (campoPassword.type === 'password') {
			campoPassword.type = 'text';
			botonMostrarContrasena.textContent = 'Ocultar contraseña';
		} else {
			campoPassword.type = 'password';
			botonMostrarContrasena.textContent = 'Mostrar contraseña';
		}
	});

	formularioLogin.addEventListener('submit', function (evento) {
		evento.preventDefault(); 

		let formularioValido = true;

		const email = campoEmail.value.trim().toLowerCase();
		if (email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
			errorEmail.textContent = 'Ingresa un correo electrónico válido.';
			formularioValido = false;
		} else {
			errorEmail.textContent = '';
		}

		const password = campoPassword.value;
		if (password.length < 8) {
			errorPassword.textContent = 'La contraseña debe tener al menos 8 caracteres.';
			formularioValido = false;
		} else {
			errorPassword.textContent = '';
		}

		if (!formularioValido) {
			mensajeEstado.textContent = 'Revisa los campos marcados en rojo.';
			mensajeEstado.style.color = 'var(--pink)';
			return;
		}

		const usuarios = obtenerUsuarios();
		const usuarioEncontrado = usuarios.find(function (usuario) {
			return usuario.email === email && usuario.password === password;
		});

		if (!usuarioEncontrado) {
			mensajeEstado.textContent = 'Correo o contraseña incorrectos. ¿Ya te registraste?';
			mensajeEstado.style.color = 'var(--pink)';
			return;
		}

		iniciarSesionLocal(usuarioEncontrado);
		mensajeEstado.textContent = '¡Bienvenido de nuevo, ' + usuarioEncontrado.nombre + '! Iniciando sesión...';
		mensajeEstado.style.color = 'var(--cyan)';

		setTimeout(function () {
			window.location.href = 'index.html';
		}, 1200);
	});

	const botonGoogle = document.getElementById('boton-google');
	const botonFacebook = document.getElementById('boton-facebook');

	botonGoogle.addEventListener('click', function () {
		mensajeEstado.textContent = 'El acceso con Google estará disponible pronto.';
	});

	botonFacebook.addEventListener('click', function () {
		mensajeEstado.textContent = 'El acceso con Facebook estará disponible pronto.';
	});
}


const formularioRegistro = document.getElementById('formulario-registro');

if (formularioRegistro) {

	const campoNombre = document.getElementById('nombre-registro');
	const campoEmailRegistro = document.getElementById('email-registro');
	const campoPasswordRegistro = document.getElementById('password-registro');
	const campoPasswordConfirmar = document.getElementById('password-confirmar');

	const errorNombre = document.getElementById('error-nombre');
	const errorEmailRegistro = document.getElementById('error-email-registro');
	const errorPasswordRegistro = document.getElementById('error-password-registro');
	const errorPasswordConfirmar = document.getElementById('error-password-confirmar');

	const mensajeEstadoRegistro = document.getElementById('mensaje-estado-registro');
	const botonMostrarContrasenaRegistro = document.getElementById('boton-mostrar-contrasena-registro');

	botonMostrarContrasenaRegistro.addEventListener('click', function () {
		const mostrando = campoPasswordRegistro.type === 'text';
		const nuevoTipo = mostrando ? 'password' : 'text';

		campoPasswordRegistro.type = nuevoTipo;
		campoPasswordConfirmar.type = nuevoTipo;
		botonMostrarContrasenaRegistro.textContent = mostrando ? 'Mostrar contraseña' : 'Ocultar contraseña';
	});

	formularioRegistro.addEventListener('submit', function (evento) {
		evento.preventDefault();

		let formularioValido = true;

		const nombre = campoNombre.value.trim();
		if (nombre === '') {
			errorNombre.textContent = 'Ingresa tu nombre completo.';
			formularioValido = false;
		} else {
			errorNombre.textContent = '';
		}

		const email = campoEmailRegistro.value.trim().toLowerCase();
		if (email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
			errorEmailRegistro.textContent = 'Ingresa un correo electrónico válido.';
			formularioValido = false;
		} else {
			errorEmailRegistro.textContent = '';
		}

		const password = campoPasswordRegistro.value;
		if (password.length < 8) {
			errorPasswordRegistro.textContent = 'La contraseña debe tener al menos 8 caracteres.';
			formularioValido = false;
		} else {
			errorPasswordRegistro.textContent = '';
		}

		const passwordConfirmar = campoPasswordConfirmar.value;
		if (passwordConfirmar !== password || passwordConfirmar === '') {
			errorPasswordConfirmar.textContent = 'Las contraseñas no coinciden.';
			formularioValido = false;
		} else {
			errorPasswordConfirmar.textContent = '';
		}

		if (!formularioValido) {
			mensajeEstadoRegistro.textContent = 'Revisa los campos marcados en rojo.';
			mensajeEstadoRegistro.style.color = 'var(--pink)';
			return;
		}

		const usuarios = obtenerUsuarios();
		const correoRepetido = usuarios.some(function (usuario) {
			return usuario.email === email;
		});

		if (correoRepetido) {
			errorEmailRegistro.textContent = 'Ya existe una cuenta con este correo.';
			mensajeEstadoRegistro.textContent = 'Revisa los campos marcados en rojo.';
			mensajeEstadoRegistro.style.color = 'var(--pink)';
			return;
		}

		usuarios.push({ nombre: nombre, email: email, password: password });
		guardarUsuarios(usuarios);

		mensajeEstadoRegistro.textContent = '¡Cuenta creada con éxito! Redirigiendo a iniciar sesión...';
		mensajeEstadoRegistro.style.color = 'var(--cyan)';
		formularioRegistro.reset();

		setTimeout(function () {
			window.location.href = 'iniciar_sesion.html';
		}, 1200);
	});
}
