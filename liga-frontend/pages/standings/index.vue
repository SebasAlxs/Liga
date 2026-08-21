<template>
  <div class="page-container p-6">

    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Tabla de Posiciones</h1>
        <p class="text-content-muted mt-1">Clasificación actualizada según resultados de partidos finalizados.</p>
      </div>

      <!-- Tournament Selector -->
      <div class="flex items-center gap-3">
        <select
          v-model="selectedTournamentId"
          @change="loadStandings"
          class="tournament-select bg-surface/80 border border-border rounded-xl px-4 py-2.5 text-content focus:outline-none focus:border-primary transition-all text-sm font-medium min-w-[220px]"
        >
          <option value="" disabled>Seleccionar torneo...</option>
          <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button
          v-if="selectedTournamentId"
          @change="loadStandings"
          class="p-2.5 rounded-xl border border-border hover:border-primary/50 text-content-muted hover:text-primary transition-all"
          title="Actualizar"
        >
          <Icon :name="loading ? 'lucide:loader-2' : 'lucide:refresh-cw'" :class="`w-4 h-4 ${loading ? 'animate-spin' : ''}`" />
        </button>
      </div>
    </div>

    <!-- No tournament selected -->
    <div v-if="!selectedTournamentId" class="glass-card rounded-3xl border border-border p-16 text-center shadow-xl">
      <Icon name="lucide:list-ordered" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content mb-2">Selecciona un torneo</h3>
      <p class="text-content-muted text-sm">Elige un torneo del selector de arriba para ver la tabla de posiciones.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="flex flex-col items-center py-20 gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Calculando posiciones...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!standings.length" class="glass-card rounded-3xl border border-border p-16 text-center shadow-xl">
      <Icon name="lucide:trophy" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content mb-2">Sin datos aún</h3>
      <p class="text-content-muted text-sm">Los equipos aparecerán aquí cuando haya partidos finalizados en este torneo.</p>
    </div>

    <!-- Standings Table -->
    <div v-else class="space-y-8 animate-fade-up">
      <!-- Top 3 Podium (Mobile: Horizontal Scroll / Desktop: Grid) -->
      <div v-if="standings.length >= 3" 
        :class="[
          'gap-4 pb-2 no-scrollbar',
          isMobile ? 'flex overflow-x-auto px-1' : 'grid grid-cols-3'
        ]"
      >
        <!-- 2nd place -->
        <div :class="['podium-card border-border order-2 md:order-1', isMobile ? 'min-w-[160px] flex-shrink-0' : '']">
          <div class="podium-rank text-content-muted">2° Lugar</div>
          <div class="w-14 h-14 rounded-2xl overflow-hidden bg-surface border border-border mx-auto mb-3 shadow-lg">
            <img v-if="standings[1].logo" :src="standings[1].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-7 h-7 text-slate-300" />
          </div>
          <p class="font-black text-content text-[11px] uppercase tracking-tighter text-center truncate w-full px-2">{{ standings[1].name }}</p>
          <p class="text-2xl font-black text-content text-center mt-1">{{ standings[1].points }}<span class="text-[10px] uppercase font-bold text-content-muted ml-1 tracking-tighter">pts</span></p>
          <div class="podium-bar-2 mt-4"></div>
        </div>

        <!-- 1st place -->
        <div :class="['podium-card border-amber-300 bg-amber-50 order-1 md:order-2', isMobile ? 'min-w-[180px] flex-shrink-0 scale-105 z-10' : 'relative']">
          <div class="absolute top-2 right-2">
            <Icon name="lucide:crown" class="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div class="podium-rank text-amber-600">🏆 Líder</div>
          <div class="w-16 h-16 rounded-2xl overflow-hidden bg-surface border-2 border-amber-300 mx-auto mb-3 shadow-xl shadow-amber-500/10">
            <img v-if="standings[0].logo" :src="standings[0].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-8 h-8 text-amber-300" />
          </div>
          <p class="font-black text-content text-xs uppercase tracking-tight text-center truncate w-full px-2">{{ standings[0].name }}</p>
          <p class="text-3xl font-black text-amber-600 text-center mt-1">{{ standings[0].points }}<span class="text-xs font-bold text-content-muted ml-1 tracking-tighter">PTS</span></p>
          <div class="podium-bar-1 mt-4"></div>
        </div>

        <!-- 3rd place -->
        <div :class="['podium-card border-orange-200 order-3', isMobile ? 'min-w-[160px] flex-shrink-0' : '']">
          <div class="podium-rank text-orange-500">3° Lugar</div>
          <div class="w-14 h-14 rounded-2xl overflow-hidden bg-surface border border-border mx-auto mb-3 shadow-lg">
            <img v-if="standings[2].logo" :src="standings[2].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-7 h-7 text-slate-300" />
          </div>
          <p class="font-black text-content text-[11px] uppercase tracking-tighter text-center truncate w-full px-2">{{ standings[2].name }}</p>
          <p class="text-2xl font-black text-content text-center mt-1">{{ standings[2].points }}<span class="text-[10px] uppercase font-bold text-content-muted ml-1 tracking-tighter">pts</span></p>
          <div class="podium-bar-3 mt-4"></div>
        </div>
      </div>

      <!-- Full Table -->
      <div class="glass-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
        <div class="px-6 py-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span class="text-xs font-black uppercase tracking-[0.2em] text-content">{{ activeTournamentName }}</span>
          </div>
          <span class="text-[10px] font-bold text-content-muted uppercase tracking-widest bg-surface-hover px-3 py-1 rounded-full">{{ standings.length }} Inscritos</span>
        </div>

        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-border bg-background">
                <th class="sticky-col px-4 py-4 text-left text-[10px] font-black text-content-muted uppercase tracking-[0.15em] w-12">#</th>
                <th class="sticky-col left-12 px-4 py-4 text-left text-[10px] font-black text-content-muted uppercase tracking-[0.15em] min-w-[120px] sm:min-w-[160px]">Equipo</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em]">PJ</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em]">G</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em]">E</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em]">P</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em] hidden md:table-cell">GF</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em] hidden md:table-cell">GC</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-content-muted uppercase tracking-[0.15em] hidden sm:table-cell">DG</th>
                <th class="px-8 py-4 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in standings"
                :key="team.id"
                class="border-b border-border transition-all hover:bg-background group"
              >
                <!-- Position -->
                <td class="sticky-col px-4 py-4 flex items-center justify-center">
                   <div :class="[
                     'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black',
                     index === 0 ? 'bg-amber-100 text-amber-600' : 
                     index === 1 ? 'bg-surface-hover text-content-muted' :
                     index === 2 ? 'bg-orange-100 text-orange-600' : 'text-content-muted'
                   ]">
                     {{ index + 1 }}
                   </div>
                </td>

                <!-- Team -->
                <td class="sticky-col left-12 px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <img v-if="team.logo" :src="team.logo" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:shield" class="w-5 h-5 text-content-muted" />
                    </div>
                    <span :class="[
                      'font-black text-[11px] sm:text-sm uppercase tracking-tight truncate max-w-[100px] sm:max-w-[180px]', 
                      index === 0 ? 'text-amber-500' : 'text-content'
                    ]">{{ team.name }}</span>
                  </div>
                </td>

                <!-- Stats -->
                <td class="px-2 sm:px-6 py-4 text-center text-sm text-content-muted font-mono">{{ team.matchesPlayed ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm font-mono text-primary font-bold">{{ team.matchesWon ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm text-content-muted font-mono">{{ team.matchesDrawn ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm font-mono text-rose-600">{{ team.matchesLost ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm text-content-muted font-mono hidden md:table-cell">{{ team.goalsFor ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm text-content-muted font-mono hidden md:table-cell">{{ team.goalsAgainst ?? 0 }}</td>
                <td class="px-2 sm:px-6 py-4 text-center text-sm font-mono font-bold hidden sm:table-cell" :class="(team.goalDifference ?? 0) > 0 ? 'text-primary' : (team.goalDifference ?? 0) < 0 ? 'text-rose-500' : 'text-content-muted'">
                  {{ (team.goalDifference ?? 0) > 0 ? '+' : '' }}{{ team.goalDifference ?? 0 }}
                </td>
                <td class="px-4 sm:px-8 py-4 text-center">
                  <span :class="['text-base sm:text-xl font-black font-mono', index === 0 ? 'text-amber-500' : 'text-content']">{{ team.points ?? 0 }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend -->
        <div class="px-6 py-3 border-t border-border flex flex-wrap gap-4 text-xs text-content-muted">
          <span>PJ: Partidos Jugados</span>
          <span>G: Ganados · E: Empatados · P: Perdidos</span>
          <span>GF: Goles a Favor · GC: Goles en Contra</span>
          <span>DG: Diferencia · PTS: Puntos</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { $api } from '~/composables/useApi'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const tournaments = ref([])
const selectedTournamentId = ref('')
const standings = ref([])
const loading = ref(false)

const activeTournamentName = computed(() =>
  tournaments.value.find(t => t.id === selectedTournamentId.value)?.name ?? ''
)

onMounted(async () => {
  try {
    const res = await $api('/tournaments')
    tournaments.value = (res?.data || []).map(t => ({ ...t, id: t._id || t.id }))
    const first = tournaments.value.find(t => t.active) ?? tournaments.value[0]
    if (first) {
      selectedTournamentId.value = first.id
      await loadStandings()
    }
  } catch (e) { console.error('standings load:', e) }
})

async function loadStandings() {
  if (!selectedTournamentId.value) return
  loading.value = true
  standings.value = []
  try {
    const res = await $api(`/stats/standings/${selectedTournamentId.value}`)
    standings.value = res?.data || []
  } catch (e) {
    console.error('Failed to load standings:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.tournament-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 3rem;
}

/* Podium */
.podium-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-width: 1px;
  border-radius: 1.5rem;
  padding: 1.5rem 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  min-height: 180px;
}

.podium-rank {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.podium-bar-1 {
  width: 100%;
  height: 3rem;
  background: linear-gradient(to top, rgba(245, 158, 11, 0.15), transparent);
  margin-top: auto;
}
.podium-bar-2 {
  width: 100%;
  height: 2rem;
  background: linear-gradient(to top, rgba(148, 163, 184, 0.08), transparent);
  margin-top: auto;
}
.podium-bar-3 {
  width: 100%;
  height: 1.5rem;
  background: linear-gradient(to top, rgba(251, 146, 60, 0.06), transparent);
  margin-top: auto;
}

/* Sticky Columns for Responsive Table */
.sticky-col {
  position: sticky !important;
  background-color: #f8fafc !important;
  z-index: 10;
}
.sticky-col.left-12 {
  left: 3rem !important;
}
th.sticky-col, td.sticky-col {
  left: 0;
}
</style>
