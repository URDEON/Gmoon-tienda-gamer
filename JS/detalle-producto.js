const productos = {
	// --- Videojuegos ---
	'fc-2027-ps4': {
		categoria: 'Videojuegos Deportes',
		nombre: 'FC 2027 PS4',
		descripcion: 'El simulador de fútbol más realista, ahora disponible para PS4.',
		precio: '$89.990',
		imagen: '../img/Juegos_Deportes/FC_2027_PS4.png'
	},
	'nba-2k26-ps5': {
		// TODO: el HTML tiene "NOMBRE DEL JUEGO" como placeholder, falta el nombre real
		categoria: 'Videojuegos Deportes',
		nombre: 'NBA 2K26 PS5',
		descripcion: 'Vive la acción de la NBA con el máximo realismo en PS5.',
		precio: '$89.990',
		imagen: '../img/Juegos_Deportes/NBA 2K26_PS5.png'
	},
	'ufc-6-ps5': {
		categoria: 'Videojuegos Deportes',
		nombre: 'UFC 6 PS5',
		descripcion: 'El simulador de artes marciales mixtas más completo, para PS5.',
		precio: '$69.990',
		imagen: '../img/Juegos_Deportes/UFC_2027_PS5.png'
	},
	'rugby-2024-ps4': {
		categoria: 'Videojuegos Deportes',
		nombre: 'RUGBY 2024 PS4',
		descripcion: 'Siente la intensidad del rugby profesional en PS4.',
		precio: '$59.990',
		imagen: '../img/Juegos_Deportes/RUGBY20_PS4.png'
	},
	'fc-2027-ps5': {
		categoria: 'Videojuegos Deportes',
		nombre: 'FC 2027 PS5',
		descripcion: 'El simulador de fútbol más realista, con gráficos de nueva generación en PS5.',
		precio: '$79.990',
		imagen: '../img/Juegos_Deportes/FC27_PS5.png'
	},
	'fc-2026-ps5': {
		categoria: 'Videojuegos Deportes',
		nombre: 'FC 2026 PS5',
		descripcion: 'El simulador de fútbol más realista, con gráficos de nueva generación en PS5.',
		precio: '$49.990',
		imagen: '../img/Juegos_Deportes/FC26_PS5.png'
	},

	// --- Consolas Modernas ---
	'ps5-slim': {
		categoria: 'Consolas Modernas',
		nombre: 'PlayStation 5 Slim',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$779.990',
		imagen: '../img/Consolas_Modernas/PS5_SLIM.png'
	},
	'xbox-series-x': {
		categoria: 'Consolas Modernas',
		nombre: 'Xbox Series X',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$649.990',
		imagen: '../img/Consolas_Modernas/Xbox_SeriesX.png'
	},
	'xbox-series-s': {
		categoria: 'Consolas Modernas',
		nombre: 'Xbox Series S',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$379.000',
		imagen: '../img/Consolas_Modernas/Xbox_SeriesS.png'
	},
	'nintendo-switch': {
		categoria: 'Consolas Modernas',
		nombre: 'Nintendo Switch',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$349.990',
		imagen: '../img/Consolas_Modernas/Nintendo_Switch.png'
	},
	'nintendo-switch-2': {
		categoria: 'Consolas Modernas',
		nombre: 'Nintendo Switch 2',
		descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.',
		precio: '$564.990',
		imagen: '../img/Consolas_Modernas/Nintendo_Switch_2.png'
	},

	// --- Consolas Retro ---
	'sega-engine': {
		categoria: 'Consolas Retro',
		nombre: 'Sega Engine',
		descripcion: 'Revive los clásicos con esta consola retro cargada de nostalgia.',
		precio: '$199.990',
		imagen: '../img/Consolas_Retro/Sega_Engine.png'
	},
	// TODO: falta la segunda consola retro — en el HTML tiene datos de relleno
	// ("imagen aca" / "Nombre aca" / "$000.000") y ni siquiera tiene id en el link.

	// --- PC Gamer de Escritorio ---
	'pc-gamer-starter': {
		categoria: 'PC Gamer',
		nombre: 'PC Gamer Gmoon Starter',
		descripcion: 'PC completo para jugar los mejores juegos con gran rendimiento.',
		precio: '$699.990',
		imagen: '../img/PC/Pc_Gamer_starter_699.png'
	},
	'pc-gamer-pro-rgb': {
		categoria: 'PC Gamer Pro',
		nombre: 'PC Gamer Pro Gmoon RGB',
		descripcion: 'PC gamer de alto rendimiento con iluminación RGB, ideal para exigir al máximo.',
		precio: '$999.990',
		imagen: '../img/PC/RGB de alta gama.png'
	},
	'pc-gamer-gmoon-ultra': {
		categoria: 'PC Gamer Ultra',
		nombre: 'PC Gamer Gmoon Ultra',
		descripcion: 'El equipo tope de gama de Gmoon, para la experiencia gamer más exigente.',
		precio: '$1.399.990',
		imagen: '../img/PC/PC gaming blanco con RGB.png'
	},

	// --- Accesorios gamer ---
	'audifonos-gamer-pro': {
		categoria: 'Periféricos',
		nombre: 'Audífonos Gamer Pro',
		descripcion: 'Audífonos inalámbricos pensados para largas sesiones de juego.',
		precio: '$69.990',
		imagen: '../img/Accesorios/Audifonos_inalambricos.png'
	},
	'teclado-hypex-rgb': {
		categoria: 'Periféricos',
		nombre: 'Teclado Hypex RGB',
		descripcion: 'Teclado mecánico con iluminación RGB personalizable.',
		precio: '$54.990',
		imagen: '../img/Accesorios/Teclado_HypexRGB.png'
	},
	'rataon-gaming-negro': {
		categoria: 'Periféricos',
		nombre: 'Ratón gaming negro',
		descripcion: 'Mouse gamer de alta precisión, cómodo para partidas largas.',
		precio: '$39.990',
		imagen: '../img/Accesorios/Ratón gaming negro.png'
	},
	'silla-gaming-gtplayer-negra-y-azul': {
		categoria: 'Periféricos',
		nombre: 'Silla gamer ergonómica',
		descripcion: 'Silla ergonómica GTPLAYER, pensada para largas jornadas de juego con máximo confort.',
		precio: '$159.990',
		imagen: '../img/Accesorios/Silla gaming GTPLAYER negra y azul.png'
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