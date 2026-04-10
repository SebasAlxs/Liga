import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPlayers() {
      this.loading = true
      try {
        const res = await api.get('/api/players')
        this.players = (res.data.data || []).map(p => ({ ...p, id: p.id || p._id }))
        return this.players
      } catch (err) {
        console.error('Error fetching players:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchTeamPlayers(teamId, includePicture = false) {
      try {
        const res = await api.get(`/api/players/team/${teamId}?includePicture=${includePicture}`)
        const newPlayers = (res.data.data || []).map(p => ({ ...p, id: p.id || p._id }))
        
        newPlayers.forEach(p => {
          const index = this.players.findIndex(existing => existing.id === p.id)
          if (index !== -1) {
            this.players[index] = { ...this.players[index], ...p }
          } else {
            this.players.push(p)
          }
        })
        return newPlayers
      } catch (err) {
        console.error(`Error fetching players for team ${teamId}:`, err)
        throw err
      }
    },

    async fetchPlayerDetail(id) {
      try {
        const res = await api.get(`/api/players/${id}`)
        const p = { ...res.data.data, id: res.data.data.id || res.data.data._id }
        const index = this.players.findIndex(existing => existing.id === p.id)
        if (index !== -1) {
          this.players[index] = { ...this.players[index], ...p }
        } else {
          this.players.push(p)
        }
        return p
      } catch (err) {
        console.error(`Error fetching player detail ${id}:`, err)
        throw err
      }
    }
  }
})
