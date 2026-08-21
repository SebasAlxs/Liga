import { defineStore } from 'pinia'
import { $api } from '~/composables/useApi'

export interface ModuleCatalogItem {
  key: string
  label: string
  icon: string
  link: string
}

// Catálogo de módulos disponibles en la app. Es la fuente de verdad para
// etiquetas/íconos/rutas; la visibilidad por rol vive en el backend.
export const MODULE_CATALOG: ModuleCatalogItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard', link: '/' },
  { key: 'matches', label: 'Partidos', icon: 'lucide:calendar-check', link: '/matches' },
  { key: 'teams', label: 'Equipos', icon: 'lucide:users-2', link: '/teams' },
  { key: 'players', label: 'Jugadores', icon: 'lucide:user-check', link: '/players' },
  { key: 'standings', label: 'Posiciones', icon: 'lucide:list-ordered', link: '/standings' },
  { key: 'vocalia', label: 'Vocalía', icon: 'lucide:clipboard-list', link: '/vocalia' },
  { key: 'scoring', label: 'Marcador en Vivo', icon: 'lucide:zap', link: '/scoring' },
  { key: 'tournaments', label: 'Torneos', icon: 'lucide:trophy', link: '/tournaments' },
  { key: 'venues', label: 'Sedes', icon: 'lucide:map-pin', link: '/venues' },
  { key: 'settings', label: 'Configuración', icon: 'lucide:settings-2', link: '/settings' },
]

export const ROLES = ['SUPERADMIN', 'ADMIN', 'VOCAL', 'DIRIGENTE'] as const
export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  ADMIN: 'Admin',
  VOCAL: 'Vocal',
  DIRIGENTE: 'Dirigente',
}

export interface ModuleAccessRow {
  role: string
  module: string
  visible: boolean
}

export const useModuleAccessStore = defineStore('moduleAccess', () => {
  // Módulos visibles para el usuario actual (para filtrar el menú)
  const myModules = ref<string[]>([])
  const loaded = ref(false)

  // Matriz completa rol x módulo (para el panel de super admin)
  const allRows = ref<ModuleAccessRow[]>([])
  const loading = ref(false)

  async function fetchMyModules() {
    try {
      const res: any = await $api('/module-access/me')
      myModules.value = res?.data || []
    } catch (err) {
      console.error('Failed to fetch my modules:', err)
      // Si falla, no ocultamos nada (comportamiento previo a esta feature)
      myModules.value = MODULE_CATALOG.map(m => m.key)
    } finally {
      loaded.value = true
    }
  }

  function isVisible(moduleKey: string) {
    // Mientras no haya cargado, no ocultar nada para evitar parpadeo/menú vacío
    if (!loaded.value) return true
    return myModules.value.includes(moduleKey)
  }

  async function fetchAll() {
    loading.value = true
    try {
      const res: any = await $api('/module-access')
      allRows.value = res?.data || []
    } catch (err) {
      console.error('Failed to fetch module access matrix:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateAll(items: ModuleAccessRow[]) {
    try {
      await $api('/module-access', { method: 'PUT', body: { items } })
      await fetchAll()
      // Si el super admin se edita a sí mismo, refrescar también su propio menú
      await fetchMyModules()
      return { success: true, message: 'Configuración de módulos actualizada correctamente' }
    } catch (err: any) {
      console.error('Failed to update module access:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar la configuración' }
    }
  }

  return {
    myModules,
    loaded,
    allRows,
    loading,
    fetchMyModules,
    isVisible,
    fetchAll,
    updateAll,
  }
})
