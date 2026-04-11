import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    teams: 0,
    tournaments: 0,
    players: 0,
    venues: 0
  })
  const loading = ref(false)

  async function fetchSummary() {
    loading.value = true
    try {
      const [teamsRes, tournamentsRes, playersRes, venuesRes]: any = await Promise.all([
        $api('/teams'),
        $api('/tournaments'),
        $api('/players'),
        $api('/headquarters')
      ])

      stats.value = {
        teams: teamsRes?.pagination?.totalCount ?? teamsRes?.data?.length ?? 0,
        tournaments: tournamentsRes?.pagination?.totalCount ?? tournamentsRes?.data?.length ?? 0,
        players: playersRes?.pagination?.totalCount ?? playersRes?.data?.length ?? 0,
        venues: venuesRes?.pagination?.totalCount ?? venuesRes?.data?.length ?? 0
      }
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    fetchSummary
  }
})
