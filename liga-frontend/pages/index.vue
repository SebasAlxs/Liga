<template>
  <div class="page-container p-6">
    <!-- ── PUBLIC VIEW: DIARIO DEPORTIVO ───────────────────────────────── -->
    <div v-if="!authStore.isLoggedIn" class="animate-fade-in max-w-7xl mx-auto py-6">
      
      <!-- Top Branding -->
      <div class="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Icon name="lucide:trophy" class="text-3xl text-obsidian-950" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase font-display leading-none">
              La Liga <span class="text-emerald-500">Oficial</span>
            </h1>
            <p class="text-xs text-obsidian-400 font-bold uppercase tracking-widest mt-1">El portal del fútbol</p>
          </div>
        </div>
        <div class="text-right hidden sm:block">
          <div class="text-xs font-bold text-obsidian-500 uppercase tracking-widest">{{ todayDate }}</div>
          <div class="text-[10px] text-emerald-500 font-bold uppercase mt-1 flex items-center justify-end gap-1">
             <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             Temporada en curso
          </div>
        </div>
      </div>

      <div v-if="pageLoading" class="py-20 flex flex-col items-center justify-center">
        <Icon name="lucide:loader-2" class="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p class="text-obsidian-500 font-bold uppercase tracking-widest text-xs">Cargando datos deportivos...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- MAIN CONTENT (Left 8 cols) -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- PARTIDO DESTACADO -->
          <section v-if="featuredMatch">
            <div class="flex items-center justify-between mb-4">
               <h2 class="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                 <Icon name="lucide:flame" class="text-emerald-500" />
                 {{ featuredMatch.status === 'IN_PROGRESS' ? 'En Vivo' : 'Partido Destacado' }}
               </h2>
            </div>
            
            <div class="relative rounded-[2.5rem] overflow-hidden bg-obsidian-900 border border-white/5 group">
              <!-- Background abstract -->
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              
              <div class="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <!-- Home Team -->
                <div class="flex flex-col items-center text-center w-full md:w-1/3">
                  <div class="w-24 h-24 sm:w-32 sm:h-32 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
                    <img v-if="teamLogo(featuredMatch.homeTeamId)" :src="teamLogo(featuredMatch.homeTeamId)" class="w-full h-full object-contain" />
                    <Icon v-else name="lucide:shield" class="w-full h-full text-obsidian-700" />
                  </div>
                  <h3 class="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-tight">{{ teamName(featuredMatch.homeTeamId) }}</h3>
                </div>

                <!-- Score / Time -->
                <div class="flex flex-col items-center w-full md:w-1/3 shrink-0">
                  <div v-if="featuredMatch.status === 'IN_PROGRESS' || featuredMatch.status === 'FINISHED'" class="flex items-center gap-4 py-4 px-6 rounded-3xl bg-obsidian-950/50 backdrop-blur-md border border-white/5">
                    <span class="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tighter">{{ featuredMatch.homeScore ?? 0 }}</span>
                    <span class="text-2xl text-obsidian-600 font-bold">-</span>
                    <span class="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tighter">{{ featuredMatch.awayScore ?? 0 }}</span>
                  </div>
                  <div v-else class="text-center">
                    <div class="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter bg-obsidian-950/50 px-6 py-4 rounded-3xl border border-white/5 inline-block">
                      {{ formatTime(featuredMatch.matchDate) }}
                    </div>
                  </div>
                  
                  <div class="mt-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2"
                       :class="featuredMatch.status === 'IN_PROGRESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-obsidian-400 border border-white/10'">
                    <span v-if="featuredMatch.status === 'IN_PROGRESS'" class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {{ statusText(featuredMatch.status) }}
                  </div>
                  <div class="text-xs text-obsidian-500 mt-2 font-bold">{{ formatDateShort(featuredMatch.matchDate) }}</div>
                </div>

                <!-- Away Team -->
                <div class="flex flex-col items-center text-center w-full md:w-1/3">
                  <div class="w-24 h-24 sm:w-32 sm:h-32 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
                    <img v-if="teamLogo(featuredMatch.awayTeamId)" :src="teamLogo(featuredMatch.awayTeamId)" class="w-full h-full object-contain" />
                    <Icon v-else name="lucide:shield" class="w-full h-full text-obsidian-700" />
                  </div>
                  <h3 class="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-tight">{{ teamName(featuredMatch.awayTeamId) }}</h3>
                </div>
              </div>
            </div>
          </section>

          <!-- RESULTADOS RECIENTES -->
          <section v-if="recentMatches.length">
            <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
               <h2 class="text-lg font-black text-white uppercase tracking-widest text-obsidian-300">
                 Últimos Resultados
               </h2>
               <NuxtLink to="/matches" class="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-1">Ver todos <Icon name="lucide:arrow-right" class="w-3 h-3" /></NuxtLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="match in recentMatches" :key="match.id" class="glass-card p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group cursor-default">
                <div class="flex justify-between items-center text-[10px] uppercase font-bold text-obsidian-500 tracking-wider mb-3">
                  <span>{{ formatDateShort(match.matchDate) }}</span>
                  <span class="text-emerald-500/50">Final</span>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-md bg-white/5 overflow-hidden flex items-center justify-center p-0.5"><img v-if="teamLogo(match.homeTeamId)" :src="teamLogo(match.homeTeamId)" class="w-full h-full object-contain"/><Icon v-else name="lucide:shield" class="w-3 h-3 text-emerald-500/50" /></div>
                      <span class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{{ teamName(match.homeTeamId) }}</span>
                    </div>
                    <span class="text-lg font-black text-white tabular-nums">{{ match.homeScore ?? 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-md bg-white/5 overflow-hidden flex items-center justify-center p-0.5"><img v-if="teamLogo(match.awayTeamId)" :src="teamLogo(match.awayTeamId)" class="w-full h-full object-contain"/><Icon v-else name="lucide:shield" class="w-3 h-3 text-emerald-500/50" /></div>
                      <span class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{{ teamName(match.awayTeamId) }}</span>
                    </div>
                    <span class="text-lg font-black text-white tabular-nums">{{ match.awayScore ?? 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- SIDEBAR (Right 4 cols) -->
        <div class="lg:col-span-4 space-y-8">
          
          <!-- TABLA DE POSICIONES MINI -->
          <div class="glass-card p-6 rounded-3xl border border-white/5">
            <div class="flex items-center justify-between mb-5">
               <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Icon name="lucide:list-ordered" class="text-emerald-500" /> Posiciones
               </h3>
               <NuxtLink to="/standings" class="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">Completa</NuxtLink>
            </div>
            
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="pb-2 text-[10px] uppercase font-bold text-obsidian-500 w-6">#</th>
                  <th class="pb-2 text-[10px] uppercase font-bold text-obsidian-500">Club</th>
                  <th class="pb-2 text-[10px] uppercase font-bold text-obsidian-500 text-center w-8">PJ</th>
                  <th class="pb-2 text-[10px] uppercase font-bold text-emerald-500 text-center w-8">PTS</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-for="(team, idx) in topTeams" :key="team.id" class="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group">
                  <td class="py-3 text-[10px] font-black text-obsidian-500">{{ idx + 1 }}</td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 rounded overflow-hidden flex items-center justify-center p-0.5"><img v-if="team.logo" :src="team.logo" class="w-full h-full object-contain"/><Icon v-else name="lucide:shield" class="w-3 h-3 text-obsidian-600" /></div>
                      <span class="font-bold text-white group-hover:text-emerald-400 truncate max-w-[120px]">{{ team.name }}</span>
                    </div>
                  </td>
                  <td class="py-3 text-center text-obsidian-400 font-mono">{{ team.matchesPlayed || 0 }}</td>
                  <td class="py-3 text-center font-black text-emerald-400 font-mono">{{ team.points || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TOP GOLEADORES -->
          <div class="glass-card p-6 rounded-3xl border border-white/5">
            <h3 class="text-sm font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <Icon name="lucide:crosshair" class="text-rose-500" /> Goleadores
            </h3>
            
            <div class="space-y-4">
              <NuxtLink v-for="(player, idx) in topScorers" :key="player.id" :to="`/players/${player.id}`" 
                class="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all">
                <div class="flex items-center gap-3">
                  <div class="text-[10px] font-black text-obsidian-500 w-3">{{ idx + 1 }}</div>
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
                    <img v-if="player.picture" :src="player.picture.startsWith('data:') ? player.picture : `data:image/jpeg;base64,${player.picture}`" class="w-full h-full object-cover" />
                    <Icon v-else name="lucide:user" class="w-4 h-4 text-obsidian-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-sm leading-none mb-1 group-hover:text-emerald-400 transition-colors">{{ player.firstName }} {{ player.lastName }}</h4>
                    <p class="text-[10px] text-obsidian-500 uppercase tracking-widest font-bold">{{ teamName(player.teamId) }}</p>
                  </div>
                </div>
                <div class="text-xl font-black text-white tabular-nums shrink-0">
                  {{ player.stats?.goals || 0 }}<span class="text-[10px] text-obsidian-600 ml-0.5">⚽</span>
                </div>
              </NuxtLink>

              <div v-if="!topScorers.length" class="text-center py-4 text-xs font-bold text-obsidian-600 uppercase tracking-widest">
                No hay datos disp.
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- ── ADMIN VIEW ────────────────────────────────── -->
    <div v-else class="animate-fade-in">
      <!-- Welcome Section -->
      <div class="mb-10 animate-fade-in">
        <h1 class="text-4xl font-black text-white tracking-tight font-display mb-2">
          Bienvenido, <span class="text-emerald-500">{{ authStore.user?.email?.split('@')[0] || 'Admin' }}</span>
        </h1>
        <p class="text-obsidian-400 font-medium">Aquí tienes el resumen de tu liga hoy.</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div v-for="kpi in kpis" :key="kpi.label" 
          class="glass-card p-4 sm:p-6 rounded-[2rem] border border-white/5 group relative overflow-hidden active-pop">
          <div class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon :name="kpi.icon" class="text-5xl text-emerald-500" />
          </div>
          
          <div class="flex flex-col gap-3">
            <div :class="`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg text-obsidian-950` ">
              <Icon :name="kpi.icon" class="text-xl sm:text-2xl" />
            </div>
            <div>
              <p class="text-[10px] sm:text-xs font-bold text-obsidian-500 uppercase tracking-widest">{{ kpi.label }}</p>
              <h3 class="text-2xl sm:text-3xl font-black text-white tabular-nums">
                <span v-if="dashboardStore.loading" class="inline-block w-8 h-8 rounded bg-white/5 animate-pulse"></span>
                <span v-else>{{ dashboardStore.stats[kpi.key] }}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Modules Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quick Management -->
        <div class="lg:col-span-2 space-y-8">
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Icon name="lucide:zap" class="text-emerald-500" />
                Gestión Rápida
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink v-for="mod in quickModules" :key="mod.label" :to="mod.link"
                class="glass-card p-5 rounded-[2rem] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group flex items-center gap-4 active-pop">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-obsidian-950 transition-all text-slate-400">
                  <Icon :name="mod.icon" class="text-2xl" />
                </div>
                <div>
                  <h4 class="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{{ mod.label }}</h4>
                  <p class="text-xs text-obsidian-500">{{ mod.desc }}</p>
                </div>
              </NuxtLink>
            </div>
          </section>

          <!-- Recent Activity Placeholder -->
          <section>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="lucide:history" class="text-emerald-500" />
              Actividad Reciente
            </h2>
            <div class="glass-card rounded-[2.5rem] border border-white/5 divide-y divide-white/5 overflow-hidden">
              <div v-for="i in 3" :key="i" class="p-6 hover:bg-emerald-500/5 transition-colors flex items-center gap-4 group">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-obsidian-950 transition-all">
                  <Icon name="lucide:check-circle-2" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-white truncate">Nuevo resultado registrado</p>
                  <p class="text-xs text-obsidian-500 truncate">Real Madrid 2 - 1 FC Barcelona • Torneo Apertura</p>
                </div>
                <span class="text-[10px] text-obsidian-600 font-bold uppercase tracking-widest whitespace-nowrap">2h ago</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Side Panel: Stats/Live -->
        <div class="space-y-8">
          <section>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="lucide:shield" class="text-emerald-500" />
              Próximos Partidos
            </h2>
            <div class="space-y-4">
              <div v-for="j in 3" :key="j" class="glass-card p-5 rounded-[2rem] border border-white/5 active-pop">
                <div class="flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-600">
                  <span>Cancha 1</span>
                  <span class="text-emerald-500 px-2 py-0.5 rounded-lg bg-emerald-500/10">18:00</span>
                </div>
                <div class="flex items-center justify-center gap-6 py-2">
                  <div class="text-center w-20">
                    <div class="w-12 h-12 bg-white/5 rounded-2xl mb-2 mx-auto flex items-center justify-center border border-white/5">
                       <Icon name="lucide:shield" class="text-obsidian-700" />
                    </div>
                    <span class="text-[10px] font-black text-white uppercase tracking-tighter truncate block w-full">EQU A</span>
                  </div>
                  <span class="text-xs font-black text-emerald-500/40 italic">VS</span>
                  <div class="text-center w-20">
                    <div class="w-12 h-12 bg-white/5 rounded-2xl mb-2 mx-auto flex items-center justify-center border border-white/5">
                       <Icon name="lucide:shield" class="text-obsidian-700" />
                    </div>
                    <span class="text-[10px] font-black text-white uppercase tracking-tighter truncate block w-full">EQU B</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const matchStore = useMatchStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()

const pageLoading = ref(true)

// Public Dashboard Computed
const featuredMatch = computed(() => {
  const inProgress = matchStore.matches.find(m => m.status === 'IN_PROGRESS')
  if (inProgress) return inProgress
  
  const scheduledList = matchStore.matches.filter(m => m.status === 'SCHEDULED')
  if (scheduledList.length) {
    // Return earliest scheduled
    return scheduledList.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())[0]
  }
  return null
})

const recentMatches = computed(() => {
  return matchStore.matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
    .slice(0, 4)
})

const topTeams = computed(() => {
  return [...teamStore.teams]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5)
})

const topScorers = computed(() => {
  return [...playerStore.players]
    .filter(p => p.stats?.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 5)
})

// Helpers
const todayDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

function teamName(id) {
  const t = teamStore.teams.find(x => x.id === id)
  return t ? t.name : 'Unknown'
}

function teamLogo(id) {
  const t = teamStore.teams.find(x => x.id === id)
  return t ? t.logo : null
}

function formatTime(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function statusText(status) {
  const map = { SCHEDULED: 'Programado', IN_PROGRESS: 'En Vivo', FINISHED: 'Finalizado', CANCELLED: 'Suspendido' }
  return map[status] || status
}

// Admin Dashboard Data
const kpis = [
  { label: 'Sedes', icon: 'lucide:map-pin', key: 'venues', color: 'from-emerald-400 to-emerald-600' },
  { label: 'Torneos', icon: 'lucide:trophy', key: 'tournaments', color: 'from-blue-400 to-blue-600' },
  { label: 'Equipos', icon: 'lucide:shield', key: 'teams', color: 'from-purple-400 to-purple-600' },
  { label: 'Jugadores', icon: 'lucide:users', key: 'players', color: 'from-orange-400 to-orange-600' },
]

const quickModules = [
  { label: 'Hojas de Vocalía', icon: 'lucide:clipboard-list', desc: 'Gestionar planillas en vivo', link: '/vocalia' },
  { label: 'Programación', icon: 'lucide:calendar-clock', desc: 'Asignar horarios y canchas', link: '/matches' },
  { label: 'Reglamentos', icon: 'lucide:file-text', desc: 'Control de suspensiones', link: '/settings' },
  { label: 'Estadísticas', icon: 'lucide:bar-chart-3', desc: 'Goleadores y posiciones', link: '/standings' },
]

onMounted(async () => {
  pageLoading.value = true
  if (authStore.isLoggedIn) {
     dashboardStore.fetchSummary()
  } else {
     await Promise.all([
       matchStore.fetchMatches(),
       teamStore.fetchTeams(),
       playerStore.fetchPlayers()
     ])
  }
  pageLoading.value = false
})
</script>

<style scoped>
.glass-card {
  background: rgba(14, 20, 27, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
