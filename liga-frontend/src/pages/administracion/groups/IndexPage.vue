<template>
  <q-page :class="$q.screen.lt.md ? 'q-pa-md mobile-dark-theme' : 'q-pa-xl premium-layout'">
    <!-- Skeletons para Loading -->
    <div v-if="loading">
      <!-- Barra de Filtros Skeleton -->
      <q-card class="shadow-1 q-mb-xl q-pa-md" style="border-radius: 12px">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-4">
            <q-skeleton type="rect" height="40px" style="border-radius: 8px" />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-skeleton type="rect" height="40px" style="border-radius: 8px" />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-skeleton type="rect" height="40px" style="border-radius: 8px" />
          </div>
          <div class="col-12 col-md-auto q-ml-md-auto text-right">
            <q-skeleton type="rect" width="140px" height="40px" style="border-radius: 8px" />
          </div>
        </div>
      </q-card>

      <!-- KPIs Skeleton -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="i in 4" :key="'kpi-skel-' + i">
          <q-card class="bg-white shadow-1 kpi-card q-pa-md" style="border-radius: 16px">
            <div class="row items-center justify-between no-wrap">
              <div>
                <q-skeleton type="text" width="40px" height="40px" />
                <q-skeleton type="text" width="100px" />
              </div>
              <q-skeleton type="QAvatar" size="54px" />
            </div>
          </q-card>
        </div>
      </div>

      <!-- Tarjetas de Equipos Skeleton -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="i in 8" :key="'team-skel-' + i">
          <q-card class="shadow-1 bg-white team-card q-pa-none" style="border-radius: 16px; height: 100%">
            <!-- Header Skeleton -->
            <div class="bg-grey-3 q-pa-md position-relative"
              style="border-top-left-radius: 16px; border-top-right-radius: 16px; height: 97px">
              <div class="row items-center no-wrap">
                <q-skeleton type="QAvatar" size="65px" class="q-mr-md" />
                <div class="col">
                  <q-skeleton type="text" width="60%" class="q-mb-sm" />
                  <div class="row q-gutter-x-sm">
                    <q-skeleton type="QBadge" width="40px" />
                    <q-skeleton type="QBadge" width="80px" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Content Skeleton -->
            <q-card-section class="q-pt-md">
              <q-list dense class="q-mb-lg">
                <q-item v-for="j in 4" :key="'item-skel-' + j" class="q-px-none q-py-sm min-h-0">
                  <q-item-section avatar style="min-width: 40px; padding-right: 12px">
                    <q-skeleton type="QAvatar" size="36px" />
                  </q-item-section>
                  <q-item-section>
                    <q-skeleton type="text" width="40%" class="text-caption" />
                    <q-skeleton type="text" width="70%" />
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="column q-gutter-y-sm">
                <q-skeleton type="rect" height="36px" style="border-radius: 8px" />
                <div class="row q-gutter-x-sm">
                  <q-skeleton type="rect" height="36px" class="col" style="border-radius: 8px" />
                  <q-skeleton type="rect" height="36px" class="col" style="border-radius: 8px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Contenido Real -->
    <div v-else>
      <AppPageHeader 
        title="Gestión de Equipos" 
        subtitle="Administra los clubes, categorías y el estado de inscripción de cada participante."
        overline="CENTRO DE ORGANIZACIÓN"
      >
        <template #actions v-if="authStore.isSuperAdmin">
          <q-btn color="slate-800" text-color="white" icon="las la-file-import" label="Importar" no-caps unelevated rounded padding="10px 20px" class="glass border-hover-emerald" @click="openBulkForm" />
          <q-btn color="emerald" icon="las la-plus-circle" label="Crear Equipo" no-caps unelevated rounded padding="10px 20px" class="text-weight-bold shadow-glow-emerald" @click="openCreateForm" />
        </template>
      </AppPageHeader>

      <!-- Barra de Filtros (Desktop) -->
      <q-card v-if="!$q.screen.lt.md" class="glass shadow-premium q-mb-xl q-pa-md border-none" style="border-radius: 20px">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-3">
            <q-input v-model="search" standout dark bg-color="slate-800" color="emerald" placeholder="Buscar equipo..." dense
              style="border-radius: 12px">
              <template v-slot:prepend><q-icon name="las la-search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-select v-model="sedeId" :options="sedeFilterOptions" label="Sede" standout dark bg-color="slate-800" color="emerald" dense
              style="border-radius: 12px" option-value="id" option-label="name" emit-value map-options />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-select v-model="torneoId" :options="tournamentFilterOptions" label="Torneo" standout dark bg-color="slate-800" color="emerald" dense
              style="border-radius: 12px" option-value="id" option-label="name" emit-value map-options />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-select v-model="categoriaId" :options="categoryFilterOptions" label="Categoría" standout dark bg-color="slate-800" color="emerald" dense
              style="border-radius: 12px" option-value="id" option-label="name" emit-value map-options />
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <q-select v-model="estado" :options="estadoOptions" label="Estado" standout dark bg-color="slate-800" color="emerald" dense
              style="border-radius: 12px" />
          </div>
        </div>
      </q-card>

      <!-- Barra de Filtros (Mobile) -->
      <div v-else class="staggered-entrance q-mb-lg">
        <div class="row items-center q-mb-md">
          <q-input v-model="search" dense standout dark bg-color="mb-card" color="mb-accent" 
            placeholder="Buscar equipos..." class="col q-mr-sm" style="border-radius: 12px">
            <template v-slot:prepend><q-icon name="search" size="xs" /></template>
          </q-input>
          <q-btn flat round icon="tune" color="mb-accent" @click="showMobileFilters = !showMobileFilters" 
            class="mb-card q-ma-none" style="padding: 10px;" />
        </div>

        <q-slide-transition>
          <div v-if="showMobileFilters" class="mb-card q-pa-md q-gutter-y-sm">
            <q-select v-model="sedeId" :options="sedeFilterOptions" label="Sede" dark dense standout color="mb-accent"
              option-value="id" option-label="name" emit-value map-options />
            <q-select v-model="torneoId" :options="tournamentFilterOptions" label="Torneo" dark dense standout color="mb-accent"
              option-value="id" option-label="name" emit-value map-options />
            <q-select v-model="categoriaId" :options="categoryFilterOptions" label="Categoría" dark dense standout color="mb-accent"
              option-value="id" option-label="name" emit-value map-options />
          </div>
        </q-slide-transition>

        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="authStore.isSuperAdmin">
          <q-btn fab icon="add" color="mb-accent" text-color="mb-bg" @click="openCreateForm" />
        </q-page-sticky>
      </div>


      <!-- Dialog for Form Team -->
      <q-dialog v-model="showFormEquipo" persistent>
        <FormEquipo :team="teamToEdit" @saved="handleTeamSaved" @cancel="closeForm" />
      </q-dialog>

      <!-- Dialog for Bulk Form Team -->
      <q-dialog v-model="showBulkFormEquipo" persistent transition-show="scale" transition-hide="scale">
        <BulkTeamForm @saved="handleBulkSaved" @cancel="closeBulkForm" />
      </q-dialog>
      <!-- Tarjetas de Estadísticas (KPIs) -->
      <div v-if="!$q.screen.lt.md" class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="kpi in kpis" :key="kpi.label">
          <KpiCard v-bind="kpi" />
        </div>
      </div>
      
      <!-- KPIs (Mobile Horizontal Scroll) -->
      <div v-else class="horizontal-scroll-container q-mb-xl">
        <div v-for="kpi in kpis" :key="kpi.label" class="mb-card q-pa-lg text-center" style="min-width: 130px;">
          <q-icon :name="kpi.icon" color="mb-accent" size="sm" class="q-mb-xs" />
          <div class="text-h5 text-weight-bolder">{{ kpi.value }}</div>
          <div class="text-caption text-mb-subtext">{{ kpi.label }}</div>
        </div>
      </div>
      <!-- Grilla de Tarjetas de Equipos -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="team in filteredTeams" :key="team.id || team._id">
          <TeamCard 
            :team="{
              ...team,
              tournament: getTournamentName(team.tournamentId),
              category: { name: getCategoryName(team.categoryId) }
            }" 
            @click="$router.push({ name: 'team-details', params: { id: team.id || team._id } })"
          />
        </div>
      </div>
        </div>
      </div>

        <div class="col-12" v-if="filteredTeams.length === 0">
          <div class="text-center text-grey-6 q-pa-xl text-h6">
            <q-icon name="group_off" size="48px" color="grey-4" class="q-mb-sm" />
            <div>No hay equipos agregados o que coincidan con la búsqueda.</div>
        </div>
      </div>
    </div>



    <!-- Dialog for Delete Confirmation -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar Eliminación</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <p>
            ¿Estás seguro de que deseas eliminar el equipo <strong>{{ teamToDelete?.name }}</strong>?
          </p>
          <p class="text-caption text-grey">Esta acción no se puede deshacer.</p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Eliminar" color="red-8" @click="deleteTeam" :loading="isDeleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import KpiCard from 'components/KpiCard.vue'
