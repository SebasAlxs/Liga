import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useTeamStore } from './teamStore'
import { usePlayerStore } from './playerStore'
import { useMatchStore } from './matchStore'

export const useLeagueStore = defineStore('league', {
    state: () => ({
        tournaments: [],
        categories: [],
        headquarters: [],
        activeTournamentId: null,
        activeCategoryId: null,
        loading: false,
        error: null
    }),

    getters: {
        currentTournament: (state) => state.tournaments.find(t => t.id === state.activeTournamentId),
        currentCategory: (state) => state.categories.find(c => c.id === state.activeCategoryId),
        
        // Dashboard Stats
        dashboardStats: (state) => {
            const teamStore = useTeamStore()
            const matchStore = useMatchStore()
            const playerStore = usePlayerStore()
            return {
                teamsCount: teamStore.teams.length,
                matchesCount: matchStore.matches.length,
                playersCount: playerStore.players.length,
                totalGoles: matchStore.matches.reduce((acc, m) => acc + (m.homeScore || 0) + (m.awayScore || 0), 0)
            }
        },

        goalsChartData: (state) => {
            // Mock data or summary for the chart
            return [10, 25, 45, 30, 60, 55, 80]
        },

        filteredStandings: (state) => {
            const matchStore = useMatchStore()
            return matchStore.standings || []
        },

        topScorers: (state) => {
            const matchStore = useMatchStore()
            return matchStore.topScorers || []
        }
    },

    actions: {
        async fetchLeagueData() {
            this.loading = true
            this.error = null
            
            const teamStore = useTeamStore()
            const playerStore = usePlayerStore()
            const matchStore = useMatchStore()

            try {
                const [tournamentsRes, categoriesRes, hqsRes] = await Promise.all([
                    api.get('/api/tournaments'),
                    api.get('/api/categories'),
                    api.get('/api/headquarters')
                ])

                this.tournaments = (tournamentsRes.data.data || []).map(t => ({ ...t, id: t.id || t._id }))
                this.categories = (categoriesRes.data.data || []).map(c => ({ ...c, id: c.id || c._id }))
                this.headquarters = (hqsRes.data.data || []).map(h => ({ ...h, id: h.id || h._id }))

                // Carga inicial de datos de los otros stores en paralelo
                await Promise.all([
                    teamStore.fetchTeams(),
                    matchStore.fetchMatches(),
                    playerStore.fetchPlayers()
                ])

                if (!this.activeTournamentId && this.tournaments.length > 0) {
                    this.activeTournamentId = this.tournaments[0].id
                }
                if (!this.activeCategoryId && this.categories.length > 0) {
                    this.activeCategoryId = this.categories[0].id
                }

                if (this.activeTournamentId) {
                    await Promise.all([
                        matchStore.fetchTopScorers(this.activeTournamentId),
                        matchStore.fetchStandings(this.activeTournamentId)
                    ])
                }
            } catch (err) {
                console.error('Error fetching league data:', err)
                this.error = 'No se pudo cargar la información de la liga'
            } finally {
                this.loading = false
            }
        },

        setActiveTournament(id) {
            this.activeTournamentId = id
            const matchStore = useMatchStore()
            matchStore.fetchTopScorers(id)
            matchStore.fetchStandings(id)
        },

        setActiveCategory(id) {
            this.activeCategoryId = id
        },

        // Métodos de metadatos simplificados
        async createTournament(data) {
            const res = await api.post('/api/tournaments', data)
            const item = { ...res.data.data, id: res.data.data.id || res.data.data._id }
            this.tournaments.push(item)
            return item
        },

        async updateTournament(id, data) {
            const res = await api.put(`/api/tournaments/${id}`, data)
            const updated = { ...res.data.data, id: res.data.data.id || res.data.data._id }
            const index = this.tournaments.findIndex(t => t.id === id)
            if (index !== -1) this.tournaments[index] = updated
            return updated
        }
    }
})
