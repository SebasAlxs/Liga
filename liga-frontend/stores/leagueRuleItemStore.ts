import { defineStore } from 'pinia'

export interface LeagueRuleItem {
  id: string
  title: string
  description?: string | null
}

export const useLeagueRuleItemStore = defineStore('leagueRuleItem', () => {
  const items = ref<LeagueRuleItem[]>([])
  const loading = ref(false)

  async function fetchItems(force = false) {
    if (!force && items.value.length) return
    loading.value = true
    try {
      const res: any = await $api('/league-rule-items')
      const raw = res?.data || []
      items.value = raw.map((i: any) => ({ ...i, id: i._id || i.id }))
    } catch (err) {
      console.error('Failed to fetch league rule items:', err)
    } finally {
      loading.value = false
    }
  }

  async function createItem(data: any) {
    try {
      await $api('/league-rule-items', { method: 'POST', body: data })
      await fetchItems(true)
      return { success: true, message: 'Regla creada correctamente' }
    } catch (err: any) {
      console.error('Failed to create rule item:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear la regla' }
    }
  }

  async function updateItem(id: string, data: any) {
    try {
      await $api(`/league-rule-items/${id}`, { method: 'PUT', body: data })
      await fetchItems(true)
      return { success: true, message: 'Regla actualizada correctamente' }
    } catch (err: any) {
      console.error('Failed to update rule item:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar la regla' }
    }
  }

  async function deleteItem(id: string) {
    try {
      await $api(`/league-rule-items/${id}`, { method: 'DELETE' })
      await fetchItems(true)
      return { success: true, message: 'Regla eliminada correctamente' }
    } catch (err: any) {
      console.error('Failed to delete rule item:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar la regla' }
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