import TeamCard from 'components/TeamCard.vue'
import AppPageHeader from 'components/AppPageHeader.vue'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { useAuthStore } from 'src/stores/auth'
import FormEquipo from './components/FormEquipo.vue'
import BulkTeamForm from './components/BulkTeamForm.vue'

const $q = useQuasar()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const loading = ref(true)
const search = ref('')
const sedeId = ref('Todas')
const torneoId = ref('Todos')
const categoriaId = ref('Todas')
const estado = ref('Todos')

const teams = computed(() => teamStore.teams)
const showFormEquipo = ref(false)
const showBulkFormEquipo = ref(false)
const teamToEdit = ref(null)
const showDeleteConfirm = ref(false)
const teamToDelete = ref(null)
const isDeleting = ref(false)
const showMobileFilters = ref(false)


const kpis = computed(() => [
  { label: 'Total equipos', value: teams.value.length, icon: 'las la-users', trend: 12 },
  { label: 'Aprobados', value: teams.value.filter(t => t.status === 'APPROVED' || !t.status).length, icon: 'las la-check-circle' },
  { label: 'Inscripciones', value: teams.value.filter(t => t.status === 'PENDING').length, icon: 'las la-id-card' },
  { label: 'Sedes Activas', value: leagueStore.headquarters.length, icon: 'las la-building' }
])


