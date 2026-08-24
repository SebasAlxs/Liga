import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface Fine {
  id: string
  amount: number
  reason: string
  status: 'PENDING' | 'PENDING_VERIFICATION' | 'PAID'
  receiptUrl?: string
  paymentDate?: string
  teamId: string
  matchId?: string
  playerId?: string
  createdAt?: string
  updatedAt?: string
  player?: any
  match?: any
  team?: { id: string; name: string }
}

export const useFineStore = defineStore('fine', () => {
  const authStore = useAuthStore()
  const fines = ref<Fine[]>([])
  const loading = ref(false)

  async function fetchFines(force = false) {
    if (!force && fines.value.length > 0) return
    loading.value = true
    try {
      let query = ''
      if (authStore.isDirigente && authStore.user?.teamId) {
         query = `?teamId=${authStore.user.teamId}`
      }
      
      const res: any = await $api(`/fines${query}`)
      fines.value = res?.data || []
    } catch (err) {
      console.error('Failed to fetch fines:', err)
    } finally {
      loading.value = false
    }
  }

  async function createFine(data: Partial<Fine>) {
    try {
      await $api('/fines', { method: 'POST', body: data })
      await fetchFines(true)
      return { success: true, message: 'Multa creada exitosamente.' }
    } catch (err: any) {
      console.error('Failed to create fine:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear la multa.' }
    }
  }

  async function updateFineStatus(id: string, status: Fine['status'], receiptUrl?: string) {
    try {
      const data: any = { status }
      if (receiptUrl) data.receiptUrl = receiptUrl
      if (status === 'PAID') data.paymentDate = new Date().toISOString()
        
      await $api(`/fines/${id}`, { method: 'PATCH', body: data })
      await fetchFines(true)
      return { success: true, message: 'Estado actualizado.' }
    } catch (err: any) {
      console.error('Failed to update fine:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar.' }
    }
  }

  return {
    fines,
    loading,
    fetchFines,
    createFine,
    updateFineStatus
  }
})
