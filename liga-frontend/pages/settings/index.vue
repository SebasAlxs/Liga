<template>
  <div class="page-container p-6">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-content font-display">Configuración</h1>
      <p class="text-content-muted mt-1">Administra los parámetros base de tu liga antes de iniciar la temporada.</p>
    </div>

    <!-- Notification -->
    <Transition name="fade">
      <div v-if="notification" :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-primary/20 border-primary/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`">
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- 2x2 Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- ══════════════════════════════════ -->
      <!-- TORNEOS                            -->
      <!-- ══════════════════════════════════ -->
      <div class="config-section">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-amber-500/10 border-amber-500/20">
              <Icon name="lucide:trophy" class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-content">Torneos</h2>
              <p class="text-xs text-content-muted">{{ tournaments.length }} registrado{{ tournaments.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button v-if="authStore.isAdmin" @click="openModal('tournament')" class="add-btn">
            <Icon name="lucide:plus" class="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div class="section-body">
          <div v-if="loading.tournaments" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500"></div>
          </div>
          <div v-else-if="!tournaments.length" class="py-8 text-center">
            <Icon name="lucide:trophy" class="w-8 h-8 text-content-muted mx-auto mb-2" />
            <p class="text-sm text-content-muted">Sin torneos creados</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in tournaments" :key="item.id" class="item-row group">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="min-w-0">
                  <p class="font-semibold text-content text-sm truncate">{{ item.name }}</p>
                  <p class="text-xs text-content-muted">{{ item.maxYellowCardsForSuspension }} 🟡 = suspensión</p>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="`status-badge ${item.active ? 'badge-active' : 'badge-inactive'}`">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </span>
                <div v-if="authStore.isAdmin" class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal('tournament', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                    <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDelete('tournament', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                    <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════ -->
      <!-- CATEGORÍAS                         -->
      <!-- ══════════════════════════════════ -->
      <div class="config-section">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-purple-500/10 border-purple-500/20">
              <Icon name="lucide:layers" class="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-content">Categorías</h2>
              <p class="text-xs text-content-muted">{{ categories.length }} registrada{{ categories.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button v-if="authStore.isAdmin" @click="openModal('category')" class="add-btn">
            <Icon name="lucide:plus" class="w-4 h-4" /> Nueva
          </button>
        </div>

        <div class="section-body">
          <div v-if="loading.categories" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
          </div>
          <div v-else-if="!categories.length" class="py-8 text-center">
            <Icon name="lucide:layers" class="w-8 h-8 text-content-muted mx-auto mb-2" />
            <p class="text-sm text-content-muted">Sin categorías creadas</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in categories" :key="item.id" class="item-row group">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-content text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-content-muted">
                  <template v-if="item.minAge || item.maxAge">{{ item.minAge ?? '?' }} – {{ item.maxAge ?? '?' }} años</template>
                  <template v-else>Sin restricción de edad</template>
                </p>
              </div>
              <div v-if="authStore.isAdmin" class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button @click="openEditModal('category', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                  <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                </button>
                <button @click="handleDelete('category', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                  <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════ -->
      <!-- SEDES                              -->
      <!-- ══════════════════════════════════ -->
      <div class="config-section">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-blue-500/10 border-blue-500/20">
              <Icon name="lucide:map-pin" class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-content">Sedes</h2>
              <p class="text-xs text-content-muted">{{ headquarters.length }} registrada{{ headquarters.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button v-if="authStore.isAdmin" @click="openModal('headquarters')" class="add-btn">
            <Icon name="lucide:plus" class="w-4 h-4" /> Nueva
          </button>
        </div>

        <div class="section-body">
          <div v-if="loading.headquarters" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <div v-else-if="!headquarters.length" class="py-8 text-center">
            <Icon name="lucide:map-pin" class="w-8 h-8 text-content-muted mx-auto mb-2" />
            <p class="text-sm text-content-muted">Sin sedes registradas</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in headquarters" :key="item.id" class="item-row group">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-content text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-content-muted truncate">{{ [item.city, item.address].filter(Boolean).join(' · ') || 'Sin dirección' }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="`status-badge ${item.active ? 'badge-active' : 'badge-inactive'}`">
                  {{ item.active ? 'Activa' : 'Inactiva' }}
                </span>
                <div v-if="authStore.isAdmin" class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal('headquarters', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                    <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDelete('headquarters', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                    <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════ -->
      <!-- ÁRBITROS                           -->
      <!-- ══════════════════════════════════ -->
      <div class="config-section">
        <div class="section-header">
          <div class="flex items-center gap-3">
            <div class="section-icon bg-orange-500/10 border-orange-500/20">
              <Icon name="lucide:badge-check" class="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 class="text-base font-bold text-content">Árbitros</h2>
              <p class="text-xs text-content-muted">{{ referees.length }} registrado{{ referees.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button v-if="authStore.isAdmin" @click="openModal('referee')" class="add-btn">
            <Icon name="lucide:plus" class="w-4 h-4" /> Nuevo
          </button>
        </div>

        <div class="section-body">
          <div v-if="loading.referees" class="py-8 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
          </div>
          <div v-else-if="!referees.length" class="py-8 text-center">
            <Icon name="lucide:badge-check" class="w-8 h-8 text-content-muted mx-auto mb-2" />
            <p class="text-sm text-content-muted">Sin árbitros registrados</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in referees" :key="item.id" class="item-row group">
              <div class="w-8 h-8 rounded-lg overflow-hidden bg-surface-hover border border-border/10 flex items-center justify-center flex-shrink-0">
                <img v-if="item.photo" :src="item.photo" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-4 h-4 text-content-muted" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-content text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-content-muted truncate">{{ [item.license, item.phone].filter(Boolean).join(' · ') || 'Sin datos' }}</p>
              </div>
              <div v-if="authStore.isAdmin" class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button @click="openEditModal('referee', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                  <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                </button>
                <button @click="handleDelete('referee', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                  <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /grid -->

    <!-- ─────────────────────────────────── -->
    <!-- Modal universal                     -->
    <!-- ─────────────────────────────────── -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-background backdrop-blur-md" @click="closeModal"></div>
      <div class="modal-card w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <!-- Top accent bar -->
        <div :class="`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-transparent to-transparent ${modalAccent}`"></div>

        <header class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl font-bold text-content">{{ modalTitle }}</h2>
            <p class="text-sm text-content-muted mt-1">{{ isEditing ? 'Modifica los datos.' : 'Completa la información.' }}</p>
          </div>
          <button @click="closeModal" class="p-2 rounded-xl text-content-muted hover:text-content transition-colors" style="background:rgba(255,255,255,0.04)">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </header>

        <form @submit.prevent="handleModalSubmit" class="space-y-5">

          <!-- TOURNAMENT -->
          <template v-if="modalType === 'tournament'">
            <div>
              <label class="field-label">Nombre del Torneo *</label>
              <input v-model="modalForm.name" type="text" required class="field-input" placeholder="Ej. Torneo Apertura 2025" />
            </div>
            <div>
              <label class="field-label">Amarillas para suspensión *</label>
              <input v-model.number="modalForm.maxYellowCardsForSuspension" type="number" min="1" max="10" required class="field-input" placeholder="3" />
              <p class="text-xs text-content-muted mt-1.5">Número de tarjetas acumuladas que generan una suspensión automática.</p>
            </div>
            <div>
              <label class="field-label">Sede del torneo (opcional)</label>
              <select v-model="modalForm.headquartersId" class="field-input">
                <option value="">Sin sede asignada</option>
                <option v-for="h in headquarters" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
            </div>
            <div>
              <label class="field-label">Estado</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="modalForm.active = true" :class="`toggle-btn ${modalForm.active ? 'toggle-on' : 'toggle-off'}`">
                  <Icon name="lucide:check-circle" class="w-4 h-4" /> Activo
                </button>
                <button type="button" @click="modalForm.active = false" :class="`toggle-btn ${!modalForm.active ? 'toggle-off-red' : 'toggle-off'}`">
                  <Icon name="lucide:pause-circle" class="w-4 h-4" /> Inactivo
                </button>
              </div>
            </div>
          </template>

          <!-- CATEGORY -->
          <template v-else-if="modalType === 'category'">
            <div>
              <label class="field-label">Nombre de la Categoría *</label>
              <input v-model="modalForm.name" type="text" required class="field-input" placeholder="Ej. Sub-20, Mayores, Masters" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="field-label">Edad mínima</label>
                <input v-model.number="modalForm.minAge" type="number" min="0" class="field-input" placeholder="16" />
              </div>
              <div>
                <label class="field-label">Edad máxima</label>
                <input v-model.number="modalForm.maxAge" type="number" min="0" class="field-input" placeholder="20" />
              </div>
            </div>
            <p class="text-xs text-content-muted">Deja vacío si no hay restricción de edad.</p>
          </template>

          <!-- HEADQUARTERS -->
          <template v-else-if="modalType === 'headquarters'">
            <div>
              <label class="field-label">Nombre de la Sede *</label>
              <input v-model="modalForm.name" type="text" required class="field-input" placeholder="Ej. Estadio Municipal" />
            </div>
            <div>
              <label class="field-label">Ciudad</label>
              <input v-model="modalForm.city" type="text" class="field-input" placeholder="Ej. Guayaquil" />
            </div>
            <div>
              <label class="field-label">Dirección</label>
              <input v-model="modalForm.address" type="text" class="field-input" placeholder="Ej. Av. 9 de Octubre 123" />
            </div>
            <div>
              <label class="field-label">Estado</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="modalForm.active = true" :class="`toggle-btn ${modalForm.active ? 'toggle-on' : 'toggle-off'}`">
                  <Icon name="lucide:check-circle" class="w-4 h-4" /> Activa
                </button>
                <button type="button" @click="modalForm.active = false" :class="`toggle-btn ${!modalForm.active ? 'toggle-off-red' : 'toggle-off'}`">
                  <Icon name="lucide:pause-circle" class="w-4 h-4" /> Inactiva
                </button>
              </div>
            </div>
          </template>

          <!-- REFEREE -->
          <template v-else-if="modalType === 'referee'">
            <div>
              <label class="field-label">Nombre completo *</label>
              <input v-model="modalForm.name" type="text" required class="field-input" placeholder="Ej. Carlos Pérez" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="field-label">Licencia</label>
                <input v-model="modalForm.license" type="text" class="field-input" placeholder="ARB-001" />
              </div>
              <div>
                <label class="field-label">Teléfono</label>
                <input v-model="modalForm.phone" type="tel" class="field-input" placeholder="+593..." />
              </div>
            </div>
            <div>
              <label class="field-label">Email</label>
              <input v-model="modalForm.email" type="email" class="field-input" placeholder="arbitro@liga.com" />
            </div>
          </template>

          <!-- Buttons -->
          <div class="pt-4 flex gap-3">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-4 rounded-2xl font-bold text-sm text-content transition-all" style="border: 1px solid rgba(255,255,255,0.1); background: transparent">
              Cancelar
            </button>
            <button type="submit" :disabled="formLoading" class="flex-1 px-4 py-4 rounded-2xl font-bold text-sm text-obsidian-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(to right, #10b981, #14b8a6); box-shadow: 0 8px 20px rgba(16,185,129,0.2)">
              <Icon v-if="formLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ isEditing ? 'Guardar Cambios' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
const authStore = useAuthStore()
const notification = ref(null)
const showModal = ref(false)
const modalType = ref('')
const isEditing = ref(false)
const editingId = ref(null)
const formLoading = ref(false)
const modalForm = ref({})

const tournaments = ref([])
const categories = ref([])
const headquarters = ref([])
const referees = ref([])
const loading = reactive({ tournaments: false, categories: false, headquarters: false, referees: false })

// ── Helpers ──────────────────────────────────────────────────
const modalTitle = computed(() => {
  const map = { tournament: 'Torneo', category: 'Categoría', headquarters: 'Sede', referee: 'Árbitro' }
  return `${isEditing.value ? 'Editar' : 'Nuevo'} ${map[modalType.value] ?? ''}`
})

const modalAccent = computed(() => {
  const map = {
    tournament: 'via-amber-500',
    category: 'via-purple-500',
    headquarters: 'via-blue-500',
    referee: 'via-orange-500',
  }
  return map[modalType.value] ?? 'via-emerald-500'
})

const endpointMap = { tournament: '/tournaments', category: '/categories', headquarters: '/headquarters', referee: '/referees' }
const storeRefMap = computed(() => ({ tournament: tournaments, category: categories, headquarters: headquarters, referee: referees }))
const loadingKeyMap = { tournament: 'tournaments', category: 'categories', headquarters: 'headquarters', referee: 'referees' }

const defaultForms = {
  tournament: () => ({ name: '', maxYellowCardsForSuspension: 3, active: true, headquartersId: '' }),
  category: () => ({ name: '', minAge: null, maxAge: null }),
  headquarters: () => ({ name: '', city: '', address: '', active: true }),
  referee: () => ({ name: '', license: '', phone: '', email: '' }),
}

// ── API ───────────────────────────────────────────────────────
async function loadSection(endpoint, storeRef, key) {
  loading[key] = true
  try {
    const res = await $api(endpoint)
    storeRef.value = (res?.data || []).map(i => ({ ...i, id: i._id || i.id }))
  } catch (e) { console.error(e) }
  finally { loading[key] = false }
}

async function fetchAll() {
  await Promise.all([
    loadSection('/tournaments', tournaments, 'tournaments'),
    loadSection('/categories', categories, 'categories'),
    loadSection('/headquarters', headquarters, 'headquarters'),
    loadSection('/referees', referees, 'referees'),
  ])
}

// ── Modal ─────────────────────────────────────────────────────
function openModal(type) {
  modalType.value = type
  isEditing.value = false
  editingId.value = null
  modalForm.value = defaultForms[type]()
  showModal.value = true
}

function openEditModal(type, item) {
  modalType.value = type
  isEditing.value = true
  editingId.value = item.id
  modalForm.value = { ...item }
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function handleModalSubmit() {
  formLoading.value = true
  const endpoint = endpointMap[modalType.value]
  const storeRef = storeRefMap.value[modalType.value]
  const key = loadingKeyMap[modalType.value]

  const payload = { ...modalForm.value }
  if (payload.minAge === null || payload.minAge === '') delete payload.minAge
  if (payload.maxAge === null || payload.maxAge === '') delete payload.maxAge
  if (payload.headquartersId === '') delete payload.headquartersId

  try {
    if (isEditing.value) {
      await $api(`${endpoint}/${editingId.value}`, { method: 'PUT', body: payload })
      notify('Registro actualizado correctamente')
    } else {
      await $api(endpoint, { method: 'POST', body: payload })
      notify('Registro creado correctamente')
    }
    await loadSection(endpoint, storeRef, key)
    closeModal()
  } catch (err) {
    notify(err.data?.message || err.message || 'Error al guardar', 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(type, item) {
  if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return
  const endpoint = endpointMap[type]
  const storeRef = storeRefMap.value[type]
  const key = loadingKeyMap[type]
  try {
    await $api(`${endpoint}/${item.id}`, { method: 'DELETE' })
    notify('Registro eliminado')
    await loadSection(endpoint, storeRef, key)
  } catch (err) {
    notify(err.data?.message || err.message || 'Error al eliminar', 'error')
  }
}

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

onMounted(fetchAll)
</script>

<style scoped>
.config-section {
  @apply bg-surface/50 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden flex flex-col;
}

.section-header {
  @apply flex items-center justify-between px-6 py-5 border-b border-border/50;
}

.section-icon {
  @apply w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0;
}

.section-body {
  @apply p-5 flex-1 min-h-[160px] max-h-[320px] overflow-y-auto;
}

.section-body::-webkit-scrollbar {
  width: 4px;
}
.section-body::-webkit-scrollbar-track {
  background: transparent;
}
.section-body::-webkit-scrollbar-thumb {
  @apply bg-border/50 rounded-full;
}

.add-btn {
  @apply flex items-center gap-1.5 bg-primary/15 border border-primary/30 text-primary px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-primary/25 hover:border-primary/50;
}

.item-row {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent transition-all hover:bg-surface-hover/50 hover:border-border/50;
}

.action-btn {
  @apply p-1.5 rounded-lg text-content-muted/50 transition-all cursor-pointer bg-transparent border-none;
}

.status-badge {
  @apply text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap;
}
.badge-active {
  @apply bg-primary/10 text-primary border-primary/30;
}
.badge-inactive {
  @apply bg-surface-hover/50 text-content-muted border-border/50;
}

/* Modal */
.modal-card {
  @apply bg-surface/95 backdrop-blur-xl border border-border/50;
}

.field-label {
  @apply block text-[11px] font-bold uppercase tracking-widest text-content-muted mb-2;
}

.field-input {
  @apply w-full bg-background/80 border border-border/50 rounded-xl px-4 py-3 text-content outline-none transition-colors text-sm focus:border-primary;
}
.field-input option {
  @apply bg-background;
}

.toggle-btn {
  @apply px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer;
}
.toggle-on {
  @apply bg-primary/10 border-primary text-primary;
}
.toggle-off {
  @apply bg-background/80 border-border/50 text-content-muted;
}
.toggle-off-red {
  @apply bg-rose-500/10 border-rose-500 text-rose-400;
}

.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
