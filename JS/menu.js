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
