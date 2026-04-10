<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <div style="width: 100%; max-width: 600px">
      <q-btn
        flat
        color="green-8"
        icon="arrow_back"
        label="Volver al Listado"
        @click="goBack"
        class="q-mb-md"
      />

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="green-8" size="3em" />
        <div class="text-grey-7 q-mt-md">Cargando datos del equipo...</div>
      </div>

      <!-- Reutilizando el FormEquipo de Agregar que adaptamos para Edición -->
      <FormEquipo v-else-if="teamData" :team="teamData" @saved="handleSaved" @cancel="goBack" />

      <div v-else class="text-center text-negative q-pa-xl">
        <q-card bordered flat>
          <q-card-section>
            <q-icon name="error" size="3em" color="negative" />
            <div class="text-h6 q-mt-md">No se pudo encontrar o cargar el equipo.</div>
            <q-btn outline color="primary" label="Volver Atrás" class="q-mt-lg" @click="goBack" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

// Importar el FormEquipo para reutilizarlo
import FormEquipo from './components/FormEquipo.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const teamData = ref(null)

const fetchTeam = async () => {
  try {
    const teamId = route.params.id
    if (!teamId) return

    const res = await api.get(`/api/teams/${teamId}`)
    teamData.value = res.data.data || res.data
  } catch (error) {
    console.error('Error fetching team for edit:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'No se pudo cargar la información del equipo',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeam()
})

const goBack = () => {
  // Volver a la página que nos llamó
  router.back()
}

const handleSaved = () => {
  // Al completar la edición exitosamente, volvemos atrás
  goBack()
}
</script>
