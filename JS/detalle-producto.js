const productos = {
	'ps5-slim': {
		categoria: 'Consolas-modernas',
		nombre: 'PlayStation 5 Slim',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$549.990',
		imagen: '../img/Consolas_Modernas/PS5_SLIM.png'
	},
	'xbox-series-x': {
		categoria: 'Consolas-modernas',
		nombre: 'Xbox Series X',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$649.990',
		imagen: '../img/Consolas_Modernas/Xbox_SeriesX.png'
	},
	'xbox-series-s': {
		categoria: 'Consolas-modernas',
		nombre: 'Xbox Series S',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$379.000',
		imagen: '../img/Consolas_Modernas/Xbox_SeriesS.png'
	},
    'nintendo-switch': {
		categoria: 'Consolas-modernas',
		nombre: 'Nintendo Switch',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$349.990',
		imagen: '../img/Consolas_Modernas/Nintendo_Switch.png'
	},
	'nintendo-switch-2': {
		categoria: 'Consolas-modernas',
		nombre: 'Nintendo Switch 2',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$564.990',
		imagen: '../img/Consolas_Modernas/Nintendo_Switch_2.png'
	},
	'pc-gamer-starter': {
		categoria: 'PC Gamer',
		nombre: 'PC Gamer Gmoon Starterr',
		descripcion: 'PC completo para jugar los mejores juegos con gran rendimiento.',
		precio: '$699.990',
		imagen: '../img/PC/Pc_Gamer_starter_699.png'
	}

};

const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get('id');
const producto = productos[idProducto];

const categoriaProducto = document.querySelector('#categoria-producto');
const nombreProducto = document.querySelector('#nombre-producto');
const descripcionProducto = document.querySelector('#descripcion-producto');
const precioProducto = document.querySelector('#precio-producto');
const imagenProducto = document.querySelector('#imagen-producto');
const botonAnadirCarrito = document.querySelector('#boton-anadir-carrito');

if (producto) {
	categoriaProducto.textContent = producto.categoria;
	nombreProducto.textContent = producto.nombre;
	descripcionProducto.textContent = producto.descripcion;
	precioProducto.textContent = producto.precio;
	imagenProducto.src = producto.imagen;
	imagenProducto.alt = producto.nombre;
	botonAnadirCarrito.addEventListener('click', () => {
		window.agregarAlCarrito({ id: idProducto, ...producto });
		botonAnadirCarrito.textContent = 'Añadido al carrito';
	});
} else {
	categoriaProducto.textContent = 'Detalle de producto';
	nombreProducto.textContent = 'Selecciona un producto';
	descripcionProducto.textContent = 'Cuando agreguemos el catálogo, cada producto tendrá aquí su información completa.';
	precioProducto.textContent = '';
	imagenProducto.removeAttribute('src');
	botonAnadirCarrito.disabled = true;
}
