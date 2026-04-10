<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-overline text-green-8 q-mb-xs text-weight-bold">GESTIÓN TÉCNICA</div>
        <h1 class="text-h3 text-weight-bolder text-grey-9 q-ma-none">Árbitros</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">Administra el staff de colegiados autorizados para la liga.</p>
      </div>
      <q-btn color="green-8" label="Nuevo Árbitro" icon="add" unelevated rounded class="q-px-lg shadow-2" @click="openForm()" />
    </div>

    <!-- Stats Row -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card shadow-1" bordered>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between">
              <div>
                <div class="text-h4 text-weight-bolder text-green-9">{{ referees.length }}</div>
                <div class="text-caption text-grey-7 text-uppercase letter-spacing-1">Total Staff</div>
              </div>
              <q-avatar color="green-1" text-color="green-9" icon="groups" size="48px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Referees Grid -->
    <div class="row q-col-gutter-lg">
      <div v-for="referee in referees" :key="referee.id" class="col-12 col-sm-6 col-md-4">
        <q-card class="referee-card shadow-1 hovered-shadow">
          <q-card-section class="q-pa-lg">
            <div class="row items-start no-wrap">
              <q-avatar size="64px" color="green-1" text-color="green-9" class="shadow-1 q-mr-md clickable" @click="$router.push(`/referees/${referee.id}`)">
                <img v-if="referee.photo" :src="referee.photo" style="object-fit: cover">
                <q-icon v-else name="person" />
              </q-avatar>
              <div class="col cursor-pointer" @click="$router.push(`/referees/${referee.id}`)">
                <div class="text-h6 text-weight-bold text-grey-9">{{ referee.name }}</div>
                <div class="text-caption text-grey-7">Licencia: {{ referee.license || 'N/A' }}</div>
                <div class="row items-center q-mt-sm q-gutter-x-sm">
                  <q-badge :color="referee.active ? 'green-2' : 'red-2'" :text-color="referee.active ? 'green-9' : 'red-9'" rounded class="q-px-sm text-weight-bold">
                    {{ referee.active ? 'Activo' : 'Inactivo' }}
                  </q-badge>
                </div>
              </div>
              <div class="column">
                <q-btn flat round color="grey-7" icon="edit" size="sm" @click="openForm(referee)" />
                <q-btn flat round color="red-5" icon="delete" size="sm" @click="confirmDelete(referee)" />
              </div>
            </div>

            <q-separator class="q-my-md opacity-2" />

            <div class="column q-gutter-y-xs">
              <div class="row items-center text-grey-7 text-caption">
                <q-icon name="phone" size="14px" class="q-mr-sm" />
                {{ referee.phone || 'No registrado' }}
              </div>
              <div class="row items-center text-grey-7 text-caption">
                <q-icon name="email" size="14px" class="q-mr-sm" />
                {{ referee.email || 'No registrado' }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="referees.length === 0 && !loading" class="col-12 text-center q-pa-xl">
        <q-icon name="person_search" size="64px" color="grey-4" />
        <div class="text-h5 text-grey-5 q-mt-md">Aún no hay árbitros registrados.</div>
        <q-btn flat color="green-8" label="Agregar el primero" class="q-mt-sm" @click="openForm()" />
      </div>
    </div>

    <!-- Form Dialog -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="width: 450px; border-radius: 20px" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5 text-weight-bold">{{ editMode ? 'Editar Árbitró' : 'Nuevo Árbitro' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveReferee" class="q-gutter-md">
            <q-input v-model="form.name" label="Nombre Completo" outlined color="green-8" rounded :rules="[val => !!val || 'Requerido']" />
            <q-input v-model="form.license" label="Número de Licencia" outlined color="green-8" rounded />
            <div class="row q-col-gutter-sm">
              <q-input v-model="form.phone" label="Teléfono" outlined color="green-8" rounded class="col" />
              <q-input v-model="form.email" label="Email" outlined color="green-8" rounded class="col" />
            </div>
            <q-input v-model="form.photo" label="URL de Foto" outlined color="green-8" rounded placeholder="https://..." />
            
            <q-toggle v-model="form.active" label="Árbitro Activo" color="green-8" />

            <div class="row justify-end q-mt-lg">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="q-mr-sm" />
              <q-btn :loading="saving" :label="editMode ? 'Actualizar' : 'Crear'" type="submit" color="green-8" unelevated rounded class="q-px-xl shadow-2" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDelete" persistent>
      <q-card style="border-radius: 16px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red-9" />
          <span class="q-ml-sm text-h6">Confirmar Eliminación</span>
        </q-card-section>

        <q-card-section>
          ¿Estás seguro de que deseas eliminar a <strong>{{ selectedReferee?.name }}</strong>? Esta acción no se puede deshacer.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Eliminar Definitivamente" color="red-8" @click="deleteReferee" :loading="deleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const referees = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const showForm = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const selectedReferee = ref(null)

const form = ref({
  name: '',
  license: '',
  phone: '',
  email: '',
  photo: '',
  active: true
})

const fetchReferees = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/referees')
    referees.value = res.data.data
  } catch (error) {
    console.error('Error fetching referees:', error)
  } finally {
    loading.value = false
  }
}

const openForm = (referee = null) => {
  if (referee) {
    selectedReferee.value = referee
    form.value = { ...referee }
    editMode.value = true
  } else {
    selectedReferee.value = null
    form.value = { name: '', license: '', phone: '', email: '', photo: '', active: true }
    editMode.value = false
  }
  showForm.value = true
}

const saveReferee = async () => {
  saving.value = true
  try {
    if (editMode.value) {
      await api.put(`/api/referees/${selectedReferee.value.id}`, form.value)
      $q.notify({ color: 'green-8', message: 'Árbitro actualizado', icon: 'check' })
    } else {
      await api.post('/api/referees', form.value)
      $q.notify({ color: 'green-8', message: 'Árbitro creado exitosamente', icon: 'check' })
    }
    showForm.value = false
    fetchReferees()
  } catch (error) {
    $q.notify({ color: 'red-8', message: 'Error al guardar árbitro', icon: 'error' })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (referee) => {
  selectedReferee.value = referee
  showDelete.value = true
}

const deleteReferee = async () => {
  deleting.value = true
  try {
    await api.delete(`/api/referees/${selectedReferee.value.id}`)
    $q.notify({ color: 'green-8', message: 'Árbitro eliminado', icon: 'delete' })
    showDelete.value = false
    fetchReferees()
  } catch (error) {
    $q.notify({ color: 'red-8', message: 'Error al eliminar árbitro', icon: 'error' })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchReferees()
})
</script>

<style scoped>
.letter-spacing-1 { letter-spacing: 1px; }
.opacity-2 { opacity: 0.1; }
.stat-card, .referee-card {
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hovered-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
}
</style>
