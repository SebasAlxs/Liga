<template>
  <div class="page-container p-6">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Gestión de Sedes</h1>
        <p class="text-content-muted mt-1">Administra las canchas y complejos deportivos donde se juegan los partidos.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="relative group">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted group-focus-within:text-primary transition-colors" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar sede..."
            class="bg-surface-hover border border-border/10 rounded-xl pl-10 pr-4 py-2 text-content focus:outline-none focus:border-primary/50 transition-all w-full sm:w-56"
          >
        </div>

        <button
          v-if="authStore.isAdmin"
          @click="openAddModal"
          class="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-obsidian-950 px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:map-pin-plus" class="w-5 h-5" />
          Nueva Sede
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
    <div v-if="headquartersStore.loading && !headquartersStore.headquarters.length" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando sedes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredHeadquarters.length === 0" class="glass-card p-12 text-center rounded-3xl border border-border/5 max-w-lg mx-auto">
      <Icon :name="searchQuery ? 'lucide:search-x' : 'lucide:map-pin'" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">
        {{ searchQuery ? 'No se encontraron sedes' : 'No hay sedes registradas' }}
      </h3>
      <p class="text-content-muted mt-2">
        {{ searchQuery ? 'Intenta con otro nombre.' : 'Registra la primera sede para poder programar partidos.' }}
      </p>
    </div>

    <!-- Table -->
    <div v-else class="glass-card rounded-3xl border border-border/5 overflow-hidden">
      <!-- Stats Bar -->
      <div class="px-6 py-4 border-b border-border/5 flex items-center justify-between">
        <span class="text-sm text-content-muted">
          <span class="text-content font-bold">{{ filteredHeadquarters.length }}</span> sede{{ filteredHeadquarters.length !== 1 ? 's' : '' }} encontrada{{ filteredHeadquarters.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/5 text-left">
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest">Sede</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden md:table-cell">Ciudad</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest hidden lg:table-cell">Dirección</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest">Estado</th>
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredHeadquarters"
              :key="item.id"
              class="border-b border-border/5 hover:bg-surface/2 transition-colors group"
            >
              <!-- Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Icon name="lucide:map-pin" class="w-5 h-5" />
                  </div>
                  <p class="font-semibold text-content">{{ item.name }}</p>
                </div>
              </td>

              <!-- City -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-sm text-content-muted">{{ item.city || '—' }}</span>
              </td>

              <!-- Address -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-sm text-content-muted">{{ item.address || '—' }}</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span :class="`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${item.active ? 'bg-primary/10 text-emerald-400 border border-primary/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`">
                  <span :class="`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-primary-hover' : 'bg-rose-400'}`"></span>
                  {{ item.active ? 'Activa' : 'Inactiva' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div v-if="authStore.isAdmin" class="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEditModal(item)"
                    class="p-2 hover:bg-primary/20 rounded-lg text-content-muted hover:text-emerald-400 transition-colors"
                    title="Editar"
                  >
                    <Icon name="lucide:edit-2" class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDeleteHeadquarters(item)"
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
            <h2 class="text-2xl font-bold text-content">{{ isEditing ? 'Editar Sede' : 'Nueva Sede' }}</h2>
            <p class="text-sm text-content-muted mt-1">Completa la información de la sede.</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-surface/5 rounded-xl text-content-muted hover:text-content transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Nombre de la Sede</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
              placeholder="Ej. Estadio Municipal"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Ciudad</label>
              <input
                v-model="form.city"
                type="text"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
                placeholder="Ej. Quito"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Dirección</label>
              <input
                v-model="form.address"
                type="text"
                class="w-full bg-surface border border-border/10 rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all"
                placeholder="Ej. Av. 9 de Octubre 123"
              >
            </div>
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
                Activa
              </button>
              <button
                type="button"
                @click="form.active = false"
                :class="`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${!form.active ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-surface border-border/10 text-content-muted hover:border-border/20'}`"
              >
                <Icon name="lucide:pause-circle" class="w-4 h-4 inline-block mr-1" />
                Inactiva
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
              {{ isEditing ? 'Guardar Cambios' : 'Crear Sede' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const headquartersStore = useHeadquartersStore()

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const notification = ref(null)
const editingId = ref(null)

const filteredHeadquarters = computed(() => {
  let list = headquartersStore.headquarters
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.city && h.city.toLowerCase().includes(q))
    )
  }
  return list
})

const form = ref({
  name: '',
  city: '',
  address: '',
  active: true
})

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', city: '', address: '', active: true }
  showModal.value = true
}

function openEditModal(item) {
  isEditing.value = true
  editingId.value = item.id
  form.value = {
    name: item.name,
    city: item.city || '',
    address: item.address || '',
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
      city: form.value.city,
      address: form.value.address,
      active: form.value.active
    }

    const res = isEditing.value
      ? await headquartersStore.updateHeadquarters(editingId.value, payload)
      : await headquartersStore.createHeadquarters(payload)

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

async function handleDeleteHeadquarters(item) {
  if (!confirm(`¿Eliminar la sede "${item.name}"?`)) return
  loading.value = true
  const res = await headquartersStore.deleteHeadquarters(item.id)
  if (res.success) {
    notify(res.message)
  } else {
    notify(res.message, 'error')
  }
  loading.value = false
}

onMounted(() => {
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
