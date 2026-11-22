import { api } from './http'

function extraerLista(data, clave) {
  if (!data) return []
  const lista = data?._embedded?.[clave]
  if (!Array.isArray(lista)) {
    throw new Error('El catálogo del backend tiene un formato inesperado.')
  }
  return lista
}

function crearDatosProducto(producto) {
  return {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    imagenUrl: producto.imagen,
    imagenInicio: producto.imagenInicio || null,
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    descuento: Number(producto.descuento),
    activo: true,
    categoria: { id: Number(producto.categoriaId) },
  }
}

export async function listarCategoriasAdminApi() {
  const { data } = await api.get('/api/v1/categorias')
  return extraerLista(data, 'categoriaList')
}

export async function crearCategoriaApi(categoria) {
  const { data } = await api.post('/api/v1/categorias', categoria)
  return data
}

export async function actualizarCategoriaApi(id, categoria) {
  const { data } = await api.put(`/api/v1/categorias/${id}`, categoria)
  return data
}

export async function desactivarCategoriaApi(id) {
  const { data } = await api.delete(`/api/v1/categorias/${id}`)
  return data
}

export async function desactivarProductoApi(id) {
  const { data } = await api.delete(`/api/v1/productos/${id}`)
  return data
}

export async function crearProductoApi(producto) {
  const { data } = await api.post('/api/v1/productos', crearDatosProducto(producto))
  return data
}

export async function actualizarProductoApi(id, producto) {
  const { data } = await api.put(`/api/v1/productos/${id}`, crearDatosProducto(producto))
  return data
}
