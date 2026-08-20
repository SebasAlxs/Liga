import { defineStore } from 'pinia'
import { $api, useApi } from '~/composables/useApi'

export interface Player {
  id: string
  firstName: string
  lastName: string
  number: number
  teamId: string
  dni?: string
  birthDate?: string
  isLocal: boolean
  picture?: string // base64
  stats?: {
    goals: number
    yellowCards: number
    redCards: number
  }
  createdAt?: string
  updatedAt?: string
}

export const usePlayerStore = defineStore('player', () => {
  const players = ref<Player[]>([])
  const loading = ref(false)
  // players.value también lo sobreescribe fetchPlayersByTeam con un subconjunto,
  // así que no podemos inferir "ya cargué todos" de players.value.length.
  const allPlayersLoaded = ref(false)

  function normalize(p: any): Player {
    return { ...p, id: p._id || p.id }
  }

  async function fetchPlayers(force = false) {
    if (!force && allPlayersLoaded.value) return
    loading.value = true
    try {
      const res: any = await $api('/players')
      const raw = res?.data || []
      players.value = raw.map(normalize)
      allPlayersLoaded.value = true
    } catch (err) {
      console.error('Failed to fetch players:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPlayersByTeam(teamId: string) {
    loading.value = true
    try {
      const res: any = await $api(`/players/team/${teamId}`)
      const raw = res?.data || []
      players.value = raw.map(normalize)
      allPlayersLoaded.value = false
    } catch (err) {
      console.error('Failed to fetch players by team:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPlayerById(id: string) {
    loading.value = true
    try {
      // In case the backend has an endpoint
      const res: any = await $api(`/players/${id}`)
      if (res?.data) {
        return normalize(res.data)
      }
      return null
    } catch (err) {
      console.error('Failed to fetch player by id:', err)
      // Fallback: search in loaded state
      return players.value.find(p => p.id === id) || null
    } finally {
      loading.value = false
    }
  }

  async function createPlayer(playerData: any) {
    try {
      await $api('/players', {
        method: 'POST',
        body: playerData
      })
      await fetchPlayers(true)
      return { success: true, message: 'Jugador creado correctamente' }
    } catch (err: any) {
      console.error('Failed to create player:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear jugador' }
    }
  }

  async function updatePlayer(id: string, playerData: any) {
    try {
      await $api(`/players/${id}`, {
        method: 'PUT',
        body: playerData
      })
      await fetchPlayers(true)
      return { success: true, message: 'Jugador actualizado correctamente' }
    } catch (err: any) {
      console.error('Failed to update player:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar jugador' }
    }
  }

  async function deletePlayer(id: string) {
    try {
      await $api(`/players/${id}`, { method: 'DELETE' })
      await fetchPlayers(true)
      return { success: true, message: 'Jugador eliminado correctamente' }
    } catch (err: any) {
      console.error('Failed to delete player:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar jugador' }
    }
  }

  return {
    players,
    loading,
    fetchPlayers,
    fetchPlayersByTeam,
    fetchPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
})
