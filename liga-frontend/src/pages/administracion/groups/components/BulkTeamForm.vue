<template>
  <q-card
    class="bulk-team-form shadow-2"
    style="border-radius: 20px; border: 1px solid #e0e0e0; min-width: 800px"
  >
    <q-card-section class="bg-green-8 text-white q-pa-md">
      <div class="row items-center justify-between">
        <div class="column">
          <div class="text-h6 text-weight-bold">Registro Masivo de Equipos</div>
          <div class="text-caption text-green-1">
            Crea rápidamente múltiples equipos para un mismo Torneo y Categoría
          </div>
        </div>
        <q-btn icon="close" flat round dense @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <q-card-section class="q-pa-lg">
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Sede Compartida -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="sharedData.headquartersId"
            :options="sedeOptions"
            label="Sede / Matriz *"
            outlined
            dense
            color="green-8"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Selecciona una sede']"
          >
            <template v-slot:prepend>
              <q-icon name="location_city" />
            </template>
          </q-select>
        </div>

        <!-- Torneo Compartido -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="sharedData.tournamentId"
            :options="tournamentOptions"
            label="Torneo para todos los equipos *"
            outlined
            dense
            color="green-8"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Selecciona un torneo']"
            :disable="!sharedData.headquartersId"
          >
            <template v-slot:prepend>
              <q-icon name="emoji_events" />
            </template>
          </q-select>
        </div>

        <!-- Categoría Compartida -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="sharedData.categoryId"
            :options="categoryOptions"
            label="Categoría para todos los equipos *"
            outlined
            dense
            color="green-8"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Selecciona una categoría']"
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
        </div>
      </div>

      <q-separator color="grey-3" class="q-my-md" />

      <div class="q-pb-md">
        <q-table
          flat
          bordered
          :rows="rows"
          :columns="columns"
          row-key="tempId"
          hide-pagination
          class="bulk-table"
        >
          <template v-slot:body-cell-logo="props">
            <q-td :props="props">
              <q-file
                v-model="props.row.logoFile"
                dense
                outlined
                color="green-8"
                accept="image/*"
                placeholder="Subir Logo"
                @update:model-value="(file) => onFileChange(file, props.row)"
              >
                <template v-slot:prepend>
                  <q-avatar v-if="props.row.logo" size="24px">
                    <img :src="props.row.logo" />
                  </q-avatar>
                  <q-icon v-else name="image" />
                </template>
                <template v-slot:append>
                  <q-icon
                    v-if="props.row.logoFile"
                    name="close"
                    @click.stop.prevent="clearLogo(props.row)"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.name"
                dense
                outlined
                color="green-8"
                placeholder="Nombre completo"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-foundedYear="props">
            <q-td :props="props" style="width: 120px">
              <q-input
                v-model.number="props.row.foundedYear"
                type="number"
                dense
                outlined
                color="green-8"
                placeholder="Ej: 2020"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-championshipsWon="props">
            <q-td :props="props" style="width: 120px">
              <q-input
                v-model.number="props.row.championshipsWon"
                type="number"
                dense
                outlined
                color="green-8"
                placeholder="0"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                color="red-5"
                icon="delete"
                dense
                @click="removeRow(props.row.tempId)"
              />
            </q-td>
          </template>
        </q-table>

        <div class="row justify-center q-pt-md">
          <q-btn
            flat
            color="green-8"
            icon="add_circle"
            label="Añadir otra fila"
            no-caps
            class="text-weight-bold"
            @click="addRow"
          />
        </div>
      </div>

      <q-separator color="grey-3" class="q-my-md" />

      <div class="row justify-end q-gutter-sm">
        <q-btn label="Cancelar" color="grey-7" flat @click="$emit('cancel')" />
        <q-btn
          label="Guardar todos los equipos"
          color="green-8"
          icon="save"
          unelevated
          class="text-weight-bold"
          :loading="saving"
          :disable="rows.length === 0 || !sharedData.tournamentId || !sharedData.categoryId"
          @click="saveAll"
          style="border-radius: 8px"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useLeagueStore } from 'src/stores/league'

