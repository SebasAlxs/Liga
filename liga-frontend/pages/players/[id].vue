<template>
  <div class="page-container p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header / Navigation -->
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/players" class="p-2 hover:bg-white/5 rounded-xl text-obsidian-400 hover:text-white transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-white font-display">Perfil del Jugador</h1>
        <div class="flex items-center gap-2 text-obsidian-400 mt-1" v-if="player">
          <NuxtLink :to="`/teams/${player.teamId}`" class="hover:text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{{ teamName }}</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p class="text-obsidian-400 animate-pulse">Cargando perfil...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!player" class="glass-card p-16 text-center rounded-3xl border border-white/5">
      <Icon name="lucide:user-x" class="w-16 h-16 text-obsidian-600 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Jugador no encontrado</h3>
      <p class="text-obsidian-400 mb-6">El jugador al que intentas acceder no existe en la base de datos.</p>
      <NuxtLink to="/players" class="btn-premium">Volver al Directorio</NuxtLink>
    </div>

    <!-- Profile View -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Izquierda: Foto y Resumen -->
      <div class="space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
          
          <div class="relative z-10 pt-4">
            <!-- Foto -->
            <div class="relative w-40 h-40 mx-auto mb-6">
              <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
              <div class="relative w-full h-full rounded-[2.5rem] bg-obsidian-900 border-4 border-obsidian-950 shadow-2xl overflow-hidden flex items-center justify-center">
                <img v-if="player.picture" :src="player.picture.startsWith('data:') ? player.picture : `data:image/jpeg;base64,${player.picture}`" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-16 h-16 text-obsidian-600" />
              </div>
              <div v-if="player.number" class="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-emerald-500 text-obsidian-950 flex items-center justify-center text-xl font-black shadow-lg border-4 border-obsidian-950">
                {{ player.number }}
              </div>
            </div>

            <!-- Nombres -->
            <h2 class="text-3xl font-black text-white leading-tight uppercase tracking-tighter">
              {{ player.firstName }}<br/>
              <span class="text-emerald-400">{{ player.lastName }}</span>
            </h2>

            <div class="mt-6 space-y-2">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/5 bg-white/2">
                <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                   <img v-if="teamLogo" :src="teamLogo" class="w-full h-full object-cover" />
                   <Icon v-else name="lucide:shield" class="w-3 h-3 text-emerald-500" />
                </div>
                <span class="text-xs font-bold text-white tracking-wide">{{ teamName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Personal -->
        <div class="glass-card p-6 rounded-3xl border border-white/5">
          <h3 class="text-sm font-bold text-obsidian-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon name="lucide:info" class="w-4 h-4 text-emerald-500" /> Datos
          </h3>
          <ul class="space-y-4">
            <li class="flex justify-between items-center">
              <span class="text-sm text-obsidian-500">Edad</span>
              <span class="font-bold text-white">{{ age }}</span>
            </li>
            <li class="flex justify-between items-center">
              <span class="text-sm text-obsidian-500">Condición</span>
              <span :class="`px-2 py-1 flex items-center gap-1 rounded-lg text-xs font-bold ${player.isLocal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`">
                <span :class="`w-1.5 h-1.5 rounded-full ${player.isLocal ? 'bg-emerald-400' : 'bg-amber-400'}`"></span>
                {{ player.isLocal ? 'Local' : 'Foráneo' }}
              </span>
            </li>
            <li class="flex justify-between items-center">
              <span class="text-sm text-obsidian-500">Registro</span>
              <span class="font-mono text-xs text-obsidian-300">{{ player.dni || 'No registrado' }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Derecha: Estadísticas -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-white/5">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-emerald-500" /> Rendimiento en la Liga
          </h3>
          
          <div class="grid grid-cols-3 gap-4 mb-8">
             <div class="p-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">⚽</div>
                 <div class="text-4xl font-black text-white tabular-nums tracking-tighter">{{ player.stats?.goals || 0 }}</div>
                 <div class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Goles</div>
             </div>
             <div class="p-6 rounded-[2rem] border border-yellow-500/20 bg-yellow-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">🟨</div>
                 <div class="text-4xl font-black text-white tabular-nums tracking-tighter">{{ player.stats?.yellowCards || 0 }}</div>
                 <div class="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-1">Amarillas</div>
             </div>
             <div class="p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">🟥</div>
                 <div class="text-4xl font-black text-white tabular-nums tracking-tighter">{{ player.stats?.redCards || 0 }}</div>
                 <div class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Rojas</div>
             </div>
          </div>

          <!-- Actividad Reciente -> Podriamos en el futuro mostrar historial de partidos, pero por ahora mostramos un mensaje placeholder elegante -->
          <div class="p-8 rounded-3xl border border-dashed border-white/10 text-center bg-white/2">
            <Icon name="lucide:history" class="w-10 h-10 text-obsidian-700 mx-auto mb-3" />
            <h4 class="text-white font-bold mb-1">Historial de Partidos</h4>
            <p class="text-xs text-obsidian-500">Pronto podrás ver el detalle de los partidos donde el jugador ha participado.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()

const player = ref(null)
const loading = ref(true)

const teamName = computed(() => {
  if (!player.value) return '—'
  const t = teamStore.teams.find(x => x.id === player.value.teamId)
  return t ? t.name : 'Agente Libre'
})

const teamLogo = computed(() => {
  if (!player.value) return null
  const t = teamStore.teams.find(x => x.id === player.value.teamId)
  return t ? t.logo : null
})

const age = computed(() => {
  if (!player.value || !player.value.birthDate) return '?'
  const today = new Date()
  const bd = new Date(player.value.birthDate)
  let a = today.getFullYear() - bd.getFullYear()
  const m = today.getMonth() - bd.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--
  return `${a} años`
})

onMounted(async () => {
  loading.value = true
  // Ensure teams are loaded for team name
  if (!teamStore.teams.length) {
    await teamStore.fetchTeams()
  }
  
  // Fetch player directly
  player.value = await playerStore.fetchPlayerById(route.params.id)
  loading.value = false
})
</script>

<style scoped>
.glass-card {
  background: rgba(14, 20, 27, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
