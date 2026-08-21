<template>
  <div class="page-container p-4 sm:p-8 min-h-screen text-content">
    <!-- ── PUBLIC VIEW ───────────────────────────────── -->
    <div v-if="!authStore.isLoggedIn" class="max-w-7xl mx-auto py-4">
      
      <!-- Top Branding -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-3 mb-4 px-3 py-1.5 bg-emerald-50 rounded-full text-primary border border-emerald-100 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-primary shadow-sm animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-widest">Temporada en Curso</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-content tracking-tight leading-tight drop-shadow-sm">
            La Liga <span class="text-primary">Oficial</span><br/>
            <span class="text-2xl text-content-muted font-normal tracking-wide">El portal del fútbol</span>
          </h1>
        </div>
        <div class="text-left md:text-right">
          <p class="text-sm font-semibold text-content-muted mb-1">{{ todayDate }}</p>
          <p class="text-primary text-sm flex items-center gap-2 md:justify-end font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-sm"></span> En curso
          </p>
        </div>
      </div>

      <div v-if="pageLoading" class="py-32 flex flex-col items-center justify-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin mb-4" />
        <p class="text-content-muted text-sm font-medium">Sincronizando datos...</p>
      </div>

      <!-- BENTO GRID LAYOUT -->
      <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        
        <!-- PARTIDO DESTACADO (Hero Box) -->
        <div class="md:col-span-12 lg:col-span-8 group relative z-10">
          <h2 class="text-base font-bold text-content mb-4 flex items-center gap-2 tracking-widest uppercase">
            <Icon name="lucide:flame" class="text-primary w-5 h-5" />
            Partido Destacado
          </h2>
          <div class="relative bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-8 sm:p-12 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 overflow-hidden">
            <!-- Volumetric Light Orb -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/20 transition-colors duration-500"></div>

            <div v-if="featuredMatch" class="relative z-10">
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-8">
              <!-- Home -->
              <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mb-6 drop-shadow-xl relative">
                  <div class="absolute inset-0 bg-surface-hover/50 rounded-full blur-xl"></div>
                  <img v-if="teamLogo(featuredMatch.homeTeamId)" :src="teamLogo(featuredMatch.homeTeamId)" class="w-full h-full object-contain relative z-10" />
                  <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border relative z-10"><Icon name="lucide:shield" class="w-12 h-12 text-slate-300" /></div>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-content leading-tight">{{ teamName(featuredMatch.homeTeamId) }}</h3>
              </div>

              <!-- Score -->
              <div class="flex flex-col items-center w-full sm:w-1/3 shrink-0">
                <div v-if="featuredMatch.status === 'IN_PROGRESS' || featuredMatch.status === 'FINISHED'" class="flex items-center gap-6">
                  <span class="text-7xl sm:text-9xl font-display text-content tabular-nums drop-shadow-sm">{{ featuredMatch.homeScore ?? 0 }}</span>
                  <span class="text-4xl text-primary/50 font-light">-</span>
                  <span class="text-7xl sm:text-9xl font-display text-content tabular-nums drop-shadow-sm">{{ featuredMatch.awayScore ?? 0 }}</span>
                </div>
                <div v-else class="text-center">
                  <div class="text-6xl sm:text-8xl font-display text-content tabular-nums tracking-tight drop-shadow-sm">
                    {{ formatTime(featuredMatch.matchDate) }}
                  </div>
                  <div class="text-base font-medium text-primary mt-4 tracking-widest uppercase">{{ formatDateShort(featuredMatch.matchDate) }}</div>
                </div>
                
                <div v-if="featuredMatch.status === 'IN_PROGRESS'" class="mt-8">
                  <NuxtLink :to="`/matches/${featuredMatch.id}`" 
                    class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-content font-bold text-sm hover:bg-primary transition-colors shadow-lg shadow-emerald-600/20">
                    <Icon name="lucide:play" class="w-4 h-4 fill-current" />
                    Seguir Partido
                  </NuxtLink>
                </div>
              </div>

              <!-- Away -->
              <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mb-6 drop-shadow-xl relative">
                  <div class="absolute inset-0 bg-surface-hover/50 rounded-full blur-xl"></div>
                  <img v-if="teamLogo(featuredMatch.awayTeamId)" :src="teamLogo(featuredMatch.awayTeamId)" class="w-full h-full object-contain relative z-10" />
                  <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border relative z-10"><Icon name="lucide:shield" class="w-12 h-12 text-slate-300" /></div>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-content leading-tight">{{ teamName(featuredMatch.awayTeamId) }}</h3>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-content-muted">No hay partidos destacados en este momento.</div>
          </div>
        </div>

        <!-- POSICIONES MINI -->
        <div class="md:col-span-6 lg:col-span-4 bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-6 sm:p-8 flex flex-col hover:border-primary/50 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
             <h3 class="text-base font-bold text-content flex items-center gap-2 tracking-widest uppercase">
               <Icon name="lucide:list" class="text-emerald-400 w-5 h-5" /> Posiciones
             </h3>
             <NuxtLink to="/standings" class="text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase tracking-widest">Completa</NuxtLink>
          </div>
          
          <div class="flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest w-8">#</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest">Club</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest text-right w-10">PJ</th>
                  <th class="pb-4 text-xs font-bold text-primary uppercase tracking-widest text-right">PTS</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-for="(team, index) in topTeams" :key="team.id" class="border-b border-border hover:bg-background/80 transition-colors cursor-pointer" @click="$router.push(`/teams/${team.id}`)">
                  <td class="py-4 text-content-muted font-bold" :class="index < 3 ? 'text-primary font-display text-xl' : ''">{{ index + 1 }}</td>
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <img v-if="team.logo" :src="team.logo" class="w-8 h-8 object-contain drop-shadow-md"/>
                      <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                      <span class="font-bold text-content text-base">{{ team.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-content-muted text-right font-medium">{{ team.stats?.played || 0 }}</td>
                  <td class="py-4 font-display text-2xl text-primary text-right">{{ team.points || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ÚLTIMOS RESULTADOS -->
        <div class="md:col-span-6 lg:col-span-8">
          <div class="flex items-center justify-between mb-4">
             <h2 class="text-base font-bold text-content tracking-widest uppercase">Últimos Resultados</h2>
             <NuxtLink to="/matches" class="text-sm font-bold tracking-widest uppercase text-primary flex items-center gap-1 hover:text-emerald-700">
               Ver todos <Icon name="lucide:arrow-right" class="w-4 h-4"/>
             </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="match in recentMatches" :key="match.id" 
              class="bg-surface/80 backdrop-blur-md rounded-2xl border border-border shadow-md p-5 hover:bg-surface hover:border-primary/50 transition-all cursor-pointer group" @click="$router.push('/matches')">
              <div class="text-[10px] font-bold text-content-muted mb-4 flex justify-between uppercase tracking-widest">
                <span>{{ formatDateShort(match.matchDate) }}</span>
                <span class="text-primary">Final</span>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="teamLogo(match.homeTeamId)" :src="teamLogo(match.homeTeamId)" class="w-8 h-8 object-contain drop-shadow-md"/>
                    <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                    <span class="text-base font-bold text-content group-hover:text-content transition-colors">{{ teamName(match.homeTeamId) }}</span>
                  </div>
                  <span class="text-3xl font-display text-content">{{ match.homeScore ?? 0 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="teamLogo(match.awayTeamId)" :src="teamLogo(match.awayTeamId)" class="w-8 h-8 object-contain drop-shadow-md"/>
                    <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                    <span class="text-base font-bold text-content group-hover:text-content transition-colors">{{ teamName(match.awayTeamId) }}</span>
                  </div>
                  <span class="text-3xl font-display text-content">{{ match.awayScore ?? 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GOLEADORES -->
        <div class="md:col-span-12 lg:col-span-4 bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300">
          <h3 class="text-base font-bold text-content mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Icon name="lucide:crosshair" class="text-primary w-5 h-5" /> Goleadores
          </h3>
          <div class="space-y-2">
            <NuxtLink v-for="(player, index) in topScorers" :key="player.id" :to="`/players/${player.id}`"
              class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-background/80 transition-colors group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border overflow-hidden">
                  <img v-if="player.picture" :src="player.picture" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:user" class="w-5 h-5 text-content-muted group-hover:text-content-muted transition-colors" />
                </div>
                <div>
                  <h4 class="font-bold text-content text-sm group-hover:text-primary transition-colors">{{ player.firstName }} {{ player.lastName }}</h4>
                  <p class="text-xs font-medium text-content-muted">{{ teamName(player.teamId) }}</p>
                </div>
              </div>
              <div class="text-3xl font-display text-primary">
                {{ player.stats?.goals || 0 }}
              </div>
            </NuxtLink>
            <div v-if="topScorers.length === 0" class="text-content-muted text-sm py-4 text-center">No hay datos disponibles</div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- ── ADMIN VIEW ────────────────────────────────── -->
    <div v-else class="max-w-7xl mx-auto py-8">
      <!-- Welcome Section -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-content mb-2">
          Hola de nuevo, <span class="text-primary">{{ authStore.user?.email?.split('@')[0] || 'Admin' }}</span>
        </h1>
        <p class="text-content-muted">Resumen administrativo de la liga.</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="kpi in kpis" :key="kpi.label" 
          class="bg-surface p-6 sm:p-8 rounded-[2rem] border border-border shadow-md flex flex-col gap-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border text-primary shrink-0">
            <Icon :name="kpi.icon" class="text-2xl" />
          </div>
          <div>
            <h3 class="text-4xl font-display text-content tracking-wider">
              <span v-if="dashboardStore.loading" class="inline-block w-8 h-8 rounded bg-surface-hover animate-pulse"></span>
              <span v-else>{{ dashboardStore.stats[kpi.key] }}</span>
            </h3>
            <p class="text-[10px] font-bold text-content-muted mt-2 uppercase tracking-widest">{{ kpi.label }}</p>
          </div>
        </div>
      </div>

      <!-- Main Modules Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Management -->
        <div class="lg:col-span-2 bg-surface rounded-[2rem] border border-border shadow-md p-8">
          <div class="mb-8 flex items-center justify-between">
            <h2 class="text-base font-bold text-content uppercase tracking-widest flex items-center gap-2">
              <Icon name="lucide:zap" class="text-primary w-5 h-5" />
              Accesos Rápidos
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink v-for="mod in quickModules" :key="mod.label" :to="mod.link"
              class="p-6 rounded-[1.5rem] bg-background hover:bg-emerald-50 transition-colors flex items-start gap-4 border border-border hover:border-emerald-100 group">
              <div class="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm group-hover:scale-110 transition-transform shrink-0">
                <Icon :name="mod.icon" class="text-primary text-xl" />
              </div>
              <div>
                <h3 class="font-bold text-content text-sm mb-1 group-hover:text-emerald-700 transition-colors">{{ mod.label }}</h3>
                <p class="text-xs text-content-muted">{{ mod.desc }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-surface rounded-[2rem] border border-border shadow-md p-8">
          <h2 class="text-base font-bold text-content flex items-center gap-2 mb-8 uppercase tracking-widest">
            <Icon name="lucide:activity" class="text-primary w-5 h-5" />
            Estado del Sistema
          </h2>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-content-muted uppercase tracking-widest">Base de Datos</span>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary shadow-sm animate-pulse"></span>
                <span class="text-xs font-bold text-content uppercase tracking-widest">Online</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-content-muted uppercase tracking-widest">API Backend</span>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                <span class="text-xs font-bold text-content uppercase tracking-widest">Conectado</span>
              </div>
            </div>
          </div>
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
  { label: 'Opciones', desc: 'Ajustes del sistema', icon: 'lucide:settings', link: '/settings' },
  { label: 'Estadísticas', icon: 'lucide:bar-chart-3', desc: 'Goleadores y posiciones', link: '/standings' },
]

onMounted(async () => {
  pageLoading.value = true
  if (authStore.isLoggedIn) {
     await dashboardStore.fetchSummary()
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
