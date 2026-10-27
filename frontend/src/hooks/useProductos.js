import { useSyncExternalStore } from 'react'
import {
  obtenerProductos,
  obtenerRevisionCatalogo,
  suscribirseAlCatalogo,
} from '../data/productos'

export function useProductos() {
  useSyncExternalStore(suscribirseAlCatalogo, obtenerRevisionCatalogo)
  return obtenerProductos()
}
