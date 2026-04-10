<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-md q-gutter-sm">
      <q-btn flat round icon="arrow_back" color="grey-8" @click="$router.back()" />
      <div>
        <div class="text-h4 text-weight-bolder text-green-9">
          {{ isVocal ? 'Planilla de Juego' : 'Detalles del Partido' }}
        </div>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">
          {{ isVocal ? 'Registro de eventos y amonestaciones' : 'Estadísticas y alineaciones en tiempo real' }}
        </div>
      </div>
    </div>

    <!-- Match Header Stadium View -->
    <q-card class="shadow-2 q-mb-lg stadium-card" style="border-radius: 24px; position: relative; overflow: hidden; background: #2e7d32">
      <!-- Soccer Field Markings -->
      <div class="soccer-field-bg absolute-full">
        <div class="field-stripe" v-for="i in 10" :key="i"></div>
        <div class="field-lines">
          <div class="center-circle"></div>
          <div class="center-line"></div>
          <div class="penalty-box left"></div>
          <div class="penalty-box right"></div>
        </div>
      </div>

      <q-card-section class="q-pa-xl text-center relative-position z-top">
        <div class="row items-center justify-center q-gutter-xl">
          <!-- Home Team -->
          <div class="col-3 text-center">
            <q-avatar size="90px" class="bg-white shadow-3 q-mb-sm team-logo-glow">
              <div class="text-green-9 text-h4 text-weight-bolder">{{ homeTeam?.name?.charAt(0) || 'H' }}</div>
            </q-avatar>
            <div class="text-h5 text-weight-bolder text-white">{{ homeTeam?.name || 'Local' }}</div>
          </div>

          <!-- Score & Mini Stadium -->
          <div class="col-5">
            <div class="text-h1 text-weight-bolder text-white q-mb-sm text-shadow">
              {{ match?.homeScore || 0 }} - {{ match?.awayScore || 0 }}
            </div>

            <!-- Mini Field Visualization -->
            <div class="mini-pitch q-mx-auto q-mt-md">
              <div class="pitch-container">
                <!-- Home Players (Left) -->
                <div class="pitch-half left row wrap justify-center items-center">
                  <div v-for="p in activeHomePlayers" :key="p.id" class="player-dot">
                    <div class="dot-inner">{{ getPlayer(p.playerId)?.number }}</div>
                    <q-tooltip>{{ getPlayerName(p.playerId) }}</q-tooltip>
                  </div>
                </div>
                <!-- Away Players (Right) -->
                <div class="pitch-half right row wrap justify-center items-center">
                  <div v-for="p in activeAwayPlayers" :key="p.id" class="player-dot away">
                    <div class="dot-inner">{{ getPlayer(p.playerId)?.number }}</div>
                    <q-tooltip>{{ getPlayerName(p.playerId) }}</q-tooltip>
                  </div>
                </div>
              </div>
            </div>

            <q-badge color="white" text-color="green-9" class="text-weight-bold q-px-md q-py-xs q-mt-md" style="font-size: 14px; border-radius: 8px">
              {{ match?.status || 'SCHEDULED' }}
            </q-badge>
          </div>

          <!-- Away Team -->
          <div class="col-3 text-center">
            <q-avatar size="90px" class="bg-white shadow-3 q-mb-sm team-logo-glow">
              <div class="text-green-9 text-h4 text-weight-bolder">{{ awayTeam?.name?.charAt(0) || 'A' }}</div>
            </q-avatar>
            <div class="text-h5 text-weight-bolder text-white">{{ awayTeam?.name || 'Visitante' }}</div>
          </div>
        </div>

        <!-- Match Status Controls -->
        <div v-if="isVocal" class="row justify-center q-mt-xl q-gutter-md">
          <q-btn v-if="match?.status === 'SCHEDULED'" label="Iniciar Partido" color="white" text-color="green-9" unelevated rounded padding="sm lg" icon="play_arrow" @click="changeStatus('IN_PROGRESS')" />
          <q-btn v-if="match?.status === 'IN_PROGRESS'" label="Finalizar Partido" color="red-8" unelevated rounded padding="sm lg" icon="stop" @click="changeStatus('FINISHED')" />
          <q-btn v-if="match?.status === 'FINISHED' && authStore.isSuperAdmin" label="Reabrir Partido" color="amber-8" unelevated rounded padding="sm lg" icon="refresh" @click="changeStatus('IN_PROGRESS')" />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-lg">
      <!-- Local Players -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-1" style="border-radius: 24px">
          <div class="bg-grey-2 q-pa-md text-weight-bold text-h6" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
            Alineación Local
          </div>
          <q-list separator>
            <q-item v-for="player in homePlayers" :key="player.id" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="green-1" text-color="green-9" class="text-weight-bold">
                  {{ player.number || '#' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ player.firstName }} {{ player.lastName }}</q-item-label>
                <q-item-label caption v-if="playerSuspended(player.id)">
                  <q-badge color="red-8" class="q-py-xs"><q-icon name="block" class="q-mr-xs" /> Suspendido</q-badge>
                </q-item-label>
                <q-item-label caption v-if="isPlayerExpelled(player.id)">
                  <q-badge color="red-10" class="q-py-xs"><q-icon name="gavel" class="q-mr-xs" /> Expulsado</q-badge>
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="isVocal && match?.status === 'IN_PROGRESS' && !isPlayerExpelled(player.id)">
                <div class="row q-gutter-xs">
                  <q-btn round flat dense color="amber-8" icon="style" @click="addEvent(player.id, homeTeam.id, 'YELLOW_CARD')">
                    <q-tooltip>Tarjeta Amarilla</q-tooltip>
                  </q-btn>
                  <q-btn round flat dense color="red-8" icon="style" @click="addEvent(player.id, homeTeam.id, 'RED_CARD')">
                    <q-tooltip>Tarjeta Roja</q-tooltip>
                  </q-btn>
                  <q-btn round flat dense color="blue-8" icon="sports_soccer" @click="addEvent(player.id, homeTeam.id, 'GOAL')">
                    <q-tooltip>Gol</q-tooltip>
                  </q-btn>
                  <q-btn v-if="isPlayerOnField(player.id)" round flat dense color="orange-8" icon="swap_horiz" @click="openSubstitutionModal(player, homeTeam.id)">
                    <q-tooltip>Sustitución</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Away Players -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-1" style="border-radius: 24px">
          <div class="bg-grey-2 q-pa-md text-weight-bold text-h6" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
            Alineación Visitante
          </div>
          <q-list separator>
            <q-item v-for="player in awayPlayers" :key="player.id" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="green-1" text-color="green-9" class="text-weight-bold">
                  {{ player.number || '#' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ player.firstName }} {{ player.lastName }}</q-item-label>
                <q-item-label caption v-if="playerSuspended(player.id)">
                  <q-badge color="red-8" class="q-py-xs"><q-icon name="block" class="q-mr-xs" /> Suspendido</q-badge>
                </q-item-label>
                <q-item-label caption v-if="isPlayerExpelled(player.id)">
                  <q-badge color="red-10" class="q-py-xs"><q-icon name="gavel" class="q-mr-xs" /> Expulsado</q-badge>
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="isVocal && match?.status === 'IN_PROGRESS' && !isPlayerExpelled(player.id)">
                <div class="row q-gutter-xs">
                  <q-btn round flat dense color="amber-8" icon="style" @click="addEvent(player.id, awayTeam.id, 'YELLOW_CARD')">
                    <q-tooltip>Tarjeta Amarilla</q-tooltip>
                  </q-btn>
                  <q-btn round flat dense color="red-8" icon="style" @click="addEvent(player.id, awayTeam.id, 'RED_CARD')">
                    <q-tooltip>Tarjeta Roja</q-tooltip>
                  </q-btn>
                  <q-btn round flat dense color="blue-8" icon="sports_soccer" @click="addEvent(player.id, awayTeam.id, 'GOAL')">
                    <q-tooltip>Gol</q-tooltip>
                  </q-btn>
                  <q-btn v-if="isPlayerOnField(player.id)" round flat dense color="orange-8" icon="swap_horiz" @click="openSubstitutionModal(player, awayTeam.id)">
                    <q-tooltip>Sustitución</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Terna Arbitral -->
      <div class="col-12 q-mt-lg">
        <q-card class="shadow-1" style="border-radius: 24px">
          <div class="bg-grey-2 q-pa-md row items-center justify-between" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
            <div class="text-weight-bold text-h6">Cuerpo Arbitral</div>
            <q-btn v-if="authStore.isSuperAdmin" flat color="green-8" label="Asignar Árbitros" icon="edit" @click="showRefereeModal = true" />
          </div>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div v-if="match?.primaryReferee" class="col-12 col-sm-6">
                <div class="referee-item row items-center no-wrap bg-grey-1 q-pa-sm rounded-borders">
                  <q-avatar size="32px" color="green-8" text-color="white" class="q-mr-sm">
                    <img v-if="match.primaryReferee.photo" :src="match.primaryReferee.photo" style="object-fit: cover">
                    <q-icon v-else name="person" />
                  </q-avatar>
                  <div class="column">
                    <div class="text-caption text-grey-7">Central</div>
                    <div class="text-weight-medium">{{ match.primaryReferee.name }}</div>
                  </div>
                </div>
              </div>
              <div v-if="match?.assistant1" class="col-12 col-sm-6">
                <div class="referee-item row items-center no-wrap bg-grey-1 q-pa-sm rounded-borders">
                  <q-avatar size="32px" color="green-7" text-color="white" class="q-mr-sm">
                    <img v-if="match.assistant1.photo" :src="match.assistant1.photo" style="object-fit: cover">
                    <q-icon v-else name="person" />
                  </q-avatar>
                  <div class="column">
                    <div class="text-caption text-grey-7">Asistente 1</div>
                    <div class="text-weight-medium">{{ match.assistant1.name }}</div>
                  </div>
                </div>
              </div>
              <div v-if="match?.assistant2" class="col-12 col-sm-6">
                <div class="referee-item row items-center no-wrap bg-grey-1 q-pa-sm rounded-borders">
                  <q-avatar size="32px" color="green-7" text-color="white" class="q-mr-sm">
                    <img v-if="match.assistant2.photo" :src="match.assistant2.photo" style="object-fit: cover">
                    <q-icon v-else name="person" />
                  </q-avatar>
                  <div class="column">
                    <div class="text-caption text-grey-7">Asistente 2</div>
                    <div class="text-weight-medium">{{ match.assistant2.name }}</div>
                  </div>
                </div>
              </div>
              <div v-if="match?.fourthReferee" class="col-12 col-sm-6">
                <div class="referee-item row items-center no-wrap bg-grey-1 q-pa-sm rounded-borders">
                  <q-avatar size="32px" color="green-6" text-color="white" class="q-mr-sm">
                    <img v-if="match.fourthReferee.photo" :src="match.fourthReferee.photo" style="object-fit: cover">
                    <q-icon v-else name="person" />
                  </q-avatar>
                  <div class="column">
                    <div class="text-caption text-grey-7">4to Árbitro</div>
                    <div class="text-weight-medium">{{ match.fourthReferee.name }}</div>
                  </div>
                </div>
              </div>
              <div v-if="!match?.refereeId && authStore.isSuperAdmin" class="col-12 text-center q-pa-sm">
                <q-btn color="green-8" outline label="Asignar Árbitros" icon="person_add" @click="showRefereeModal = true" rounded unelevated />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Match Timeline / History -->
      <div class="col-12 q-mt-lg">
        <q-card class="shadow-1" style="border-radius: 24px">
          <div class="bg-grey-2 q-pa-md text-weight-bold text-h6" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
            Historial de Eventos
          </div>
          <q-card-section>
            <q-list separator>
              <q-item v-for="event in sortedEvents" :key="event.id" class="q-py-sm">
                <q-item-section avatar>
                  <q-icon :name="getEventIcon(event.type)" :color="getEventColor(event.type)" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    <template v-if="event.type === 'SUBSTITUTION'">
                      <span class="text-red-8">Sale: {{ getPlayerName(event.playerId) }}</span>
                      <q-icon name="arrow_forward" class="q-mx-xs" />
                      <span class="text-green-8">Entra: {{ getPlayerName(event.relatedPlayerId) }}</span>
                    </template>
                    <template v-else>
                      {{ getPlayerName(event.playerId) }} ({{ getTeamName(event.teamId) }})
                    </template>
                  </q-item-label>
                  <q-item-label caption>
                    {{ getEventLabel(event.type) }} • {{ formatTime(event.createdAt) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="isVocal">
                  <q-btn flat round dense color="grey-7" icon="delete" @click="confirmDeleteEvent(event.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="sortedEvents.length === 0" class="text-grey-6 text-center q-pa-xl">
                <q-item-section>No hay eventos registrados para este partido.</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Substitution Modal -->
    <q-dialog v-model="showSubModal" persistent>
      <q-card style="width: 400px; border-radius: 20px">
        <q-card-section class="bg-orange-8 text-white">
          <div class="text-h6 text-weight-bold">Registrar Sustitución</div>
          <div class="text-subtitle2">Saliendo: {{ playerToSubOut?.firstName }} {{ playerToSubOut?.lastName }}</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm text-weight-bold">Seleccionar Jugador que Entra:</div>
          <q-list bordered separator style="max-height: 300px; overflow: auto">
            <q-item v-for="sub in availableSubs" :key="sub.id" clickable v-ripple :active="selectedSubId === sub.playerId" active-class="bg-orange-1" @click="selectedSubId = sub.playerId">
              <q-item-section avatar>
                <q-avatar color="orange-1" text-color="orange-9" size="sm">
                  {{ getPlayer(sub.playerId)?.number }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ getPlayerName(sub.playerId) }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="selectedSubId === sub.playerId">
                <q-icon name="check_circle" color="orange-8" />
              </q-item-section>
            </q-item>
            <q-item v-if="availableSubs.length === 0" class="text-grey-6 italic">
              No hay suplentes disponibles
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Confirmar Cambio" color="orange-8" :disable="!selectedSubId" @click="confirmSubstitution" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Referee Assignment Modal -->
    <q-dialog v-model="showRefereeModal" persistent>
      <q-card style="width: 450px; border-radius: 20px" class="q-pa-md shadow-24">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5 text-weight-bold text-green-9">Configurar Cuerpo Arbitral</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-lg">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">TIPO DE ASIGNACIÓN</div>
          <q-btn-toggle
            v-model="crewType"
            toggle-color="green-8"
            color="white"
            text-color="grey-9"
            unelevated
            spread
            rounded
            no-caps
            class="q-mb-md border-grey-3"
            :options="crewOptions"
          />

          <q-select
            v-model="assignedReferees.refereeId"
            :options="refereeOptions"
            option-label="name"
            option-value="id"
            label="Árbitro Central"
            outlined
            rounded
            color="green-8"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend><q-icon name="person" color="green-8" /></template>
          </q-select>

          <template v-if="crewType !== 'SINGLE'">
            <q-select
              v-model="assignedReferees.assistant1Id"
              :options="refereeOptions"
              option-label="name"
              option-value="id"
              label="Asistente 1"
              outlined
              rounded
              color="green-8"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend><q-icon name="person_outline" color="green-7" /></template>
            </q-select>
            <q-select
              v-model="assignedReferees.assistant2Id"
              :options="refereeOptions"
              option-label="name"
              option-value="id"
              label="Asistente 2"
              outlined
              rounded
              color="green-8"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend><q-icon name="person_outline" color="green-7" /></template>
            </q-select>
          </template>

          <template v-if="crewType === 'QUARTET'">
            <q-select
              v-model="assignedReferees.fourthRefereeId"
              :options="refereeOptions"
              option-label="name"
              option-value="id"
              label="4to Árbitro"
              outlined
              rounded
              color="green-8"
              emit-value
              map-options
              clearable
            >
              <template v-slot:prepend><q-icon name="person_add" color="green-6" /></template>
            </q-select>
          </template>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup rounded />
          <q-btn 
            :loading="savingReferees" 
            label="Confirmar Asignación" 
            color="green-8" 
            unelevated 
            rounded 
            class="q-px-xl shadow-2"
            @click="saveReferees" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { usePlayerStore } from 'src/stores/playerStore'
import { useMatchStore } from 'src/stores/matchStore'
import { useAuthStore } from 'src/stores/auth'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()

const authStore = useAuthStore()
const isVocal = computed(() => route.query.vocal === 'true' && authStore.isVocal)
const matchId = computed(() => route.params.id)
const match = computed(() => matchStore.matches.find(m => m.id === matchId.value))
const homeTeam = computed(() => teamStore.teams.find(t => t.id === match.value?.homeTeamId))
const awayTeam = computed(() => teamStore.teams.find(t => t.id === match.value?.awayTeamId))

const homePlayers = computed(() => playerStore.players.filter(p => p.teamId === homeTeam.value?.id))
const awayPlayers = computed(() => playerStore.players.filter(p => p.teamId === awayTeam.value?.id))

const events = computed(() => matchStore.matchEvents)
const matchLineups = computed(() => matchStore.matchLineups)

const activeHomePlayers = computed(() => {
    if (!homeTeam.value) return []
    const baseLineup = matchLineups.value.filter(l => l.teamId === homeTeam.value.id && l.status === 'STARTER')
    
    // Applying substitutions logic
    let currentOnField = [...baseLineup]
    const subs = events.value.filter(e => e.type === 'SUBSTITUTION' && e.teamId === homeTeam.value.id)
    
    subs.forEach(s => {
        // Remove the one who went out
        currentOnField = currentOnField.filter(p => p.playerId !== s.playerId)
        // Add the one who went in (if not already there)
        if (s.relatedPlayerId && !currentOnField.find(p => p.playerId === s.relatedPlayerId)) {
            currentOnField.push({ playerId: s.relatedPlayerId, id: `sub-${s.id}` })
        }
    })

    // Remove expelled players from field
    currentOnField = currentOnField.filter(p => !isPlayerExpelled(p.playerId))

    return currentOnField
})

const activeAwayPlayers = computed(() => {
    if (!awayTeam.value) return []
    const baseLineup = matchLineups.value.filter(l => l.teamId === awayTeam.value.id && l.status === 'STARTER')
    
    let currentOnField = [...baseLineup]
    const subs = events.value.filter(e => e.type === 'SUBSTITUTION' && e.teamId === awayTeam.value.id)
    
    subs.forEach(s => {
        currentOnField = currentOnField.filter(p => p.playerId !== s.playerId)
        if (s.relatedPlayerId && !currentOnField.find(p => p.playerId === s.relatedPlayerId)) {
            currentOnField.push({ playerId: s.relatedPlayerId, id: `sub-${s.id}` })
        }
    })

    // Remove expelled players from field
    currentOnField = currentOnField.filter(p => !isPlayerExpelled(p.playerId))

    return currentOnField
})

// Substitution Dialog State
const showSubModal = ref(false)
const playerToSubOut = ref(null)
const selectedSubId = ref(null)
const selectedTeamIdForSub = ref(null)

// Referee Assignment State
const showRefereeModal = ref(false)
const savingReferees = ref(false)
const allReferees = ref([])
const crewType = ref('SINGLE')
const crewOptions = [
    { label: 'Solo Central', value: 'SINGLE' },
    { label: 'Terna (3)', value: 'TRIO' },
    { label: 'Cuarteto (4)', value: 'QUARTET' }
]

const assignedReferees = ref({
    refereeId: null,
    assistant1Id: null,
    assistant2Id: null,
    fourthRefereeId: null
})

const refereeOptions = computed(() => allReferees.value.filter(r => r.active))

const availableSubs = computed(() => {
    if (!selectedTeamIdForSub.value) return []
    const onFieldIds = (selectedTeamIdForSub.value === homeTeam.value?.id ? activeHomePlayers : activeAwayPlayers).value.map(p => p.playerId)
    return matchLineups.value.filter(l => 
        l.teamId === selectedTeamIdForSub.value && 
        l.status === 'SUBSTITUTE' && 
        !onFieldIds.includes(l.playerId)
    )
})

const isPlayerExpelled = (playerId) => {
    const playerEvents = events.value.filter(e => e.playerId === playerId)
    const hasRed = playerEvents.some(e => e.type === 'RED_CARD')
    const yellowCount = playerEvents.filter(e => e.type === 'YELLOW_CARD').length
    return hasRed || yellowCount >= 2
}

const isPlayerOnField = (playerId) => {
    if (isPlayerExpelled(playerId)) return false
    return activeHomePlayers.value.some(p => p.playerId === playerId) || 
           activeAwayPlayers.value.some(p => p.playerId === playerId)
}

const openSubstitutionModal = (player, teamId) => {
    playerToSubOut.value = player
    selectedTeamIdForSub.value = teamId
    selectedSubId.value = null
    showSubModal.value = true
}

const confirmSubstitution = async () => {
    if (!selectedSubId.value || !playerToSubOut.value) return
    
    try {
        $q.loading.show()
        await matchStore.createMatchEvent({
            matchId: matchId.value,
            playerId: playerToSubOut.value.id, // Player going OUT
            teamId: selectedTeamIdForSub.value,
            type: 'SUBSTITUTION',
            relatedPlayerId: selectedSubId.value, // Player coming IN
            tournamentId: match.value.tournamentId
        })
        
        $q.notify({ type: 'positive', message: 'Sustitución registrada con éxito' })
        showSubModal.value = false
        await matchStore.fetchMatchEvents(matchId.value) // Sync events
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Error en la sustitución' })
    } finally {
        $q.loading.hide()
    }
}

const getPlayer = (playerId) => playerStore.players.find(p => p.id === playerId)

const sortedEvents = computed(() => {
    return [...events.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Local State for Suspensions
const activeSuspensions = ref([])

const fetchAllReferees = async () => {
    try {
        const res = await api.get('/api/referees')
        allReferees.value = res.data.data
    } catch (error) {
        console.error('Error fetching referees', error)
    }
}

const saveReferees = async () => {
    savingReferees.value = true
    try {
        const payload = { ...assignedReferees.value }
        
        // Clean payload based on crewType
        if (crewType.value === 'SINGLE') {
            payload.assistant1Id = null
            payload.assistant2Id = null
            payload.fourthRefereeId = null
        } else if (crewType.value === 'TRIO') {
            payload.fourthRefereeId = null
        }

        await matchStore.updateMatch(matchId.value, payload)
        $q.notify({ type: 'positive', message: 'Terna arbitral asignada correctamente' })
        showRefereeModal.value = false
        // Refresh local match data
        await leagueStore.fetchLeagueData()
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Error al asignar árbitros' })
    } finally {
        savingReferees.value = false
    }
}

const loadData = async () => {
    if (!matchId.value) return
    try {
        await matchStore.fetchMatchEvents(matchId.value)
        await matchStore.fetchMatchLineup(matchId.value)
        await fetchAllReferees()
        if (match.value) {
            assignedReferees.value = {
                refereeId: match.value.refereeId,
                assistant1Id: match.value.assistant1Id,
                assistant2Id: match.value.assistant2Id,
                fourthRefereeId: match.value.fourthRefereeId
            }
            // Infer crewType
            if (match.value.fourthRefereeId) crewType.value = 'QUARTET'
            else if (match.value.assistant1Id) crewType.value = 'TRIO'
            else crewType.value = 'SINGLE'
        }
        await loadSuspensions()
    } catch (e) {
        console.error('Error loading match data', e)
    }
}

onMounted(() => {
    loadData()
})

const loadSuspensions = async () => {
    if (!match.value) return
    const tournamentId = match.value.tournamentId
    if (!tournamentId) return;

    const allPlayers = [...homePlayers.value, ...awayPlayers.value]
    activeSuspensions.value = []

    // Fetch suspensions concurrently in chunks or all at once to be faster than sequential loop
    await Promise.all(allPlayers.map(async (player) => {
        try {
            const res = await api.get(`/api/suspensions?playerId=${player.id}&tournamentId=${tournamentId}`)
            if (res.data.data && res.data.data.length > 0) {
                const active = res.data.data.filter(s => s.status === 'ACTIVE')
                if (active.length > 0) {
                    activeSuspensions.value.push(player.id)
                }
            }
        } catch (e) {
            console.error('Error fetching suspensions for', player.id)
        }
    }))
}

watch(matchId, () => loadData())

const playerSuspended = (id) => activeSuspensions.value.includes(id)

const addEvent = async (playerId, teamId, type) => {
    try {
        $q.loading.show()
        await matchStore.createMatchEvent({
            matchId: matchId.value,
            playerId,
            teamId,
            type,
            tournamentId: match.value.tournamentId
        })
        $q.notify({ type: 'positive', message: `Evento ${getEventLabel(type)} registrado.` })
        
        // Refresh everything to sync score and suspensions
        await leagueStore.fetchLeagueData() // This updates matches (scores)
        await loadSuspensions()
    } catch (error) {
        $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error registrando evento' })
    } finally {
        $q.loading.hide()
    }
}

const confirmDeleteEvent = (eventId) => {
    $q.dialog({
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este evento? Esto revertirá los cambios en el marcador y sanciones.',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        try {
            $q.loading.show()
            await matchStore.deleteMatchEvent(eventId)
            $q.notify({ type: 'positive', message: 'Evento eliminado.' })
            
            // Refresh sync
            await leagueStore.fetchLeagueData()
            await loadSuspensions()
        } catch (error) {
            $q.notify({ type: 'negative', message: 'Error eliminando evento' })
        } finally {
            $q.loading.hide()
        }
    })
}

const changeStatus = async (status) => {
    try {
        $q.loading.show()
        await matchStore.updateMatch(matchId.value, { status })
        $q.notify({ type: 'positive', message: `Estado actualizado a ${status}` })
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Error actualizando estado' })
    } finally {
        $q.loading.hide()
    }
}

const getEventIcon = (type) => {
    if (type === 'GOAL') return 'sports_soccer'
    if (type === 'YELLOW_CARD') return 'style'
    if (type === 'RED_CARD') return 'style'
    if (type === 'SUBSTITUTION') return 'swap_horiz'
    return 'info'
}

const getEventColor = (type) => {
    if (type === 'GOAL') return 'blue-8'
    if (type === 'YELLOW_CARD') return 'amber-8'
    if (type === 'RED_CARD') return 'red-8'
    if (type === 'SUBSTITUTION') return 'orange-8'
    return 'grey-7'
}

const getPlayerName = (playerId) => {
    const p = getPlayer(playerId)
    return p ? `${p.firstName} ${p.lastName}` : 'Jugador desconocido'
}

const getTeamName = (teamId) => {
    const t = teamStore.teams.find(team => team.id === teamId)
    return t ? t.name : 'Equipo desconocido'
}

const getEventLabel = (type) => {
    const labels = {
        GOAL: 'Gol',
        YELLOW_CARD: 'Tarjeta Amarilla',
        RED_CARD: 'Tarjeta Roja',
        SUBSTITUTION: 'Sustitución'
    }
    return labels[type] || type
}

const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.border-grey-3 {
    border: 1px solid #e0e0e0;
}
.stadium-card {
    min-height: 400px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
}

.soccer-field-bg {
    display: flex;
    flex-direction: column;
    opacity: 0.8;
}

.field-stripe {
    flex: 1;
}
.field-stripe:nth-child(even) {
    background: rgba(255,255,255,0.05);
}

.field-lines {
    position: absolute;
    inset: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    pointer-events: none;
}

.center-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(255,255,255,0.3);
}

.center-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100px;
    height: 100px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.penalty-box {
    position: absolute;
    width: 60px;
    height: 120px;
    border: 2px solid rgba(255,255,255,0.3);
    top: 50%;
    transform: translateY(-50%);
}
.penalty-box.left { left: -2px; border-left: none; }
.penalty-box.right { right: -2px; border-right: none; }

.team-logo-glow {
    box-shadow: 0 0 20px rgba(255,255,255,0.3);
    border: 4px solid rgba(255,255,255,0.2);
}

.text-shadow {
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.mini-pitch {
    width: 100%;
    max-width: 500px;
    height: 180px;
    background: rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 10px;
    position: relative;
}

.pitch-container {
    display: flex;
    height: 100%;
}

.pitch-half {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    gap: 10px;
    padding: 10px;
}

.player-dot {
    width: 34px;
    height: 34px;
    background: #0d47a1;
    border: 2px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.player-dot:hover {
    transform: scale(1.3) translateY(-5px);
    z-index: 10;
}

.player-dot.away {
    background: #b71c1c;
}

.dot-inner {
    color: white;
    font-size: 14px;
    font-weight: bold;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
    70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
}

.player-dot {
    animation: pulse 2s infinite;
}
</style>
