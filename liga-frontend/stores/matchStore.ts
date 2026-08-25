import { defineStore } from 'pinia'
import { $api, useApi } from '~/composables/useApi'
import { useAuthStore } from './auth'

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED'

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  matchDate: string
  round?: number | null
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
  async function fetchMatches(managedByMe = false) {
    const authStore = useAuthStore()
    const isManaged = managedByMe || authStore.isDirigente
    loading.value = true
    try {
      const url = isManaged ? '/matches?managedByMe=true' : '/matches'
      const res: any = await $api(url)
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

  async function generateFixture(tournamentId: string, categoryId: string, doubleRound: boolean) {
    try {
      await $api('/matches/fixture/generate', { method: 'POST', body: { tournamentId, categoryId, doubleRound } })
      await fetchMatches()
      return { success: true, message: 'Fixture generado correctamente' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Error al generar el fixture' }
    }
  }

  async function downloadFixturePdf(tournamentId: string, categoryId: string) {
    try {
      const blob: any = await $api(`/matches/fixture/pdf?tournamentId=${tournamentId}&categoryId=${categoryId}`, { responseType: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fixture-${tournamentId}-${categoryId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err.data?.message || err.message || 'Error al descargar el fixture' }
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
    generateFixture, downloadFixturePdf,
  }
})
