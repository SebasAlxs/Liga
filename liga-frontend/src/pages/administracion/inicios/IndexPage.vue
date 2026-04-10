<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLeagueStore } from 'src/stores/league'

const $q = useQuasar()
const router = useRouter()
const leagueStore = useLeagueStore()

const stats = computed(() => leagueStore.dashboardStats)
const goalsData = computed(() => leagueStore.goalsChartData)

// Function to generate SVG path for the goals chart
const generateChartPath = (data, isArea = false) => {
  if (!data || data.length === 0) return ''

  const width = 265 // 290 - 25
  const height = 160 // 180 - 20
  const maxGoal = Math.max(...data, 80) // Scale to max goal or 80
  const stepX = width / (data.length - 1)

  let path = `M 25 ${180 - (data[0] / maxGoal) * height}`

  for (let i = 1; i < data.length; i++) {
    const x = 25 + i * stepX
    const y = 180 - (data[i] / maxGoal) * height
    // Using simple line for now, or could use bezier for smoothness like the original
    path += ` L ${x} ${y}`
  }

  if (isArea) {
    path += ` L 290 180 L 25 180 Z`
  }

  return path
}

const areaPath = computed(() => generateChartPath(goalsData.value, true))
const linePath = computed(() => generateChartPath(goalsData.value, false))

const topTeams = computed(() => leagueStore.filteredStandings.slice(0, 5))
const topScorers = computed(() => leagueStore.topScorers)

const actions = [
  { title: 'Ver Partidos', desc: 'Resultados y fechas', icon: 'las la-calendar', color: 'emerald', link: 'matches' },
  { title: 'Tabla General', desc: 'Posiciones actuales', icon: 'las la-trophy', color: 'blue', link: 'admin' },
  { title: 'Nuevos Equipos', desc: 'Gestionar inscripciones', icon: 'las la-plus-circle', color: 'indigo', link: 'groups' },
  { title: 'Configuración', desc: 'Ajustes del sistema', icon: 'las la-cog', color: 'slate', link: 'admin-dashboard' }
]

onMounted(() => {
  leagueStore.fetchLeagueData()
})

const goToFormInicio = () => {
  router.push({ name: 'formulario' })
}

const goToFormInicios = () => {
  router.push({ name: 'jobcard' })
}
</script>

