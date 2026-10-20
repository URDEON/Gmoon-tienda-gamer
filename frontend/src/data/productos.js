// Catálogo Gmoon. El precio es un número (CLP) para poder calcular totales.
export const productos = [
  // --- Videojuegos ---
  { id: 'fc-2027-ps4', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'FC 2027 PS4', descripcion: 'El simulador de fútbol más realista, ahora disponible para PS4.', precio: 89990, imagen: '/img/Juegos_Deportes/FC_2027_PS4.png' },
  { id: 'nba-2k26-ps5', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'NBA 2K26 PS5', descripcion: 'Vive la acción de la NBA con el máximo realismo en PS5.', precio: 89990, imagen: '/img/Juegos_Deportes/NBA 2K26_PS5.png' },
  { id: 'ufc-6-ps5', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'UFC 6 PS5', descripcion: 'El simulador de artes marciales mixtas más completo, para PS5.', precio: 69990, imagen: '/img/Juegos_Deportes/UFC_2027_PS5.png' },
  { id: 'rugby-2024-ps4', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'RUGBY 2024 PS4', descripcion: 'Siente la intensidad del rugby profesional en PS4.', precio: 59990, imagen: '/img/Juegos_Deportes/RUGBY20_PS4.png' },
  { id: 'fc-2027-ps5', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'FC 2027 PS5', descripcion: 'El simulador de fútbol más realista, con gráficos de nueva generación en PS5.', precio: 79990, imagen: '/img/Juegos_Deportes/FC27_PS5.png' },
  { id: 'fc-2026-ps5', grupo: 'Videojuegos', categoria: 'Videojuegos Deportes', nombre: 'FC 2026 PS5', descripcion: 'El simulador de fútbol más realista, con gráficos de nueva generación en PS5.', precio: 49990, imagen: '/img/Juegos_Deportes/FC26_PS5.png' },

  // --- Consolas Modernas ---
  { id: 'ps5-slim', grupo: 'Consolas Modernas', categoria: 'Consolas Modernas', nombre: 'PlayStation 5 Slim', descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.', precio: 779990, imagen: '/img/Consolas_Modernas/PS5_SLIM.png' },
  { id: 'xbox-series-x', grupo: 'Consolas Modernas', categoria: 'Consolas Modernas', nombre: 'Xbox Series X', descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.', precio: 649990, imagen: '/img/Consolas_Modernas/Xbox_SeriesX.png' },
  { id: 'xbox-series-s', grupo: 'Consolas Modernas', categoria: 'Consolas Modernas', nombre: 'Xbox Series S', descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.', precio: 379000, imagen: '/img/Consolas_Modernas/Xbox_SeriesS.png' },
  { id: 'nintendo-switch', grupo: 'Consolas Modernas', categoria: 'Consolas Modernas', nombre: 'Nintendo Switch', descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.', precio: 349990, imagen: '/img/Consolas_Modernas/Nintendo_Switch.png' },
  { id: 'nintendo-switch-2', grupo: 'Consolas Modernas', categoria: 'Consolas Modernas', nombre: 'Nintendo Switch 2', descripcion: 'Consola de nueva generación para disfrutar tus juegos favoritos con gran velocidad y calidad de imagen.', precio: 564990, imagen: '/img/Consolas_Modernas/Nintendo_Switch_2.png' },

  // --- Consolas Retro ---
  { id: 'sega-engine', grupo: 'Consolas Retro', categoria: 'Consolas Retro', nombre: 'Sega Engine', descripcion: 'Revive los clásicos con esta consola retro cargada de nostalgia.', precio: 199990, imagen: '/img/Consolas_Retro/Sega_Engine.png' },
  { id: 'nintendo-64', grupo: 'Consolas Retro', categoria: 'Consolas Retro', nombre: 'Nintendo 64', descripcion: 'Consola retro de la marca Nintendo, ideal para coleccionistas y amantes del gaming clásico.', precio: 199990, imagen: 'https://i.ebayimg.com/images/g/4lgAAOSwLnNjJjPz/s-l1200.jpg' },

  // --- PC Gamer ---
  { id: 'pc-gamer-starter', grupo: 'PC Gamer', categoria: 'PC Gamer', nombre: 'PC Gamer Gmoon Starter', descripcion: 'PC completo para jugar los mejores juegos con gran rendimiento.', precio: 699990, imagen: '/img/PC/Pc_Gamer_starter_699.png', imagenInicio: '/img/PC/portada_pc_699.png' },
  { id: 'pc-gamer-pro-rgb', grupo: 'PC Gamer', categoria: 'PC Gamer Pro', nombre: 'PC Gamer Pro Gmoon RGB', descripcion: 'PC gamer de alto rendimiento con iluminación RGB, ideal para exigir al máximo.', precio: 999990, imagen: '/img/PC/RGB de alta gama.png', imagenInicio: '/img/PC/portada_pc_999.png' },
  { id: 'pc-gamer-gmoon-ultra', grupo: 'PC Gamer', categoria: 'PC Gamer Ultra', nombre: 'PC Gamer Gmoon Ultra', descripcion: 'El equipo tope de gama de Gmoon, para la experiencia gamer más exigente.', precio: 1399990, imagen: '/img/PC/PC gaming blanco con RGB.png', imagenInicio: '/img/PC/portada_pc_1.399.png' },

  // --- Periféricos ---
  { id: 'audifonos-gamer-pro', grupo: 'Periféricos', categoria: 'Periféricos', nombre: 'Audífonos Gamer Pro', descripcion: 'Audífonos inalámbricos pensados para largas sesiones de juego.', precio: 69990, imagen: '/img/Accesorios/Audifonos_inalambricos.png' },
  { id: 'teclado-hypex-rgb', grupo: 'Periféricos', categoria: 'Periféricos', nombre: 'Teclado Hypex RGB', descripcion: 'Teclado mecánico con iluminación RGB personalizable.', precio: 54990, imagen: '/img/Accesorios/Teclado_HypexRGB.png' },
  { id: 'raton-gaming-negro', grupo: 'Periféricos', categoria: 'Periféricos', nombre: 'Ratón gaming negro', descripcion: 'Mouse gamer de alta precisión, cómodo para partidas largas.', precio: 39990, imagen: '/img/Accesorios/Ratón gaming negro.png' },
  { id: 'silla-gaming-gtplayer', grupo: 'Periféricos', categoria: 'Periféricos', nombre: 'Silla gamer ergonómica', descripcion: 'Silla ergonómica GTPLAYER, pensada para largas jornadas de juego con máximo confort.', precio: 159990, imagen: '/img/Accesorios/Silla gaming GTPLAYER negra y azul.png' },
]

// Orden, títulos e identificadores de las secciones del catálogo
export const grupos = [
  { nombre: 'Videojuegos', id: 'videojuegos' },
  { nombre: 'Consolas Modernas', id: 'consolas-modernas' },
  { nombre: 'Consolas Retro', id: 'consolas-retro' },
  { nombre: 'PC Gamer', titulo: 'PC Gamer de Escritorio', id: 'Pc Gamer' },
  { nombre: 'Periféricos', titulo: 'Accesorios gamer', id: 'accesorios' },
]

// 89990 -> "$89.990"
export const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`