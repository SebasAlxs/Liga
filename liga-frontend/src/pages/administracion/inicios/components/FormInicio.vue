<template>
  <div class="q-pa-md">
    <!-- Header: Tabs and Search -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="col-12 col-md-auto">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="green-8"
          indicator-color="green-8"
          align="left"
          narrow-indicator
        >
          <q-tab name="j12" label="JORNADA 12" class="text-weight-bold" />
          <q-tab name="j13" label="JORNADA 13 (ACTUAL)" class="text-weight-bold" />
          <q-tab name="j14" label="JORNADA 14" class="text-weight-bold" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-auto q-mt-sm q-mt-md-none row items-center q-gutter-md">
        <q-btn
          color="blue-8"
          icon="list"
          label="Ver Equipos"
          no-caps
          unelevated
          @click="showListEquipos = true"
          style="border-radius: 8px"
        />
        <q-btn
          color="green-8"
          icon="add_circle"
          label="Crear Equipo"
          no-caps
          unelevated
          @click="showFormEquipo = true"
          style="border-radius: 8px"
        />
        <q-input
          v-model="search"
          placeholder="Buscar equipo..."
          outlined
          dense
          bg-color="white"
          class="rounded-borders"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Dialog for New Team -->
    <q-dialog v-model="showFormEquipo" persistent>
      <FormEquipo @saved="handleTeamSaved" />
    </q-dialog>

    <!-- Dialog for Teams List -->
    <q-dialog v-model="showListEquipos">
      <q-card style="width: 400px; max-width: 80vw; border-radius: 12px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-grey-8">Equipos Agregados</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup text-color="grey-8" />
        </q-card-section>
        <q-card-section>
          <q-list bordered separator class="rounded-borders">
            <q-item v-for="team in teamsList" :key="team.id" v-ripple>
              <q-item-section avatar>
                <q-avatar color="green-7" text-color="white" class="text-weight-bold shadow-1">
                  {{ team.name ? team.name.charAt(0).toUpperCase() : '?' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-grey-9">{{ team.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="teamsList.length === 0">
              <q-item-section class="text-grey-6 text-center q-py-md text-weight-medium">
                No hay equipos agregados
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-separator color="grey-3" class="q-mb-xl" />

    <!-- Match Grid -->
    <div class="row q-col-gutter-lg">
      <div v-for="match in filteredMatches" :key="match.id" class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="my-card match-card"
          :class="{ 'live-card': match.status === 'live' }"
        >
          <!-- Card Header with Context and Status -->
          <q-card-section
            class="row items-center justify-between q-pb-none"
            :class="match.headerClass"
          >
            <div class="text-subtitle2 text-weight-bold text-grey-8">{{ match.context }}</div>
            <q-badge
              :color="match.statusColor"
              :label="match.statusLabel"
              class="q-px-sm q-py-xs text-caption text-weight-bold"
              style="border-radius: 12px"
            />
          </q-card-section>

          <!-- Match Content -->
          <q-card-section class="q-py-md">
            <div class="row items-center justify-between text-center">
              <!-- Team A -->
              <div class="col-4 column items-center">
                <q-avatar
                  size="64px"
                  :color="match.teamAColor"
                  text-color="white"
                  class="text-h4 text-weight-bold shadow-1"
                >
                  {{ match.teamA.charAt(0) }}
                </q-avatar>
                <div class="text-body1 text-weight-bold q-mt-sm">{{ match.teamA }}</div>
              </div>

              <!-- Score / Time -->
              <div class="col-4 column items-center justify-center">
                <div v-if="match.status !== 'pending'" class="text-h3 text-weight-bolder q-mb-xs">
                  {{ match.scoreA }} - {{ match.scoreB }}
                </div>
                <div v-else class="text-h3 text-weight-bolder q-mb-xs text-green-7">
                  {{ match.time }}
                </div>
                <div class="text-caption text-grey-6 text-weight-bold">VS</div>
              </div>

              <!-- Team B -->
              <div class="col-4 column items-center">
                <q-avatar
                  size="64px"
                  :color="match.teamBColor"
                  text-color="white"
                  class="text-h4 text-weight-bold shadow-1"
                >
                  {{ match.teamB.charAt(0) }}
                </q-avatar>
                <div class="text-body1 text-weight-bold q-mt-sm">{{ match.teamB }}</div>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-2" inset />

          <!-- Card Footer -->
          <q-card-section class="row items-center justify-center q-gutter-x-lg text-grey-7 q-pt-sm">
            <div class="row items-center">
              <q-icon name="event" size="18px" class="q-mr-xs" />
              <span class="text-weight-medium">{{ match.date }}</span>
            </div>
            <div class="row items-center">
              <q-icon name="place" size="18px" class="q-mr-xs" />
              <span class="text-weight-medium">{{ match.location }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import FormEquipo from './FormEquipo.vue'

const tab = ref('j13')
const search = ref('')

const matches = ref([])
const showFormEquipo = ref(false)
const teamsList = ref([])
const showListEquipos = ref(false)

const filteredMatches = computed(() => {
  let result = matches.value
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (m) => m.teamA.toLowerCase().includes(s) || m.teamB.toLowerCase().includes(s),
    )
  }
  return result
})

const fetchData = async () => {
  try {
    const [teamsRes, matchesRes] = await Promise.all([
      api.get('/api/teams'),
      api.get('/api/matches'),
    ])

    // Checking the response shape usually `data.data` for standard envelops.
    const teams = teamsRes.data.data || teamsRes.data || []
    const backendMatches = matchesRes.data.data || matchesRes.data || []

    teamsList.value = teams

    const teamMap = {}
    teams.forEach((t) => {
      teamMap[t.id] = t
    })

    matches.value = backendMatches.map((m) => {
      const homeTeam = teamMap[m.homeTeamId]
      const awayTeam = teamMap[m.awayTeamId]

      const statusMap = {
        SCHEDULED: {
          label: 'Pendiente',
          color: 'green-7',
          headerClass: 'bg-white',
          statusStr: 'pending',
        },
        IN_PROGRESS: {
          label: 'En Vivo',
          color: 'red-7',
          headerClass: 'bg-red-1',
          statusStr: 'live',
        },
        FINISHED: {
          label: 'Finalizado',
          color: 'grey-4',
          headerClass: 'bg-grey-1',
          statusStr: 'finished',
        },
        CANCELLED: {
          label: 'Cancelado',
          color: 'black',
          headerClass: 'bg-grey-3',
          statusStr: 'cancelled',
        },
      }

      const s = statusMap[m.status] || statusMap['SCHEDULED']

      return {
        id: m.id,
        context: 'Principal',
        status: s.statusStr,
        statusLabel: s.label,
        statusColor: s.color,
        headerClass: s.headerClass,
        teamA: homeTeam ? homeTeam.name : 'Desconocido',
        teamAColor: 'green-7',
        scoreA: m.homeScore ?? 0,
        teamB: awayTeam ? awayTeam.name : 'Desconocido',
        teamBColor: 'blue-7',
        scoreB: m.awayScore ?? 0,
        date: new Date(m.matchDate).toLocaleDateString(),
        time: new Date(m.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: 'Cancha Central',
      }
    })
  } catch (error) {
    console.error('Error fetching data from API:', error)
  }
}

onMounted(() => {
  fetchData()
})

const handleTeamSaved = () => {
  showFormEquipo.value = false
  fetchData()
}
</script>

<style scoped>
.match-card {
  border-radius: 24px;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.q-badge.bg-grey-4 {
  color: #424242 !important;
}
</style>
