<template>
  <div class="page-container p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header / Navigation -->
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/players" class="p-2 hover:bg-surface/5 rounded-xl text-content-muted hover:text-content transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Perfil del Jugador</h1>
        <div class="flex items-center gap-2 text-content-muted mt-1" v-if="player">
          <NuxtLink :to="`/teams/${player.teamId}`" class="hover:text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{{ teamName }}</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando perfil...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!player" class="glass-card p-16 text-center rounded-3xl border border-border/5">
      <Icon name="lucide:user-x" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-content mb-2">Jugador no encontrado</h3>
      <p class="text-content-muted mb-6">El jugador al que intentas acceder no existe en la base de datos.</p>
      <NuxtLink to="/players" class="btn-premium">Volver al Directorio</NuxtLink>
    </div>

    <!-- Profile View -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Izquierda: Foto y Resumen -->
      <div class="space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-border/5 text-center relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
          
          <div class="relative z-10 pt-4">
            <!-- Foto -->
            <div class="relative w-40 h-40 mx-auto mb-6">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all"></div>
              <div class="relative w-full h-full rounded-[2.5rem] bg-surface border-4 border-border shadow-2xl overflow-hidden flex items-center justify-center">
                <img v-if="player.picture" :src="player.picture" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-16 h-16 text-content-muted" />
              </div>
              <div v-if="player.number" class="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-primary text-obsidian-950 flex items-center justify-center text-xl font-black shadow-lg border-4 border-border">
                {{ player.number }}
              </div>
            </div>

            <!-- Nombres -->
            <h2 class="text-3xl font-black text-content leading-tight uppercase tracking-tighter">
              {{ player.firstName }}<br/>
              <span class="text-emerald-400">{{ player.lastName }}</span>
            </h2>

            <div class="mt-6 space-y-2">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border/5 bg-surface/2">
                <div class="w-6 h-6 rounded-lg bg-surface/5 flex items-center justify-center overflow-hidden">
                   <img v-if="teamLogo" :src="teamLogo" class="w-full h-full object-cover" />
                   <Icon v-else name="lucide:shield" class="w-3 h-3 text-primary" />
                </div>
                <span class="text-xs font-bold text-content tracking-wide">{{ teamName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Personal -->
        <div class="glass-card p-6 rounded-3xl border border-border/5">
          <h3 class="text-sm font-bold text-content-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon name="lucide:info" class="w-4 h-4 text-primary" /> Datos
          </h3>
          <ul class="space-y-4">
            <li class="flex justify-between items-center">
              <span class="text-sm text-content-muted">Edad</span>
              <span class="font-bold text-content">{{ age }}</span>
            </li>
            <li class="flex justify-between items-center">
              <span class="text-sm text-content-muted">Condición</span>
              <span :class="`px-2 py-1 flex items-center gap-1 rounded-lg text-xs font-bold ${player.isLocal ? 'bg-primary/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`">
                <span :class="`w-1.5 h-1.5 rounded-full ${player.isLocal ? 'bg-primary-hover' : 'bg-amber-400'}`"></span>
                {{ player.isLocal ? 'Local' : 'Foráneo' }}
              </span>
            </li>
            <li class="flex justify-between items-center">
              <span class="text-sm text-content-muted">Registro</span>
              <span class="font-mono text-xs text-content-muted">{{ player.dni || 'No registrado' }}</span>
            </li>
            <li v-if="suspensionStore.isPlayerSuspended(player.id)" class="flex justify-between items-center">
              <span class="text-sm text-content-muted">Estado</span>
              <span class="px-2 py-1 flex items-center gap-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                🚫 Sancionado
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Derecha: Estadísticas -->
      <div class="lg:col-span-2 space-y-6">
        <div class="glass-card p-8 rounded-3xl border border-border/5">
          <h3 class="text-xl font-bold text-content mb-6 flex items-center gap-2">
            <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-primary" /> Rendimiento en la Liga
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <div class="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">⚽</div>
                 <div class="text-4xl font-black text-content tabular-nums tracking-tighter">{{ player.stats?.goals || 0 }}</div>
                 <div class="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Goles</div>
             </div>
             <div class="p-6 rounded-[2rem] border border-yellow-500/20 bg-yellow-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">🟨</div>
                 <div class="text-4xl font-black text-content tabular-nums tracking-tighter">{{ player.stats?.yellowCards || 0 }}</div>
                 <div class="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-1">Amarillas</div>
             </div>
             <div class="p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">🟥</div>
                 <div class="text-4xl font-black text-content tabular-nums tracking-tighter">{{ player.stats?.redCards || 0 }}</div>
                 <div class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Rojas</div>
             </div>
             <div class="p-6 rounded-[2rem] border border-sky-500/20 bg-sky-500/5 text-center transition-transform hover:scale-105">
                 <div class="text-3xl mb-2">🏟️</div>
                 <div class="text-4xl font-black text-content tabular-nums tracking-tighter">{{ player.stats?.matchesPlayed || 0 }}</div>
                 <div class="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1">Partidos</div>
             </div>
          </div>

          <h4 class="text-sm font-bold text-content-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon name="lucide:history" class="w-4 h-4 text-primary" /> Historial de Partidos
          </h4>

          <div v-if="matchHistory.length" class="space-y-3">
            <div v-for="m in matchHistory" :key="m.matchId"
                 class="p-4 rounded-2xl border border-border/5 bg-surface/2 flex items-center gap-4">
              <div class="w-16 shrink-0 text-center">
                <p class="text-xs font-bold text-content-muted">{{ formatDate(m.matchDate) }}</p>
                <span v-if="m.result" class="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black"
                      :class="{
                        'bg-primary/10 text-emerald-400': m.result === 'W',
                        'bg-amber-500/10 text-amber-400': m.result === 'D',
                        'bg-rose-500/10 text-rose-400': m.result === 'L',
                      }">
                  {{ m.result === 'W' ? 'Ganó' : m.result === 'D' ? 'Empató' : 'Perdió' }}
                </span>
              </div>

              <div class="flex-1 min-w-0 flex items-center justify-center gap-3 text-sm font-bold text-content">
                <span class="truncate text-right flex-1" :class="{ 'text-emerald-400': m.isHome }">{{ m.homeTeamName }}</span>
                <span class="shrink-0 tabular-nums px-2 py-1 rounded-lg bg-surface/5">
                  {{ m.homeScore ?? '-' }} : {{ m.awayScore ?? '-' }}
                </span>
                <span class="truncate flex-1" :class="{ 'text-emerald-400': !m.isHome }">{{ m.awayTeamName }}</span>
              </div>

              <div class="flex items-center gap-2 shrink-0 text-xs text-content-muted">
                <span v-if="m.goals" class="flex items-center gap-1">⚽ {{ m.goals }}</span>
                <span v-if="m.yellowCards" class="flex items-center gap-1">🟨 {{ m.yellowCards }}</span>
                <span v-if="m.redCards" class="flex items-center gap-1">🟥 {{ m.redCards }}</span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 mt-2 rounded-3xl border border-dashed border-border/10 text-center bg-surface/2">
            <Icon name="lucide:history" class="w-10 h-10 text-content-muted mx-auto mb-3" />
            <h4 class="text-content font-bold mb-1">Sin partidos registrados</h4>
            <p class="text-xs text-content-muted">Este jugador todavía no ha participado en ningún partido.</p>
          </div>
        </div>

        <!-- Sanciones y Multas -->
        <div v-if="activeSuspension || playerFines.length" class="glass-card p-8 rounded-3xl border border-border/5">
          <h3 class="text-xl font-bold text-content mb-6 flex items-center gap-2">
            <Icon name="lucide:shield-alert" class="w-5 h-5 text-primary" /> Sanciones y Multas
          </h3>

          <div v-if="activeSuspension" class="p-5 mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-start gap-3">
            <Icon name="lucide:ban" class="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-bold text-rose-400">Sanción activa · {{ activeSuspension.matchesSuspended }} {{ activeSuspension.matchesSuspended === 1 ? 'partido' : 'partidos' }}</p>
              <p class="text-xs text-content-muted mt-1">{{ activeSuspension.reason }}</p>
            </div>
          </div>

          <div v-if="playerFines.length" class="grid grid-cols-3 gap-4">
            <div class="p-5 rounded-2xl border border-border/5 bg-surface/2 text-center">
              <div class="text-2xl font-black text-content tabular-nums">{{ playerFines.length }}</div>
              <div class="text-[10px] font-bold text-content-muted uppercase tracking-widest mt-1">Multas</div>
            </div>
            <div class="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
              <div class="text-2xl font-black text-amber-400 tabular-nums">${{ pendingFinesAmount.toFixed(2) }}</div>
              <div class="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">Pendiente</div>
            </div>
            <div class="p-5 rounded-2xl border border-primary/20 bg-primary/5 text-center">
              <div class="text-2xl font-black text-primary tabular-nums">${{ paidFinesAmount.toFixed(2) }}</div>
              <div class="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Pagado</div>
            </div>
          </div>
        </div>

        <!-- Historial de Equipos -->
        <div v-if="teamHistory.length" class="glass-card p-8 rounded-3xl border border-border/5">
          <h3 class="text-xl font-bold text-content mb-6 flex items-center gap-2">
            <Icon name="lucide:shirt" class="w-5 h-5 text-primary" /> Historial de Equipos
          </h3>

          <ul class="space-y-3">
            <li v-for="entry in teamHistory" :key="entry.id"
                class="flex items-center gap-4 p-4 rounded-2xl border"
                :class="entry.current ? 'border-primary/20 bg-primary/5' : 'border-border/5 bg-surface/2'">
              <div class="w-10 h-10 rounded-xl bg-surface/5 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="entry.teamLogo" :src="entry.teamLogo" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:shield" class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-content truncate">{{ entry.teamName }}</p>
                <p class="text-xs text-content-muted">
                  {{ formatDate(entry.startDate) }} — {{ entry.current ? 'Actualidad' : formatDate(entry.endDate) }}
                </p>
              </div>
              <span v-if="entry.current" class="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-emerald-400 shrink-0">
                Equipo Actual
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const suspensionStore = useSuspensionStore()
const fineStore = useFineStore()

const player = ref(null)
const loading = ref(true)
const playerFines = ref([])
const teamHistory = ref([])
const matchHistory = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-EC', { year: 'numeric', month: 'short' })
}

const activeSuspension = computed(() => {
  if (!player.value) return null
  return suspensionStore.suspensions.find(s => s.playerId === player.value.id && s.status === 'ACTIVE') || null
})

const pendingFinesAmount = computed(() =>
  playerFines.value
    .filter(f => f.status !== 'PAID')
    .reduce((sum, f) => sum + (f.amount || 0), 0)
)

const paidFinesAmount = computed(() =>
  playerFines.value
    .filter(f => f.status === 'PAID')
    .reduce((sum, f) => sum + (f.amount || 0), 0)
)

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
  await suspensionStore.fetchSuspensions(true)
  if (player.value) {
    playerFines.value = await fineStore.fetchFinesByPlayer(player.value.id)
    teamHistory.value = await playerStore.fetchPlayerTeamHistory(player.value.id)
    matchHistory.value = await playerStore.fetchPlayerMatchHistory(player.value.id)
  }
  loading.value = false
})
</script>

<style scoped>

</style>
