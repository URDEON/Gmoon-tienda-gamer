const CLAVE_CARRITO = 'gmoon-carrito';

function obtenerCarrito() {
	return JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
}

function guardarCarrito(carrito) {
	localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
	const carrito = obtenerCarrito();
	const productoExistente = carrito.find((item) => item.id === producto.id);

	if (productoExistente) {
		productoExistente.cantidad += 1;
	} else {
		carrito.push({ ...producto, cantidad: 1 });
	}

	guardarCarrito(carrito);
}

function cambiarCantidad(id, cambio) {
	const carrito = obtenerCarrito();
	const producto = carrito.find((item) => item.id === id);

	if (!producto) return;

	producto.cantidad += cambio;
	const carritoActualizado = carrito.filter((item) => item.cantidad > 0);
	guardarCarrito(carritoActualizado);
	renderizarCarrito();
}

function eliminarDelCarrito(id) {
	const carrito = obtenerCarrito().filter((item) => item.id !== id);
	guardarCarrito(carrito);
	renderizarCarrito();
}

function renderizarCarrito() {
	const lista = document.querySelector('#lista-carrito');
	const total = document.querySelector('#total-carrito');
	const mensajeVacio = document.querySelector('#carrito-vacio');

	if (!lista || !total || !mensajeVacio) return;

	const carrito = obtenerCarrito();
	lista.innerHTML = '';
	let totalCarrito = 0;

	mensajeVacio.hidden = carrito.length > 0;

	carrito.forEach((producto) => {
		const precio = Number(producto.precio.replace(/[^0-9]/g, ''));
		totalCarrito += precio * producto.cantidad;

		const item = document.createElement('article');
		item.className = 'item-carrito';
		item.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}">
			<div class="datos-item-carrito">
				<p>${producto.categoria}</p>
				<h2>${producto.nombre}</h2>
				<strong>${producto.precio}</strong>
			</div>
			<div class="controles-carrito">
				<button type="button" data-cambio="-1" aria-label="Restar una unidad">−</button>
				<span>${producto.cantidad}</span>
				<button type="button" data-cambio="1" aria-label="Sumar una unidad">+</button>
			</div>
			<button class="boton-eliminar-carrito" type="button">Eliminar</button>
		`;

		item.querySelectorAll('[data-cambio]').forEach((boton) => {
			boton.addEventListener('click', () => cambiarCantidad(producto.id, Number(boton.dataset.cambio)));
		});
		item.querySelector('.boton-eliminar-carrito').addEventListener('click', () => eliminarDelCarrito(producto.id));
		lista.appendChild(item);
	});

	total.textContent = `$${totalCarrito.toLocaleString('es-CL')}`;
}

window.agregarAlCarrito = agregarAlCarrito;
document.addEventListener('DOMContentLoaded', renderizarCarrito);
