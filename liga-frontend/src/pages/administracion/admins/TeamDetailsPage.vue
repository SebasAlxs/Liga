<template>
    <q-page class="q-pa-lg bg-green-50">
        <div v-if="loading" class="flex flex-center" style="height: 60vh">
            <q-spinner-dots color="green-8" size="4em" />
        </div>

        <div v-else-if="team" class="max-width-container">
            <q-btn flat no-caps color="green-9" icon="arrow_back" label="Volver a Equipos"
                @click="router.push({ name: 'groups' })" class="q-mb-md text-weight-bold" />

            <!-- Team Header Card -->
            <q-card class="team-header shadow-3 q-mb-xl">
                <q-card-section class="q-pa-xl">
                    <div class="row q-col-gutter-xl items-center">
                        <div class="col-12 col-md-auto text-center">
                            <q-avatar size="180px" class="bg-white shadow-2 border-green">
                                <img v-if="team.logo" :src="team.logo" alt="logo" />
                                <q-icon v-else name="groups" size="80px" color="grey-3" />
                            </q-avatar>
                        </div>
                        <div class="col-12 col-md text-center text-md-left">
                            <div class="text-h2 text-weight-bolder text-green-10">{{ team.name }}</div>
                            <div class="row q-gutter-md justify-center justify-md-start q-mt-md">
                                <div class="flex items-center text-grey-8">
                                    <q-icon name="history" size="24px" class="q-mr-xs" />
                                    <span class="text-subtitle1">Fundado en {{ team.foundedYear }}</span>
                                </div>
                                <div class="flex items-center text-amber-9">
                                    <q-icon name="emoji_events" size="24px" class="q-mr-xs" />
                                    <span class="text-subtitle1 text-weight-bold">{{ team.championshipsWon || 0 }}
                                        Títulos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- Players Section -->
            <div class="row items-center justify-between q-mb-lg">
                <div class="column">
                    <div class="text-h4 text-weight-bold text-green-9">Plantilla de Jugadores</div>
                    <div class="text-subtitle1 text-grey-7">{{ teamPlayers.length }} jugadores inscritos</div>
                </div>
                <div class="row q-gutter-sm">
                    <q-btn :outline="!showBulkForm" :color="showBulkForm ? 'orange-9' : 'green-8'"
                        :icon="showBulkForm ? 'close' : 'list_alt'"
                        :label="showBulkForm ? 'Cancelar Masivo' : 'Registro Masivo'" unelevated no-caps
                        class="text-weight-bold q-px-lg" style="border-radius: 12px"
                        @click="showBulkForm = !showBulkForm" />
                    <q-btn v-if="!showBulkForm" color="green-8" icon="add" label="Inscribir Jugador" unelevated no-caps
                        class="text-weight-bold q-px-lg py-sm" style="border-radius: 12px" @click="openPlayerForm()" />
                </div>
            </div>

            <!-- Bulk Player Form -->
            <div v-if="showBulkForm" class="q-mb-xl">
                <BulkPlayerForm :team-id="team?.id" @saved="onBulkSaved" @cancel="showBulkForm = false" />
            </div>

            <!-- Players Grid/List -->
            <div v-if="!showBulkForm">
                <div v-if="teamPlayers.length === 0"
                    class="text-center q-pa-xl bg-white rounded-28 border-dashed shadow-1">
                    <q-icon name="person_add" size="64px" color="grey-3" />
                    <div class="text-h6 text-grey-5 q-mt-md">Aún no hay jugadores registrados</div>
                    <q-btn flat color="green-8" label="Añadir el primero" class="q-mt-sm" @click="openPlayerForm()" />
                </div>

                <div v-else class="row q-col-gutter-lg">
                    <div v-for="player in teamPlayers" :key="player.id" class="col-12 col-sm-6 col-md-4">
                        <q-card class="player-card shadow-1 overflow-hidden">
                            <q-card-section class="q-pa-md">
                                <div class="row items-center no-wrap">
                                    <div class="column items-center q-mr-md relative-position">
                                        <q-avatar size="70px" class="bg-grey-2 shadow-2 border-white">
                                            <img v-if="player.picture"
                                                :src="player.picture.startsWith('http') ? player.picture : `data:image/png;base64,${player.picture}`"
                                                alt="foto" />
                                            <q-icon v-else name="person" color="grey-3" size="36px" />
                                        </q-avatar>
                                        <q-badge color="amber-9" floating class="text-weight-bolder"
                                            style="padding: 2px 6px; border-radius: 4px; border: 1px solid white">
                                            #{{ player.number }}
                                        </q-badge>
                                    </div>
                                    <div class="col overflow-hidden">
                                        <div class="text-h6 text-weight-bolder text-grey-9 ellipsis">
                                            {{ player.firstName }} {{ player.lastName }}
                                        </div>
                                        <div
                                            class="text-caption text-green-7 text-uppercase text-weight-bold letter-spacing-1">
                                            {{ player.position || 'Jugador' }}
                                        </div>
                                    </div>
                                    <div class="column">
                                        <q-btn flat round color="grey-6" icon="more_vert">
                                            <q-menu auto-close transition-show="jump-down" transition-hide="jump-up">
                                                <q-list style="min-width: 150px">
                                                    <q-item clickable @click="openPlayerForm(player)">
                                                        <q-item-section avatar><q-icon name="edit"
                                                                color="blue-8" /></q-item-section>
                                                        <q-item-section>Editar</q-item-section>
                                                    </q-item>
                                                    <q-separator />
                                                    <q-item clickable class="text-negative"
                                                        @click="confirmDeletePlayer(player)">
                                                        <q-item-section avatar><q-icon name="delete"
                                                                color="negative" /></q-item-section>
                                                        <q-item-section>Eliminar</q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-menu>
                                        </q-btn>
                                    </div>
                                </div>
                            </q-card-section>

                            <q-separator color="grey-2" inset />

                            <q-card-actions align="center" class="bg-grey-1">
                                <q-btn flat color="green-9" icon="visibility" label="Ver Detalles"
                                    class="full-width text-weight-bold" @click="viewPlayerDetails(player)" />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error/Not Found -->
        <div v-else class="flex flex-center" style="height: 60vh">
            <div class="text-center">
                <q-icon name="error_outline" size="100px" color="red-3" />
                <div class="text-h4 text-grey-8 q-mt-lg">Equipo no encontrado</div>
                <q-btn color="green-8" label="Volver a Inicio" unelevated class="q-mt-xl"
                    @click="router.push('/inicio')" />
            </div>
        </div>

        <!-- Player Dialog (Edit/Create) -->
        <q-dialog v-model="playerDialog" transition-show="rotate" transition-hide="rotate">
            <FormPlayer :player="selectedPlayer" :team-id="team?.id" @saved="onPlayerSaved" />
        </q-dialog>

        <!-- Player Detail Modal -->
        <PlayerDetailModal v-model="detailsModal" :player="selectedPlayerDetails" @edit="onEditFromDetails"
            @delete="onDeleteFromDetails" />
    </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import FormPlayer from './components/FormPlayer.vue'
