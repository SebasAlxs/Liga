<template>
  <div class="page-container p-6">

    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white font-display">Tabla de Posiciones</h1>
        <p class="text-obsidian-400 mt-1">Clasificación actualizada según resultados de partidos finalizados.</p>
      </div>

      <!-- Tournament Selector -->
      <div class="flex items-center gap-3">
        <select
          v-model="selectedTournamentId"
          @change="loadStandings"
          class="bg-obsidian-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium min-w-[220px]"
        >
          <option value="" disabled>Seleccionar torneo...</option>
          <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button
          v-if="selectedTournamentId"
          @click="loadStandings"
          class="p-2.5 rounded-xl border border-white/10 hover:border-emerald-500/30 text-obsidian-400 hover:text-emerald-400 transition-all"
          title="Actualizar"
        >
          <Icon :name="loading ? 'lucide:loader-2' : 'lucide:refresh-cw'" :class="`w-4 h-4 ${loading ? 'animate-spin' : ''}`" />
        </button>
      </div>
    </div>

    <!-- No tournament selected -->
    <div v-if="!selectedTournamentId" class="glass-card rounded-3xl border border-white/5 p-16 text-center">
      <Icon name="lucide:list-ordered" class="w-16 h-16 text-obsidian-700 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Selecciona un torneo</h3>
      <p class="text-obsidian-400 text-sm">Elige un torneo del selector de arriba para ver la tabla de posiciones.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="flex flex-col items-center py-20 gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p class="text-obsidian-400 animate-pulse">Calculando posiciones...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!standings.length" class="glass-card rounded-3xl border border-white/5 p-16 text-center">
      <Icon name="lucide:trophy" class="w-16 h-16 text-obsidian-700 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Sin datos aún</h3>
      <p class="text-obsidian-400 text-sm">Los equipos aparecerán aquí cuando haya partidos finalizados en este torneo.</p>
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
        <div :class="['podium-card border-premium-silver order-2 md:order-1', isMobile ? 'min-w-[160px] flex-shrink-0' : '']">
          <div class="podium-rank text-slate-400">2° Lugar</div>
          <div class="w-14 h-14 rounded-2xl overflow-hidden bg-obsidian-800 border-2 border-white/5 mx-auto mb-3 shadow-lg">
            <img v-if="standings[1].logo" :src="standings[1].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-7 h-7 text-obsidian-600" />
          </div>
          <p class="font-black text-white text-[11px] uppercase tracking-tighter text-center truncate w-full px-2">{{ standings[1].name }}</p>
          <p class="text-2xl font-black text-white text-center mt-1">{{ standings[1].points }}<span class="text-[10px] uppercase font-bold text-obsidian-500 ml-1 tracking-tighter">pts</span></p>
          <div class="podium-bar-2 mt-4"></div>
        </div>

        <!-- 1st place -->
        <div :class="['podium-card border-premium-gold bg-amber-500/5 order-1 md:order-2', isMobile ? 'min-w-[180px] flex-shrink-0 scale-105 z-10' : 'relative']">
          <div class="absolute top-2 right-2">
            <Icon name="lucide:crown" class="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div class="podium-rank text-amber-500">🏆 Líder</div>
          <div class="w-16 h-16 rounded-2xl overflow-hidden bg-obsidian-800 border-2 border-amber-500/40 mx-auto mb-3 shadow-xl shadow-amber-500/10">
            <img v-if="standings[0].logo" :src="standings[0].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-8 h-8 text-amber-500/50" />
          </div>
          <p class="font-black text-white text-xs uppercase tracking-tight text-center truncate w-full px-2">{{ standings[0].name }}</p>
          <p class="text-3xl font-black text-amber-500 text-center mt-1">{{ standings[0].points }}<span class="text-xs font-bold text-obsidian-500 ml-1 tracking-tighter">PTS</span></p>
          <div class="podium-bar-1 mt-4"></div>
        </div>

        <!-- 3rd place -->
        <div :class="['podium-card border-premium-bronze order-3', isMobile ? 'min-w-[160px] flex-shrink-0' : '']">
          <div class="podium-rank text-orange-400">3° Lugar</div>
          <div class="w-14 h-14 rounded-2xl overflow-hidden bg-obsidian-800 border-2 border-white/5 mx-auto mb-3 shadow-lg">
            <img v-if="standings[2].logo" :src="standings[2].logo" class="w-full h-full object-cover" />
            <Icon v-else name="lucide:shield" class="w-7 h-7 text-obsidian-600" />
          </div>
          <p class="font-black text-white text-[11px] uppercase tracking-tighter text-center truncate w-full px-2">{{ standings[2].name }}</p>
          <p class="text-2xl font-black text-white text-center mt-1">{{ standings[2].points }}<span class="text-[10px] uppercase font-bold text-obsidian-500 ml-1 tracking-tighter">pts</span></p>
          <div class="podium-bar-3 mt-4"></div>
        </div>
      </div>

      <!-- Full Table -->
      <div class="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div class="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs font-black uppercase tracking-[0.2em] text-white">{{ activeTournamentName }}</span>
          </div>
          <span class="text-[10px] font-bold text-obsidian-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{{ standings.length }} Inscritos</span>
        </div>

        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.01]">
                <th class="sticky-col px-4 py-4 text-left text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em] w-12">#</th>
                <th class="sticky-col left-12 px-4 py-4 text-left text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em] min-w-[160px]">Equipo</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em]">PJ</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em]">G</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em]">E</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em]">P</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em] hidden md:table-cell">GF</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em] hidden md:table-cell">GC</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-obsidian-500 uppercase tracking-[0.15em] hidden sm:table-cell">DG</th>
                <th class="px-8 py-4 text-center text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in standings"
                :key="team.id"
                class="border-b border-white/5 transition-all active:bg-white/5 group"
              >
                <!-- Position -->
                <td class="sticky-col px-4 py-4 flex items-center justify-center">
                   <div :class="[
                     'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black',
                     index === 0 ? 'bg-amber-500/20 text-amber-500' : 
                     index === 1 ? 'bg-slate-400/20 text-slate-400' :
                     index === 2 ? 'bg-orange-400/20 text-orange-400' : 'text-obsidian-500'
                   ]">
                     {{ index + 1 }}
                   </div>
                </td>

                <!-- Team -->
                <td class="sticky-col left-12 px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <img v-if="team.logo" :src="team.logo" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:shield" class="w-5 h-5 text-obsidian-600" />
                    </div>
                    <span :class="['font-black text-sm uppercase tracking-tight truncate', index === 0 ? 'text-amber-400' : 'text-white']">{{ team.name }}</span>
                  </div>
                </td>

                <!-- Stats -->
                <td class="px-6 py-4 text-center text-sm text-obsidian-400 font-mono">{{ team.matchesPlayed ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm font-mono text-emerald-500/80 font-bold">{{ team.matchesWon ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm text-obsidian-400 font-mono">{{ team.matchesDrawn ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm font-mono text-rose-500/80">{{ team.matchesLost ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm text-obsidian-500 font-mono hidden md:table-cell">{{ team.goalsFor ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm text-obsidian-500 font-mono hidden md:table-cell">{{ team.goalsAgainst ?? 0 }}</td>
                <td class="px-6 py-4 text-center text-sm font-mono font-bold hidden sm:table-cell" :class="(team.goalDifference ?? 0) > 0 ? 'text-emerald-500' : (team.goalDifference ?? 0) < 0 ? 'text-rose-500' : 'text-obsidian-500'">
                  {{ (team.goalDifference ?? 0) > 0 ? '+' : '' }}{{ team.goalDifference ?? 0 }}
                </td>
                <td class="px-8 py-4 text-center">
                  <span :class="['text-xl font-black font-mono', index === 0 ? 'text-amber-400 text-glow' : 'text-white']">{{ team.points ?? 0 }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend -->
        <div class="px-6 py-3 border-t border-white/5 flex flex-wrap gap-4 text-xs text-obsidian-600">
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
.glass-card {
  background: rgba(14, 20, 27, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Podium */
.podium-card {
  background: rgba(14, 20, 27, 0.45);
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
  background-color: #0c1117 !important;
  z-index: 10;
}
.sticky-col.left-12 {
  left: 3rem !important;
}
th.sticky-col, td.sticky-col {
  left: 0;
}
</style>
