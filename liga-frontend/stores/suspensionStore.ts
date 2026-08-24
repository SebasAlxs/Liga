import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Suspension {
  id: string
  playerId: string
  tournamentId: string
  teamId?: string
  matchId?: string
  fineId?: string
  reason: string
  matchesSuspended: number
  status: 'ACTIVE' | 'SERVED' | 'APPEALED'
  createdAt?: string
  updatedAt?: string
}

export const useSuspensionStore = defineStore('suspension', () => {
  const suspensions = ref<Suspension[]>([])
  const loading = ref(false)

  async function fetchSuspensions(force = false) {
    if (!force && suspensions.value.length > 0) return
    loading.value = true
    try {
      const res: any = await $api('/suspensions')
      suspensions.value = res?.data || []
    } catch (err) {
      console.error('Failed to fetch suspensions:', err)
    } finally {
      loading.value = false
    }
  }

  const activePlayerIds = computed(() => new Set(
    suspensions.value.filter(s => s.status === 'ACTIVE').map(s => s.playerId)
  ))

  function isPlayerSuspended(playerId: string) {
    return activePlayerIds.value.has(playerId)
  }

  return {
    suspensions,
    loading,
    fetchSuspensions,
    isPlayerSuspended
  }
})