import PlayerDetailModal from './components/PlayerDetailModal.vue'
import BulkPlayerForm from './components/BulkPlayerForm.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const team = ref(null)
const players = ref([])
const loading = ref(true)

const playerDialog = ref(false)
const selectedPlayer = ref(null)

const detailsModal = ref(false)
const selectedPlayerDetails = ref(null)

const showBulkForm = ref(false)

const teamPlayers = computed(() => {
    const teamId = route.params.id
    return players.value.filter(p => p.teamId === teamId)
})

const fetchData = async () => {
    try {
        loading.value = true
        const teamId = route.params.id
        const [teamRes, playersRes] = await Promise.all([
            api.get(`/api/teams/${teamId}`),
            api.get('/api/players')
        ])

        // Normalizing after fix in leagueStore pattern
        const rawTeam = teamRes.data.data || teamRes.data
        team.value = { ...rawTeam, id: rawTeam.id || rawTeam._id }

        const rawPlayers = playersRes.data.data || playersRes.data || []
        players.value = rawPlayers.map(p => ({ ...p, id: p.id || p._id }))

    } catch (error) {
        console.error('Error fetching team details:', error)
        $q.notify({ color: 'negative', message: 'Error cargando datos' })
    } finally {
        loading.value = false
    }
}

const openPlayerForm = (player = null) => {
    selectedPlayer.value = player
    playerDialog.value = true
}

const viewPlayerDetails = (player) => {
    selectedPlayerDetails.value = player
    detailsModal.value = true
}

const onEditFromDetails = (player) => {
    detailsModal.value = false
    openPlayerForm(player)
}

const onDeleteFromDetails = (player) => {
    detailsModal.value = false
    confirmDeletePlayer(player)
}

const onPlayerSaved = () => {
    playerDialog.value = false
    fetchData()
}

const onBulkSaved = () => {
    showBulkForm.value = false
    fetchData()
}

const confirmDeletePlayer = (player) => {
    $q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar a ${player.firstName}?`,
        cancel: true,
        persistent: true,
        ok: { label: 'Eliminar', color: 'negative', flat: true }
    }).onOk(async () => {
        try {
            await api.delete(`/api/players/${player.id}`)
            $q.notify({ color: 'positive', message: 'Jugador eliminado' })
            fetchData()
        } catch (error) {
            $q.notify({ color: 'negative', message: 'No se pudo eliminar al jugador' })
        }
    })
}

onMounted(() => {
    fetchData()
})
</script>

<script>
export default {
    name: 'TeamDetailsPage'
}
</script>

<style scoped>
.max-width-container {
    max-width: 1200px;
    margin: 0 auto;
}

.team-header {
    border-radius: 35px;
    background: linear-gradient(135deg, #ffffff 0%, #f1fcf4 100%);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.border-green {
    border: 6px solid #e8f5e9;
}

.player-card {
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid #e0e0e0;
}

.player-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 100, 0, 0.08) !important;
    border-color: #2e7d32;
}

.player-number {
    min-width: 45px;
    text-align: center;
}

.rounded-28 {
    border-radius: 28px;
}

.border-dashed {
    border: 2px dashed #c8e6c9;
}

.letter-spacing-1 {
    letter-spacing: 1px;
}

.text-green-10 {
    color: #1b5e20;
}
</style>
