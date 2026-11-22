import { api, mensajeErrorApi } from './http'
import {
  guardarGrupos,
  guardarProductos,
  obtenerGrupos,
  obtenerProductos,
} from '../data/productos'

const normalizarTexto = (valor = '') => valor
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase()

const crearSlug = (valor) => normalizarTexto(valor)
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

export async function cargarCatalogoApi() {
  const { data } = await api.get('/api/v1/productos')
  const productosApi = data?._embedded?.productoList ?? (data ? null : [])
  if (!Array.isArray(productosApi)) {
    throw new Error('El catálogo del backend tiene un formato inesperado.')
  }

  const productosLocales = obtenerProductos()
  const porNombre = new Map(productosLocales.map((producto) => [
    normalizarTexto(producto.nombre),
    producto,
  ]))
  const idsUsados = new Set()

  const productos = productosApi.map((producto) => {
    const categoria = producto.categoria || {}
    const local = porNombre.get(normalizarTexto(producto.nombre))
    const idBase = local?.id || `${crearSlug(producto.nombre) || 'producto'}-${producto.id}`
    const id = idsUsados.has(idBase) ? `${idBase}-${producto.id}` : idBase
    idsUsados.add(id)
    return {
      ...local,
      id,
      backendId: String(producto.id),
      categoriaBackendId: categoria.id == null ? '' : String(categoria.id),
      grupo: categoria.grupo || 'Otros',
      categoria: categoria.nombre || 'General',
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      descuento: Number(producto.descuento || 0),
      imagen: local?.imagen || producto.imagenUrl || '/img/Imagen_Bienvenida.png',
      imagenInicio: local?.imagenInicio || producto.imagenInicio || producto.imagenUrl || '',
    }
  })

  if (productos.some((producto) => (
    !producto.backendId
    || !producto.nombre
    || !Number.isFinite(producto.precio)
    || !Number.isInteger(producto.stock)
  ))) {
    throw new Error('El catálogo del backend contiene productos inválidos.')
  }

  const gruposApi = [...new Set(productos.map((producto) => producto.grupo))]
  const gruposLocales = obtenerGrupos()
  const gruposPorNombre = new Map(gruposLocales.map((grupo) => [
    normalizarTexto(grupo.nombre),
    grupo,
  ]))
  guardarGrupos(gruposApi.map((nombre) => (
    gruposPorNombre.get(normalizarTexto(nombre)) || { nombre, id: crearSlug(nombre) }
  )))
  guardarProductos(productos)
  return productos
}

export function mensajeErrorCatalogo(error) {
  return mensajeErrorApi(error, 'No se pudo cargar el catálogo del backend.')
}