<template>
  <q-page class="bg-slate-50 no-scroll" style="min-height: 100vh;">
    <!-- Immersive Hero Section -->
    <div class="hero-section relative-position q-pb-xl overflow-hidden">
      <!-- Mesh Gradient Background Mockup -->
      <div class="absolute-full gradient-overlay"></div>
      
      <div class="relative-position" :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-xl'" style="z-index: 10">
        <div class="row items-center q-mb-lg">
          <div>
            <div class="text-weight-bolder text-white tracking-tighter q-mb-xs" :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'">
              Dashboard de la Liga
            </div>
            <div class="font-medium opacity-80" :class="$q.screen.lt.sm ? 'text-subtitle2 text-slate-200' : 'text-h6 text-slate-100'">
              Temporada 2026 • Estado actual del torneo • <q-badge color="emerald" class="q-ml-sm">En Vivo</q-badge>
            </div>
          </div>
          <q-space />
          <div class="row q-gutter-md">
             <q-btn flat round icon="las la-sync" color="white" @click="leagueStore.fetchLeagueData()" class="bg-white-10 backdrop-blur transition-base hover-rotate" />
             <q-btn flat round icon="las la-bell" color="white" class="bg-white-10 backdrop-blur" />
          </div>
        </div>
      </div>
    </div>

    <!-- Overlapping Stats Cards -->
    <div class="relative-position" :class="$q.screen.lt.sm ? 'q-px-md' : 'q-px-xl'" :style="{ marginTop: $q.screen.lt.sm ? '-40px' : '-80px', zIndex: 20 }">
      <div class="row q-col-gutter-lg">
        <!-- Tarjeta Equipos -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="glass shadow-premium transition-base border-hover overflow-hidden" style="border-radius: 24px">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="text-overline text-slate-700 font-bold tracking-widest q-mb-xs">EQUIPOS</div>
                  <div class="text-h3 text-weight-bolder text-slate-900 q-mb-xs">
                    {{ leagueStore.loading ? '...' : stats.teamsCount }}
                  </div>
                  <div class="text-caption text-emerald text-weight-bold">
                    <q-icon name="las la-arrow-up" /> +2 este mes
                  </div>
                </div>
                <div class="bg-emerald-50 flex flex-center" style="width: 64px; height: 64px; border-radius: 20px">
                  <q-icon name="las la-futbol" color="emerald" size="36px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta Partidos -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="glass shadow-premium transition-base border-hover overflow-hidden" style="border-radius: 24px">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="text-overline text-slate-700 font-bold tracking-widest q-mb-xs">PARTIDOS</div>
                  <div class="text-h3 text-weight-bolder text-slate-900 q-mb-xs">
                    {{ leagueStore.loading ? '...' : stats.matchesCount }}
                  </div>
                  <div class="text-caption text-blue-6 text-weight-bold">
                    8 en curso
                  </div>
                </div>
                <div class="bg-blue-50 flex flex-center" style="width: 64px; height: 64px; border-radius: 20px">
                  <q-icon name="las la-calendar-check" color="blue-6" size="36px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta Goles -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="glass shadow-premium transition-base border-hover overflow-hidden" style="border-radius: 24px">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="text-overline text-slate-700 font-bold tracking-widest q-mb-xs">GOLES TOTALES</div>
                  <div class="text-h3 text-weight-bolder text-slate-900 q-mb-xs">
                    {{ leagueStore.loading ? '...' : stats.totalGoles }}
                  </div>
                  <div class="text-caption text-amber-9 text-weight-bold">
                    Prom. 2.4 / part
                  </div>
                </div>
                <div class="bg-amber-50 flex flex-center" style="width: 64px; height: 64px; border-radius: 20px">
                  <q-icon name="las la-trophy" color="amber-7" size="36px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta Jugadores -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="glass shadow-premium transition-base border-hover overflow-hidden" style="border-radius: 24px">
            <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="text-overline text-slate-700 font-bold tracking-widest q-mb-xs">JUGADORES</div>
                  <div class="text-h3 text-weight-bolder text-slate-900 q-mb-xs">
                    {{ leagueStore.loading ? '...' : stats.playersCount }}
                  </div>
                  <div class="text-caption text-indigo-6 text-weight-bold">
                    Ver todos
                  </div>
                </div>
                <div class="bg-indigo-50 flex flex-center" style="width: 64px; height: 64px; border-radius: 20px">
                  <q-icon name="las la-users" color="indigo-6" size="36px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div :class="$q.screen.lt.sm ? 'q-px-md q-pt-lg' : 'q-px-xl q-pt-xl'" class="q-pb-xl">
      <!-- Sección de Gráficos y Top Teams -->
      <div class="row q-col-gutter-xl q-mb-xl">
        <!-- Estadísticas de Goles -->
        <div class="col-12 col-md-8">
          <q-card flat class="glass shadow-premium overflow-hidden" style="border-radius: 28px; height: 100%">
            <q-card-section :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
              <div class="row items-center q-mb-md">
                <div class="bg-emerald-50 q-pa-sm q-mr-md" style="border-radius: 14px">
                  <q-icon name="las la-chart-area" size="28px" color="emerald" />
                </div>
                <div>
                  <div class="text-h5 text-weight-bolder text-slate-900 tracking-tight">Rendimiento de Goles</div>
                  <div class="text-slate-700 font-medium">Histórico de efectividad en el torneo</div>
                </div>
              </div>

            <div class="relative-position q-mt-xl" style="height: 320px; width: 100%">
              <svg viewBox="0 0 300 200" class="full-width full-height" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientGoles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Grid lines -->
                <g class="text-slate-200" stroke-width="0.5">
                  <line x1="25" y1="20" x2="295" y2="20" stroke="currentColor" stroke-dasharray="4,4" />
                  <line x1="25" y1="60" x2="295" y2="60" stroke="currentColor" stroke-dasharray="4,4" />
                  <line x1="25" y1="100" x2="295" y2="100" stroke="currentColor" stroke-dasharray="4,4" />
                  <line x1="25" y1="140" x2="295" y2="140" stroke="currentColor" stroke-dasharray="4,4" />
                </g>

                <!-- Axis Labels -->
                <g class="text-slate-400 font-bold" font-size="8" font-family="Plus Jakarta Sans">
                  <text x="0" y="24">100</text>
                  <text x="0" y="104">50</text>
                  <text x="0" y="184">0</text>
                </g>

                <!-- Line and Area Plot -->
                <path v-if="areaPath" :d="areaPath" fill="url(#gradientGoles)" />
                <path
                  v-if="linePath"
                  :d="linePath"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  filter="url(#shadow)"
                />
              </svg>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top 5 Equipos -->
      <div class="col-12 col-md-4">
        <q-card flat class="glass shadow-premium overflow-hidden" style="border-radius: 28px; height: 100%">
          <q-card-section class="bg-slate-900 text-white header-gradient" :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
            <div class="row items-center">
              <div class="bg-white-20 q-pa-sm q-mr-md backdrop-blur" style="border-radius: 14px">
                <q-icon name="las la-trophy" size="28px" color="amber" />
              </div>
              <div class="text-h5 text-weight-bolder tracking-tight">Elite de la Liga</div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-list separator>
              <q-item v-for="team in topTeams" :key="team.id" class="q-py-lg q-px-xl transition-base hover-bg-slate-50 border-left-hover">
                <q-item-section avatar>
                  <div class="relative-position">
                    <q-avatar size="52px" class="shadow-soft bg-white border-slate">
                      <img v-if="team.logo" :src="team.logo" alt="logo" />
                      <span v-else class="text-slate-900 text-weight-bold">{{ team.equipo.charAt(0) }}</span>
                    </q-avatar>
                    <q-badge color="slate-900" floating class="text-weight-bold shadow-soft" style="padding: 4px 6px; border: 2px solid white; bottom: -4px; right: -4px">
                      {{ team.pos }}
                    </q-badge>
                  </div>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-slate-900" style="font-size: 17px">{{ team.equipo }}</q-item-label>
                  <q-item-label caption class="text-slate-600 font-medium">{{ team.pj }} PJ • {{ team.pg }}/{{ team.pe }}/{{ team.pp }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="column items-end">
                    <div class="text-h5 text-weight-bolder text-emerald">{{ team.pts }}</div>
                    <div class="text-overline text-slate-600 line-height-1">PTS</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Fila Inferior: Goleadores -->
    <div class="row q-col-gutter-xl q-mb-xl">
      <!-- Tabla de Goleadores -->
      <div class="col-12 col-md-6">
        <q-card flat class="glass shadow-premium" style="border-radius: 28px; height: 100%">
          <q-card-section :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
            <div class="row items-center justify-between q-mb-xl">
              <div class="row items-center">
                <div class="bg-blue-50 q-pa-sm q-mr-md" style="border-radius: 14px">
                  <q-icon name="las la-medal" size="28px" color="blue-6" />
                </div>
                <div class="text-h5 text-weight-bolder text-slate-900 tracking-tight">Máximos Artilleros</div>
              </div>
              <q-badge color="blue-50" text-color="blue-6" class="text-weight-bold q-px-lg q-py-xs no-shadow" style="border-radius: 10px">Temporada Actual</q-badge>
            </div>

            <q-list separator v-if="topScorers.length > 0">
              <q-item v-for="(scorer, index) in topScorers" :key="scorer.playerId" class="q-py-md transition-base hover-bg-slate-50" style="border-radius: 18px">
                <q-item-section avatar>
                  <q-avatar size="48px" :color="index === 0 ? 'amber-50' : 'slate-50'" 
                    :text-color="index === 0 ? 'amber-8' : 'slate-500'" class="text-weight-bold shadow-soft">
                    <span>{{ index + 1 }}</span>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-slate-900" style="font-size: 17px">{{ scorer.playerName }}</q-item-label>
                  <q-item-label caption class="text-slate-700 font-medium">
                    <q-icon name="las la-shield-alt" size="14px" class="q-mr-xs" />{{ scorer.teamName }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center">
                    <div class="text-h4 text-weight-bolder text-slate-900 q-mr-sm">{{ scorer.goals }}</div>
                    <q-icon name="las la-futbol" size="22px" color="emerald" class="opacity-40" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions (Integrated) -->
      <div class="col-12 col-md-6">
        <div class="column q-gutter-y-lg">
          <div class="text-h5 text-weight-bolder text-slate-900 tracking-tight">Acciones Principales</div>
          <div class="row q-col-gutter-lg">
            <div v-for="action in actions" :key="action.title" class="col-6">
              <q-btn
                flat
                class="full-width q-pa-xl glass shadow-premium transition-base border-hover overflow-hidden"
                style="border-radius: 28px; text-transform: none;"
                @click="router.push({ name: action.link })"
              >
                <div class="column items-center q-gutter-y-md">
                  <div :class="`bg-${action.color}-50`" class="flex flex-center shadow-soft" style="width: 72px; height: 72px; border-radius: 20px">
                    <q-icon :name="action.icon" :color="action.color" size="36px" />
                  </div>
                  <div class="text-h6 text-weight-bolder text-slate-900">{{ action.title }}</div>
                  <div class="text-caption text-slate-700 font-medium text-center">{{ action.desc }}</div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.hero-section {
  background-color: #0f172a;
  min-height: 280px;
}
.gradient-overlay {
  background: radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%);
  opacity: 0.8;
}
.bg-white-10 {
  background: rgba(255, 255, 255, 0.1);
}
.bg-white-20 {
  background: rgba(255, 255, 255, 0.2);
}
.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.header-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
.hover-rotate:hover {
  transform: rotate(180deg);
}
.border-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
}
.border-left-hover:hover {
  border-left: 4px solid #10b981;
  padding-left: 44px !important;
}
.tracking-widest {
  letter-spacing: 0.15em;
}
.line-height-1 {
  line-height: 1;
}
.opacity-40 {
  opacity: 0.4;
}
.opacity-80 {
  opacity: 0.8;
}
.glass {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
</style>
