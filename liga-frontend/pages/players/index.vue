<template>
  <div class="page-container p-6">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Gestión de Jugadores</h1>
        <p class="text-content-muted mt-1">Administra la plantilla de jugadores de la liga.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Filter by team -->
        <select
          v-model="selectedTeamId"
          class="select-arrow bg-surface-hover border border-border/10 rounded-xl px-4 py-2 text-content focus:outline-none focus:border-primary/50 transition-all"
          @change="onTeamFilterChange"
        >
          <option value="">Todos los equipos</option>
          <option v-for="team in teamStore.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>

        <!-- Search -->
        <div class="relative group">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted group-focus-within:text-primary transition-colors" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar jugador..."
            class="bg-surface-hover border border-border/10 rounded-xl pl-10 pr-4 py-2 text-content focus:outline-none focus:border-primary/50 transition-all w-full sm:w-56"
          >
        </div>

        <button
          v-if="authStore.canManageTeams"
          id="btn-add-player"
          @click="openAddModal"
          class="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-obsidian-950 px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:user-plus" class="w-5 h-5" />
          Nuevo Jugador
        </button>
      </div>
    </div>

    <!-- Notification -->
    <Transition name="fade">
      <div
        v-if="notification"
        :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-primary/20 border-primary/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`"
      >
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="playerStore.loading && !playerStore.players.length" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando jugadores...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPlayers.length === 0" class="glass-card p-12 text-center rounded-3xl border border-border/5 max-w-lg mx-auto">
      <Icon :name="searchQuery ? 'lucide:search-x' : 'lucide:users'" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">
        {{ searchQuery ? 'No se encontraron jugadores' : 'No hay jugadores registrados' }}
      </h3>
      <p class="text-content-muted mt-2">
        {{ searchQuery ? 'Intenta con otro nombre.' : 'Agrega el primer jugador a la liga.' }}
      </p>
    </div>

    <!-- Players Table -->
    <div v-else class="glass-card rounded-3xl border border-border/5 overflow-hidden">
      <!-- Stats Bar -->
      <div class="px-6 py-4 border-b border-border/5 flex items-center justify-between">
        <span class="text-sm text-content-muted">
          <span class="text-content font-bold">{{ filteredPlayers.length }}</span> jugadores encontrados
        </span>
        <div class="flex items-center gap-4 text-xs text-content-muted">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-primary"></span> Local
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Foráneo
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/5 text-left">
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest w-12">#</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest">Jugador</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden md:table-cell">Cédula</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden lg:table-cell">Equipo</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden lg:table-cell">Edad</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden md:table-cell">Tipo</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in filteredPlayers"
              :key="player.id"
              class="border-b border-border/5 hover:bg-surface/2 transition-colors group"
            >
              <!-- Dorsal -->
              <td class="px-6 py-4">
                <span class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-emerald-400 font-bold text-sm font-mono">
                  {{ player.number }}
                </span>
              </td>

              <!-- Name + Photo -->
              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/players/${player.id}`"
                  class="flex items-center gap-3 w-fit"
                >
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-surface-hover border border-border/10 flex-shrink-0">
                    <img
                      v-if="player.picture"
                      :src="player.picture"
                      class="w-full h-full object-cover"
                      alt="Foto jugador"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <Icon name="lucide:user" class="w-5 h-5 text-content-muted" />
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold text-content group-hover:text-emerald-400 transition-colors">
                      {{ player.firstName }} {{ player.lastName }}
                    </p>
                    <span v-if="suspensionStore.isPlayerSuspended(player.id)" class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      🚫 Sancionado
                    </span>
                  </div>
                </NuxtLink>
              </td>

              <!-- Cédula -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-sm text-content-muted font-mono">{{ player.dni || '—' }}</span>
              </td>

              <!-- Team -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-sm text-content-muted">{{ getTeamName(player.teamId) }}</span>
              </td>

              <!-- Age -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-sm text-content-muted">{{ (player.dateOfBirth || player.birthDate) ? calculateAge(player.dateOfBirth || player.birthDate) + ' años' : '—' }}</span>
              </td>

              <!-- Local/Foráneo -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span :class="`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${player.isLocal ? 'bg-primary/10 text-emerald-400 border border-primary/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`">
                  <span :class="`w-1.5 h-1.5 rounded-full ${player.isLocal ? 'bg-primary-hover' : 'bg-amber-400'}`"></span>
                  {{ player.isLocal ? 'Local' : 'Foráneo' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div v-if="authStore.canManageTeams" class="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEditModal(player)"
                    class="p-2 hover:bg-primary/20 rounded-lg text-content-muted hover:text-emerald-400 transition-colors"
                    title="Editar"
                  >
                    <Icon name="lucide:edit-2" class="w-4 h-4" />
                  </button>
                  <button
                    v-if="authStore.isAdmin"
                    @click="handleDeletePlayer(player)"
                    class="p-2 hover:bg-rose-500/20 rounded-lg text-content-muted hover:text-rose-400 transition-colors"
                    title="Eliminar"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-background backdrop-blur-md" @click="closeModal"></div>

      <div class="glass-card w-full max-w-lg rounded-3xl border border-border/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden overflow-y-auto max-h-[90vh]">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

        <header class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold text-content">{{ isEditing ? 'Editar Jugador' : 'Nuevo Jugador' }}</h2>
            <p class="text-sm text-content-muted mt-1">Completa la información del jugador.</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-surface/5 rounded-xl text-content-muted hover:text-content transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Photo Upload -->
          <div class="flex justify-center mb-2">
            <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
              <div class="w-24 h-24 rounded-3xl bg-surface-hover border-2 border-dashed border-border/10 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                <img
                  v-if="form.picture"
                  :src="form.picture"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-center p-2">
                  <Icon name="lucide:camera" class="w-8 h-8 text-content-muted mb-1 mx-auto" />
                  <span class="text-[10px] text-content-muted font-bold uppercase">Foto</span>
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Icon name="lucide:upload" class="w-4 h-4 text-obsidian-950" />
              </div>
              <input ref="fileInput" type="file" hidden accept="image/*" @change="onFileSelected">
            </div>
          </div>

          <!-- Cédula / DNI como primer campo principal -->
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Cédula / DNI</label>
            <div class="relative">
              <Icon name="lucide:id-card" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
              <input
                v-model="form.dni"
                @input="handleDniInput"
                type="text"
                maxlength="10"
                :class="['w-full bg-surface border rounded-xl pl-12 pr-12 py-4 text-content focus:outline-none transition-all font-mono text-lg font-bold shadow-sm', 
                  cedulaError ? 'border-rose-500/50 focus:border-rose-500' : 
                  cedulaSuccess ? 'border-emerald-500/50 focus:border-emerald-500' : 
                  'border-border/10 focus:border-primary'
                ]"
                placeholder="Ingresa los 10 dígitos..."
              >
              <Icon v-if="loadingDni" name="lucide:loader-2" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
              <Icon v-else-if="cedulaSuccess" name="lucide:check-circle-2" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <Icon v-else-if="cedulaError" name="lucide:alert-circle" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
            </div>
            <p class="text-[10px] text-content-muted mt-2 ml-1">Ingresa la cédula para autocompletar los datos.</p>
          </div>

          <!-- Nombre y Apellido -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Nombre</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
                placeholder="Juan"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Apellido</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
                placeholder="Pérez"
              >
            </div>
          </div>

          <!-- Dorsal y Fecha de Nacimiento -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Dorsal #</label>
              <input
                v-model.number="form.number"
                type="number"
                required
                min="1"
                max="99"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all font-mono"
                placeholder="10"
              >
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest">Nacimiento</label>
                <span v-if="form.birthDate" class="text-xs font-bold text-primary">{{ calculateAge(form.birthDate) }} años</span>
              </div>
              <input
                v-model="form.birthDate"
                type="date"
                required
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all font-mono"
              >
            </div>
          </div>

          <!-- Equipo -->
          <div v-if="!authStore.isDirigente">
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Equipo</label>
            <select
              v-model="form.teamId"
              required
              class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
            >
              <option value="" disabled>Selecciona un equipo...</option>
              <option v-for="team in teamStore.teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Tipo de Jugador -->
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-3">Tipo de Jugador</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.isLocal = true"
                :class="`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${form.isLocal ? 'bg-primary/20 border-primary text-emerald-400' : 'bg-surface border-border/10 text-content-muted hover:border-border/20'}`"
              >
                <Icon name="lucide:home" class="w-4 h-4 inline-block mr-1" />
                Local
              </button>
              <button
                type="button"
                @click="form.isLocal = false"
                :class="`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${!form.isLocal ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-surface border-border/10 text-content-muted hover:border-border/20'}`"
              >
                <Icon name="lucide:plane" class="w-4 h-4 inline-block mr-1" />
                Foráneo
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="pt-4 flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-4 rounded-2xl border border-border/10 text-content hover:bg-surface/5 transition-all font-bold text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-obsidian-950 hover:from-emerald-400 hover:to-teal-400 transition-all font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ isEditing ? 'Guardar Cambios' : 'Crear Jugador' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const suspensionStore = useSuspensionStore()

// State
const searchQuery = ref('')
const selectedTeamId = ref('')
const managedByMe = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const loadingDni = ref(false)
const cedulaSuccess = ref(false)
const cedulaError = ref(false)
const notification = ref(null)
const editingId = ref(null)

const form = ref({
  firstName: '',
  lastName: '',
  number: null,
  teamId: '',
  dni: '',
  birthDate: '',
  isLocal: true,
  picture: ''
})

// Computed
const filteredPlayers = computed(() => {
  let list = playerStore.players
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      (p.dni && p.dni.includes(q))
    )
  }
  return list
})

