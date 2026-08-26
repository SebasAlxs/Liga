<template>
  <div class="page-container p-6">
    <!-- Alert Notification -->
    <Transition name="fade">
      <div v-if="notification" :class="`fixed top-6 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-primary/20 border-primary/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`">
        <Icon :name="notification.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
        <span class="font-medium">{{ notification.message }}</span>
      </div>
    </Transition>

    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Obligaciones y Multas</h1>
        <p class="text-content-muted">Gestión de multas del campeonato</p>
      </div>

      <div v-if="authStore.isSuperAdmin" class="flex gap-2">
        <button @click="showCatalogModal = true" class="btn-primary">
          <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
          Configurar Catálogo
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
      <p class="text-content-muted text-sm animate-pulse">Cargando obligaciones...</p>
    </div>

    <!-- ADMIN / SUPERADMIN VIEW -->
    <div v-else-if="authStore.isAdmin || authStore.isSuperAdmin" class="space-y-6">

      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Pendiente de Pago</p>
          <p class="text-2xl font-display text-red-600">{{ formatCurrency(totalPending) }}</p>
        </div>
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">En Verificación</p>
          <p class="text-2xl font-display text-yellow-600">{{ formatCurrency(totalVerification) }}</p>
        </div>
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Recaudado</p>
          <p class="text-2xl font-display text-emerald-600">{{ formatCurrency(totalPaid) }}</p>
        </div>
        <div class="bg-background rounded-2xl border border-border p-4">
          <p class="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-1">Multas Registradas</p>
          <p class="text-2xl font-display text-content">{{ fineStore.fines.length }}</p>
        </div>
      </div>

      <!-- Estado de Cuenta por Equipo -->
      <div class="bg-background rounded-2xl border border-border p-5">
        <h2 class="text-lg font-display mb-4">Estado de Cuenta por Equipo (Pendientes)</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-2 custom-scroll">
          <div v-for="debt in teamDebts" :key="debt.team.id" class="p-3 rounded-xl border flex items-center justify-between" :class="debt.amount > 0 ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'">
            <div class="flex items-center gap-2 overflow-hidden">
              <div class="w-7 h-7 rounded-full overflow-hidden bg-white border border-border flex-shrink-0 flex items-center justify-center">
                <img v-if="debt.team.logo" :src="debt.team.logo" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:shield" class="w-4 h-4 text-content-muted" />
              </div>
              <p class="font-bold text-xs truncate">{{ debt.team.name }}</p>
            </div>
            <p class="font-display font-bold text-sm" :class="debt.amount > 0 ? 'text-red-600' : 'text-emerald-600'">{{ formatCurrency(debt.amount) }}</p>
          </div>
        </div>
      </div>

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
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest">Tipo de Multa Rápida</label>
                <button
                  @click="openQuickAddTypeModal"
                  type="button"
                  class="text-xs font-bold text-primary hover:text-emerald-700 flex items-center gap-1"
                >
                  <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                  Agregar tipo
                </button>
              </div>
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
                <p v-if="!fineTypeStore.fineTypes.length" class="text-xs text-content-muted self-center">
                  Aún no hay tipos en el catálogo.
                </p>
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

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">
                  Jugador <span class="normal-case font-normal text-content-muted/70">(opcional)</span>
                </label>
                <select v-model="newFine.playerId" class="input-base w-full" :disabled="!newFine.teamId || playerStore.loading">
                  <option value="">Sin jugador específico</option>
                  <option v-for="player in playerStore.players" :key="player.id" :value="player.id">
                    #{{ player.number }} {{ player.firstName }} {{ player.lastName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-content-muted uppercase tracking-widest mb-1">
                  Partido <span class="normal-case font-normal text-content-muted/70">(opcional)</span>
                </label>
                <select v-model="newFine.matchId" class="input-base w-full" :disabled="!newFine.teamId">
                  <option value="">Sin partido asociado</option>
                  <option v-for="match in teamMatches" :key="match.id" :value="match.id">
                    {{ matchLabel(match) }}
                  </option>
                </select>
              </div>
            </div>

            <button @click="submitFine" :disabled="!newFine.teamId || !newFine.reason || newFine.amount <= 0 || isSubmitting" class="btn-primary w-full justify-center">
              <Icon :name="isSubmitting ? 'lucide:loader-2' : 'lucide:plus'" :class="['w-4 h-4 mr-2', isSubmitting && 'animate-spin']" />
              Aplicar Multa
            </button>
          </div>
        </div>

        <!-- Pagos por verificar -->
        <div class="bg-background rounded-2xl border border-border p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-display">Pagos por Verificar</h2>
            <span v-if="verificationFines.length" class="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
              {{ verificationFines.length }} pendiente{{ verificationFines.length === 1 ? '' : 's' }}
            </span>
          </div>

          <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <div v-for="fine in verificationFines" :key="fine.id" class="p-4 rounded-xl border border-yellow-200 bg-yellow-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p class="font-bold text-sm text-content">{{ fine.team?.name || 'Equipo Desconocido' }}</p>
                <p class="text-xs text-content-muted">{{ fine.reason }}</p>
                <p v-if="fine.player" class="text-xs text-content-muted">
                  <Icon name="lucide:user" class="w-3 h-3 inline -mt-0.5" />
                  {{ fine.player.firstName }} {{ fine.player.lastName }}
                </p>
                <div class="text-lg font-display text-yellow-700">{{ formatCurrency(fine.amount) }}</div>
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <a v-if="fine.receiptUrl" :href="fine.receiptUrl" target="_blank" class="btn-secondary text-xs flex-1 sm:flex-none justify-center">
                  <Icon name="lucide:external-link" class="w-4 h-4 mr-1" />
                  Ver Recibo
                </a>
                <button @click="rejectPayment(fine.id)" class="btn-secondary text-xs flex-1 sm:flex-none justify-center text-red-600 hover:bg-red-50 border-red-200">
                  <Icon name="lucide:x" class="w-4 h-4 mr-1" />
                  Rechazar
                </button>
                <button @click="openApproveFineModal(fine)" class="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs flex-1 sm:flex-none justify-center">
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-display">Historial de Multas Global</h2>
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div class="relative">
              <Icon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                v-model="historySearch"
                type="text"
                placeholder="Buscar equipo o motivo..."
                class="input-base pl-9 w-full sm:w-64"
              />
            </div>
            <select v-model="historyStatusFilter" class="input-base w-full sm:w-44">
              <option value="ALL">Todos los estados</option>
              <option v-for="(label, status) in STATUS_LABELS" :key="status" :value="status">{{ label }}</option>
            </select>
          </div>
        </div>

        <div v-if="filteredHistoryFines.length" class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-content-muted uppercase bg-secondary/50">
              <tr>
                <th class="px-4 py-3 rounded-tl-lg">Fecha</th>
                <th class="px-4 py-3">Equipo</th>
                <th class="px-4 py-3">Motivo</th>
                <th class="px-4 py-3">Jugador</th>
                <th class="px-4 py-3">Monto</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fine in filteredHistoryFines" :key="fine.id" class="border-b border-border hover:bg-secondary/20">
                <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(fine.createdAt) }}</td>
                <td class="px-4 py-3 font-bold">{{ fine.team?.name || 'Equipo Desconocido' }}</td>
                <td class="px-4 py-3">{{ fine.reason }}</td>
                <td class="px-4 py-3 text-content-muted">{{ fine.player ? `${fine.player.firstName} ${fine.player.lastName}` : '—' }}</td>
                <td class="px-4 py-3 whitespace-nowrap">{{ formatCurrency(fine.amount) }}</td>
                <td class="px-4 py-3">
                  <select
                    :value="fine.status"
                    @change="changeFineStatus(fine, ($event.target as HTMLSelectElement).value as Fine['status'])"
                    :disabled="updatingFineId === fine.id"
                    class="text-[10px] font-bold uppercase rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-wait"
                    :class="statusSelectClass(fine.status)"
                  >
                    <option v-for="(label, status) in STATUS_LABELS" :key="status" :value="status">{{ label }}</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="openDeleteFineModal(fine)"
                    :disabled="deletingFineId === fine.id"
                    class="text-content-muted hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-wait"
                    title="Eliminar multa"
                  >
                    <Icon :name="deletingFineId === fine.id ? 'lucide:loader-2' : 'lucide:trash-2'" :class="['w-4 h-4', deletingFineId === fine.id && 'animate-spin']" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-10 text-content-muted text-sm">
          <Icon :name="fineStore.fines.length ? 'lucide:search-x' : 'lucide:inbox'" class="w-8 h-8 mx-auto mb-2 text-content-muted/50" />
          {{ fineStore.fines.length ? 'Ninguna multa coincide con tu búsqueda.' : 'Aún no se han registrado multas.' }}
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
              <p v-if="fine.player" class="text-xs text-content-muted">
                Jugador: {{ fine.player.firstName }} {{ fine.player.lastName }}
              </p>
              <p class="text-xs text-content-muted">Emitida: {{ formatDate(fine.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <div class="text-2xl font-display text-red-600">{{ formatCurrency(fine.amount) }}</div>
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
                <span class="font-display text-yellow-600">{{ formatCurrency(fine.amount) }}</span>
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
                <p class="text-xs text-content-muted">Pagado el {{ formatDate(fine.paymentDate || fine.updatedAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-display text-content">{{ formatCurrency(fine.amount) }}</p>
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

    <!-- Modal: Agregar Tipo Rápido (Admin/SuperAdmin) -->
    <div v-if="showQuickAddTypeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-background w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-5 border-b border-border flex justify-between items-center">
          <h2 class="text-lg font-display">Nuevo Tipo de Multa</h2>
          <button @click="showQuickAddTypeModal = false" class="text-content-muted hover:text-content">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase mb-1">Nombre</label>
            <input v-model="newFineType.name" type="text" class="input-base w-full" placeholder="Ej: Roja Directa" />
          </div>
          <div>
            <label class="block text-xs font-bold text-content-muted uppercase mb-1">Precio ($)</label>
            <input v-model.number="newFineType.defaultAmount" type="number" step="0.01" class="input-base w-full" />
          </div>
        </div>

        <div class="p-5 border-t border-border flex gap-3 justify-end bg-secondary/20">
          <button @click="showQuickAddTypeModal = false" class="btn-secondary">Cancelar</button>
          <button @click="submitQuickAddType" :disabled="!newFineType.name || newFineType.defaultAmount <= 0 || isSubmitting" class="btn-primary">
            Agregar y Usar
          </button>
        </div>
      </div>
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
            <p class="text-3xl font-display text-content">{{ formatCurrency(selectedFine?.amount || 0) }}</p>
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
            <div v-for="type in fineTypeStore.fineTypes" :key="type.id" class="p-3 border border-border rounded-lg">
              <div v-if="editingTypeId === type.id" class="flex gap-2 items-end">
                <div class="flex-1">
                  <input v-model="editingType.name" type="text" class="input-base w-full" />
                </div>
                <div class="w-24">
                  <input v-model.number="editingType.defaultAmount" type="number" step="0.01" class="input-base w-full" />
                </div>
                <button @click="saveEditFineType(type.id)" class="text-emerald-600 hover:text-emerald-700 p-2">
                  <Icon name="lucide:check" class="w-4 h-4" />
                </button>
                <button @click="cancelEditFineType" class="text-content-muted hover:text-content p-2">
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-else class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-sm">{{ type.name }}</p>
                  <p class="text-xs text-content-muted font-display">${{ type.defaultAmount.toFixed(2) }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="startEditFineType(type)" class="text-content-muted hover:text-content p-2">
                    <Icon name="lucide:pencil" class="w-4 h-4" />
                  </button>
                  <button @click="removeFineType(type.id)" class="text-red-500 hover:text-red-700 p-2">
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!fineTypeStore.fineTypes.length" class="text-center py-6 text-content-muted text-sm">
              No hay tipos de multa en el catálogo aún.
            </div>
          </div>

        </div>

        <div class="p-5 border-t border-border flex justify-end bg-secondary/20">
          <button @click="showCatalogModal = false" class="btn-primary">Hecho</button>
        </div>
      </div>
    </div>

    <!-- Modal: Eliminar Multa (Admin/SuperAdmin) -->
    <div v-if="showDeleteFineModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-background w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-5 border-b border-border flex justify-between items-center">
          <h2 class="text-lg font-display">Eliminar Multa</h2>
          <button @click="showDeleteFineModal = false" class="text-content-muted hover:text-content">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5 space-y-3">
          <div class="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div class="text-sm text-content">
              <p>
                ¿Eliminar la multa <span class="font-bold">"{{ fineToDelete?.reason }}"</span>
                de <span class="font-bold">{{ fineToDelete?.team?.name || 'este equipo' }}</span>?
              </p>
              <p class="text-xs text-content-muted mt-1">Esta acción no se puede deshacer.</p>
            </div>
          </div>
        </div>

        <div class="p-5 border-t border-border flex gap-3 justify-end bg-secondary/20">
          <button @click="showDeleteFineModal = false" class="btn-secondary" :disabled="deletingFineId === fineToDelete?.id">Cancelar</button>
          <button
            @click="confirmDeleteFine"
            :disabled="deletingFineId === fineToDelete?.id"
            class="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-wait"
          >
            <Icon :name="deletingFineId === fineToDelete?.id ? 'lucide:loader-2' : 'lucide:trash-2'" :class="['w-4 h-4 mr-2', deletingFineId === fineToDelete?.id && 'animate-spin']" />
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Aprobar Pago (Admin/SuperAdmin) -->
    <div v-if="showApproveFineModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-background w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-5 border-b border-border flex justify-between items-center">
          <h2 class="text-lg font-display">Aprobar Pago</h2>
          <button @click="showApproveFineModal = false" class="text-content-muted hover:text-content">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5 space-y-3">
          <div class="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div class="text-sm text-content">
              <p>
                ¿Aprobar el pago de <span class="font-bold">"{{ fineToApprove?.reason }}"</span>
                de <span class="font-bold">{{ fineToApprove?.team?.name || 'este equipo' }}</span>
                por <span class="font-bold">{{ formatCurrency(fineToApprove?.amount || 0) }}</span>?
              </p>
              <p class="text-xs text-content-muted mt-1">La multa se marcará como pagada.</p>
            </div>
          </div>
        </div>

        <div class="p-5 border-t border-border flex gap-3 justify-end bg-secondary/20">
          <button @click="showApproveFineModal = false" class="btn-secondary" :disabled="approvingFineId === fineToApprove?.id">Cancelar</button>
          <button
            @click="confirmApprovePayment"
            :disabled="approvingFineId === fineToApprove?.id"
            class="btn-primary bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-wait"
          >
            <Icon :name="approvingFineId === fineToApprove?.id ? 'lucide:loader-2' : 'lucide:check'" :class="['w-4 h-4 mr-2', approvingFineId === fineToApprove?.id && 'animate-spin']" />
            Aprobar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTeamStore } from '~/stores/teamStore'
import { useFineStore, type Fine } from '~/stores/fineStore'
import { useFineTypeStore, type FineType } from '~/stores/fineTypeStore'
import { usePlayerStore } from '~/stores/playerStore'
import { useMatchStore, type Match } from '~/stores/matchStore'

const STATUS_LABELS: Record<Fine['status'], string> = {
  PENDING: 'Pendiente',
  PENDING_VERIFICATION: 'Verificando',
  PAID: 'Pagada'
}

const STATUS_SELECT_CLASSES: Record<Fine['status'], string> = {
  PAID: 'bg-emerald-100 text-emerald-700',
  PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-red-100 text-red-700'
}

const authStore = useAuthStore()
const teamStore = useTeamStore()
const fineStore = useFineStore()
const fineTypeStore = useFineTypeStore()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()

const pageLoading = ref(true)
const isSubmitting = ref(false)
const updatingFineId = ref<string | null>(null)
const deletingFineId = ref<string | null>(null)
const showDeleteFineModal = ref(false)
const fineToDelete = ref<Fine | null>(null)
const showApproveFineModal = ref(false)
const fineToApprove = ref<Fine | null>(null)
const approvingFineId = ref<string | null>(null)
const notification = ref<{ message: string; type: 'success' | 'error' } | null>(null)

// Modals
const showCatalogModal = ref(false)
const showPaymentModal = ref(false)
const showQuickAddTypeModal = ref(false)

// Forms
const newFine = ref({
  teamId: '',
  reason: '',
  amount: 0,
  playerId: '',
  matchId: ''
})

const newFineType = ref({
  name: '',
  defaultAmount: 0
})

const selectedFine = ref<Fine | null>(null)
const receiptUrl = ref('')

// Historial filters
const historySearch = ref('')
const historyStatusFilter = ref('ALL')

// Catálogo edit state
const editingTypeId = ref<string | null>(null)
const editingType = ref({ name: '', defaultAmount: 0 })

onMounted(async () => {
  pageLoading.value = true
  if (authStore.isAdmin || authStore.isSuperAdmin) {
    await Promise.all([
      fineStore.fetchFines(),
      fineTypeStore.fetchFineTypes(),
      teamStore.fetchTeams(),
      matchStore.fetchMatches()
    ])
  } else if (authStore.isDirigente) {
    await fineStore.fetchFines()
  }
  pageLoading.value = false
})

watch(() => newFine.value.teamId, async (teamId) => {
  newFine.value.playerId = ''
  newFine.value.matchId = ''
  if (teamId) {
    await playerStore.fetchPlayersByTeam(teamId)
  } else {
    playerStore.players = []
  }
})

const teamMatches = computed(() => {
  const teamId = newFine.value.teamId
  if (!teamId) return []
  return matchStore.matches
    .filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId)
    .slice()
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
})

function matchLabel(match: Match) {
  const teamId = newFine.value.teamId
  const opponentId = match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId
  const opponent = teamStore.teams.find(t => t.id === opponentId)?.name || 'Rival'
  const prefix = match.homeTeamId === teamId ? 'vs' : '@'
  return `${prefix} ${opponent} - ${formatDate(match.matchDate)}`
}

function notify(message: string, type: 'success' | 'error' = 'success') {
  notification.value = { message, type }
  setTimeout(() => { notification.value = null }, 3000)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

function formatDate(date?: string) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// --- Computed Admin ---
const verificationFines = computed(() => {
  return fineStore.fines.filter(f => f.status === 'PENDING_VERIFICATION')
})

const totalPending = computed(() => fineStore.fines.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0))
const totalVerification = computed(() => fineStore.fines.filter(f => f.status === 'PENDING_VERIFICATION').reduce((sum, f) => sum + f.amount, 0))
const totalPaid = computed(() => fineStore.fines.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0))

const filteredHistoryFines = computed(() => {
  const query = historySearch.value.trim().toLowerCase()
  return fineStore.fines
    .filter(f => historyStatusFilter.value === 'ALL' || f.status === historyStatusFilter.value)
    .filter(f => !query || f.team?.name?.toLowerCase().includes(query) || f.reason.toLowerCase().includes(query))
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
})

const teamDebts = computed(() => {
  return teamStore.teams.map(team => {
    const amount = fineStore.fines
      .filter(f => f.teamId === team.id && f.status === 'PENDING')
      .reduce((sum, f) => sum + f.amount, 0)
    return { team, amount }
  }).sort((a, b) => b.amount - a.amount)
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
  const res = await fineStore.createFine({
    teamId: newFine.value.teamId,
    reason: newFine.value.reason,
    amount: newFine.value.amount,
    playerId: newFine.value.playerId || undefined,
    matchId: newFine.value.matchId || undefined
  })
  notify(res.message, res.success ? 'success' : 'error')
  if (res.success) newFine.value = { teamId: '', reason: '', amount: 0, playerId: '', matchId: '' }
  isSubmitting.value = false
}

function openApproveFineModal(fine: Fine) {
  fineToApprove.value = fine
  showApproveFineModal.value = true
}

async function confirmApprovePayment() {
  if (!fineToApprove.value) return
  const id = fineToApprove.value.id
  approvingFineId.value = id
  const res = await fineStore.updateFineStatus(id, 'PAID')
  notify(res.message, res.success ? 'success' : 'error')
  approvingFineId.value = null
  showApproveFineModal.value = false
  fineToApprove.value = null
}

async function rejectPayment(id: string) {
  if (!confirm('¿Rechazar este comprobante y devolver la multa a pendiente de pago?')) return
  const res = await fineStore.updateFineStatus(id, 'PENDING')
  notify(res.success ? 'Pago rechazado.' : res.message, res.success ? 'success' : 'error')
}

function statusSelectClass(status: Fine['status']) {
  return STATUS_SELECT_CLASSES[status]
}

async function changeFineStatus(fine: Fine, newStatus: Fine['status']) {
  if (newStatus === fine.status) return
  const isReverting = fine.status === 'PAID' && newStatus !== 'PAID'
  if (isReverting && !confirm(`Esta multa ya está marcada como pagada. ¿Revertirla a "${STATUS_LABELS[newStatus]}"?`)) return

  updatingFineId.value = fine.id
  const res = await fineStore.updateFineStatus(fine.id, newStatus)
  notify(res.success ? `Estado actualizado a "${STATUS_LABELS[newStatus]}".` : res.message, res.success ? 'success' : 'error')
  updatingFineId.value = null
}

function openDeleteFineModal(fine: Fine) {
  fineToDelete.value = fine
  showDeleteFineModal.value = true
}

async function confirmDeleteFine() {
  if (!fineToDelete.value) return
  const id = fineToDelete.value.id
  deletingFineId.value = id
  const res = await fineStore.deleteFine(id)
  notify(res.success ? 'Multa eliminada.' : res.message, res.success ? 'success' : 'error')
  deletingFineId.value = null
  showDeleteFineModal.value = false
  fineToDelete.value = null
}

async function addFineType() {
  if (!newFineType.value.name || newFineType.value.defaultAmount <= 0) return
  const res = await fineTypeStore.createFineType(newFineType.value)
  notify(res.message, res.success ? 'success' : 'error')
  if (res.success) newFineType.value = { name: '', defaultAmount: 0 }
}

function openQuickAddTypeModal() {
  newFineType.value = { name: '', defaultAmount: 0 }
  showQuickAddTypeModal.value = true
}

async function submitQuickAddType() {
  if (!newFineType.value.name || newFineType.value.defaultAmount <= 0) return
  isSubmitting.value = true
  const res = await fineTypeStore.createFineType(newFineType.value)
  notify(res.message, res.success ? 'success' : 'error')
  if (res.success) {
    applyFineType(fineTypeStore.fineTypes.find(t => t.name === newFineType.value.name) || newFineType.value)
    newFineType.value = { name: '', defaultAmount: 0 }
    showQuickAddTypeModal.value = false
  }
  isSubmitting.value = false
}

async function removeFineType(id: string) {
  if (!confirm('¿Eliminar este tipo de multa del catálogo?')) return
  const res = await fineTypeStore.deleteFineType(id)
  notify(res.message, res.success ? 'success' : 'error')
}

function startEditFineType(type: FineType) {
  editingTypeId.value = type.id
  editingType.value = { name: type.name, defaultAmount: type.defaultAmount }
}

function cancelEditFineType() {
  editingTypeId.value = null
}

async function saveEditFineType(id: string) {
  if (!editingType.value.name || editingType.value.defaultAmount <= 0) return
  const res = await fineTypeStore.updateFineType(id, editingType.value)
  notify(res.message, res.success ? 'success' : 'error')
  if (res.success) editingTypeId.value = null
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
  const res = await fineStore.updateFineStatus(selectedFine.value.id, 'PENDING_VERIFICATION', receiptUrl.value)
  notify(res.message, res.success ? 'success' : 'error')
  showPaymentModal.value = false
  selectedFine.value = null
  isSubmitting.value = false
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
