<template>
  <div class="page-container p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-content font-display">Módulos por Rol</h1>
      <p class="text-content-muted mt-1">Elige qué secciones del menú puede ver cada rol de la plataforma.</p>
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

    <!-- No autorizado -->
    <div v-if="!authStore.isSuperAdmin" class="glass-card p-12 text-center rounded-3xl border border-border/5 max-w-lg mx-auto">
      <Icon name="lucide:shield-alert" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content">Acceso restringido</h3>
      <p class="text-content-muted mt-2">Solo un Super Admin puede configurar la visibilidad de módulos.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="moduleAccessStore.loading && !matrix.length" class="flex justify-center py-20 flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-content-muted animate-pulse">Cargando configuración...</p>
    </div>

    <!-- Table -->
    <div v-else class="glass-card rounded-3xl border border-border/5 overflow-hidden">
      <div class="px-6 py-4 border-b border-border/5 flex items-center justify-between flex-wrap gap-3">
        <span class="text-sm text-content-muted">
          Los cambios no incluyen al Super Admin en el menú lateral hasta guardar.
        </span>
        <button
          @click="handleSave"
          :disabled="saving || !hasChanges"
          class="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-obsidian-950 px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:save" class="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/5 text-left">
              <th class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest">Módulo</th>
              <th
                v-for="role in ROLES"
                :key="role"
                class="px-6 py-4 text-xs font-bold text-content-muted uppercase tracking-widest text-center"
              >
                {{ ROLE_LABELS[role] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in MODULE_CATALOG"
              :key="item.key"
              class="border-b border-border/5 hover:bg-surface/2 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Icon :name="item.icon" class="w-4 h-4 text-primary" />
                  <span class="font-semibold text-content">{{ item.label }}</span>
                </div>
              </td>
              <td v-for="role in ROLES" :key="role" class="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  class="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                  :checked="isChecked(role, item.key)"
                  @change="toggle(role, item.key, $event.target.checked)"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MODULE_CATALOG, ROLES, ROLE_LABELS } from '~/stores/moduleAccess'

const authStore = useAuthStore()
const moduleAccessStore = useModuleAccessStore()

const notification = ref(null)
const saving = ref(false)
// Cambios pendientes en memoria: Map("ROLE::module" -> boolean)
const pendingChanges = ref({})

const matrix = computed(() => moduleAccessStore.allRows)

const hasChanges = computed(() => Object.keys(pendingChanges.value).length > 0)

function keyFor(role, moduleKey) {
  return `${role}::${moduleKey}`
}

function isChecked(role, moduleKey) {
  const k = keyFor(role, moduleKey)
  if (k in pendingChanges.value) return pendingChanges.value[k]
  const row = matrix.value.find(r => r.role === role && r.module === moduleKey)
  return row ? row.visible : true
}

function toggle(role, moduleKey, checked) {
  pendingChanges.value = { ...pendingChanges.value, [keyFor(role, moduleKey)]: checked }
}

function notify(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => notification.value = null, 3500)
}

async function handleSave() {
  saving.value = true
  try {
    const items = Object.entries(pendingChanges.value).map(([k, visible]) => {
      const [role, module] = k.split('::')
      return { role, module, visible }
    })
    const res = await moduleAccessStore.updateAll(items)
    if (res.success) {
      pendingChanges.value = {}
      notify(res.message)
    } else {
      notify(res.message, 'error')
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (authStore.isSuperAdmin) {
    await moduleAccessStore.fetchAll()
  }
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