const estadoOptions = ['Todos', 'Aprobado', 'Pendiente', 'Rechazado']

const sedeFilterOptions = computed(() => {
  return [{ id: 'Todas', name: 'Todas las Sedes' }, ...leagueStore.headquarters]
})

const tournamentFilterOptions = computed(() => {
  let list = leagueStore.tournaments
  if (sedeId.value !== 'Todas') {
    list = list.filter(t => t.headquartersId === sedeId.value)
  }
  return [{ id: 'Todos', name: 'Todos los Torneos' }, ...list]
})

const categoryFilterOptions = computed(() => {
  return [{ id: 'Todas', name: 'Todas las Categorías' }, ...leagueStore.categories]
})

const filteredTeams = computed(() => {
  let result = teams.value

  // Filtrar por sede visualizando los torneos que pertenecen a esa sede
  if (sedeId.value !== 'Todas') {
    const allowedTournaments = leagueStore.tournaments
      .filter(t => t.headquartersId === sedeId.value)
      .map(t => t.id)
    result = result.filter(t => allowedTournaments.includes(t.tournamentId))
  }

  if (torneoId.value !== 'Todos') {
    result = result.filter(t => t.tournamentId === torneoId.value)
  }

  if (categoriaId.value !== 'Todas') {
    result = result.filter(t => t.categoryId === categoriaId.value)
  }

  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(t => t.name.toLowerCase().includes(s))
  }

  return result
})

const fetchTeams = async () => {
  loading.value = true
  try {
    await teamStore.fetchTeams()
  } catch (error) {
    console.error('Error fetching teams:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (leagueStore.tournaments.length === 0 || leagueStore.categories.length === 0) {
    leagueStore.fetchLeagueData()
  }
  fetchTeams()
})

const getTournamentName = (id) => {
  if (!id) return null
  const t = leagueStore.tournaments.find(t => t.id === id)
  return t ? t.name : null
}

const getCategoryName = (id) => {
  if (!id) return null
  const c = leagueStore.categories.find(c => c.id === id)
  return c ? c.name : null
}

const confirmDelete = (team) => {
  teamToDelete.value = team
  showDeleteConfirm.value = true
}

const deleteTeam = async () => {
  if (!teamToDelete.value) return

  isDeleting.value = true
  try {
    const teamId = teamToDelete.value.id || teamToDelete.value._id
    if (!teamId) throw new Error('El equipo no tiene un ID válido')

    await teamStore.deleteTeam(teamId)

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Equipo eliminado exitosamente',
      icon: 'check_circle',
    })

    showDeleteConfirm.value = false
    teamToDelete.value = null
  } catch (error) {
    console.error('Error deleting team:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error.response?.data?.message || 'Error al eliminar el equipo',
      icon: 'error',
    })
  } finally {
    isDeleting.value = false
  }
}

const openCreateForm = () => {
  teamToEdit.value = null
  showFormEquipo.value = true
}

const openEditForm = (team) => {
  teamToEdit.value = team
  showFormEquipo.value = true
}

const closeForm = () => {
  showFormEquipo.value = false
  teamToEdit.value = null
}

const openBulkForm = () => {
  showBulkFormEquipo.value = true
}

const closeBulkForm = () => {
  showBulkFormEquipo.value = false
}

const handleBulkSaved = () => {
  closeBulkForm()
  fetchTeams()
}
</script>

<style scoped>
:deep(.filter-input .q-field__control),
:deep(.filter-select .q-field__control) {
  border-radius: 8px !important;
}

.kpi-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.team-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
</style>
