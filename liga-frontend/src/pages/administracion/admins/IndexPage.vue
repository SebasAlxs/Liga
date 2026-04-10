<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header -->
    <!-- <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-green-9">Posiciones</div>
      <q-btn
        color="green-8"
        label="Inscribirse"
        unelevated
        class="text-weight-bold q-px-md"
        style="border-radius: 8px"
      />
    </div> -->

    <!-- <q-separator /> -->

    <div class="q-mt-lg q-mb-md row items-end justify-between">
      <div>
        <div class="text-h4 text-weight-bolder text-green-9">Tabla de Posiciones</div>
        <div class="row items-center q-gutter-x-sm q-mt-xs">
          <div class="text-subtitle1 text-grey-7">
            {{ activeCategoryName }} - {{ activeTournamentName }}
          </div>
          <q-badge v-if="activeTournament?.active" color="green-8" label="Activo" />
        </div>
      </div>

      <div class="row q-gutter-sm items-center">
        <!-- Selectors -->
        <q-select
          v-model="selectedTournament"
          :options="tournamentOptions"
          label="Torneo"
          dense
          outlined
          rounded
          emit-value
          map-options
          options-dense
          bg-color="white"
          style="min-width: 200px"
          color="green-8"
        >
          <template v-slot:prepend>
            <q-icon name="emoji_events" color="green-8" />
          </template>
        </q-select>

        <q-select
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Categoría"
          dense
          outlined
          rounded
          emit-value
          map-options
          options-dense
          bg-color="white"
          style="min-width: 180px"
          color="green-8"
        >
          <template v-slot:prepend>
            <q-icon name="category" color="green-8" />
          </template>
        </q-select>

        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey-7"
          active-color="green-8"
          indicator-color="green-8"
          align="left"
          narrow-indicator
          no-caps
          inline-label
          style="border-bottom: 2px solid #e0e0e0; min-width: 150px"
        >
          <q-tab name="standings" label="Posiciones" icon="leaderboard" />
        </q-tabs>
      </div>
    </div>

    <!-- Skeletons para Loading -->
    <q-card
      v-if="loading"
      class="my-card shadow-1 q-mt-md"
      v-bind:style="{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e0e0' }"
    >
      <q-markup-table flat bordered class="no-shadow" style="border-radius: 24px">
        <thead class="bg-green-8 text-white">
          <tr>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 80px">POS</th>
            <th class="text-weight-bolder text-subtitle2 text-left">EQUIPO</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 60px">PJ</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 60px">PG</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 60px">PE</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 60px">PP</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 60px">DG</th>
            <th class="text-weight-bolder text-subtitle2 text-center" style="width: 80px">PTS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i" style="height: 64px">
            <td class="text-center">
              <q-skeleton type="text" width="20px" class="q-mx-auto" />
            </td>
            <td>
              <div class="row items-center no-wrap">
                <q-skeleton type="QAvatar" size="36px" class="q-mr-md" />
                <q-skeleton type="text" width="120px" />
              </div>
            </td>
            <td class="text-center"><q-skeleton type="text" width="20px" class="q-mx-auto" /></td>
            <td class="text-center"><q-skeleton type="text" width="20px" class="q-mx-auto" /></td>
            <td class="text-center"><q-skeleton type="text" width="20px" class="q-mx-auto" /></td>
            <td class="text-center"><q-skeleton type="text" width="20px" class="q-mx-auto" /></td>
            <td class="text-center"><q-skeleton type="text" width="24px" class="q-mx-auto" /></td>
            <td class="text-center"><q-skeleton type="text" width="24px" class="q-mx-auto" /></td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>

    <!-- Table Card -->
    <q-card
      v-else
      class="my-card shadow-1 q-mt-md"
      v-bind:style="{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e0e0' }"
    >
      <!-- Standings Table -->
      <q-table
        v-if="activeTab === 'standings'"
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        bordered
        hide-bottom
        hide-pagination
        :loading="loading"
        :rows-per-page-options="[0]"
        table-header-class="bg-green-8 text-white text-weight-bold"
        card-class="no-shadow"
      >
        <!-- Custom Header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-green-8 text-white">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-weight-bolder text-subtitle2"
              style="border-bottom: none"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom Rows -->
        <template v-slot:body="props">
          <q-tr :props="props" style="height: 64px">
            <q-td
              key="pos"
              :props="props"
              class="text-weight-bold text-green-8 text-center text-subtitle1"
            >
              {{ props.row.pos }}
            </q-td>
            <q-td key="equipo" :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="36px"
                  color="grey-3"
                  text-color="dark"
                  class="q-mr-md text-weight-bold shadow-1"
                >
                  <img v-if="props.row.logo" :src="props.row.logo" alt="logo" />
                  <span v-else>{{ props.row.equipo.charAt(0) }}</span>
                </q-avatar>
                <div class="text-weight-bold text-green-10 text-subtitle1">
                  {{ props.row.equipo }}
                </div>
              </div>
            </q-td>
            <q-td
              key="pj"
              :props="props"
              class="text-weight-bold text-dark text-center text-subtitle1"
            >
              {{ props.row.pj }}
            </q-td>
            <q-td key="pg" :props="props" class="text-subtitle1 text-grey-8 text-center">
              {{ props.row.pg }}
            </q-td>
            <q-td key="pe" :props="props" class="text-subtitle1 text-grey-8 text-center">
              {{ props.row.pe }}
            </q-td>
            <q-td key="pp" :props="props" class="text-subtitle1 text-grey-8 text-center">
              {{ props.row.pp }}
            </q-td>
            <q-td
              key="dg"
              :props="props"
              class="text-weight-bold text-center text-subtitle1"
              :class="
                props.row.dg > 0 ? 'text-green-8' : props.row.dg < 0 ? 'text-red' : 'text-green-8'
              "
            >
              {{ props.row.dg > 0 ? '+' : '' }}{{ props.row.dg }}
            </q-td>
            <q-td
              key="pts"
              :props="props"
              class="text-weight-bold text-green-8 text-center text-h6"
            >
              {{ props.row.pts }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useLeagueStore } from 'src/stores/league'

