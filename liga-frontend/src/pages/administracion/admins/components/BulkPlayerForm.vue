<template>
  <q-card class="bulk-player-form shadow-2" style="border-radius: 20px; border: 1px solid #e0e0e0;">
    <q-card-section class="bg-green-8 text-white q-pa-md">
      <div class="row items-center justify-between">
        <div class="column">
          <div class="text-h6 text-weight-bold">Registro Masivo de Jugadores</div>
          <div class="text-caption text-green-1">Agrega múltiples jugadores rápidamente</div>
        </div>
        <q-btn icon="close" flat round dense @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <q-card-section class="q-pa-lg">
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
          <template v-slot:body-cell-picture="props">
            <q-td :props="props" class="text-center">
              <q-avatar size="40px" class="bg-grey-2 shadow-1 cursor-pointer" @click="triggerFileInput(props.row.tempId)">
                <img v-if="props.row.preview" :src="props.row.preview" />
                <q-icon v-else name="add_a_photo" color="grey-5" size="20px" />
                <input
                  type="file"
                  :id="'file-' + props.row.tempId"
                  style="display: none"
                  accept="image/*"
                  @change="onFileSelected($event, props.row)"
                />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-firstName="props">
            <q-td :props="props">
              <q-input v-model="props.row.firstName" dense outlined color="green-8" placeholder="Nombre" />
            </q-td>
          </template>

          <template v-slot:body-cell-lastName="props">
            <q-td :props="props">
              <q-input v-model="props.row.lastName" dense outlined color="green-8" placeholder="Apellido" />
            </q-td>
          </template>

          <template v-slot:body-cell-number="props">
            <q-td :props="props" style="width: 80px">
              <q-input v-model.number="props.row.number" type="number" dense outlined color="green-8" placeholder="#" />
            </q-td>
          </template>

          <template v-slot:body-cell-position="props">
            <q-td :props="props">
              <q-input v-model="props.row.position" dense outlined color="green-8" placeholder="Ej: Delantero" />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="red-5" icon="delete" dense @click="removeRow(props.row.tempId)" />
            </q-td>
          </template>
        </q-table>

        <div class="row justify-center q-pt-md">
          <q-btn
            flat
            color="green-8"
            icon="add_circle"
            label="Agregar otro jugador"
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
          label="Guardar todos los jugadores"
          color="green-8"
          icon="save"
          unelevated
          class="text-weight-bold"
          :loading="saving"
          :disable="rows.length === 0"
          @click="saveAll"
          style="border-radius: 8px;"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['saved', 'cancel'])
const $q = useQuasar()
const saving = ref(false)

const columns = [
  { name: 'picture', label: 'Foto', align: 'center', field: 'picture' },
  { name: 'firstName', label: 'Nombre *', align: 'left', field: 'firstName' },
  { name: 'lastName', label: 'Apellido *', align: 'left', field: 'lastName' },
  { name: 'number', label: 'Dorsal *', align: 'center', field: 'number' },
  { name: 'position', label: 'Posición', align: 'left', field: 'position' },
  { name: 'actions', label: '', align: 'center', field: 'actions' }
]

const rows = ref([
  createRow()
])

function createRow() {
  return {
    tempId: Date.now() + Math.random(),
    firstName: '',
    lastName: '',
    number: null,
    position: '',
    picture: '',
    preview: ''
  }
}

function addRow() {
  rows.value.push(createRow())
}

function removeRow(tempId) {
  if (rows.value.length === 1) {
    // Just clear the row if it's the only one
    rows.value = [createRow()]
    return
  }
  rows.value = rows.value.filter(r => r.tempId !== tempId)
}

function triggerFileInput(tempId) {
  document.getElementById('file-' + tempId).click()
}

function onFileSelected(event, row) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    row.preview = e.target.result
    row.picture = e.target.result.split(',')[1] // Raw base64
  }
  reader.readAsDataURL(file)
}

async function saveAll() {
  // Simple validation
  const invalid = rows.value.some(r => !r.firstName || !r.lastName || r.number === null)
  if (invalid) {
    $q.notify({
      color: 'negative',
      message: 'Por favor complete los campos obligatorios (*)',
      icon: 'warning'
    })
    return
  }

  saving.value = true
  let successCount = 0
  let errorCount = 0

  try {
    // Sequential saving for now as backend doesn't have bulk endpoint
    for (const player of rows.value) {
      try {
        await api.post('/api/players', {
          firstName: player.firstName,
          lastName: player.lastName,
          number: player.number,
          position: player.position,
          picture: player.picture,
          teamId: props.teamId
        })
        successCount++
      } catch (err) {
        console.error('Error creating player:', player.firstName, err)
        errorCount++
      }
    }

    if (successCount > 0) {
      $q.notify({
        color: 'positive',
        message: `${successCount} jugadores guardados correctamente`,
        icon: 'check_circle'
      })
    }

    if (errorCount > 0) {
      $q.notify({
        color: 'negative',
        message: `Error al guardar ${errorCount} jugadores`,
        icon: 'error'
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

.bulk-player-form {
  max-width: 900px;
  margin: 0 auto;
}
</style>