// Helpers
function getTeamName(teamId) {
  const team = teamStore.teams.find(t => t.id === teamId)
  return team ? team.name : '—'
}

function calculateAge(birthDate) {
  const today = new Date()
  const bd = new Date(birthDate)
  let age = today.getFullYear() - bd.getFullYear()
  const m = today.getMonth() - bd.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
  return age
}

// Hooks
onMounted(async () => {
  await Promise.all([
    playerStore.fetchPlayers(false, managedByMe.value),
    teamStore.fetchTeams(false, managedByMe.value),
    suspensionStore.fetchSuspensions(true)
  ])
})

// Methods
async function toggleManagedByMe() {
  managedByMe.value = !managedByMe.value
  await Promise.all([
    playerStore.fetchPlayers(true, managedByMe.value),
    teamStore.fetchTeams(true, managedByMe.value)
  ])
}
function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

async function handleDniInput() {
  cedulaSuccess.value = false
  cedulaError.value = false
  if (form.value.dni && form.value.dni.length === 10) {
    await fetchCedulaData(form.value.dni)
  }
}

async function fetchCedulaData(dni) {
  loadingDni.value = true
  cedulaSuccess.value = false
  cedulaError.value = false
  try {
    const data = await $fetch('/api/cedula', { query: { dni } })
    if (data && data.nombres && data.apellidos) {
      form.value.firstName = data.nombres
      form.value.lastName = data.apellidos
      
      const rawDate = data.fechaNacimiento || data.fecha_nacimiento || data.fecha_de_nacimiento
      if (rawDate) {
        let parsedDate = rawDate
        if (rawDate.includes('/')) {
           const parts = rawDate.split('/')
           if (parts.length === 3) {
             const [d, m, y] = parts
             if (y.length === 4) parsedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
           }
        }
        form.value.birthDate = parsedDate
      }
      
      cedulaSuccess.value = true
      notify('Datos cargados exitosamente', 'success')
    }
  } catch (error) {
    cedulaError.value = true
    const msg = error.response?._data?.statusMessage || 'No se pudo obtener datos de la cédula'
    notify(msg, 'error')
  } finally {
    loadingDni.value = false
  }
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  
  const defaultTeam = authStore.isDirigente && teamStore.teams.length > 0 
    ? teamStore.teams[0].id 
    : (selectedTeamId.value || '')

  form.value = {
    firstName: '',
    lastName: '',
    number: null,
    teamId: defaultTeam,
    dni: '',
    birthDate: '',
    isLocal: true,
    picture: ''
  }
  showModal.value = true
}

