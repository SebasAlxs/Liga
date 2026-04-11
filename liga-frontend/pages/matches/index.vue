<template>
  <div class="page-container p-6">

    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white font-display">Gestión de Partidos</h1>
        <p class="text-obsidian-400 mt-1">Programa y administra los encuentros de la liga.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 flex-wrap">
        <select v-model="filterTournament" class="bg-obsidian-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-sm">
          <option value="">Todos los torneos</option>
          <option v-for="t in matchStore.tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <select v-model="filterStatus" class="bg-obsidian-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-all text-sm">
          <option value="">Todos los estados</option>
          <option value="SCHEDULED">Programados</option>
          <option value="IN_PROGRESS">En juego</option>
          <option value="FINISHED">Finalizados</option>
          <option value="CANCELLED">Cancelados</option>
        </select>
        <button v-if="authStore.isAdmin" id="btn-add-match" @click="openAddModal" class="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-obsidian-950 px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap text-sm">
          <Icon name="lucide:calendar-plus" class="w-5 h-5" />
          Nuevo Partido
        </button>
      </div>
    </div>

    <!-- Notification -->
    <Transition name="fade">
      <div v-if="notification" :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`">
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="matchStore.loading && !matchStore.matches.length" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p class="text-obsidian-400 animate-pulse">Cargando partidos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredMatches.length === 0" class="glass-card p-12 text-center rounded-3xl border border-white/5 max-w-lg mx-auto">
      <Icon name="lucide:calendar-x" class="w-16 h-16 text-obsidian-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white">No hay partidos</h3>
      <p class="text-obsidian-400 mt-2">No se encontraron partidos con los filtros actuales.</p>
    </div>

    <!-- Matches grouped by date -->
    <div v-else class="space-y-4">
      <div v-for="(group, date) in groupedMatches" :key="date">
        <!-- Date separator -->
        <div class="flex items-center gap-4 mb-4 mt-6 first:mt-0">
          <div class="flex-shrink-0 text-xs font-bold text-obsidian-500 uppercase tracking-widest">
            {{ formatDateLabel(date) }}
          </div>
          <div class="flex-1 h-px bg-white/5"></div>
          <span class="text-xs text-obsidian-600">{{ group.length }} partido{{ group.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Match Cards -->
        <div class="space-y-3">
          <div v-for="match in group" :key="match.id" class="glass-card rounded-2xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden">
            <div :class="`h-1 w-full ${statusColor(match.status).strip}`"></div>

            <div class="p-5 flex items-center gap-4">
              <!-- Status Badge -->
              <div class="flex-shrink-0 w-24 hidden sm:block">
                <span :class="`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusColor(match.status).badge}`">
                  <span :class="`w-1.5 h-1.5 rounded-full ${statusColor(match.status).dot} ${match.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`"></span>
                  {{ statusLabel(match.status) }}
                </span>
              </div>

              <!-- Home Team -->
              <div class="flex-1 flex items-center justify-end gap-3 min-w-0">
                <span class="font-bold text-white text-right truncate group-hover:text-emerald-400 transition-colors">{{ getTeamName(match.homeTeamId) }}</span>
                <div class="w-10 h-10 rounded-xl bg-obsidian-800 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img v-if="getTeamLogo(match.homeTeamId)" :src="getTeamLogo(match.homeTeamId)" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:shield" class="w-5 h-5 text-obsidian-600" />
                </div>
              </div>

              <!-- Score / VS -->
              <div class="flex-shrink-0 flex items-center gap-2 px-2">
                <template v-if="match.status === 'SCHEDULED' || match.status === 'CANCELLED'">
                  <div class="text-center">
                    <p class="text-obsidian-500 font-black text-xs uppercase tracking-widest">vs</p>
                    <p class="text-obsidian-600 text-xs mt-0.5">{{ formatTime(match.matchDate) }}</p>
                  </div>
                </template>
                <template v-else>
                  <span class="text-2xl font-black text-white font-mono w-6 text-center">{{ match.homeScore ?? '-' }}</span>
                  <span class="text-obsidian-600 font-black text-lg">:</span>
                  <span class="text-2xl font-black text-white font-mono w-6 text-center">{{ match.awayScore ?? '-' }}</span>
                </template>
              </div>

              <!-- Away Team -->
              <div class="flex-1 flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-obsidian-800 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img v-if="getTeamLogo(match.awayTeamId)" :src="getTeamLogo(match.awayTeamId)" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:shield" class="w-5 h-5 text-obsidian-600" />
                </div>
                <span class="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{{ getTeamName(match.awayTeamId) }}</span>
              </div>

              <!-- Torneo + Acciones -->
              <div class="flex-shrink-0 flex items-center gap-2 ml-2">
                <span class="text-xs text-obsidian-500 hidden xl:block truncate max-w-[120px]">{{ getTournamentName(match.tournamentId) }}</span>
                <div v-if="authStore.isLoggedIn" class="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button @click="openScoreModal(match)" class="p-2 hover:bg-emerald-500/20 rounded-lg text-obsidian-400 hover:text-emerald-400 transition-colors" title="Actualizar marcador">
                    <Icon name="lucide:clipboard-edit" class="w-4 h-4" />
                  </button>
                  <button v-if="authStore.isAdmin" @click="openEditModal(match)" class="p-2 hover:bg-blue-500/20 rounded-lg text-obsidian-400 hover:text-blue-400 transition-colors" title="Editar">
                    <Icon name="lucide:edit-2" class="w-4 h-4" />
                  </button>
                  <button v-if="authStore.isAdmin" @click="handleDelete(match)" class="p-2 hover:bg-rose-500/20 rounded-lg text-obsidian-400 hover:text-rose-400 transition-colors" title="Eliminar">
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Modal: Create/Edit ─────────────────── -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md" @click="closeModal"></div>
      <div class="glass-card w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        <header class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold text-white">{{ isEditing ? 'Editar Partido' : 'Nuevo Partido' }}</h2>
            <p class="text-sm text-obsidian-400 mt-1">Programa el encuentro entre dos equipos.</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-white/5 rounded-xl text-obsidian-500 hover:text-white transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Fecha y Hora</label>
            <input v-model="form.matchDate" type="datetime-local" required class="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Equipo Local</label>
              <select v-model="form.homeTeamId" required class="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="team in teamStore.teams" :key="team.id" :value="team.id" :disabled="team.id === form.awayTeamId">{{ team.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Equipo Visitante</label>
              <select v-model="form.awayTeamId" required class="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="team in teamStore.teams" :key="team.id" :value="team.id" :disabled="team.id === form.homeTeamId">{{ team.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Torneo</label>
              <select v-model="form.tournamentId" required class="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="t in matchStore.tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-2">Categoría</label>
              <select v-model="form.categoryId" required class="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                <option value="" disabled>Seleccionar...</option>
                <option v-for="c in matchStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-xs font-bold text-obsidian-500 uppercase tracking-widest mb-3">Estado</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="s in statusOptions" :key="s.value" type="button" @click="form.status = s.value" :class="`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${form.status === s.value ? s.activeClass : 'bg-obsidian-900 border-white/10 text-obsidian-400 hover:border-white/20'}`">
                <Icon :name="s.icon" class="w-4 h-4 flex-shrink-0" />{{ s.label }}
              </button>
            </div>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold text-sm">Cancelar</button>
            <button type="submit" :disabled="formLoading" class="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian-950 hover:from-emerald-400 hover:to-teal-400 transition-all font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon v-if="formLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ isEditing ? 'Guardar Cambios' : 'Crear Partido' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Modal: Marcador rápido ─────────────── -->
    <div v-if="showScoreModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md" @click="showScoreModal = false"></div>
      <div class="glass-card w-full max-w-sm rounded-3xl border border-white/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <header class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">Actualizar Marcador</h2>
            <p class="text-xs text-obsidian-400 mt-1">Ingresa el resultado del partido.</p>
          </div>
          <button @click="showScoreModal = false" class="p-2 hover:bg-white/5 rounded-xl text-obsidian-500 hover:text-white transition-colors">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </header>

        <!-- Equipos -->
        <div class="flex items-center justify-between gap-4 mb-8">
          <div class="text-center flex-1">
            <div class="w-14 h-14 rounded-2xl bg-obsidian-800 border border-white/10 flex items-center justify-center mx-auto mb-2 overflow-hidden">
              <img v-if="getTeamLogo(scoreForm.homeTeamId)" :src="getTeamLogo(scoreForm.homeTeamId)" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-7 h-7 text-obsidian-600" />
            </div>
            <p class="text-xs font-bold text-white truncate">{{ getTeamName(scoreForm.homeTeamId) }}</p>
          </div>
          <div class="text-obsidian-600 font-black text-lg flex-shrink-0">vs</div>
          <div class="text-center flex-1">
            <div class="w-14 h-14 rounded-2xl bg-obsidian-800 border border-white/10 flex items-center justify-center mx-auto mb-2 overflow-hidden">
              <img v-if="getTeamLogo(scoreForm.awayTeamId)" :src="getTeamLogo(scoreForm.awayTeamId)" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-7 h-7 text-obsidian-600" />
            </div>
            <p class="text-xs font-bold text-white truncate">{{ getTeamName(scoreForm.awayTeamId) }}</p>
          </div>
        </div>

        <!-- Inputs de marcador -->
        <div class="flex items-center gap-4 mb-6">
          <input v-model.number="scoreForm.homeScore" type="number" min="0" class="flex-1 bg-obsidian-900 border border-white/10 rounded-2xl px-4 py-4 text-white text-3xl font-black text-center focus:outline-none focus:border-emerald-500 transition-all font-mono">
          <span class="text-obsidian-600 font-black text-2xl flex-shrink-0">:</span>
          <input v-model.number="scoreForm.awayScore" type="number" min="0" class="flex-1 bg-obsidian-900 border border-white/10 rounded-2xl px-4 py-4 text-white text-3xl font-black text-center focus:outline-none focus:border-emerald-500 transition-all font-mono">
        </div>

        <!-- Estado rápido -->
        <div class="grid grid-cols-2 gap-2 mb-6">
          <button v-for="s in statusOptions" :key="s.value" type="button" @click="scoreForm.status = s.value" :class="`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 justify-center ${scoreForm.status === s.value ? s.activeClass : 'bg-obsidian-900 border-white/10 text-obsidian-400 hover:border-white/20'}`">
            <Icon :name="s.icon" class="w-3.5 h-3.5" />{{ s.label }}
          </button>
        </div>

        <div class="flex gap-3">
          <button @click="showScoreModal = false" class="flex-1 px-4 py-3 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold text-sm">Cancelar</button>
          <button @click="handleScoreUpdate" :disabled="formLoading" class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 transition-all font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
            <Icon v-if="formLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            Guardar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const authStore = useAuthStore()
const matchStore = useMatchStore()
const teamStore = useTeamStore()

const filterTournament = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const showScoreModal = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const notification = ref(null)
const editingId = ref(null)

const defaultForm = () => ({
  matchDate: '',
  homeTeamId: '',
  awayTeamId: '',
  tournamentId: '',
  categoryId: '',
  status: 'SCHEDULED',
})

const form = ref(defaultForm())

const scoreForm = ref({
  matchId: '',
  homeTeamId: '',
  awayTeamId: '',
  homeScore: 0,
  awayScore: 0,
  status: 'IN_PROGRESS',
})

const statusOptions = [
  { value: 'SCHEDULED', label: 'Programado', icon: 'lucide:calendar', activeClass: 'bg-blue-500/10 border-blue-500/50 text-blue-400', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400', strip: 'bg-blue-500/40', dot: 'bg-blue-400' },
  { value: 'IN_PROGRESS', label: 'En juego', icon: 'lucide:play-circle', activeClass: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', strip: 'bg-emerald-500', dot: 'bg-emerald-400' },
  { value: 'FINISHED', label: 'Finalizado', icon: 'lucide:flag', activeClass: 'bg-obsidian-700/50 border-white/20 text-obsidian-200', badge: 'bg-obsidian-700/30 border-white/10 text-obsidian-400', strip: 'bg-obsidian-600', dot: 'bg-obsidian-400' },
  { value: 'CANCELLED', label: 'Cancelado', icon: 'lucide:x-circle', activeClass: 'bg-rose-500/10 border-rose-500/50 text-rose-400', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400', strip: 'bg-rose-500/40', dot: 'bg-rose-400' },
]

const filteredMatches = computed(() => {
  let list = matchStore.matches
  if (filterTournament.value) list = list.filter(m => m.tournamentId === filterTournament.value)
  if (filterStatus.value) list = list.filter(m => m.status === filterStatus.value)
  return list
})

const groupedMatches = computed(() => {
  const groups = {}
  const sorted = [...filteredMatches.value].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
  for (const match of sorted) {
    const dateKey = match.matchDate.split('T')[0]
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(match)
  }
  return groups
})

function getTeamName(teamId) { return teamStore.teams.find(t => t.id === teamId)?.name ?? teamId }
function getTeamLogo(teamId) { return teamStore.teams.find(t => t.id === teamId)?.logo ?? null }
function getTournamentName(tid) { return matchStore.tournaments.find(t => t.id === tid)?.name ?? '—' }
function statusColor(status) { return statusOptions.find(s => s.value === status) ?? statusOptions[0] }
function statusLabel(status) { return statusOptions.find(s => s.value === status)?.label ?? status }

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === tomorrow.toDateString()) return 'Mañana'
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function toLocalInput(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onMounted(async () => {
  await Promise.all([
    matchStore.fetchMatches(),
    matchStore.fetchTournaments(),
    matchStore.fetchCategories(),
    teamStore.fetchTeams(),
  ])
})

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  showModal.value = true
}

function openEditModal(match) {
  isEditing.value = true
  editingId.value = match.id
  form.value = {
    matchDate: toLocalInput(match.matchDate),
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    tournamentId: match.tournamentId,
    categoryId: match.categoryId,
    status: match.status,
  }
  showModal.value = true
}

function openScoreModal(match) {
  scoreForm.value = {
    matchId: match.id,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeScore: match.homeScore ?? 0,
    awayScore: match.awayScore ?? 0,
    status: match.status === 'SCHEDULED' ? 'IN_PROGRESS' : match.status,
  }
  showScoreModal.value = true
}

function closeModal() { showModal.value = false }

async function handleSubmit() {
  formLoading.value = true
  try {
    const payload = { ...form.value, matchDate: new Date(form.value.matchDate).toISOString() }
    const res = isEditing.value
      ? await matchStore.updateMatch(editingId.value, payload)
      : await matchStore.createMatch(payload)
    if (res.success) { notify(res.message); closeModal() }
    else notify(res.message, 'error')
  } catch { notify('Error inesperado', 'error') }
  finally { formLoading.value = false }
}

async function handleScoreUpdate() {
  formLoading.value = true
  try {
    const res = await matchStore.updateMatch(scoreForm.value.matchId, {
      homeScore: scoreForm.value.homeScore,
      awayScore: scoreForm.value.awayScore,
      status: scoreForm.value.status,
    })
    if (res.success) { notify(res.message); showScoreModal.value = false }
    else notify(res.message, 'error')
  } catch { notify('Error inesperado', 'error') }
  finally { formLoading.value = false }
}

async function handleDelete(match) {
  if (!confirm(`¿Eliminar partido ${getTeamName(match.homeTeamId)} vs ${getTeamName(match.awayTeamId)}?`)) return
  const res = await matchStore.deleteMatch(match.id)
  if (res.success) notify(res.message)
  else notify(res.message, 'error')
}
</script>

<style scoped>
.glass-card {
  background: rgba(14, 20, 27, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
