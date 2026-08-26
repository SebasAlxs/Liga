import { defineStore } from 'pinia'

export interface Stage {
  id: string
  name: string
  type: string
  isTwoLegged: boolean
}

export const useStageStore = defineStore('stage', () => {
  const items = ref<Stage[]>([])
  const loading = ref(false)

  async function fetchItems(tournamentId: string, force = false) {
    if (!tournamentId) return
    if (!force && items.value.length) return
    loading.value = true
    try {
      const res: any = await $api(`/stages/tournament/${tournamentId}`)
      const raw = res?.data || []
      items.value = raw.map((i: any) => ({ ...i, id: i._id || i.id }))
    } catch (err) {
      console.error('Failed to fetch stages:', err)
    } finally {
      loading.value = false
    }
  }

  async function createItem(data: any) {
    try {
      await $api('/stages', { method: 'POST', body: data })
      if (data.tournamentId) await fetchItems(data.tournamentId, true)
      return { success: true, message: 'Fase creada correctamente' }
    } catch (err: any) {
      console.error('Failed to create stage:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear la fase' }
    }
  }

  async function updateItem(id: string, data: any) {
    try {
      await $api(`/stages/${id}`, { method: 'PUT', body: data })
      if (data.tournamentId) await fetchItems(data.tournamentId, true)
      return { success: true, message: 'Fase actualizada correctamente' }
    } catch (err: any) {
      console.error('Failed to update stage:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar la fase' }
    }
  }

  async function deleteItem(id: string) {
    try {
      await $api(`/stages/${id}`, { method: 'DELETE' })
      items.value = items.value.filter(i => i.id !== id)
      return { success: true, message: 'Fase eliminada correctamente' }
    } catch (err: any) {
      console.error('Failed to delete stage:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar la fase' }
    }
  }

  return {
    items,
    loading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
})
