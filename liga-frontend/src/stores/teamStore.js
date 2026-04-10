import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTeams() {
      this.loading = true
      try {
        const res = await api.get('/api/teams')
        this.teams = (res.data.data || []).map(t => ({ ...t, id: t.id || t._id }))
        return this.teams
      } catch (err) {
        console.error('Error fetching teams:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async createTeam(data) {
      try {
        const res = await api.post('/api/teams', data)
        const newTeam = { ...res.data.data, id: res.data.data.id || res.data.data._id }
        this.teams.push(newTeam)
        return newTeam
      } catch (err) {
        console.error('Error creating team:', err)
        throw err
      }
    },

    async updateTeam(id, data) {
      try {
        const res = await api.put(`/api/teams/${id}`, data)
        const updated = { ...res.data.data, id: res.data.data.id || res.data.data._id }
        const index = this.teams.findIndex(t => t.id === id)
        if (index !== -1) {
          this.teams[index] = updated
        }
        return updated
      } catch (err) {
        console.error('Error updating team:', err)
        throw err
      }
    },

    async deleteTeam(id) {
      try {
        await api.delete(`/api/teams/${id}`)
        this.teams = this.teams.filter(t => t.id !== id)
      } catch (err) {
        console.error('Error deleting team:', err)
        throw err
      }
    }
  }
})
