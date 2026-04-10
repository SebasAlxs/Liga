<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header -->
    <div v-if="referee" class="q-mb-xl">
      <div class="row items-center q-gutter-x-lg">
        <q-avatar size="100px" color="green-1" text-color="green-9" class="shadow-2">
          <img v-if="referee.photo" :src="referee.photo" style="object-fit: cover">
          <q-icon v-else name="person" size="64px" />
        </q-avatar>
        <div>
          <div class="text-overline text-green-8 text-weight-bold">PERFIL DE ÁRBITRO</div>
          <h1 class="text-h3 text-weight-bolder text-grey-9 q-ma-none">{{ referee.name }}</h1>
          <div class="row items-center q-mt-sm q-gutter-x-md">
            <q-badge :color="referee.active ? 'green-2' : 'red-2'" :text-color="referee.active ? 'green-9' : 'red-9'" rounded class="q-px-sm">
              {{ referee.active ? 'Activo' : 'Inactivo' }}
            </q-badge>
            <div class="text-subtitle1 text-grey-7">Licencia: {{ referee.license || 'Sin registro' }}</div>
          </div>
        </div>
        <q-space />
        <q-btn flat color="grey-7" label="Volver" icon="arrow_back" @click="$router.back()" rounded />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Contact Info -->
      <div class="col-12 col-md-4">
        <q-card class="info-card shadow-1" bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Información de Contacto</div>
            <div class="column q-gutter-y-md">
              <div class="row items-center no-wrap">
                <q-icon name="phone" color="green-8" size="sm" class="q-mr-md" />
                <div>
                  <div class="text-caption text-grey-7">Teléfono</div>
                  <div class="text-body1">{{ referee?.phone || 'No registrado' }}</div>
                </div>
              </div>
              <div class="row items-center no-wrap">
                <q-icon name="email" color="green-8" size="sm" class="q-mr-md" />
                <div>
                  <div class="text-caption text-grey-7">Correo Electrónico</div>
                  <div class="text-body1 text-break">{{ referee?.email || 'No registrado' }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md info-card shadow-1" bordered>
          <q-card-section class="text-center q-pa-lg">
            <div class="text-h4 text-weight-bolder text-green-9 q-mb-xs">{{ matchHistory.length }}</div>
            <div class="text-overline text-grey-7">Partidos Dirigidos</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Match Timeline -->
      <div class="col-12 col-md-8">
        <q-card class="info-card shadow-1" bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Historial de Partidos (Timeline)</div>
            
            <q-timeline color="green-8" class="q-px-md">
              <q-timeline-entry
                v-for="match in sortedHistory"
                :key="match.id"
                :title="`${getTeamName(match.homeTeamId)} vs ${getTeamName(match.awayTeamId)}`"
                :subtitle="formatDate(match.matchDate)"
                :icon="getRoleIcon(match)"
              >
                <div>
                  <div class="row items-center q-gutter-x-sm">
                    <q-badge color="grey-2" text-color="grey-9" class="text-weight-bold">
                      {{ match.homeScore }} - {{ match.awayScore }}
                    </q-badge>
                    <div class="text-caption text-grey-7">{{ getTournamentName(match.tournamentId) }}</div>
                  </div>
                  <div class="text-caption text-green-9 q-mt-xs text-weight-bold">
                    Rol: {{ getMatchRole(match) }}
                  </div>
                </div>
              </q-timeline-entry>

              <div v-if="matchHistory.length === 0" class="text-center q-pa-xl text-grey-5">
                <q-icon name="history" size="48px" />
                <div class="text-body1 q-mt-sm">Este árbitro aún no ha dirigido partidos registrados.</div>
              </div>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { date } from 'quasar'

const route = useRoute()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const referee = ref(null)
const matchHistory = ref([])

const refereeId = computed(() => route.params.id)

const fetchReferee = async () => {
  try {
    const res = await api.get(`/api/referees/${refereeId.value}`)
    referee.value = res.data.data
  } catch (error) {
    console.error('Error fetching referee details', error)
  }
}

const fetchMatchHistory = async () => {
  try {
    const res = await api.get('/api/matches')
    const allMatches = res.data.data || []
    // Filter matches where this referee participated
    matchHistory.value = allMatches.filter(m => 
      m.refereeId === refereeId.value ||
      m.assistant1Id === refereeId.value ||
      m.assistant2Id === refereeId.value ||
      m.fourthRefereeId === refereeId.value
    )
  } catch (error) {
    console.error('Error fetching match history', error)
  }
}

const sortedHistory = computed(() => {
  return [...matchHistory.value].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
})

const getTeamName = (id) => teamStore.teams.find(t => t.id === id)?.name || 'Equipo'
const getTournamentName = (id) => leagueStore.tournaments.find(t => t.id === id)?.name || 'Torneo'
const formatDate = (val) => date.formatDate(val, 'DD MMM, YYYY')

const getMatchRole = (match) => {
  if (match.refereeId === refereeId.value) return 'Árbitro Central'
  if (match.assistant1Id === refereeId.value) return 'Asistente 1'
  if (match.assistant2Id === refereeId.value) return 'Asistente 2'
  if (match.fourthRefereeId === refereeId.value) return '4to Árbitro'
  return 'Oficial'
}

const getRoleIcon = (match) => {
  if (match.refereeId === refereeId.value) return 'sports'
  return 'person_outline'
}

onMounted(() => {
  fetchReferee()
  fetchMatchHistory()
})
</script>

<style scoped>
.info-card {
  border-radius: 20px;
}
.rounded-borders {
  border-radius: 8px;
}
.text-break {
  word-break: break-all;
}
</style>
