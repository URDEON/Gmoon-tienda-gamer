const articulos = {
	'guias-consolas': {
		categoria: 'Guías gamer',
		titulo: 'Cómo elegir tu próxima consola',
		resumen: 'Comparamos opciones para que encuentres la consola que mejor se adapta a tu forma de jugar.',
		imagen: '../img/Stiker_Aqui_te_explicamos.png',
		contenido: 'Antes de elegir una consola, piensa en los juegos que quieres disfrutar, el espacio disponible y la forma en que prefieres jugar. También es importante revisar sus controles, almacenamiento y catálogo exclusivo.'
	},
	'setup-gamer': {
		categoria: 'Setup gamer',
		titulo: 'Arma un espacio cómodo para jugar',
		resumen: 'Consejos simples para ordenar tus periféricos y disfrutar sesiones más cómodas.',
		imagen: '../img/Stiker_setup_gamer.png',
		contenido: 'Un buen setup no depende solo de tener muchos accesorios. Comienza con una silla cómoda, una mesa con espacio suficiente y una iluminación que no canse la vista. Después organiza tus periféricos para que todo quede al alcance.'
	}
};

const parametros = new URLSearchParams(window.location.search);
const idArticulo = parametros.get('id') || 'guias-consolas';
const articulo = articulos[idArticulo];

const categoriaArticulo = document.querySelector('#categoria-articulo');
const tituloArticulo = document.querySelector('#titulo-articulo');
const resumenArticulo = document.querySelector('#resumen-articulo');
const contenidoArticulo = document.querySelector('#contenido-articulo');
const imagenArticulo = document.querySelector('#imagen-articulo');

if (articulo) {
	categoriaArticulo.textContent = articulo.categoria;
	tituloArticulo.textContent = articulo.titulo;
	resumenArticulo.textContent = articulo.resumen;
	contenidoArticulo.textContent = articulo.contenido;
	imagenArticulo.src = articulo.imagen;
	imagenArticulo.alt = articulo.titulo;
} else {
	tituloArticulo.textContent = 'Artículo no encontrado';
	resumenArticulo.textContent = 'La noticia que buscas no está disponible.';
	contenidoArticulo.textContent = '';
	imagenArticulo.removeAttribute('src');
}
