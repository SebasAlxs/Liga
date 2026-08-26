import { defineStore } from 'pinia'

// Nota: se llama TournamentEntry (no "Tournament") porque stores/matchStore.ts
// ya exporta un tipo Tournament más reducido para sus propios selectores.
export interface TournamentEntry {
  id: string
  name: string
  active: boolean
  maxYellowCardsForSuspension: number
  blockPlayerWithPendingFines: boolean
  maxForeignPlayersOnField: number
  maxPlayersOnField: number
  minPlayersToStartMatch: number
  matchHalfDurationMinutes: number
  headquartersId?: string
}

export const useTournamentStore = defineStore('tournament', () => {
  const tournaments = ref<TournamentEntry[]>([])
  const loading = ref(false)

  async function fetchTournaments(force = false) {
    if (!force && tournaments.value.length) return
    loading.value = true
    try {
      const res: any = await $api('/tournaments')
      const raw = res?.data || []
      tournaments.value = raw.map((t: any) => ({ ...t, id: t._id || t.id }))
    } catch (err) {
      console.error('Failed to fetch tournaments:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTournament(data: any) {
    try {
      await $api('/tournaments', { method: 'POST', body: data })
      await fetchTournaments(true)
      return { success: true, message: 'Torneo creado correctamente' }
    } catch (err: any) {
      console.error('Failed to create tournament:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear el torneo' }
    }
  }

  async function updateTournament(id: string, data: any) {
    try {
      await $api(`/tournaments/${id}`, { method: 'PUT', body: data })
      await fetchTournaments(true)
      return { success: true, message: 'Torneo actualizado correctamente' }
    } catch (err: any) {
      console.error('Failed to update tournament:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar el torneo' }
    }
  }

  async function deleteTournament(id: string) {
    try {
      await $api(`/tournaments/${id}`, { method: 'DELETE' })
      await fetchTournaments(true)
      return { success: true, message: 'Torneo eliminado correctamente' }
    } catch (err: any) {
      console.error('Failed to delete tournament:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar el torneo' }
    }
  }

  return {
    tournaments,
    loading,
    fetchTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
  }
})
