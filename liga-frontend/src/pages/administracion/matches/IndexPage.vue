<template>
    <q-page class="q-pa-lg bg-grey-1">
        <div class="row items-center justify-between q-mb-md">
            <div>
                <div class="text-h4 text-weight-bolder text-green-9">Calendario de Partidos</div>
                <div class="text-subtitle1 text-grey-7 q-mt-xs">Selecciona un partido para gestionar la planilla</div>
            </div>
            <div v-if="authStore.isSuperAdmin">
                <q-btn color="green-8" icon="add" label="Programar Partido" unelevated class="text-weight-bold"
                    style="border-radius: 8px" @click="showCreateModal = true" />
            </div>
        </div>

        <q-card class="my-card shadow-1"
            v-bind:style="{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e0e0' }">
            <q-table :rows="enrichedMatches" :columns="columns" row-key="id" flat bordered
                :loading="leagueStore.loading" table-header-class="bg-green-8 text-white text-weight-bold"
                no-data-label="No hay partidos registrados">
                <template v-slot:body-cell-teams="props">
                    <q-td :props="props" class="text-center">
                        <div class="row items-center justify-center q-gutter-md text-weight-bold">
                            <span class="text-right" style="width: 120px">{{ props.row.homeTeamName }}</span>
                            <q-badge color="grey-3" text-color="grey-9" class="q-px-sm text-subtitle2 shadow-1">
                                {{ props.row.homeScore || 0 }} - {{ props.row.awayScore || 0 }}
                            </q-badge>
                            <span class="text-left" style="width: 120px">{{ props.row.awayTeamName }}</span>
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                        <q-badge :color="getStatusColor(props.row.status)" :label="props.row.status"
                            class="text-weight-bold q-pa-xs" style="border-radius: 6px;" />
                    </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <q-btn flat dense :color="isVocal ? 'green-9' : 'blue-8'" 
                            :label="isVocal ? 'Gestionar Planilla' : 'Ver Detalle'" 
                            :icon-right="isVocal ? 'assignment' : 'arrow_forward'" no-caps
                            class="text-weight-bold" 
                            @click="$router.push(isVocal ? `/vocal-matches/${props.row.id}/sheet` : `/matches/${props.row.id}`)" />
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <FormMatch v-model="showCreateModal" :loading="isCreating" @submit="handleCreate" />
    </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { useMatchStore } from 'src/stores/matchStore'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import FormMatch from './components/FormMatch.vue'

const route = useRoute()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const matchStore = useMatchStore()
const authStore = useAuthStore()
const $q = useQuasar()

const isVocal = computed(() => route.name === 'vocal-matches')

const showCreateModal = ref(false)
const isCreating = ref(false)

const columns = [
    { name: 'date', label: 'FECHA Y HORA', align: 'left', field: val => val.matchDate ? new Date(val.matchDate).toLocaleString() : 'Por definir', sortable: true },
    { name: 'teams', label: 'ENCUENTRO', align: 'center', field: 'teams' },
    { name: 'status', label: 'ESTADO', align: 'center', field: 'status' },
    { name: 'actions', label: 'ACCIONES', align: 'right' }
]

const enrichedMatches = computed(() => {
    return matchStore.matches.map(m => {
        const homeTeam = teamStore.teams.find(t => t.id === m.homeTeamId)
        const awayTeam = teamStore.teams.find(t => t.id === m.awayTeamId)
        return {
            ...m,
            homeTeamName: homeTeam?.name || 'Local Desconocido',
            awayTeamName: awayTeam?.name || 'Visitante Desconocido'
        }
    })
})

const getStatusColor = (status) => {
    switch (status) {
        case 'FINISHED': return 'grey-6'
        case 'IN_PROGRESS': return 'green-6'
        case 'SCHEDULED': return 'blue-6'
        default: return 'orange-6'
    }
}

onMounted(() => {
    if (matchStore.matches.length === 0 || teamStore.teams.length === 0) {
        leagueStore.fetchLeagueData()
    }
})

const handleCreate = async (matchData) => {
    isCreating.value = true
    try {
        await matchStore.createMatch(matchData)
        $q.notify({
            color: 'positive',
            message: 'Partido programado exitosamente',
            icon: 'check_circle',
            position: 'top'
        })
        showCreateModal.value = false
    } catch (error) {
        console.error('Error in handleCreate:', error)
        $q.notify({
            color: 'negative',
            message: error.response?.data?.message || 'Error al programar el partido',
            icon: 'error',
            position: 'top'
        })
    } finally {
        isCreating.value = false
    }
}
</script>

<style scoped>
.my-card {
    border-radius: 24px;
}

.q-table__container {
    border-radius: 24px !important;
}
</style>
