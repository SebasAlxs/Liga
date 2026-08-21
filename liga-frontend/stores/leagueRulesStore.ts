import { defineStore } from 'pinia'

export interface LeagueRules {
  maxForeignPlayersOnField: number
}

export const useLeagueRulesStore = defineStore('leagueRules', () => {
  const rules = ref<LeagueRules>({ maxForeignPlayersOnField: 4 })
  const loading = ref(false)

  async function fetchRules() {
    loading.value = true
    try {
      const res: any = await $api('/league-rules')
      if (res?.data) rules.value = res.data
    } catch (err) {
      console.error('Failed to fetch league rules:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateRules(data: Partial<LeagueRules>) {
    try {
      const res: any = await $api('/league-rules', { method: 'PUT', body: data })
      if (res?.data) rules.value = res.data
      return { success: true, message: 'Reglas actualizadas correctamente' }
    } catch (err: any) {
      console.error('Failed to update league rules:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar las reglas' }
    }
  }

  return {
    rules,
    loading,
    fetchRules,
    updateRules,
  }
})
