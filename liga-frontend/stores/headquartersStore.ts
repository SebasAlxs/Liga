import { defineStore } from 'pinia'

export interface Headquarters {
  id: string
  name: string
  city?: string
  address?: string
  active: boolean
}

export const useHeadquartersStore = defineStore('headquarters', () => {
  const headquarters = ref<Headquarters[]>([])
  const loading = ref(false)

  async function fetchHeadquarters(force = false) {
    if (!force && headquarters.value.length) return
    loading.value = true
    try {
      const res: any = await $api('/headquarters')
      const raw = res?.data || []
      headquarters.value = raw.map((h: any) => ({ ...h, id: h._id || h.id }))
    } catch (err) {
      console.error('Failed to fetch headquarters:', err)
    } finally {
      loading.value = false
    }
  }

  async function createHeadquarters(data: any) {
    try {
      await $api('/headquarters', { method: 'POST', body: data })
      await fetchHeadquarters(true)
      return { success: true, message: 'Sede creada correctamente' }
    } catch (err: any) {
      console.error('Failed to create headquarters:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear la sede' }
    }
  }

  async function updateHeadquarters(id: string, data: any) {
    try {
      await $api(`/headquarters/${id}`, { method: 'PUT', body: data })
      await fetchHeadquarters(true)
      return { success: true, message: 'Sede actualizada correctamente' }
    } catch (err: any) {
      console.error('Failed to update headquarters:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar la sede' }
    }
  }

  async function deleteHeadquarters(id: string) {
    try {
      await $api(`/headquarters/${id}`, { method: 'DELETE' })
      await fetchHeadquarters(true)
      return { success: true, message: 'Sede eliminada correctamente' }
    } catch (err: any) {
      console.error('Failed to delete headquarters:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar la sede' }
    }
  }

  return {
    headquarters,
    loading,
    fetchHeadquarters,
    createHeadquarters,
    updateHeadquarters,
    deleteHeadquarters,
  }
})
