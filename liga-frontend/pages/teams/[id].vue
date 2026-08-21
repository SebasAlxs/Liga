<template>
  <div class="page-container p-6 max-w-7xl mx-auto">
    <!-- Header / Navigation -->
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/teams" class="p-2 hover:bg-surface-hover rounded-xl text-content-muted hover:text-content transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Detalle del Equipo</h1>
        <div class="flex items-center gap-2 text-content-muted mt-1">
          <NuxtLink to="/teams" class="hover:text-primary">Equipos</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <span class="text-primary font-medium">{{ team?.name || 'Cargando...' }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="!team" class="text-center py-20 bg-surface/80 backdrop-blur rounded-3xl border border-border shadow-xl">
      <Icon name="lucide:search-x" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">Equipo no encontrado</h3>
      <p class="text-content-muted mt-2">El club que buscas no existe o ha sido eliminado.</p>
      <NuxtLink to="/teams" class="mt-6 inline-flex items-center gap-2 bg-primary text-content px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
        Volver a la lista
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar Info -->
      <div class="space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-border shadow-xl text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
          
          <div class="relative z-10">
            <div class="w-32 h-32 rounded-3xl bg-background border-2 border-border mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-xl">
              <img v-if="team.logo" :src="team.logo" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-20 h-20 text-emerald-300" />
            </div>
            
            <h2 class="text-2xl font-bold text-content mb-2">{{ team.name }}</h2>
            <p class="text-content-muted text-sm font-medium">Fundado en {{ team.foundedYear || 'N/A' }}</p>
            
            <div class="flex justify-center gap-4 mt-8">
              <div class="text-center px-4 py-2 bg-background rounded-2xl border border-border">
                <div class="text-[10px] text-content-muted uppercase font-bold tracking-wider">Títulos</div>
                <div class="text-xl font-bold text-primary">{{ team.championshipsWon || 0 }}</div>
              </div>
              <div class="text-center px-4 py-2 bg-background rounded-2xl border border-border">
                <div class="text-[10px] text-content-muted uppercase font-bold tracking-wider">Puntos</div>
                <div class="text-xl font-bold text-primary">{{ team.points || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-border shadow-xl">
          <h3 class="text-lg font-bold text-content mb-4 flex items-center gap-2">
            <Icon name="lucide:info" class="w-5 h-5 text-primary" />
            Estadísticas de Temporada
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl">
              <span class="text-content-muted">Partidos Jugados</span>
              <span class="text-content font-bold">{{ team.matchesPlayed }}</span>
            </div>
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl">
              <span class="text-content-muted">Victorias</span>
              <span class="text-primary font-bold">{{ team.matchesWon }}</span>
            </div>
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl">
              <span class="text-content-muted">Empates</span>
              <span class="text-content-muted font-bold">{{ team.matchesDrawn }}</span>
            </div>
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl">
              <span class="text-content-muted">Derrotas</span>
              <span class="text-rose-500 font-bold">{{ team.matchesLost }}</span>
            </div>
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl transition-colors hover:bg-emerald-50">
              <span class="text-content-muted">Goles a Favor</span>
              <span class="text-primary font-bold">{{ team.goalsFor }}</span>
            </div>
            <div class="flex justify-between p-3 bg-background border border-border rounded-xl transition-colors hover:bg-rose-50">
              <span class="text-content-muted">Goles en Contra</span>
              <span class="text-rose-600 font-bold">{{ team.goalsAgainst }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content / Roster -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-border shadow-xl min-h-[500px]">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-content flex items-center gap-3">
              <Icon name="lucide:users" class="w-6 h-6 text-primary" />
              Plantilla de Jugadores
            </h3>
            <button v-if="authStore.canManageTeams" class="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-content px-4 py-2 rounded-xl font-bold transition-all border border-primary/50">
              <Icon name="lucide:user-plus" class="w-5 h-5" />
              Inscribir Jugador
            </button>
          </div>

          <!-- Players Table Placeholder -->
          <div v-if="loadingPlayers" class="flex justify-center py-12">
            <Icon name="lucide:loader-2" class="w-10 h-10 text-primary animate-spin" />
          </div>
          
          <div v-else-if="players.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-4">
              <Icon name="lucide:user-x" class="w-10 h-10 text-content-muted" />
            </div>
            <h4 class="text-lg font-semibold text-content">No hay jugadores inscritos</h4>
            <p class="text-content-muted mt-1 max-w-xs">Registra a los jugadores que forman parte de este club para llevar el control de goles y tarjetas.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-border">
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest pl-4">Dorsal</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest">Jugador</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden md:table-cell">Cédula</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest text-center">Local</th>
                  <th v-if="authStore.canManageTeams" class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="player in players" :key="player.id" class="group/row hover:bg-background transition-colors">
                  <td class="py-4 pl-4">
                    <div class="w-10 h-10 rounded-xl bg-surface flex items-center justify-center font-bold text-primary border border-border shadow-sm">
                      {{ player.number }}
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-surface-hover overflow-hidden border border-border flex items-center justify-center">
                        <img v-if="player.picture" :src="player.picture" class="w-full h-full object-cover" />
                        <Icon v-else name="lucide:user" class="w-5 h-5 text-content-muted" />
                      </div>
                      <div>
                        <p class="font-bold text-content group-hover/row:text-primary transition-colors">{{ player.firstName }} {{ player.lastName }}</p>
                        <p class="text-xs text-content-muted font-medium">Ficha activa</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 hidden md:table-cell">
                    <span class="font-mono text-sm text-content-muted">{{ player.dni || '---' }}</span>
                  </td>
                  <td class="py-4 text-center">
                    <span :class="`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${player.isLocal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`">
                      {{ player.isLocal ? 'Local' : 'Visitante' }}
                    </span>
                  </td>
                  <td v-if="authStore.canManageTeams" class="py-4 text-right pr-4">
                    <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button class="p-2 hover:bg-emerald-100 rounded-lg text-content-muted hover:text-primary">
                        <Icon name="lucide:edit-2" class="w-4 h-4" />
                      </button>
                      <button class="p-2 hover:bg-rose-100 rounded-lg text-content-muted hover:text-rose-600">
                        <Icon name="lucide:trash-2" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()

const team = ref(null)
const players = computed(() => playerStore.players)
const loading = ref(true)
const loadingPlayers = computed(() => playerStore.loading)

onMounted(async () => {
  loading.value = true
  const [teamRes] = await Promise.all([
    teamStore.fetchTeamById(route.params.id),
    playerStore.fetchPlayersByTeam(route.params.id),
  ])
  team.value = teamRes
  loading.value = false
})
</script>

<style scoped>
</style>
