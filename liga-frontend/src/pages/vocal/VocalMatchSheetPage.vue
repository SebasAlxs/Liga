<template>
    <q-page :class="$q.screen.gt.xs ? ($q.screen.gt.sm ? 'q-pa-xl' : 'q-pa-lg') : 'q-pa-md'" class="bg-slate-50">
        <!-- Header -->
        <div class="row items-center q-gutter-sm q-gutter-sm-md" :class="$q.screen.gt.xs ? 'q-mb-xl' : 'q-mb-lg'">
            <q-btn flat round icon="las la-arrow-left" color="slate-400" @click="router.back()" class="bg-white shadow-soft transition-base border-hover-emerald" />
            <div class="col-grow">
                <div class="text-weight-bolder text-slate-900 tracking-tighter" :class="$q.screen.gt.xs ? 'text-h3' : 'text-h4'">Control de Planilla</div>
                <div class="text-slate-500 q-mt-xs font-medium" :class="$q.screen.gt.xs ? 'text-h6' : 'text-subtitle1'">
                    <template v-if="match">
                        {{ getTeamName(match.homeTeamId) }} <span class="text-emerald mx-2">vs</span> {{ getTeamName(match.awayTeamId) }}
                    </template>
                    <template v-else>
                        Cargando partido...
                    </template>
                </div>
            </div>
            <div class="col-auto">
                <q-badge :color="matchStatusColor === 'green-8' ? 'emerald-50' : 'amber-50'" 
                    :text-color="matchStatusColor === 'green-8' ? 'emerald' : 'amber-7'"
                    class="q-px-md q-py-sm text-weight-bold no-shadow" style="border-radius: 8px">
                    {{ match?.status || '...' }}
                </q-badge>
            </div>
        </div>

        <!-- Team Selection Tabs -->
        <q-tabs v-model="teamTab" dense class="bg-white q-mb-xl shadow-premium no-border overflow-hidden" 
            style="border-radius: 16px" active-color="emerald" indicator-color="emerald" align="justify" narrow-indicator>
            <q-tab name="home" :label="getTeamName(match?.homeTeamId) || 'Local'" icon="las la-home" class="q-py-md" />
            <q-tab name="away" :label="getTeamName(match?.awayTeamId) || 'Visitante'" icon="las la-plane" class="q-py-md" />
        </q-tabs>

        <q-tab-panels v-model="teamTab" animated class="bg-transparent">
            <q-tab-panel :name="tKey" v-for="(team, tKey) in teamsData" :key="tKey" class="q-pa-none">
                <div class="row q-col-gutter-xl">
                    <!-- ROSTER COLUMN (Left) -->
                    <div class="col-12 col-md-5">
                        <q-card flat class="roster-card shadow-premium no-border overflow-hidden" 
                            style="border-radius: 24px; min-height: 400px; max-height: 70vh; display: flex; flex-direction: column;">
                            <q-card-section class="bg-emerald-50 text-emerald row items-center justify-between q-pa-lg">
                                <div class="text-subtitle1 text-weight-bold tracking-tight">Plantilla disponible</div>
                                <q-badge outline color="emerald" label="Sin verificar" class="text-weight-bold" />
                            </q-card-section>
                            
                            <q-card-section class="q-pa-none scroll" style="flex: 1">
                                <q-list separator class="q-px-sm">
                                    <q-item v-for="player in getAvailablePlayers(tKey)" :key="player.id" 
                                        class="q-py-md border-b-slate cursor-pointer" clickable
                                        @click="openCheckInModal(player, team.id)">
                                        <q-item-section avatar>
                                            <q-avatar color="slate-50" text-color="slate-900" font-size="18px" class="text-weight-bold">
                                                {{ player.number || '#' }}
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-weight-bold text-slate-900">{{ player.firstName }} {{ player.lastName }}</q-item-label>
                                            <q-item-label caption v-if="player.dni" class="text-slate-400">DNI: {{ player.dni }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn label="Verificar" color="emerald" unelevated rounded size="sm"
                                                icon="las la-check-circle" class="text-weight-bold" />
                                        </q-item-section>
                                    </q-item>
                                    <q-item v-if="getAvailablePlayers(tKey).length === 0" class="text-center q-pa-xl text-slate-400 italic">
                                        <q-item-section>No hay más jugadores disponibles</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>

                    <!-- LINEUP COLUMN (Right) -->
                    <div class="col-12 col-md-7">
                        <q-card flat class="lineup-card shadow-premium no-border overflow-hidden" 
                            style="border-radius: 24px; min-height: 400px; max-height: 70vh; display: flex; flex-direction: column;">
                            <q-card-section class="bg-slate-900 text-white row items-center justify-between q-pa-lg">
                                <div class="text-subtitle1 text-weight-bold tracking-tight">Jugadores en Planilla</div>
                                <div class="row q-gutter-sm">
                                    <q-badge color="emerald" class="q-px-md q-py-xs text-weight-bold">Titulares: {{ getLineupByStatus(tKey, 'STARTER').length }}/11</q-badge>
                                    <q-badge color="slate-700" class="q-px-md q-py-xs text-weight-bold">Suplentes: {{ getLineupByStatus(tKey, 'SUBSTITUTE').length }}</q-badge>
                                </div>
                            </q-card-section>
                            
                            <q-card-section class="q-pa-none scroll" style="flex: 1">
                                <!-- STARTERS -->
                                <div class="text-overline text-slate-400 q-px-lg q-py-md bg-slate-50 font-bold" style="font-size: 10px; letter-spacing: 1px">TITULARES (11)</div>
                                <q-list separator class="q-px-sm">
                                    <q-item v-for="item in getLineupByStatus(tKey, 'STARTER')" :key="item.id" class="q-py-sm">
                                        <q-item-section avatar>
                                            <q-avatar size="36px" color="emerald-50" text-color="emerald" class="text-weight-bold">{{ getPlayer(item.playerId)?.number }}</q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-weight-bold text-slate-900">{{ getPlayerName(item.playerId) }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side class="row no-wrap items-center q-gutter-x-sm">
                                            <q-btn icon="las la-arrow-down" color="slate-400" flat round size="sm" class="border-hover-slate" @click="toggleStatus(item)">
                                                <q-tooltip>Mover a Suplentes</q-tooltip>
                                            </q-btn>
                                            <q-btn icon="las la-times" color="slate-400" flat round size="sm" class="border-hover-rose" @click="removeFromLineup(item)" />
                                        </q-item-section>
                                    </q-item>
                                    <q-item v-if="getLineupByStatus(tKey, 'STARTER').length === 0" class="text-center q-pa-xl text-slate-300 italic">
                                        <q-item-section>Pendiente asignar titulares</q-item-section>
                                    </q-item>
                                </q-list>

                                <q-separator class="bg-slate-100" />

                                <!-- SUBSTITUTES -->
                                <div class="text-overline text-slate-400 q-px-lg q-py-md bg-slate-50 font-bold" style="font-size: 10px; letter-spacing: 1px">SUPLENTES</div>
                                <q-list separator class="q-px-sm">
                                    <q-item v-for="item in getLineupByStatus(tKey, 'SUBSTITUTE')" :key="item.id" class="q-py-sm">
                                        <q-item-section avatar>
                                            <q-avatar size="36px" color="slate-100" text-color="slate-500" class="text-weight-bold">{{ getPlayer(item.playerId)?.number }}</q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-weight-medium text-slate-700">{{ getPlayerName(item.playerId) }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side class="row no-wrap items-center q-gutter-x-sm">
                                            <q-btn icon="las la-arrow-up" color="slate-400" flat round size="sm" class="border-hover-emerald" @click="toggleStatus(item)">
                                                <q-tooltip>Mover a Titulares</q-tooltip>
                                            </q-btn>
                                            <q-btn icon="las la-times" color="slate-400" flat round size="sm" class="border-hover-rose" @click="removeFromLineup(item)" />
                                        </q-item-section>
                                    </q-item>
                                    <q-item v-if="getLineupByStatus(tKey, 'SUBSTITUTE').length === 0" class="text-center q-pa-xl text-slate-300 italic">
                                        <q-item-section>No hay suplentes registrados</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>

        <!-- Footer Actions -->
        <div class="row q-mt-xl justify-end">
            <q-btn label="Finalizar e Ir al Partido" color="slate-900" unelevated rounded padding="16px 48px" 
                icon="las la-futbol" class="text-weight-bold shadow-soft transition-base full-width-sm" 
                style="border-radius: 16px" @click="finishLineup" />
        </div>

        <!-- CHECK-IN MODAL -->
        <q-dialog v-model="showCheckInModal" persistent transition-show="fade" transition-hide="fade">
            <q-card style="max-width: 95vw; width: 420px; border-radius: 28px" :class="$q.screen.gt.xs ? 'q-pa-xl' : 'q-pa-lg'" class="shadow-premium">
                <q-card-section class="column items-center q-pb-lg">
                    <div class="text-h4 text-weight-bolder text-slate-900 tracking-tighter text-center" :class="$q.screen.gt.xs ? 'q-mb-xl' : 'q-mb-lg'">Verificación</div>
                    <q-avatar :size="$q.screen.gt.xs ? '160px' : '120px'" class="shadow-premium no-border" :class="$q.screen.gt.xs ? 'q-mb-xl' : 'q-mb-lg'" style="border-radius: 40px">
                        <template v-if="selectedPlayer?.picture">
                            <q-img :src="formatImageUrl(selectedPlayer.picture)" />
                        </template>
                        <template v-else-if="loadingPlayerDetail">
                            <q-spinner color="emerald" size="40px" />
                        </template>
                        <q-icon v-else name="las la-user" :size="$q.screen.gt.xs ? '80px' : '60px'" color="slate-200" />
                    </q-avatar>
                    <div class="text-h5 text-weight-bold text-slate-900 text-center">{{ selectedPlayer?.firstName }} {{ selectedPlayer?.lastName }}</div>
                    <div class="row q-gutter-x-sm q-mt-sm">
                        <q-badge color="emerald-50" text-color="emerald" class="q-px-md text-weight-bold">Dorsal: {{ selectedPlayer?.number }}</q-badge>
                        <q-badge color="slate-100" text-color="slate-500" class="q-px-md text-weight-bold" v-if="selectedPlayer?.dni">DNI: {{ selectedPlayer.dni }}</q-badge>
                    </div>
                </q-card-section>

                <q-card-section class="text-center text-slate-500 q-pt-none font-medium">
                    ¿Confirmas la identidad del jugador para agregarlo a la planilla?
                </q-card-section>

                <q-card-actions align="center" class="q-gutter-y-sm q-mt-md column full-width">
                    <q-btn unelevated label="Confirmar Identidad" color="emerald" @click="confirmCheckIn" 
                        class="full-width text-weight-bold" style="border-radius: 16px; height: 56px" 
                        icon="las la-id-card" />
                    <q-btn flat label="Cancelar" color="slate-400" v-close-popup class="full-width text-weight-bold" no-caps />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { usePlayerStore } from 'src/stores/playerStore'
import { useMatchStore } from 'src/stores/matchStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()

const matchId = computed(() => route.params.id)
const teamTab = ref('home')

const match = computed(() => matchStore.matches.find(m => m.id === matchId.value))
const matchLineup = computed(() => matchStore.matchLineups)

const teamsData = computed(() => {
    if (!match.value) return {}
    return {
        home: {
            id: match.value.homeTeamId,
            name: match.value.homeTeam?.name,
            players: playerStore.players.filter(p => p.teamId === match.value.homeTeamId),
            items: homeLineup.value
        },
        away: {
            id: match.value.awayTeamId,
            name: match.value.awayTeam?.name,
            players: playerStore.players.filter(p => p.teamId === match.value.awayTeamId),
            items: awayLineup.value
        }
    }
})

const homeLineup = computed(() => matchLineup.value.filter(l => l.teamId === match.value?.homeTeamId))
const awayLineup = computed(() => matchLineup.value.filter(l => l.teamId === match.value?.awayTeamId))

const showCheckInModal = ref(false)
const selectedPlayerId = ref(null)
const selectedPlayer = computed(() => playerStore.players.find(p => p.id === selectedPlayerId.value))
const targetTeamId = ref(null)
const loadingPlayerDetail = ref(false)

const matchStatusColor = computed(() => {
    if (match.value?.status === 'SCHEDULED') return 'amber-8'
    if (match.value?.status === 'IN_PROGRESS') return 'green-8'
    return 'grey-8'
})

const getAvailablePlayers = (tKey) => {
    const team = teamsData.value[tKey]
    if (!team) return []
    const lineupIds = team.items.map(l => l.playerId)
    return team.players.filter(p => !lineupIds.includes(p.id))
}

const getLineupByStatus = (tKey, status) => {
    const team = teamsData.value[tKey]
    if (!team) return []
    return team.items.filter(item => item.status === status)
}

const getPlayer = (id) => playerStore.players.find(p => p.id === id)
const getPlayerName = (id) => {
    const p = getPlayer(id)
    return p ? `${p.firstName} ${p.lastName}` : 'Desconocido'
}
const getTeamName = (id) => teamStore.teams.find(t => t.id === id)?.name || '...'

const formatImageUrl = (picture) => {
    if (!picture) return ''
    if (picture.startsWith('data:')) return picture
    return `data:image/png;base64,${picture}`
}

onMounted(async () => {
    try {
        $q.loading.show()
        await leagueStore.fetchLeagueData() 
        if (match.value) {
            await Promise.all([
                playerStore.fetchTeamPlayers(match.value.homeTeamId),
                playerStore.fetchTeamPlayers(match.value.awayTeamId),
                matchStore.fetchMatchLineup(matchId.value)
            ])
        }
    } finally {
        $q.loading.hide()
    }
})

const openCheckInModal = async (player, teamId) => {
    selectedPlayerId.value = player.id
    targetTeamId.value = teamId
    showCheckInModal.value = true
    
    try {
        loadingPlayerDetail.value = true
        await playerStore.fetchPlayerDetail(player.id)
    } catch (e) {
        console.error('Error fetching player image', e)
    } finally {
        loadingPlayerDetail.value = false
    }
}

const confirmCheckIn = async () => {
    try {
        if (selectedPlayer.value && targetTeamId.value) {
            // Determine initial status: STARTER if less than 11 starters, else SUBSTITUTE
            const teamSide = targetTeamId.value === match.value.homeTeamId ? 'home' : 'away'
            const currentStarters = getLineupByStatus(teamSide, 'STARTER').length
            const initialStatus = currentStarters < 11 ? 'STARTER' : 'SUBSTITUTE'
            
            await matchStore.addPlayerToLineup({
                matchId: matchId.value,
                playerId: selectedPlayer.value.id,
                teamId: targetTeamId.value,
                status: initialStatus,
                checkedIn: true, 
                number: selectedPlayer.value.number
            })
            
            showCheckInModal.value = false
            $q.notify({ color: 'emerald', message: `${selectedPlayer.value.firstName} verificado`, icon: 'las la-id-card', classes: 'shadow-premium' })
        }
    } catch (e) {
        $q.notify({ color: 'rose-6', message: 'Error al agregar', icon: 'error', classes: 'shadow-premium' })
    }
}

const toggleStatus = async (item) => {
    try {
        const newStatus = item.status === 'STARTER' ? 'SUBSTITUTE' : 'STARTER'
        
        // Validation: Max 11 starters
        if (newStatus === 'STARTER') {
            const startersCount = matchLineup.value.filter(l => l.teamId === item.teamId && l.status === 'STARTER').length
            if (startersCount >= 11) {
                $q.notify({ color: 'warning', message: 'Ya hay 11 titulares asignados para este equipo.', classes: 'shadow-premium' })
                return
            }
        }
        
        await matchStore.updateLineupPlayer(item.id, { status: newStatus })
    } catch (e) {
        $q.notify({ color: 'rose-6', message: 'Error al cambiar estado', classes: 'shadow-premium' })
    }
}

const removeFromLineup = async (item) => {
    try {
        await matchStore.removePlayerFromLineup(item.id)
    } catch (e) {
        $q.notify({ color: 'rose-6', message: 'Error al remover', classes: 'shadow-premium' })
    }
}

const finishLineup = () => {
    $q.notify({ color: 'emerald', message: 'Planilla guardada correctamente', icon: 'check_circle', classes: 'shadow-premium' })
    router.push(`/matches/${matchId.value}?vocal=true`)
}
</script>

<style scoped>
.roster-card, .lineup-card {
    background: white;
}
.scroll {
    overflow-y: auto;
}
@media (max-width: 599px) {
    .full-width-sm {
        width: 100%;
    }
}
</style>