const leagueStore = useLeagueStore()
const activeTab = ref('standings')

const tournamentOptions = computed(() => {
  return leagueStore.tournaments.map((t) => ({
    label: t.name,
    value: t.id,
    active: t.active,
  }))
})

const categoryOptions = computed(() => {
  return leagueStore.categories.map((c) => ({
    label: c.name,
    value: c.id,
  }))
})

const selectedTournament = computed({
  get: () => leagueStore.activeTournamentId,
  set: (val) => leagueStore.setActiveTournament(val),
})

const selectedCategory = computed({
  get: () => leagueStore.activeCategoryId,
  set: (val) => leagueStore.setActiveCategory(val),
})

const activeTournament = computed(() => {
  return leagueStore.tournaments.find((t) => t.id === leagueStore.activeTournamentId)
})

const activeTournamentName = computed(() => {
  return activeTournament.value?.name || 'Seleccione Torneo'
})

const activeCategoryName = computed(() => {
  const category = leagueStore.categories.find((c) => c.id === leagueStore.activeCategoryId)
  return category?.name || 'Seleccione Categoría'
})

const columns = [
  { name: 'pos', label: 'POS', align: 'center', field: 'pos', headerStyle: 'width: 80px' },
  { name: 'equipo', label: 'EQUIPO', align: 'left', field: 'equipo' },
  { name: 'pj', label: 'PJ', align: 'center', field: 'pj', headerStyle: 'width: 60px' },
  { name: 'pg', label: 'PG', align: 'center', field: 'pg', headerStyle: 'width: 60px' },
  { name: 'pe', label: 'PE', align: 'center', field: 'pe', headerStyle: 'width: 60px' },
  { name: 'pp', label: 'PP', align: 'center', field: 'pp', headerStyle: 'width: 60px' },
  { name: 'dg', label: 'DG', align: 'center', field: 'dg', headerStyle: 'width: 60px' },
  { name: 'pts', label: 'PTS', align: 'center', field: 'pts', headerStyle: 'width: 80px' },
]

const rows = computed(() => leagueStore.standings)
const loading = computed(() => leagueStore.loading)

onMounted(() => {
  leagueStore.fetchLeagueData()
})
</script>

<style scoped>
.my-card {
  border-radius: 24px;
}

.q-table__container {
  border-radius: 24px !important;
}

.text-green-10 {
  color: #1b5e20;
}
</style>
