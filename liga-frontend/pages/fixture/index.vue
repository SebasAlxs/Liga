<template>
  <div class="page-container p-6 relative">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Generador de Fixture</h1>
        <p class="text-content-muted mt-1">Genera y administra el calendario de partidos por torneo, categoría y fase.</p>
      </div>
    </div>

    <!-- Notification -->
    <Transition name="fade">
      <div v-if="notification" :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-primary/20 border-primary/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`">
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- Hidden Poster Component -->
    <div class="fixed top-0 left-0 opacity-0 pointer-events-none z-[-100]">
      <FixturePoster 
        v-if="posterData"
        ref="posterRef"
        :tournamentName="posterData.tournamentName"
        :roundLabel="posterData.roundLabel"
        :dateLabel="posterData.dateLabel"
        :matches="posterData.matches"
      />
    </div>

    <!-- Full screen loading overlay for Poster -->
    <div v-if="isGeneratingPoster" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
      <h2 class="text-2xl font-bold text-white font-display">Generando Póster...</h2>
      <p class="text-emerald-400 mt-2 font-medium">Por favor espera un momento</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      
      <!-- Panel de Configuración -->
      <div class="lg:col-span-1 h-full">
        <div class="glass-card rounded-3xl border border-border/10 p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          
          <h2 class="text-lg font-bold text-content mb-6 flex items-center gap-2">
            <Icon name="lucide:settings-2" class="w-5 h-5 text-emerald-400" />
            Configuración
          </h2>

          <div class="space-y-5 flex-1">
            <!-- Torneo -->
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">1. Torneo</label>
              <select
                v-model="form.tournamentId"
                @change="onTournamentChange"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
              >
                <option value="" disabled>Selecciona un torneo</option>
                <option v-for="t in tournamentStore.tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>

            <!-- Categoría -->
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">2. Categoría</label>
              <select
                v-model="form.categoryId"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
                :disabled="!form.tournamentId"
              >
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="c in matchStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <!-- Fase -->
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">3. Fase (Stage)</label>
              <select
                v-model="form.stageId"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                :disabled="stageStore.loading || !form.tournamentId"
              >
                <option value="" disabled>Selecciona una fase</option>
                <option v-for="s in stageStore.items" :key="s.id" :value="s.id">
                  {{ s.name }} ({{ s.type === 'LEAGUE' ? 'Liga' : s.type === 'GROUP_STAGE' ? 'Grupos' : 'Eliminatoria' }})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Acciones y Vista Previa -->
      <div class="lg:col-span-2 h-full">
        
        <div v-if="!isReadyToFetch" class="glass-card rounded-3xl border border-border/10 p-12 shadow-xl flex flex-col items-center justify-center text-center h-full">
          <div class="w-20 h-20 rounded-full bg-surface-hover flex items-center justify-center mb-6">
            <Icon name="lucide:calendar-range" class="w-10 h-10 text-slate-300" />
          </div>
          <h3 class="text-xl font-bold text-content">Completa la configuración</h3>
          <p class="text-content-muted mt-2 max-w-sm mx-auto">Selecciona el torneo, la categoría y la fase a la izquierda para verificar si ya existe un calendario o si deseas generar uno nuevo.</p>
        </div>

        <div v-else-if="loadingPreview" class="glass-card rounded-3xl border border-border/10 p-12 shadow-xl flex flex-col items-center justify-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p class="text-content-muted mt-4 font-medium animate-pulse">Comprobando calendario...</p>
        </div>

        <div v-else class="glass-card rounded-3xl border border-border/10 p-8 shadow-xl relative overflow-hidden h-full flex flex-col">
          
          <div v-if="hasFixture" class="flex-1 flex flex-col h-full overflow-hidden">
            <div class="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <h3 class="text-xl font-bold text-content flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-400" />
                  Fixture Existente
                </h3>
                <p class="text-sm text-content-muted mt-1">{{ totalMatches }} partidos en {{ totalRounds }} fechas.</p>
              </div>
              <button @click="handleDownloadFixturePdf" class="flex items-center gap-2 px-4 py-2 bg-surface-hover border border-border rounded-xl text-sm font-bold text-content hover:bg-surface transition-colors whitespace-nowrap">
                <Icon name="lucide:file-text" class="w-4 h-4" />
                PDF General
              </button>
            </div>

            <!-- Scrollable list of matches grouped by round -->
            <div class="flex-1 overflow-y-auto pr-2 space-y-6 styled-scrollbar">
              <div v-for="(matches, round) in groupedMatchesByRound" :key="round" class="bg-surface-hover/30 border border-border/30 rounded-2xl p-5">
                
                <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                  <h4 class="font-bold text-lg text-content font-display uppercase tracking-wider">Fecha {{ round }}</h4>
                  <div class="flex gap-2">
                    <button @click="downloadRoundPoster(round, matches, 'png')" class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian-950 rounded-lg text-xs font-bold shadow-lg hover:opacity-90 transition-opacity">
                      <Icon name="lucide:image" class="w-3.5 h-3.5" /> Póster (PNG)
                    </button>
                    <button @click="downloadRoundPoster(round, matches, 'pdf')" class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg hover:opacity-90 transition-opacity">
                      <Icon name="lucide:file-pdf" class="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="match in matches" :key="match.id" class="bg-surface border border-border/50 rounded-xl p-3 flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <div class="w-6 h-6 rounded-full bg-surface-hover border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img v-if="getTeamLogo(match.homeTeamId)" :src="getTeamLogo(match.homeTeamId)" class="w-full h-full object-cover" />
                        <Icon v-else name="lucide:shield" class="w-4 h-4 text-slate-400" />
                      </div>
                      <span class="text-sm font-medium truncate">{{ getTeamName(match.homeTeamId) }}</span>
                    </div>
                    
                    <div class="text-xs font-black text-content-muted px-2 flex-shrink-0">VS</div>
                    
                    <div class="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <span class="text-sm font-medium truncate text-right">{{ getTeamName(match.awayTeamId) }}</span>
                      <div class="w-6 h-6 rounded-full bg-surface-hover border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img v-if="getTeamLogo(match.awayTeamId)" :src="getTeamLogo(match.awayTeamId)" class="w-full h-full object-cover" />
                        <Icon v-else name="lucide:shield" class="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
              <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
              <Icon name="lucide:calendar-plus" class="w-10 h-10 text-emerald-400 relative z-10" />
            </div>
            <h3 class="text-2xl font-bold text-content">Sin Fixture Generado</h3>
            <p class="text-content-muted mt-3 mb-8 max-w-sm">No existen partidos programados para esta Fase. Puedes generar el calendario automáticamente usando las reglas establecidas.</p>
            
            <button
              @click="handleGenerateFixture"
              :disabled="actionLoading"
              class="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian-950 hover:from-emerald-400 hover:to-teal-400 transition-all font-bold text-lg shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3 w-full max-w-md"
            >
              <Icon v-if="actionLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <Icon v-else name="lucide:wand-2" class="w-5 h-5" />
              Generar Automáticamente
            </button>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { toJpeg } from 'html-to-image'
import jsPDF from 'jspdf'
import { useTournamentStore } from '~/stores/tournamentStore'
import { useMatchStore } from '~/stores/matchStore'
import { useStageStore } from '~/stores/stageStore'
import { useTeamStore } from '~/stores/teamStore'
import FixturePoster from '~/components/FixturePoster.vue'

const tournamentStore = useTournamentStore()
const matchStore = useMatchStore()
const stageStore = useStageStore()
const teamStore = useTeamStore()

const notification = ref(null)
const form = ref({ tournamentId: '', categoryId: '', stageId: '' })
const actionLoading = ref(false)
const loadingPreview = ref(false)

const posterRef = ref(null)
const posterData = ref(null)
const isGeneratingPoster = ref(false)

// Estado del fixture existente
const hasFixture = ref(false)
const groupedMatchesByRound = ref({}) // @ts-ignore
const totalMatches = ref(0)
const totalRounds = ref(0)

const isReadyToFetch = computed(() => form.value.tournamentId && form.value.categoryId && form.value.stageId)

onMounted(async () => {
  tournamentStore.fetchTournaments()
  matchStore.fetchCategories()
  teamStore.fetchTeams() // Necesitamos los nombres de los equipos
})

async function onTournamentChange() {
  form.value.stageId = ''
  hasFixture.value = false
  if (form.value.tournamentId) {
    await stageStore.fetchItems(form.value.tournamentId)
  }
}

watch(() => [form.value.tournamentId, form.value.categoryId, form.value.stageId], async ([tid, cid, sid]) => {
  if (tid && cid && sid) {
    await checkExistingFixture()
  } else {
    hasFixture.value = false
  }
})

function getTeamName(teamId) { return teamStore.teams.find(t => t.id === teamId)?.name ?? 'Equipo Desconocido' }
function getTeamLogo(teamId) { return teamStore.teams.find(t => t.id === teamId)?.logo ?? null }

async function checkExistingFixture() {
  loadingPreview.value = true
  try {
    await matchStore.fetchMatches() 
    
    const matches = matchStore.matches.filter(m => 
      m.tournamentId === form.value.tournamentId && 
      m.categoryId === form.value.categoryId && 
      m.stageId === form.value.stageId
    )
    
    if (matches.length > 0) {
      hasFixture.value = true
      totalMatches.value = matches.length
      
      const groups = {}
      for (const m of matches) {
        const round = m.round || 1
        if (!groups[round]) groups[round] = []
        groups[round].push(m)
      }
      groupedMatchesByRound.value = groups
      totalRounds.value = Object.keys(groups).length
    } else {
      hasFixture.value = false
      groupedMatchesByRound.value = {}
      totalMatches.value = 0
      totalRounds.value = 0
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingPreview.value = false
  }
}

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

async function handleGenerateFixture() {
  if (!isReadyToFetch.value) return
  actionLoading.value = true
  const res = await matchStore.generateFixture(form.value.tournamentId, form.value.categoryId, form.value.stageId)
  actionLoading.value = false
  
  if (res.success) {
    notify(res.message)
    await checkExistingFixture()
  } else {
    notify(res.message, 'error')
  }
}

async function handleDownloadFixturePdf() {
  if (!isReadyToFetch.value) return
  actionLoading.value = true
  const res = await matchStore.downloadFixturePdf(form.value.tournamentId, form.value.categoryId, form.value.stageId)
  actionLoading.value = false
  if (!res.success) {
    notify(res.message, 'error')
  }
}

// Format the date label for the poster based on the first match date of the round
function formatPosterDate(dateStr) {
  if (!dateStr) return 'PRÓXIMAMENTE'
  const d = new Date(dateStr)
  // Options to get something like "SÁBADO 27 DE JUNIO"
  const formatted = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  return formatted.toUpperCase().replace(',', '')
}

function formatPosterTime(dateStr) {
  if (!dateStr) return 'POR DEFINIR'
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

async function downloadRoundPoster(round, matches, format = 'png') {
  isGeneratingPoster.value = true
  
  try {
    const tournament = tournamentStore.tournaments.find(t => t.id === form.value.tournamentId)
    const stage = stageStore.items.find(s => s.id === form.value.stageId)
    
    // Sort matches by time
    const sortedMatches = [...matches].sort((a,b) => new Date(a.matchDate) - new Date(b.matchDate))
    const firstMatchDate = sortedMatches[0]?.matchDate
    
    const isKnockout = stage?.type === 'KNOCKOUT'
    const roundLabel = isKnockout ? `FASE FINAL` : `FECHA ${round}`
    
    // Prep data for poster component
    posterData.value = {
      tournamentName: tournament?.name || 'LIGA',
      roundLabel: roundLabel,
      dateLabel: formatPosterDate(firstMatchDate),
      matches: sortedMatches.map(m => ({
        homeTeamName: getTeamName(m.homeTeamId),
        homeTeamLogo: getTeamLogo(m.homeTeamId),
        awayTeamName: getTeamName(m.awayTeamId),
        awayTeamLogo: getTeamLogo(m.awayTeamId),
        time: formatPosterTime(m.matchDate),
        subtitle: isKnockout && m.round === 1 ? 'SEMIFINAL' : null // Optional: Add logic if it's knockout
      }))
    }

    // Wait for Vue to render the component in the DOM
    await nextTick()
    // Wait a bit more for images (logos) to load if they are external
    await new Promise(r => setTimeout(r, 1000))

    const el = document.getElementById('fixture-poster-capture')
    if (!el) throw new Error("No se pudo encontrar el elemento del póster")

    // Use toJpeg for smaller file size than png, but still high quality
    const dataUrl = await toJpeg(el, { quality: 0.95, pixelRatio: 2 })

    if (format === 'png' || format === 'jpg') {
      // Download as Image
      const link = document.createElement('a')
      link.download = `Fixture_Fecha_${round}_${tournament?.name || 'Torneo'}.jpg`
      link.href = dataUrl
      link.click()
    } else if (format === 'pdf') {
      // Download as PDF
      // A4 portrait
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1920] // Match the poster dimensions
      })
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 1080, 1920)
      pdf.save(`Fixture_Fecha_${round}_${tournament?.name || 'Torneo'}.pdf`)
    }

    notify(`Póster de Fecha ${round} generado con éxito`)
  } catch (error) {
    console.error(error)
    notify('Error al generar el póster', 'error')
  } finally {
    isGeneratingPoster.value = false
    posterData.value = null
  }
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-20px); }

.styled-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.styled-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05); 
  border-radius: 10px;
}
.styled-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3); 
  border-radius: 10px;
}
.styled-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5); 
}
</style>
