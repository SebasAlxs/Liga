<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-content mb-2">
          Gestión de <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Torneos</span>
        </h1>
        <p class="text-content-muted">Organiza y supervisa tus campeonatos activos.</p>
      </div>

      <button
        v-if="authStore.isAdmin"
        @click="openAddModal"
        class="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-obsidian-950 px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
      >
        <Icon name="lucide:trophy" class="w-5 h-5" />
        Nuevo Torneo
      </button>
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
    <div v-if="tournamentStore.loading && !tournamentStore.tournaments.length" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando torneos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!tournamentStore.tournaments.length" class="glass-card p-12 text-center rounded-3xl border border-border/5 max-w-lg mx-auto">
      <Icon name="lucide:trophy" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">No hay torneos registrados</h3>
      <p class="text-content-muted mt-2">Crea el primer torneo para poder organizar partidos y tablas de posiciones.</p>
    </div>

    <!-- List -->
    <div v-else class="glass-card rounded-3xl border border-border/5 overflow-hidden">
      <div class="px-6 py-4 border-b border-border/5 flex items-center justify-between">
        <span class="text-sm text-content-muted">
          <span class="text-content font-bold">{{ tournamentStore.tournaments.length }}</span> torneo{{ tournamentStore.tournaments.length !== 1 ? 's' : '' }} registrado{{ tournamentStore.tournaments.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <div class="divide-y divide-border/5">
        <div
          v-for="item in tournamentStore.tournaments"
          :key="item.id"
          class="px-6 py-4 flex items-center gap-4 hover:bg-surface/2 transition-colors group"
        >
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Icon name="lucide:trophy" class="w-5 h-5" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-content truncate">{{ item.name }}</p>
            <p class="text-sm text-content-muted truncate">
              {{ item.maxYellowCardsForSuspension }} 🟨 = suspensión
              <template v-if="getHeadquartersName(item.headquartersId)"> · {{ getHeadquartersName(item.headquartersId) }}</template>
            </p>
          </div>

          <span :class="`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${item.active ? 'bg-primary/10 text-emerald-400 border border-primary/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`">
            <span :class="`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-primary-hover' : 'bg-rose-400'}`"></span>
            {{ item.active ? 'Activo' : 'Inactivo' }}
          </span>

          <div v-if="authStore.isAdmin" class="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              @click="openEditModal(item)"
              class="p-2 hover:bg-primary/20 rounded-lg text-content-muted hover:text-emerald-400 transition-colors"
              title="Editar"
            >
              <Icon name="lucide:edit-2" class="w-4 h-4" />
            </button>
            <button
              @click="handleDeleteTournament(item)"
              class="p-2 hover:bg-rose-500/20 rounded-lg text-content-muted hover:text-rose-400 transition-colors"
              title="Eliminar"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-background backdrop-blur-md" @click="closeModal"></div>

      <div class="glass-card w-full max-w-lg rounded-3xl border border-border/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden overflow-y-auto max-h-[90vh]">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

        <header class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold text-content">{{ isEditing ? 'Editar Torneo' : 'Nuevo Torneo' }}</h2>
            <p class="text-sm text-content-muted mt-1">Completa la información del torneo.</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-surface/5 rounded-xl text-content-muted hover:text-content transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Nombre del Torneo</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
              placeholder="Ej. Torneo Apertura 2025"
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Amarillas para suspensión</label>
            <input
              v-model.number="form.maxYellowCardsForSuspension"
              type="number"
              min="1"
              max="10"
              required
              class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all font-mono"
              placeholder="3"
            >
            <p class="text-xs text-content-muted mt-1.5">Número de tarjetas acumuladas que generan una suspensión automática.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Sede del Torneo (opcional)</label>
            <select
              v-model="form.headquartersId"
              class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
            >
              <option value="">Sin sede asignada</option>
              <option v-for="h in headquartersStore.headquarters" :key="h.id" :value="h.id">{{ h.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-3">Estado</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.active = true"
                :class="`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${form.active ? 'bg-primary/20 border-primary text-emerald-400' : 'bg-surface border-border/10 text-content-muted hover:border-border/20'}`"
              >
                <Icon name="lucide:check-circle" class="w-4 h-4 inline-block mr-1" />
                Activo
              </button>
              <button
                type="button"
                @click="form.active = false"
                :class="`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${!form.active ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-surface border-border/10 text-content-muted hover:border-border/20'}`"
              >
                <Icon name="lucide:pause-circle" class="w-4 h-4 inline-block mr-1" />
                Inactivo
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
              {{ isEditing ? 'Guardar Cambios' : 'Crear Torneo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const tournamentStore = useTournamentStore()
const headquartersStore = useHeadquartersStore()

const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const notification = ref(null)
const editingId = ref(null)

const form = ref({
  name: '',
  maxYellowCardsForSuspension: 3,
  headquartersId: '',
  active: true
})

function getHeadquartersName(id) {
  if (!id) return null
  const h = headquartersStore.headquarters.find(h => h.id === id)
  return h ? h.name : null
}

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', maxYellowCardsForSuspension: 3, headquartersId: '', active: true }
  showModal.value = true
}

function openEditModal(item) {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    name: item.name,
    maxYellowCardsForSuspension: item.maxYellowCardsForSuspension,
    headquartersId: item.headquartersId || '',
    active: item.active
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
      name: form.value.name,
      maxYellowCardsForSuspension: Number(form.value.maxYellowCardsForSuspension),
      active: form.value.active,
      ...(form.value.headquartersId && { headquartersId: form.value.headquartersId })
    }

    const res = isEditing.value
      ? await tournamentStore.updateTournament(editingId.value, payload)
      : await tournamentStore.createTournament(payload)

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

async function handleDeleteTournament(item) {
  if (!confirm(`¿Eliminar el torneo "${item.name}"?`)) return
  loading.value = true
  const res = await tournamentStore.deleteTournament(item.id)
  if (res.success) {
    notify(res.message)
  } else {
    notify(res.message, 'error')
  }
  loading.value = false
}

onMounted(() => {
  tournamentStore.fetchTournaments()
  headquartersStore.fetchHeadquarters()
})
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