function openEditModal(player) {
  isEditing.value = true
  editingId.value = player.id
  form.value = {
    firstName: player.firstName,
    lastName: player.lastName,
    number: player.number,
    teamId: player.teamId,
    dni: player.dni || '',
    birthDate: (player.dateOfBirth || player.birthDate) ? (player.dateOfBirth || player.birthDate).split('T')[0] : '',
    isLocal: player.isLocal,
    picture: player.picture || ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  loading.value = true
  try {
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      number: Number(form.value.number),
      teamId: form.value.teamId,
      isLocal: form.value.isLocal,
      ...(form.value.dni && { dni: form.value.dni }),
      ...(form.value.birthDate && { birthDate: form.value.birthDate }),
      ...(form.value.picture && {
        picture: form.value.picture.startsWith('data:')
          ? form.value.picture.split(',')[1]
          : form.value.picture
      })
    }

    let res
    if (isEditing.value) {
      res = await playerStore.updatePlayer(editingId.value, payload)
    } else {
      res = await playerStore.createPlayer(payload)
    }

    if (res.success) {
      notify(res.message)
      closeModal()
    } else {
      notify(res.message, 'error')
    }
  } catch (err) {
    notify('Error inesperado procesando la solicitud', 'error')
  } finally {
    loading.value = false
  }
}

async function handleDeletePlayer(player) {
  if (!confirm(`¿Eliminar a ${player.firstName} ${player.lastName}?`)) return
  loading.value = true
  const res = await playerStore.deletePlayer(player.id)
  if (res.success) {
    notify(res.message)
  } else {
    notify(res.message, 'error')
  }
  loading.value = false
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 2000000) {
    notify('La imagen no debe superar los 2MB', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.picture = e.target.result
  }
  reader.readAsDataURL(file)
}

async function onTeamFilterChange() {
  if (selectedTeamId.value) {
    await playerStore.fetchPlayersByTeam(selectedTeamId.value)
  } else {
    await playerStore.fetchPlayers()
  }
}
</script>

<style scoped>


.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
