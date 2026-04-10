import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useMatchStore = defineStore('match', {
  state: () => ({
    matches: [],
    matchEvents: [],
    matchLineups: [],
    standings: [],
    topScorers: [],
    loading: false,
    error: null
  }),

  getters: {
    dashboardStats: (state) => {
      const finishedMatches = state.matches.filter(m => m.status === 'FINISHED')
      const totalGoles = finishedMatches.reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0)

      return {
        matchesCount: finishedMatches.length,
        totalGoles,
        activeMatches: state.matches.filter(m => m.status === 'IN_PROGRESS').length
      }
    }
  },

  actions: {
    async fetchMatches() {
      this.loading = true
      try {
        const res = await api.get('/api/matches')
        this.matches = (res.data.data || []).map(m => ({ ...m, id: m.id || m._id }))
        return this.matches
      } catch (err) {
        console.error('Error fetching matches:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchStandings(tournamentId) {
      if (!tournamentId) return
      try {
        const res = await api.get(`/api/stats/standings/${tournamentId}`)
        this.standings = (res.data.data || []).map((t, index) => ({
          id: t._id || t.id,
          equipo: t.name,
          logo: t.logo,
          categoryId: t.categoryId,
          pj: t.matchesPlayed,
          pg: t.matchesWon,
          pe: t.matchesDrawn,
          pp: t.matchesLost,
          gf: t.goalsFor,
          gc: t.goalsAgainst,
          dg: t.goalDifference,
          pts: t.points,
          pos: index + 1
        }))
      } catch (err) {
        console.error('Error fetching standings:', err)
      }
    },

    async fetchTopScorers(tournamentId) {
      if (!tournamentId) return
      try {
        const res = await api.get(`/api/stats/top-scorers/${tournamentId}?limit=10`)
        this.topScorers = res.data.data || []
      } catch (err) {
        console.error('Error fetching top scorers:', err)
      }
    },

    async fetchMatchLineup(matchId) {
      try {
        const response = await api.get(`/api/match-lineups/${matchId}`)
        this.matchLineups = response.data.data || []
        return this.matchLineups
      } catch (err) {
        console.error('Error fetching match lineup:', err)
        throw err
      }
    },

    async addPlayerToLineup(data) {
      try {
        const response = await api.post('/api/match-lineups', data)
        const newItem = response.data.data
        this.matchLineups.push(newItem)
        return newItem
      } catch (err) {
        console.error('Error adding player to lineup:', err)
        throw err
      }
    },

    async updateMatch(id, data) {
      try {
        const response = await api.put(`/api/matches/${id}`, data)
        const updated = { ...response.data.data, id: response.data.data.id || response.data.data._id }
        const index = this.matches.findIndex(m => m.id === id)
        if (index !== -1) {
          this.matches[index] = updated
        }
        return updated
      } catch (err) {
        console.error('Error updating match:', err)
        throw err
      }
    }
  }
})