const emit = defineEmits(['saved', 'cancel'])
const $q = useQuasar()
const leagueStore = useLeagueStore()

const saving = ref(false)

const sharedData = ref({
  headquartersId: null,
  tournamentId: leagueStore.activeTournamentId || null,
  categoryId: leagueStore.activeCategoryId || null,
})

const sedeOptions = computed(() => leagueStore.headquarters)

const tournamentOptions = computed(() => {
  if (!sharedData.value.headquartersId) return []
  return leagueStore.tournaments.filter((t) => t.headquartersId === sharedData.value.headquartersId)
})

const categoryOptions = computed(() => leagueStore.categories)

watch(
  () => sharedData.value.headquartersId,
  () => {
    sharedData.value.tournamentId = null
  },
)

const columns = [
  { name: 'name', label: 'Nombre del Equipo *', align: 'left', field: 'name' },
  { name: 'foundedYear', label: 'Fundación *', align: 'center', field: 'foundedYear' },
  { name: 'championshipsWon', label: 'Títulos', align: 'center', field: 'championshipsWon' },
  { name: 'logo', label: 'Logo', align: 'left', field: 'logo' },
  { name: 'actions', label: '', align: 'center', field: 'actions' },
]

const rows = ref([createRow()])

onMounted(() => {
  if (leagueStore.tournaments.length === 0 || leagueStore.categories.length === 0) {
    leagueStore.fetchLeagueData()
  }
})

function createRow() {
  return {
    tempId: Date.now() + Math.random(),
    name: '',
    foundedYear: new Date().getFullYear(),
    championshipsWon: null,
    logo: '',
    logoFile: null,
  }
}

function onFileChange(file, row) {
  if (!file) {
    clearLogo(row)
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    row.logo = e.target.result // Base64 encoding
  }
  reader.readAsDataURL(file)
}

function clearLogo(row) {
  row.logoFile = null
  row.logo = ''
}

function addRow() {
  rows.value.push(createRow())
}

function removeRow(tempId) {
  if (rows.value.length === 1) {
    rows.value = [createRow()]
    return
  }
  rows.value = rows.value.filter((r) => r.tempId !== tempId)
}

async function saveAll() {
  if (!sharedData.value.tournamentId || !sharedData.value.categoryId) {
    $q.notify({
      color: 'negative',
      message: 'Debes seleccionar un torneo y una categoría aplicables para todos',
      icon: 'warning',
    })
    return
  }

  const invalid = rows.value.some((r) => !r.name || r.name.length < 3 || r.foundedYear === null)
  if (invalid) {
    $q.notify({
      color: 'negative',
      message: 'Comprueba que todos los equipos tengan nombre (min. 3 letras) y año de fundación',
      icon: 'warning',
    })
    return
  }

  saving.value = true
  let successCount = 0
  let errorCount = 0

  try {
    for (const team of rows.value) {
      try {
        const payload = {
          name: team.name,
          foundedYear: Number(team.foundedYear),
          tournamentId: sharedData.value.tournamentId,
          categoryId: sharedData.value.categoryId,
        }
        if (team.championshipsWon !== null && team.championshipsWon !== '') {
          payload.championshipsWon = Number(team.championshipsWon)
        }
        if (team.logo && team.logo.trim() !== '') {
          payload.logo = team.logo.trim()
        }

        await api.post('/api/teams', payload)
        successCount++
      } catch (err) {
        console.error('Error creating team:', team.name, err)
        errorCount++
      }
    }

    if (successCount > 0) {
      $q.notify({
        color: 'positive',
        message: `${successCount} equipos guardados correctamente`,
        icon: 'check_circle',
      })
    }

    if (errorCount > 0) {
      $q.notify({
        color: 'negative',
        message: `Error al guardar ${errorCount} equipos`,
        icon: 'error',
      })
    }

    if (successCount > 0) {
      emit('saved')
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.bulk-table {
  background: white;
  border-radius: 12px;
}

:deep(.q-table th) {
  font-weight: bold;
  color: #555;
  background-color: #f8f9fa;
}

.bulk-team-form {
  max-width: 900px;
  margin: 0 auto;
}
</style>
