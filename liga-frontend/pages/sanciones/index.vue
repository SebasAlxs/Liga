<template>
  <div class="page-container p-6">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Sanciones</h1>
        <p class="text-content-muted">Jugadores sancionados y su historial de suspensiones</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
      <p class="text-content-muted text-sm animate-pulse">Cargando sanciones...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Sancionados Activos</p>
          <p class="text-2xl font-display text-rose-500">{{ activeCount }}</p>
        </div>
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Sanciones Cumplidas</p>
          <p class="text-2xl font-display text-emerald-600">{{ servedCount }}</p>
        </div>
        <div class="bg-background rounded-2xl border border-border p-4 col-span-2 lg:col-span-1">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Total Registradas</p>
          <p class="text-2xl font-display text-content">{{ suspensionStore.suspensions.length }}</p>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-background rounded-2xl border border-border p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-display">Historial de Sanciones</h2>
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div class="relative">
              <Icon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                v-model="search"
                type="text"
                placeholder="Buscar jugador, equipo o motivo..."
                class="input-base pl-9 w-full sm:w-64"
              />
            </div>
            <select v-model="statusFilter" class="input-base w-full sm:w-44">
              <option value="ALL">Todos los estados</option>
              <option v-for="(label, status) in STATUS_LABELS" :key="status" :value="status">{{ label }}</option>
            </select>
          </div>
        </div>

        <div v-if="filteredSuspensions.length" class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-content-muted uppercase bg-secondary/50">
              <tr>
                <th class="px-4 py-3 rounded-tl-lg">Jugador</th>
                <th class="px-4 py-3">Equipo</th>
                <th class="px-4 py-3">Motivo</th>
                <th class="px-4 py-3">Partidos</th>
                <th class="px-4 py-3">Fecha</th>
                <th class="px-4 py-3 rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in filteredSuspensions" :key="s.id" class="border-b border-border hover:bg-secondary/20">
                <td class="px-4 py-3 font-bold">
                  <NuxtLink :to="`/players/${s.playerId}`" class="hover:text-emerald-400 transition-colors">
                    {{ s.playerName || 'Jugador desconocido' }}
                  </NuxtLink>
                </td>
                <td class="px-4 py-3 text-content-muted">{{ s.teamName || '—' }}</td>
                <td class="px-4 py-3">{{ s.reason }}</td>
                <td class="px-4 py-3 text-content-muted">{{ s.matchesSuspended }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-content-muted">{{ formatDate(s.createdAt) }}</td>
                <td class="px-4 py-3">
                  <span :class="`text-[10px] font-bold uppercase rounded-full px-2 py-1 ${statusClass(s.status)}`">
                    {{ STATUS_LABELS[s.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-10 text-content-muted text-sm">
          <Icon :name="suspensionStore.suspensions.length ? 'lucide:search-x' : 'lucide:shield-check'" class="w-8 h-8 mx-auto mb-2 text-content-muted/50" />
          {{ suspensionStore.suspensions.length ? 'Ninguna sanción coincide con tu búsqueda.' : 'No hay jugadores sancionados por el momento.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSuspensionStore, type Suspension } from '~/stores/suspensionStore'

const STATUS_LABELS: Record<Suspension['status'], string> = {
  ACTIVE: 'Activa',
  SERVED: 'Cumplida',
  APPEALED: 'Apelada'
}

const STATUS_CLASSES: Record<Suspension['status'], string> = {
  ACTIVE: 'bg-rose-100 text-rose-700',
  SERVED: 'bg-emerald-100 text-emerald-700',
  APPEALED: 'bg-amber-100 text-amber-700'
}

const suspensionStore = useSuspensionStore()

const pageLoading = ref(true)
const search = ref('')
const statusFilter = ref('ALL')

onMounted(async () => {
  pageLoading.value = true
  await suspensionStore.fetchSuspensions(true)
  pageLoading.value = false
})

const activeCount = computed(() => suspensionStore.suspensions.filter(s => s.status === 'ACTIVE').length)
const servedCount = computed(() => suspensionStore.suspensions.filter(s => s.status === 'SERVED').length)

const filteredSuspensions = computed(() => {
  const query = search.value.trim().toLowerCase()
  return suspensionStore.suspensions
    .filter(s => statusFilter.value === 'ALL' || s.status === statusFilter.value)
    .filter(s => !query ||
      s.playerName?.toLowerCase().includes(query) ||
      s.teamName?.toLowerCase().includes(query) ||
      s.reason.toLowerCase().includes(query)
    )
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

function statusClass(status: Suspension['status']) {
  return STATUS_CLASSES[status]
}

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
