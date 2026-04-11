import { defineStore } from 'pinia'

export interface Team {
  id: string
  name: string
  logo?: string
  categoryId?: string
  // Add other fields as per backend entity
}

export const useTeamStore = defineStore('team', () => {
  const teams = ref<Team[]>([])
  const loading = ref(false)

  async function fetchTeams() {
    loading.value = true
    try {
      const res: any = await $api('/teams')
      
      // Backend returns _id instead of id, normalize it here
      const rawTeams = res?.data || []
      teams.value = rawTeams.map((t: any) => ({
        ...t,
        id: t._id || t.id // Ensure we have id
      }))
    } catch (err) {
      console.error('Failed to fetch teams:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTeamById(id: string) {
    loading.value = true
    try {
      const res: any = await $api(`/teams/${id}`)
      const t = res?.data
      if (t) {
        return {
          ...t,
          id: t._id || t.id
        }
      }
      return null
    } catch (err) {
      console.error(`Failed to fetch team ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createTeam(teamData: any) {
    try {
      await $api('/teams', {
        method: 'POST',
        body: teamData
      })
      await fetchTeams()
      return { success: true, message: 'Equipo creado correctamente' }
    } catch (err: any) {
      console.error('Failed to create team:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al crear equipo' }
    }
  }

  async function updateTeam(id: string, teamData: any) {
    try {
      await $api(`/teams/${id}`, {
        method: 'PUT',
        body: teamData
      })
      await fetchTeams()
      return { success: true, message: 'Equipo actualizado correctamente' }
    } catch (err: any) {
      console.error('Failed to update team:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al actualizar equipo' }
    }
  }

  async function deleteTeam(id: string) {
    try {
      await $api(`/teams/${id}`, {
        method: 'DELETE'
      })
      await fetchTeams()
      return { success: true, message: 'Equipo eliminado correctamente' }
    } catch (err: any) {
      console.error('Failed to delete team:', err)
      return { success: false, message: err.data?.message || err.message || 'Error al eliminar equipo' }
    }
  }

  return {
    teams,
    loading,
    fetchTeams,
    fetchTeamById,
    createTeam,
    updateTeam,
    deleteTeam
  }
})
