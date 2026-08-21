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

    <!-- ══════════════════════════════════ -->
    <!-- REGLAS DEL CAMPEONATO               -->
    <!-- ══════════════════════════════════ -->
    <div class="config-section mb-6">
      <div class="section-header">
        <div class="flex items-center gap-3">
          <div class="section-icon bg-cyan-500/10 border-cyan-500/20">
            <Icon name="lucide:scroll-text" class="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 class="text-base font-bold text-content">Reglas del Campeonato</h2>
            <p class="text-xs text-content-muted">Reglas generales, aplican a toda la liga</p>
          </div>
        </div>
        <button v-if="authStore.isAdmin" @click="openModal('ruleItem')" class="add-btn">
          <Icon name="lucide:plus" class="w-4 h-4" /> Nueva Regla
        </button>
      </div>

      <div class="section-body max-h-none space-y-4">
        <!-- Foráneos en cancha: campo fijo, siempre visible arriba de la lista -->
        <div class="item-row !cursor-default">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-content text-sm">Foráneos en cancha</p>
            <p class="text-xs text-content-muted">Máximo {{ leagueRulesStore.rules.maxForeignPlayersOnField }}, el resto locales</p>
          </div>
          <button v-if="authStore.isAdmin" @click="openRulesModal" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
            <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Lista libre de reglas -->
        <div v-if="ruleItemsLoading" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
        <div v-else-if="!leagueRuleItemStore.items.length" class="py-8 text-center">
          <Icon name="lucide:scroll-text" class="w-8 h-8 text-content-muted mx-auto mb-2" />
          <p class="text-sm text-content-muted">Sin reglas adicionales registradas</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in leagueRuleItemStore.items" :key="item.id" class="item-row group items-start">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-content text-sm">{{ item.title }}</p>
              <p class="text-xs text-content-muted whitespace-pre-line">{{ item.description || 'Sin descripción' }}</p>
            </div>
            <div v-if="authStore.isAdmin" class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button @click="openEditModal('ruleItem', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
              </button>
              <button @click="handleDelete('ruleItem', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2x2 Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

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

    <!-- ══════════════════════════════════ -->
    <!-- USUARIOS (solo SUPERADMIN)         -->
    <!-- ══════════════════════════════════ -->
    <div v-if="authStore.isSuperAdmin" class="config-section mt-6">
      <div class="section-header">
        <div class="flex items-center gap-3">
          <div class="section-icon bg-emerald-500/10 border-emerald-500/20">
            <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 class="text-base font-bold text-content">Usuarios</h2>
            <p class="text-xs text-content-muted">{{ users.length }} cuenta{{ users.length !== 1 ? 's' : '' }} registrada{{ users.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <button @click="openModal('user')" class="add-btn">
          <Icon name="lucide:plus" class="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div class="section-body max-h-none">
        <div v-if="loading.users" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
        <div v-else-if="!users.length" class="py-8 text-center">
          <Icon name="lucide:shield-check" class="w-8 h-8 text-content-muted mx-auto mb-2" />
          <p class="text-sm text-content-muted">Sin usuarios registrados</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in users" :key="item.id" class="item-row group">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-content text-sm truncate">{{ item.email }}</p>
              <p class="text-xs text-content-muted">Creado {{ new Date(item.createdAt).toLocaleDateString('es-ES') }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span :class="`status-badge ${roleBadgeClass(item.role)}`">{{ item.role }}</span>
              <div class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal('user', item)" class="action-btn hover:text-emerald-400 hover:bg-primary/10" title="Editar">
                  <Icon name="lucide:edit-2" class="w-3.5 h-3.5" />
                </button>
                <button @click="handleDelete('user', item)" class="action-btn hover:text-rose-400 hover:bg-rose-500/10" title="Eliminar">
                  <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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

          <!-- LEAGUE RULES (foráneos en cancha) -->
          <template v-if="modalType === 'rules'">
            <div>
              <label class="field-label">Máximo de foráneos en cancha *</label>
              <input v-model.number="modalForm.maxForeignPlayersOnField" type="number" min="0" max="11" required class="field-input" placeholder="4" />
              <p class="text-xs text-content-muted mt-1.5">El resto de jugadores en cancha deben ser locales.</p>
            </div>
          </template>

          <!-- RULE ITEM (lista libre de reglas) -->
          <template v-else-if="modalType === 'ruleItem'">
            <div>
              <label class="field-label">Título *</label>
              <input v-model="modalForm.title" type="text" required class="field-input" placeholder="Ej. Suspensiones" />
            </div>
            <div>
              <label class="field-label">Descripción</label>
              <textarea v-model="modalForm.description" rows="3" class="field-input" placeholder="Ej. 3 amarillas acumuladas = 1 partido de suspensión"></textarea>
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

          <!-- USER -->
          <template v-else-if="modalType === 'user'">
            <div>
              <label class="field-label">Correo electrónico *</label>
              <input v-model="modalForm.email" type="email" required class="field-input" placeholder="dirigente@liga.com" />
            </div>
            <div>
              <label class="field-label">{{ isEditing ? 'Nueva contraseña' : 'Contraseña *' }}</label>
              <input v-model="modalForm.password" type="password" :required="!isEditing" minlength="8" class="field-input" placeholder="Mínimo 8 caracteres" />
              <p v-if="isEditing" class="text-xs text-content-muted mt-1.5">Déjalo en blanco para no cambiar la contraseña.</p>
            </div>
            <div>
              <label class="field-label">Rol *</label>
              <select v-model="modalForm.role" required class="field-input">
                <option value="SUPERADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="VOCAL">Vocal</option>
                <option value="DIRIGENTE">Dirigente</option>
              </select>
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
const leagueRulesStore = useLeagueRulesStore()
const leagueRuleItemStore = useLeagueRuleItemStore()
const notification = ref(null)
const showModal = ref(false)
const modalType = ref('')
const isEditing = ref(false)
const editingId = ref(null)
const formLoading = ref(false)
const modalForm = ref({})

const categories = ref([])
const referees = ref([])
const users = ref([])
const loading = reactive({ categories: false, referees: false, users: false })
const ruleItemsLoading = computed(() => leagueRuleItemStore.loading && !leagueRuleItemStore.items.length)

// ── Helpers ──────────────────────────────────────────────────
const modalTitle = computed(() => {
  if (modalType.value === 'rules') return 'Editar Reglas del Campeonato'
  const map = { ruleItem: 'Regla', category: 'Categoría', referee: 'Árbitro', user: 'Usuario' }
  return `${isEditing.value ? 'Editar' : 'Nueva'} ${map[modalType.value] ?? ''}`
})

const modalAccent = computed(() => {
  const map = {
    rules: 'via-cyan-500',
    ruleItem: 'via-cyan-500',
    category: 'via-purple-500',
    referee: 'via-orange-500',
    user: 'via-emerald-500',
  }
  return map[modalType.value] ?? 'via-emerald-500'
})

const endpointMap = { category: '/categories', referee: '/referees', user: '/users' }
const storeRefMap = computed(() => ({ category: categories, referee: referees, user: users }))
const loadingKeyMap = { category: 'categories', referee: 'referees', user: 'users' }

const defaultForms = {
  ruleItem: () => ({ title: '', description: '' }),
  category: () => ({ name: '', minAge: null, maxAge: null }),
  referee: () => ({ name: '', license: '', phone: '', email: '' }),
  user: () => ({ email: '', password: '', role: 'DIRIGENTE' }),
}

function roleBadgeClass(role) {
  const map = {
    SUPERADMIN: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    ADMIN: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    VOCAL: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    DIRIGENTE: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  }
  return map[role] ?? 'badge-inactive'
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
  const tasks = [
    loadSection('/categories', categories, 'categories'),
    loadSection('/referees', referees, 'referees'),
    leagueRulesStore.fetchRules(),
    leagueRuleItemStore.fetchItems(),
  ]
  if (authStore.isSuperAdmin) tasks.push(loadSection('/users', users, 'users'))
  await Promise.all(tasks)
}

// ── Modal ─────────────────────────────────────────────────────
function openRulesModal() {
  modalType.value = 'rules'
  isEditing.value = true
  editingId.value = null
  modalForm.value = { ...leagueRulesStore.rules }
  showModal.value = true
}

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

  if (modalType.value === 'rules') {
    const payload = {
      maxForeignPlayersOnField: Number(modalForm.value.maxForeignPlayersOnField),
      suspensionRules: modalForm.value.suspensionRules || null,
      format: modalForm.value.format || null,
    }
    const res = await leagueRulesStore.updateRules(payload)
    if (res.success) {
      notify(res.message)
      closeModal()
    } else {
      notify(res.message, 'error')
    }
    formLoading.value = false
    return
  }

  if (modalType.value === 'ruleItem') {
    const payload = {
      title: modalForm.value.title,
      description: modalForm.value.description || null,
    }
    const res = isEditing.value
      ? await leagueRuleItemStore.updateItem(editingId.value, payload)
      : await leagueRuleItemStore.createItem(payload)
    if (res.success) {
      notify(res.message)
      closeModal()
    } else {
      notify(res.message, 'error')
    }
    formLoading.value = false
    return
  }

  const endpoint = endpointMap[modalType.value]
  const storeRef = storeRefMap.value[modalType.value]
  const key = loadingKeyMap[modalType.value]

  const payload = { ...modalForm.value }
  if (payload.minAge === null || payload.minAge === '') delete payload.minAge
  if (payload.maxAge === null || payload.maxAge === '') delete payload.maxAge
  if (modalType.value === 'user' && isEditing.value && !payload.password) delete payload.password

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
  if (!confirm(`¿Eliminar "${item.name || item.title || item.email}"? Esta acción no se puede deshacer.`)) return

  if (type === 'ruleItem') {
    const res = await leagueRuleItemStore.deleteItem(item.id)
    notify(res.message, res.success ? 'success' : 'error')
    return
  }

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
