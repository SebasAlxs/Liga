import { defineStore } from 'pinia'
import { $api, useApi } from '~/composables/useApi'

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED'

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  matchDate: string
  tournamentId: string
  categoryId: string
  status: MatchStatus
  refereeId?: string | null
  assistant1Id?: string | null
  assistant2Id?: string | null
  fourthRefereeId?: string | null
  primaryReferee?: any
  assistant1?: any
  assistant2?: any
  fourthReferee?: any
  createdAt?: string
  updatedAt?: string
}

export interface Tournament {
  id: string
  name: string
  active: boolean
  maxYellowCardsForSuspension?: number
}

export interface Category {
  id: string
  name: string
  minAge?: number
  maxAge?: number
}

export const useMatchStore = defineStore('match', () => {
  const matches = ref<Match[]>([])
  const tournaments = ref<Tournament[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  function normalize(m: any): Match {
    return { ...m, id: m._id || m.id }
  }

  function normalizeMeta(item: any) {
    return { ...item, id: item._id || item.id }
  }

  // ── Matches ──────────────────────────────────────────
  async function fetchMatches() {
    loading.value = true
    try {
      const res: any = await $api('/matches')
      matches.value = (res?.data || []).map(normalize)
    } catch (err) {
      console.error('Failed to fetch matches:', err)
    } finally {
      loading.value = false
    }
  }

  async function createMatch(payload: any) {
    try {
      await $api('/matches', { method: 'POST', body: payload })
      await fetchMatches()
      return { success: true, message: 'Partido creado correctamente' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Error al crear partido' }
    }
  }

  async function updateMatch(id: string, payload: any) {
    try {
      await $api(`/matches/${id}`, { method: 'PUT', body: payload })
      await fetchMatches()
      return { success: true, message: 'Partido actualizado correctamente' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar partido' }
    }
  }

  async function deleteMatch(id: string) {
    try {
      await $api(`/matches/${id}`, { method: 'DELETE' })
      await fetchMatches()
      return { success: true, message: 'Partido eliminado correctamente' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar partido' }
    }
  }

  // ── Tournaments ────────────────────────────────────
  async function fetchTournaments() {
    try {
      const res: any = await $api('/tournaments')
      tournaments.value = (res?.data || []).map(normalizeMeta)
    } catch (err) {
      console.error('Failed to fetch tournaments:', err)
    }
  }

  // ── Categories ────────────────────────────────────
  async function fetchCategories() {
    try {
      const res: any = await $api('/categories')
      categories.value = (res?.data || []).map(normalizeMeta)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  return {
    matches, tournaments, categories, loading,
    fetchMatches, createMatch, updateMatch, deleteMatch,
    fetchTournaments, fetchCategories,
  }
})
