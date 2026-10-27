import { useSyncExternalStore } from 'react'
import {
  obtenerOrdenes,
  obtenerRevisionOrdenes,
  suscribirseAOrdenes,
} from '../data/ordenes'

export function useOrdenes() {
  useSyncExternalStore(suscribirseAOrdenes, obtenerRevisionOrdenes)
  return obtenerOrdenes()
}
