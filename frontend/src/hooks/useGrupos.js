import { useEffect, useSyncExternalStore } from 'react'
import {
  cargarCatalogo,
  obtenerEstadoCatalogo,
  suscribirseAlEstadoCatalogo,
} from '../api/catalogoStore'
import {
  obtenerGrupos,
  obtenerRevisionGrupos,
  suscribirseAGrupos,
} from '../data/productos'

export function useGrupos() {
  useSyncExternalStore(suscribirseAGrupos, obtenerRevisionGrupos)
  const estado = useSyncExternalStore(
    suscribirseAlEstadoCatalogo,
    obtenerEstadoCatalogo,
  )
  useEffect(() => {
    void cargarCatalogo()
  }, [])
  return estado.cargando || estado.error ? [] : obtenerGrupos()
}
