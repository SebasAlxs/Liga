<template>
  <div class="page-container p-6 max-w-7xl mx-auto">
    <!-- Header / Navigation -->
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/teams" class="p-2 hover:bg-white/5 rounded-xl text-obsidian-400 hover:text-white transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-white font-display">Detalle del Equipo</h1>
        <div class="flex items-center gap-2 text-obsidian-400 mt-1">
          <NuxtLink to="/teams" class="hover:text-emerald-400">Equipos</NuxtLink>
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
          <span class="text-emerald-500 font-medium">{{ team?.name || 'Cargando...' }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>

    <div v-else-if="!team" class="text-center py-20 bg-obsidian-900/50 rounded-3xl border border-white/5">
      <Icon name="lucide:search-x" class="w-16 h-16 text-obsidian-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white">Equipo no encontrado</h3>
      <p class="text-obsidian-400 mt-2">El club que buscas no existe o ha sido eliminado.</p>
      <NuxtLink to="/teams" class="mt-6 inline-flex items-center gap-2 bg-emerald-500 text-obsidian-950 px-6 py-2 rounded-xl font-bold">
        Volver a la lista
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar Info -->
      <div class="space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
          
          <div class="relative z-10">
            <div class="w-32 h-32 rounded-3xl bg-obsidian-800 border-2 border-white/10 mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-2xl">
              <img v-if="team.logo" :src="team.logo" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-20 h-20 text-emerald-500/50" />
            </div>
            
            <h2 class="text-2xl font-bold text-white mb-2">{{ team.name }}</h2>
            <p class="text-obsidian-400 text-sm font-medium">Fundado en {{ team.foundedYear || 'N/A' }}</p>
            
            <div class="flex justify-center gap-4 mt-8">
              <div class="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                <div class="text-[10px] text-obsidian-500 uppercase font-bold tracking-wider">Títulos</div>
                <div class="text-xl font-bold text-emerald-500">{{ team.championshipsWon || 0 }}</div>
              </div>
              <div class="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                <div class="text-[10px] text-obsidian-500 uppercase font-bold tracking-wider">Puntos</div>
                <div class="text-xl font-bold text-emerald-500">{{ team.points || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-white/5">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="lucide:info" class="w-5 h-5 text-emerald-500" />
            Estadísticas de Temporada
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between p-3 bg-white/2 rounded-xl">
              <span class="text-obsidian-400">Partidos Jugados</span>
              <span class="text-white font-bold">{{ team.matchesPlayed }}</span>
            </div>
            <div class="flex justify-between p-3 bg-white/2 rounded-xl">
              <span class="text-obsidian-400">Victorias</span>
              <span class="text-emerald-400 font-bold">{{ team.matchesWon }}</span>
            </div>
            <div class="flex justify-between p-3 bg-white/2 rounded-xl">
              <span class="text-obsidian-400">Empates</span>
              <span class="text-obsidian-300 font-bold">{{ team.matchesDrawn }}</span>
            </div>
            <div class="flex justify-between p-3 bg-white/2 rounded-xl">
              <span class="text-obsidian-400">Derrotas</span>
              <span class="text-rose-400 font-bold">{{ team.matchesLost }}</span>
            </div>
            <div class="flex justify-between p-3 bg-white/2 rounded-xl transition-colors hover:bg-emerald-500/10">
              <span class="text-obsidian-400">Goles a Favor</span>
              <span class="text-emerald-500 font-bold">{{ team.goalsFor }}</span>
            </div>
            <div class="flex justify-between p-3 bg-white/2 rounded-xl transition-colors hover:bg-rose-500/10">
              <span class="text-obsidian-400">Goles en Contra</span>
              <span class="text-rose-500 font-bold">{{ team.goalsAgainst }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content / Roster -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-white/5 min-h-[500px]">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-white flex items-center gap-3">
              <Icon name="lucide:users" class="w-6 h-6 text-emerald-500" />
              Plantilla de Jugadores
            </h3>
            <button v-if="authStore.isAdmin" class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-obsidian-950 px-4 py-2 rounded-xl font-bold transition-all">
              <Icon name="lucide:user-plus" class="w-5 h-5" />
              Inscribir Jugador
            </button>
          </div>

          <!-- Players Table Placeholder -->
          <div v-if="loadingPlayers" class="flex justify-center py-12">
            <Icon name="lucide:loader-2" class="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
          
          <div v-else-if="players.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-20 h-20 bg-obsidian-800 rounded-full flex items-center justify-center mb-4">
              <Icon name="lucide:user-x" class="w-10 h-10 text-obsidian-600" />
            </div>
            <h4 class="text-lg font-semibold text-white">No hay jugadores inscritos</h4>
            <p class="text-obsidian-400 mt-1 max-w-xs">Registra a los jugadores que forman parte de este club para llevar el control de goles y tarjetas.</p>
          </div>

          <div v-else class="overflow-x-auto">
             <!-- Future table implementation -->
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

const team = ref(null)
const players = ref([])
const loading = ref(true)
const loadingPlayers = ref(false)

onMounted(async () => {
  loading.value = true
  team.value = await teamStore.fetchTeamById(route.params.id)
  loading.value = false
  
  // Logic to fetch players can be added here once playerStore is ready
})
</script>

<style scoped>
.glass-card {
  background: rgba(14, 20, 27, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
