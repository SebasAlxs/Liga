<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-20">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display text-content">Obligaciones y Multas</h1>
        <p class="text-content-muted">Gestión de multas del campeonato</p>
      </div>
      
      <div v-if="authStore.isSuperAdmin" class="flex gap-2">
        <button @click="showCatalogModal = true" class="btn-primary bg-indigo-600 hover:bg-indigo-700">
          <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
          Configurar Catálogo
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pageLoading" class="flex items-center justify-center p-12">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- ADMIN / SUPERADMIN VIEW -->
    <div v-else-if="authStore.isAdmin || authStore.isSuperAdmin" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Generador de Multas -->
        <div class="bg-background rounded-2xl border border-border p-5">
          <h2 class="text-lg font-display mb-4">Nueva Multa</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">Equipo Infractor</label>
              <select v-model="newFine.teamId" class="input-base w-full">
                <option value="">Seleccione un equipo...</option>
                <option v-for="team in teamStore.teams" :key="team.id" :value="team.id">
                  {{ team.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">Tipo de Multa Rápida</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="type in fineTypeStore.fineTypes" 
                  :key="type.id"
                  @click="applyFineType(type)"
                  class="px-3 py-1.5 rounded-lg text-sm border hover:border-primary hover:bg-primary/5 transition-colors"
                  :class="newFine.reason === type.name ? 'border-primary bg-primary/10 text-primary' : 'border-border text-content'"
                >
                  {{ type.name }} (${{ type.defaultAmount }})
                </button>
                <button 
                  @click="applyFineType({ name: '', defaultAmount: 0, id: 'custom', active: true })"
                  class="px-3 py-1.5 rounded-lg text-sm border hover:border-primary hover:bg-primary/5 transition-colors"
                  :class="newFine.reason !== '' && !fineTypeStore.fineTypes.find(t => t.name === newFine.reason) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-content'"
                >
                  Personalizada
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">Motivo</label>
                <input v-model="newFine.reason" type="text" class="input-base w-full" placeholder="Ej: Agresión" />
              </div>
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">Monto ($)</label>
                <input v-model.number="newFine.amount" type="number" step="0.01" class="input-base w-full" />
              </div>
            </div>
            
            <button @click="submitFine" :disabled="!newFine.teamId || !newFine.reason || newFine.amount <= 0 || isSubmitting" class="btn-primary w-full justify-center">
              <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
              Aplicar Multa
            </button>
          </div>
        </div>

        <!-- Pagos por verificar -->
        <div class="bg-background rounded-2xl border border-border p-5">
          <h2 class="text-lg font-display mb-4">Pagos por Verificar</h2>
          
          <div class="space-y-3">
            <div v-for="fine in verificationFines" :key="fine.id" class="p-4 rounded-xl border border-yellow-200 bg-yellow-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p class="font-bold text-sm text-content">{{ fine.team?.name || 'Equipo Desconocido' }}</p>
                <p class="text-xs text-content-muted">{{ fine.reason }}</p>
                <div class="text-lg font-display text-yellow-700">${{ fine.amount.toFixed(2) }}</div>
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <a v-if="fine.receiptUrl" :href="fine.receiptUrl" target="_blank" class="btn-secondary text-xs flex-1 sm:flex-none justify-center">
                  <Icon name="lucide:external-link" class="w-4 h-4 mr-1" />
                  Ver Recibo
                </a>
                <button @click="approvePayment(fine.id)" class="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs flex-1 sm:flex-none justify-center">
                  <Icon name="lucide:check" class="w-4 h-4 mr-1" />
                  Aprobar
                </button>
              </div>
            </div>
            
            <div v-if="!verificationFines.length" class="text-center py-8 text-content-muted text-sm">
              <Icon name="lucide:check-circle" class="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
              No hay pagos pendientes de verificación.
            </div>
          </div>
        </div>
      </div>

      <!-- Historial Admin -->
      <div class="bg-background rounded-2xl border border-border p-5">
        <h2 class="text-lg font-display mb-4">Historial de Multas Global</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-content-muted uppercase bg-secondary/50">
              <tr>
                <th class="px-4 py-3 rounded-tl-lg">Fecha</th>
                <th class="px-4 py-3">Equipo</th>
                <th class="px-4 py-3">Motivo</th>
                <th class="px-4 py-3">Monto</th>
                <th class="px-4 py-3 rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fine in fineStore.fines" :key="fine.id" class="border-b border-border hover:bg-secondary/20">
                <td class="px-4 py-3">{{ new Date(fine.createdAt).toLocaleDateString() }}</td>
                <td class="px-4 py-3 font-bold">{{ fine.team?.name }}</td>
                <td class="px-4 py-3">{{ fine.reason }}</td>
                <td class="px-4 py-3">${{ fine.amount.toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-[10px] font-bold uppercase rounded-full" 
                        :class="fine.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : (fine.status === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')">
                    {{ fine.status === 'PAID' ? 'Pagada' : (fine.status === 'PENDING_VERIFICATION' ? 'Verificando' : 'Pendiente') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>

    <!-- DIRIGENTE VIEW -->
    <div v-else-if="authStore.isDirigente" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Pendientes -->
        <div class="md:col-span-2 space-y-4">
          <h2 class="text-lg font-display">Multas Pendientes de Pago</h2>
          
          <div v-for="fine in pendingFines" :key="fine.id" class="bg-background rounded-2xl border border-red-200 p-5 flex flex-col sm:flex-row gap-4 justify-between items-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div>
              <h3 class="font-bold text-lg text-content">{{ fine.reason }}</h3>
              <p class="text-xs text-content-muted">Emitida: {{ new Date(fine.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <div class="text-2xl font-display text-red-600">${{ fine.amount.toFixed(2) }}</div>
              <button @click="openPaymentModal(fine)" class="btn-primary w-full sm:w-auto justify-center">
                Pagar
              </button>
            </div>
          </div>
          
          <div v-if="!pendingFines.length" class="bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
            <Icon name="lucide:shield-check" class="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <h3 class="font-bold text-emerald-900">¡Al día!</h3>
            <p class="text-sm text-emerald-700">Tu equipo no tiene multas pendientes de pago.</p>
          </div>
        </div>
        
        <!-- En Verificación -->
        <div>
          <h2 class="text-lg font-display mb-4">Pagos en Revisión</h2>
          <div class="space-y-3">
            <div v-for="fine in myVerificationFines" :key="fine.id" class="bg-background rounded-xl border border-yellow-200 p-4">
              <div class="flex justify-between items-start mb-2">
                <span class="font-bold text-sm">{{ fine.reason }}</span>
                <span class="font-display text-yellow-600">${{ fine.amount.toFixed(2) }}</span>
              </div>
              <div class="flex items-center gap-2 text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded inline-flex">
                <Icon name="lucide:clock" class="w-3 h-3" />
                Esperando aprobación de Liga
              </div>
            </div>
            
            <div v-if="!myVerificationFines.length" class="text-xs text-content-muted text-center py-4">
              Ningún pago en revisión.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Historial Dirigente -->
      <div class="bg-background rounded-2xl border border-border p-5">
        <h2 class="text-lg font-display mb-4">Historial de Pagos Completados</h2>
        <div class="space-y-2">
          <div v-for="fine in paidFines" :key="fine.id" class="flex justify-between items-center p-3 hover:bg-secondary/20 rounded-xl transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon name="lucide:check" class="w-4 h-4" />
              </div>
              <div>
                <p class="font-bold text-sm">{{ fine.reason }}</p>
                <p class="text-xs text-content-muted">Pagado el {{ new Date(fine.paymentDate || fine.updatedAt).toLocaleDateString() }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-display text-content">${{ fine.amount.toFixed(2) }}</p>
              <!-- En el futuro, aquí iría un botón "Descargar Recibo PDF" -->
            </div>
          </div>
          
          <div v-if="!paidFines.length" class="text-sm text-content-muted text-center py-4">
            Aún no hay historial de pagos.
          </div>
        </div>
      </div>
      
    </div>

    <!-- Restricción -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <Icon name="lucide:lock" class="w-16 h-16 text-content-muted mb-4" />
      <h2 class="text-2xl font-display text-content mb-2">Acceso Restringido</h2>
      <p class="text-content-muted max-w-md">
        Tu rol no tiene permisos para gestionar multas. Si crees que esto es un error, contacta al administrador de la liga.
      </p>
    </div>

    <!-- Modal: Reportar Pago (Dirigente) -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-background w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-5 border-b border-border flex justify-between items-center">
          <h2 class="text-lg font-display">Reportar Pago</h2>
          <button @click="showPaymentModal = false" class="text-content-muted hover:text-content">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-5 space-y-4">
          <div class="bg-secondary/30 p-4 rounded-xl border border-border">
            <p class="text-xs text-content-muted uppercase tracking-widest font-bold mb-1">Monto a Pagar</p>
            <p class="text-3xl font-display text-content">${{ selectedFine?.amount.toFixed(2) }}</p>
            <p class="text-sm mt-1 text-content">{{ selectedFine?.reason }}</p>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-2">URL del Comprobante (Temporal)</label>
            <input v-model="receiptUrl" type="url" placeholder="https://imgur.com/..." class="input-base w-full" />
            <p class="text-[10px] text-content-muted mt-1">Por ahora ingresa un link directo a la imagen de tu transferencia.</p>
          </div>
        </div>
        
        <div class="p-5 border-t border-border flex gap-3 justify-end bg-secondary/20">
          <button @click="showPaymentModal = false" class="btn-secondary">Cancelar</button>
          <button @click="submitPayment" :disabled="!receiptUrl || isSubmitting" class="btn-primary">
            Enviar a Revisión
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal: Configuración Catálogo (SuperAdmin) -->
    <div v-if="showCatalogModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-background w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div class="p-5 border-b border-border flex justify-between items-center">
          <h2 class="text-lg font-display">Catálogo de Multas</h2>
          <button @click="showCatalogModal = false" class="text-content-muted hover:text-content">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-5 overflow-y-auto space-y-6">
          
          <!-- Crear Tipo -->
          <div class="flex gap-2 items-end">
            <div class="flex-1">
              <label class="block text-xs font-bold text-content-muted uppercase mb-1">Nombre</label>
              <input v-model="newFineType.name" type="text" class="input-base w-full" placeholder="Ej: Roja Directa" />
            </div>
            <div class="w-24">
              <label class="block text-xs font-bold text-content-muted uppercase mb-1">Precio ($)</label>
              <input v-model.number="newFineType.defaultAmount" type="number" step="0.01" class="input-base w-full" />
            </div>
            <button @click="addFineType" :disabled="!newFineType.name || newFineType.defaultAmount <= 0" class="btn-primary h-10 px-3">
              <Icon name="lucide:plus" class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Lista -->
          <div class="space-y-2">
            <div v-for="type in fineTypeStore.fineTypes" :key="type.id" class="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p class="font-bold text-sm">{{ type.name }}</p>
                <p class="text-xs text-content-muted font-display">${{ type.defaultAmount.toFixed(2) }}</p>
              </div>
              <button @click="fineTypeStore.deleteFineType(type.id)" class="text-red-500 hover:text-red-700 p-2">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
        
        <div class="p-5 border-t border-border flex justify-end bg-secondary/20">
          <button @click="showCatalogModal = false" class="btn-primary">Hecho</button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTeamStore } from '~/stores/teamStore'
import { useFineStore, type Fine } from '~/stores/fineStore'
import { useFineTypeStore, type FineType } from '~/stores/fineTypeStore'

const authStore = useAuthStore()
const teamStore = useTeamStore()
const fineStore = useFineStore()
const fineTypeStore = useFineTypeStore()

const pageLoading = ref(true)
const isSubmitting = ref(false)

// Modals
const showCatalogModal = ref(false)
const showPaymentModal = ref(false)

// Forms
const newFine = ref({
  teamId: '',
  reason: '',
  amount: 0
})

const newFineType = ref({
  name: '',
  defaultAmount: 0
})

const selectedFine = ref<Fine | null>(null)
const receiptUrl = ref('')

onMounted(async () => {
  pageLoading.value = true
  if (authStore.isAdmin || authStore.isSuperAdmin) {
    await Promise.all([
      fineStore.fetchFines(),
      fineTypeStore.fetchFineTypes(),
      teamStore.fetchTeams()
    ])
  } else if (authStore.isDirigente) {
    await fineStore.fetchFines()
  }
  pageLoading.value = false
})

// --- Computed Admin ---
const verificationFines = computed(() => {
  return fineStore.fines.filter(f => f.status === 'PENDING_VERIFICATION')
})

// --- Computed Dirigente ---
const pendingFines = computed(() => {
  return fineStore.fines.filter(f => f.status === 'PENDING')
})
const myVerificationFines = computed(() => {
  return fineStore.fines.filter(f => f.status === 'PENDING_VERIFICATION')
})
const paidFines = computed(() => {
  return fineStore.fines.filter(f => f.status === 'PAID')
})

// --- Actions Admin ---
function applyFineType(type: Partial<FineType>) {
  newFine.value.reason = type.name || ''
  newFine.value.amount = type.defaultAmount || 0
}

async function submitFine() {
  if (!newFine.value.teamId || !newFine.value.reason || newFine.value.amount <= 0) return
  isSubmitting.value = true
  await fineStore.createFine(newFine.value)
  newFine.value = { teamId: '', reason: '', amount: 0 }
  isSubmitting.value = false
}

async function approvePayment(id: string) {
  if (confirm('¿Aprobar pago de esta multa?')) {
    await fineStore.updateFineStatus(id, 'PAID')
  }
}

async function addFineType() {
  if (!newFineType.value.name || newFineType.value.defaultAmount <= 0) return
  await fineTypeStore.createFineType(newFineType.value)
  newFineType.value = { name: '', defaultAmount: 0 }
}

// --- Actions Dirigente ---
function openPaymentModal(fine: Fine) {
  selectedFine.value = fine
  receiptUrl.value = ''
  showPaymentModal.value = true
}

async function submitPayment() {
  if (!selectedFine.value || !receiptUrl.value) return
  isSubmitting.value = true
  await fineStore.updateFineStatus(selectedFine.value.id, 'PENDING_VERIFICATION', receiptUrl.value)
  showPaymentModal.value = false
  selectedFine.value = null
  isSubmitting.value = false
}
</script>
