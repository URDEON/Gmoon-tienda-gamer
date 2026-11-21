import { useEffect, useSyncExternalStore } from 'react'
import {
  cargarCatalogo,
  obtenerEstadoCatalogo,
  reintentarCargaCatalogo,
  suscribirseAlEstadoCatalogo,
} from '../api/catalogoStore'
import {
  obtenerProductos,
  obtenerRevisionCatalogo,
  suscribirseAlCatalogo,
} from '../data/productos'

export function useProductos() {
  useSyncExternalStore(suscribirseAlCatalogo, obtenerRevisionCatalogo)
  const estado = useCatalogoEstado()
  useEffect(() => {
    void cargarCatalogo()
  }, [])
  return estado.cargando || estado.error ? [] : obtenerProductos()
}

export function useCatalogoEstado() {
  const estado = useSyncExternalStore(
    suscribirseAlEstadoCatalogo,
    obtenerEstadoCatalogo,
  )
  return { ...estado, reintentar: reintentarCargaCatalogo }
}
