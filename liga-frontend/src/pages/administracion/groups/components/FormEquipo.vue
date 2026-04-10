<template>
  <q-card style="min-width: 400px; border-radius: 16px">
    <q-card-section class="bg-green-8 text-white row items-center justify-between">
      <div class="text-h6 text-weight-bold">
        {{ isEdit ? 'Editar Equipo' : 'Agregar Nuevo Equipo' }}
      </div>
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <!-- Nombre del Equipo -->
        <q-input v-model="formData.name" label="Nombre del Equipo *" outlined dense color="green-8"
          :rules="[(val) => !!val || 'El nombre es obligatorio']">
          <template v-slot:prepend>
            <q-icon name="groups" />
          </template>
        </q-input>

        <!-- Torneo -->
        <q-select v-model="formData.tournamentId" :options="tournamentOptions" label="Torneo *" outlined dense
          color="green-8" option-value="id" option-label="name" emit-value map-options
          :rules="[(val) => !!val || 'El torneo es obligatorio']">
          <template v-slot:prepend>
            <q-icon name="emoji_events" />
          </template>
        </q-select>

        <!-- Categoría -->
        <q-select v-model="formData.categoryId" :options="categoryOptions" label="Categoría *" outlined dense
          color="green-8" option-value="id" option-label="name" emit-value map-options
          :rules="[(val) => !!val || 'La categoría es obligatoria']">
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>

        <!-- Año de Fundación -->
        <q-input v-model.number="formData.foundedYear" label="Año de Fundación *" type="number" outlined dense
          color="green-8" :rules="[
            (val) => !!val || 'El año es obligatorio',
            (val) => (val > 1800 && val <= new Date().getFullYear()) || 'Ingrese un año válido',
          ]">
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input>

        <!-- Campeonatos Ganados (Opcional) -->
        <q-input v-model.number="formData.championshipsWon" label="Campeonatos Ganados (Opcional)" type="number"
          outlined dense color="green-8" :rules="[(val) => !val || val >= 0 || 'El valor no puede ser negativo']">
          <template v-slot:prepend>
            <q-icon name="emoji_events" />
          </template>
        </q-input>

        <!-- Enlace del Logo o Archivo (Opcional) -->
        <q-file v-model="formData.logoFile" label="Subir Logo del Equipo (Opcional)" outlined dense color="green-8"
          accept="image/*" @update:model-value="onFileChange">
          <template v-slot:prepend>
            <q-icon name="image" />
          </template>
          <template v-slot:append>
            <q-icon v-if="formData.logoFile" name="close" @click.stop.prevent="clearLogo" class="cursor-pointer" />
          </template>
        </q-file>
        
        <!-- Preview -->
        <div v-if="formData.logoPreview" class="row justify-center q-mt-sm">
            <q-avatar size="100px" class="shadow-2">
                <img :src="formData.logoPreview" />
            </q-avatar>
        </div>

        <!-- Acciones -->
        <div class="row justify-end q-mt-lg q-gutter-sm">
          <q-btn label="Cancelar" color="grey-7" flat v-close-popup @click="$emit('cancel')" />
          <q-btn :label="isEdit ? 'Actualizar Equipo' : 'Guardar Equipo'" color="green-8" type="submit"
            :loading="loading" class="text-weight-bold" unelevated />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
  team: {
    type: Object,
    default: null,
  },
})

import { useLeagueStore } from 'src/stores/league'


const emit = defineEmits(['saved', 'cancel'])
const $q = useQuasar()
const leagueStore = useLeagueStore()

const loading = ref(false)

const formData = ref({
  name: '',
  foundedYear: null,
  championshipsWon: null,
  logoFile: null,
  logoPreview: '',
  logo: '',
  tournamentId: null,
  categoryId: null,
})

const isEdit = computed(() => !!props.team)

const tournamentOptions = computed(() => leagueStore.tournaments)
const categoryOptions = computed(() => leagueStore.categories)


const initForm = () => {
  if (props.team) {
    formData.value = {
      name: props.team.name || '',
      foundedYear: props.team.foundedYear || null,
      championshipsWon: props.team.championshipsWon || null,
      logoFile: null,
      logoPreview: props.team.logo || '',
      logo: props.team.logo || '', // Mantiene el logo actual si existe
      tournamentId: props.team.tournamentId || null,
      categoryId: props.team.categoryId || null,
    }
  } else {
    formData.value = {
      name: '',
      foundedYear: null,
      championshipsWon: null,
      logoFile: null,
      logoPreview: '',
      logo: '',
      tournamentId: leagueStore.activeTournamentId || null,
      categoryId: leagueStore.activeCategoryId || null,
    }
  }
}

const onFileChange = (file) => {
    if (!file) {
        clearLogo()
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        formData.value.logoPreview = e.target.result
        formData.value.logo = e.target.result // Base64 encoding
    }
    reader.readAsDataURL(file)
}

const clearLogo = () => {
    formData.value.logoFile = null
    formData.value.logoPreview = ''
    formData.value.logo = ''
}

onMounted(() => {
  if (leagueStore.tournaments.length === 0 || leagueStore.categories.length === 0) {
    leagueStore.fetchLeagueData()
  }
  initForm()
})

watch(
  () => props.team,
  () => {
    initForm()
  },
)

const onSubmit = async () => {
  try {
    loading.value = true

    const payload = {
      name: formData.value.name,
      foundedYear: formData.value.foundedYear,
      tournamentId: formData.value.tournamentId,
      categoryId: formData.value.categoryId,
    }

    if (formData.value.championshipsWon !== null && formData.value.championshipsWon !== '') {
      payload.championshipsWon = Number(formData.value.championshipsWon)
    }
    if (formData.value.logo && formData.value.logo.trim() !== '') {
      payload.logo = formData.value.logo.trim()
    } else {
        payload.logo = '' // Or delete payload.logo depending on the backend, typically empty string is fine
    }

    // Peticion al backend
    if (isEdit.value) {
      const teamId = props.team.id || props.team._id
      await api.put(`/api/teams/${teamId}`, payload)

      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Equipo actualizado exitosamente',
        icon: 'check_circle',
      })
    } else {
      await api.post('/api/teams', payload)

      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Equipo creado exitosamente',
        icon: 'check_circle',
      })
    }

    emit('saved') // Notificar al componente padre para que recargue la lista
  } catch (error) {
    console.error('Error creando equipo:', error)
    $q.notify({
      color: 'negative',
      position: 'top',
      message: error.response?.data?.message || 'Ocurrió un error al guardar el equipo',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
