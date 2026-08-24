<template>
  <div class="page-container p-6">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">{{ authStore.canManageTeams ? 'Gestión de Equipos' : 'Equipos de la Liga' }}</h1>
        <p class="text-content-muted mt-1">{{ authStore.canManageTeams ? 'Administra lo clubes y delegados de la liga.' : 'Conoce a los clubes que participan en el torneo.' }}</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative group">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted group-focus-within:text-primary transition-colors" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar equipo..." 
            class="bg-surface/80 border border-border rounded-xl pl-10 pr-4 py-2 text-content focus:outline-none focus:border-primary transition-all w-full sm:w-64"
          >
        </div>

        <button 
          v-if="authStore.canManageTeams"
          @click="openAddModal"
          class="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-content px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:plus" class="w-5 h-5" />
          {{ authStore.canManageTeams ? 'Nuevo Equipo' : 'Inscribir Equipo' }}
        </button>
      </div>
    </div>

    <!-- Alert Notification -->
    <Transition name="fade">
      <div v-if="notification" :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-primary/20 border-primary/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`">
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="teamStore.loading && !teamStore.teams.length" class="flex justify-center py-20 text-center flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando equipos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTeams.length === 0" class="glass-card p-12 text-center rounded-3xl border border-border shadow-xl max-w-lg mx-auto">
      <Icon :name="searchQuery ? 'lucide:search-x' : 'lucide:shield-off'" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">
        {{ searchQuery ? 'No se encontraron equipos' : 'No hay equipos registrados' }}
      </h3>
      <p class="text-content-muted mt-2">
        {{ searchQuery ? 'Intenta con otro término de búsqueda.' : 'Comienza agregando el primer equipo a la liga.' }}
      </p>
    </div>

    <!-- Teams Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="team in filteredTeams" 
        :key="team.id"
        class="glass-card group hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden border border-border flex flex-col"
      >
        <div class="p-6 flex-1">
          <div class="flex items-start justify-between mb-4">
            <div class="w-16 h-16 rounded-2xl bg-background flex items-center justify-center border border-border group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
              <img v-if="team.logo" :src="team.logo" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-10 h-10 text-emerald-300" />
            </div>
            <div v-if="canManageTeam(team)" class="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="openEditModal(team)" class="p-2 hover:bg-emerald-100 rounded-lg text-content-muted hover:text-primary transition-colors" title="Editar">
                <Icon name="lucide:edit-2" class="w-4 h-4" />
              </button>
              <button @click.stop="handleDeleteTeam(team)" class="p-2 hover:bg-rose-100 rounded-lg text-content-muted hover:text-rose-600 transition-colors" title="Eliminar">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-content mb-1 group-hover:text-primary transition-colors">
            {{ team.name }}
          </h3>
          <p class="text-xs text-content-muted font-mono">ID: {{ team.id.substring(0, 8) }}</p>
          
          <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div class="flex flex-col">
              <span class="text-[10px] text-content-muted uppercase tracking-wider font-bold">Fundación</span>
              <span class="text-sm font-semibold text-content">{{ team.foundedYear || '-' }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-content-muted uppercase tracking-wider font-bold">Puntos</span>
              <span class="text-sm font-bold text-primary">{{ team.points }}</span>
            </div>
          </div>
        </div>
        
        <!-- "Gestionar Plantilla" solo para admins o vocales, o quiza solo quitar el boton de CRUD. Pero si un publico entra a "ver", deberia decir "Ver Plantilla" -->
        <NuxtLink :to="`/teams/${team.id}`" class="px-6 py-4 bg-background/50 hover:bg-emerald-50 transition-all flex justify-between items-center group/link border-t border-border">
          <span class="text-sm font-bold text-content-muted group-hover/link:text-content transition-colors">{{ authStore.canManageTeams ? 'Gestionar Plantilla' : 'Ver Plantilla' }}</span>
          <div class="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-content transition-all">
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Modal Form (Add/Edit) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="closeModal"></div>
      
      <div class="glass-card w-full max-w-lg rounded-3xl border border-border p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        
        <header class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold text-content">{{ isEditing ? 'Editar Equipo' : 'Nuevo Equipo' }}</h2>
            <p class="text-sm text-content-muted mt-1">Completa la información del club.</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-surface-hover rounded-xl text-content-muted hover:text-content-muted transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="flex justify-center mb-4">
            <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
              <div class="w-24 h-24 rounded-3xl bg-background border-2 border-dashed border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover" />
                <div v-else class="text-center p-2">
                  <Icon name="lucide:camera" class="w-8 h-8 text-slate-300 mb-1 mx-auto" />
                  <span class="text-[10px] text-content-muted font-bold uppercase">Logo</span>
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Icon name="lucide:upload" class="w-4 h-4 text-content" />
              </div>
              <input ref="fileInput" type="file" hidden accept="image/*" @change="onFileSelected">
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Nombre del Equipo</label>
              <input 
                v-model="form.name" 
                type="text" 
                required
                class="w-full bg-surface border border-border rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all shadow-inner" 
                placeholder="Ej. Club Atletico Nacional"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Año de Fundación</label>
                <input 
                  v-model.number="form.foundedYear" 
                  type="number" 
                  class="w-full bg-surface border border-border rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all shadow-inner font-mono" 
                  placeholder="2024"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Campeonatos</label>
                <input 
                  v-model.number="form.championshipsWon" 
                  type="number" 
                  class="w-full bg-surface border border-border rounded-xl px-4 py-3 text-content focus:outline-none focus:border-primary transition-all shadow-inner font-mono" 
                  placeholder="0"
                >
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-3">
            <button 
              type="button"
              @click="closeModal" 
              class="flex-1 px-4 py-4 rounded-2xl border border-border text-content hover:bg-surface-hover transition-all font-bold text-sm tracking-wide"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-content hover:from-emerald-400 hover:to-teal-400 transition-all font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ isEditing ? 'Guardar Cambios' : 'Crear Equipo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const teamStore = useTeamStore()

// State
const searchQuery = ref('')
const managedByMe = ref(true) // Default true for Dirigentes
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const notification = ref(null)
const editingId = ref(null)

const form = ref({
  name: '',
  logo: '',
  foundedYear: new Date().getFullYear(),
  championshipsWon: 0
})

// Computed
const filteredTeams = computed(() => {
  if (!searchQuery.value) return teamStore.teams
  const query = searchQuery.value.toLowerCase()
  return teamStore.teams.filter(t => t.name.toLowerCase().includes(query))
})

// Hooks
onMounted(async () => {
  await teamStore.fetchTeams(false, managedByMe.value)
})

// Methods
async function toggleManagedByMe() {
  managedByMe.value = !managedByMe.value
  await teamStore.fetchTeams(true, managedByMe.value)
}
function canManageTeam(team) {
  if (authStore.isSuperAdmin) return true
  if (authStore.isDirigente && team.managerId === authStore.user?.id) return true
  return false
}

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3000)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = {
    name: '',
    logo: '',
    foundedYear: new Date().getFullYear(),
    championshipsWon: 0
  }
  showModal.value = true
}

function openEditModal(team) {
  isEditing.value = true
  editingId.value = team.id
  form.value = { 
    name: team.name, 
    logo: team.logo || '',
    foundedYear: team.foundedYear || new Date().getFullYear(),
    championshipsWon: team.championshipsWon || 0
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  loading.value = true
  try {
    let res
    if (isEditing.value) {
      res = await teamStore.updateTeam(editingId.value, form.value)
    } else {
      res = await teamStore.createTeam(form.value)
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

async function handleDeleteTeam(team) {
  if (!confirm(`¿Estás seguro de eliminar al equipo ${team.name}?`)) return
  
  loading.value = true
  const res = await teamStore.deleteTeam(team.id)
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
    form.value.logo = e.target.result
  }
  reader.readAsDataURL(file)
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
