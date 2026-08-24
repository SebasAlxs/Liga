import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface FineType {
  id: string
  name: string
  defaultAmount: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export const useFineTypeStore = defineStore('fineType', () => {
  const fineTypes = ref<FineType[]>([])
  const loading = ref(false)

  async function fetchFineTypes(force = false, activeOnly = true) {
    if (!force && fineTypes.value.length > 0) return
    loading.value = true
    try {
      const query = activeOnly ? '?active=true' : ''
      const res: any = await $api(`/fine-types${query}`)
      fineTypes.value = res?.data || []
    } catch (err) {
      console.error('Failed to fetch fine types:', err)
    } finally {
      loading.value = false
    }
  }

  async function createFineType(data: Partial<FineType>) {
    try {
      await $api('/fine-types', { method: 'POST', body: data })
      await fetchFineTypes(true, false)
      return { success: true, message: 'Tipo de multa creado exitosamente.' }
    } catch (err: any) {
      console.error('Failed to create fine type:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear.' }
    }
  }

  async function updateFineType(id: string, data: Partial<FineType>) {
    try {
      await $api(`/fine-types/${id}`, { method: 'PUT', body: data })
      await fetchFineTypes(true, false)
      return { success: true, message: 'Tipo de multa actualizado.' }
    } catch (err: any) {
      console.error('Failed to update fine type:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar.' }
    }
  }
  
  async function deleteFineType(id: string) {
    try {
      await $api(`/fine-types/${id}`, { method: 'DELETE' })
      await fetchFineTypes(true, false)
      return { success: true, message: 'Tipo de multa eliminado.' }
    } catch (err: any) {
      console.error('Failed to delete fine type:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar.' }
    }
  }

  return {
    fineTypes,
    loading,
    fetchFineTypes,
    createFineType,
    updateFineType,
    deleteFineType
  }
})
