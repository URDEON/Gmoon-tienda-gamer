import { useSyncExternalStore } from 'react'
import {
  obtenerGrupos,
  obtenerRevisionGrupos,
  suscribirseAGrupos,
} from '../data/productos'

export function useGrupos() {
  useSyncExternalStore(suscribirseAGrupos, obtenerRevisionGrupos)
  return obtenerGrupos()
}
