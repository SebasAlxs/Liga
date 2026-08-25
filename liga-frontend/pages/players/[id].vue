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
          
          <div class="grid grid-cols-3 gap-4 mb-8">
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
          </div>

          <!-- TODO: datos quemados temporalmente en el front, pendiente de conectar al backend.
               Agrupados por categoría para poder quitar/ajustar campos según feedback. -->
          <div class="space-y-6">
            <div v-for="group in statGroups" :key="group.title">
              <h4 class="text-xs font-bold text-content-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon :name="group.icon" class="w-4 h-4 text-primary" /> {{ group.title }}
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  v-for="stat in group.stats"
                  :key="stat.label"
                  class="p-4 rounded-2xl border border-border/5 bg-surface/2 text-center"
                >
                  <div class="text-2xl font-black text-content tabular-nums tracking-tighter">{{ stat.value }}</div>
                  <div class="text-[10px] font-bold text-content-muted uppercase tracking-widest mt-1">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actividad Reciente -> Podriamos en el futuro mostrar historial de partidos, pero por ahora mostramos un mensaje placeholder elegante -->
          <div class="p-8 mt-6 rounded-3xl border border-dashed border-border/10 text-center bg-surface/2">
            <Icon name="lucide:history" class="w-10 h-10 text-content-muted mx-auto mb-3" />
            <h4 class="text-content font-bold mb-1">Historial de Partidos</h4>
            <p class="text-xs text-content-muted">Pronto podrás ver el detalle de los partidos donde el jugador ha participado.</p>
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
const suspensionStore = useSuspensionStore()

const player = ref(null)
const loading = ref(true)

// Datos quemados temporalmente para maquetar la vista. Reemplazar por player.stats?.x cuando el backend los provea.
const statGroups = computed(() => [
  {
    title: 'General',
    icon: 'lucide:activity',
    stats: [
      { label: 'Partidos Jugados', value: 12 },
      { label: 'Titularidades', value: 9 },
      { label: 'Minutos Jugados', value: 810 }
    ]
  },
  {
    title: 'Ataque',
    icon: 'lucide:target',
    stats: [
      { label: 'Goles', value: player.value?.stats?.goals || 0 },
      { label: 'Asistencias', value: 3 },
      { label: 'Tiros', value: 21 },
      { label: 'Tiros a Puerta', value: 11 }
    ]
  },
  {
    title: 'Pases',
    icon: 'lucide:arrow-right-left',
    stats: [
      { label: 'Pases Completados', value: 254 },
      { label: '% Precisión', value: '82%' }
    ]
  },
  {
    title: 'Defensa',
    icon: 'lucide:shield',
    stats: [
      { label: 'Duelos Ganados', value: 34 },
      { label: 'Intercepciones', value: 14 },
      { label: 'Recuperaciones', value: 22 },
      { label: 'Balones Perdidos', value: 18 }
    ]
  },
  {
    title: 'Disciplina',
    icon: 'lucide:flag',
    stats: [
      { label: 'Faltas Cometidas', value: 7 },
      { label: 'Faltas Recibidas', value: 10 },
      { label: 'Amarillas', value: player.value?.stats?.yellowCards || 0 },
      { label: 'Rojas', value: player.value?.stats?.redCards || 0 }
    ]
  }
])

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
  loading.value = false
})
</script>

<style scoped>

</style>
