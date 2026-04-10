<template>
  <q-card square flat class="my-form-card">
    <q-card-section class="bg-green-8 text-white q-pa-lg">
      <div class="row items-center justify-between no-wrap">
        <div>
          <div class="text-h5 text-weight-bold">{{ isEdit ? 'Actualizar Equipo' : 'Nuevo Equipo' }}</div>
          <div class="text-subtitle2 text-green-1 opacity-80">Completa la información del club</div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="text-white opacity-70" />
      </div>
    </q-card-section>

    <q-card-section class="q-pa-xl">
      <q-form @submit="onSubmit" class="column q-gutter-y-lg">
        <!-- Logo Preview and URL Section -->
        <div class="row q-col-gutter-lg items-center">
          <div class="col-12 col-sm-auto text-center">
            <q-avatar size="120px" class="shadow-2 border-green bg-grey-1">
              <img v-if="formData.logo" :src="formData.logo" @error="handleLogoError" />
              <q-icon v-else name="groups" size="60px" color="grey-4" />
              <div v-if="logoError"
                class="absolute-full flex flex-center bg-grey-2 text-grey-6 text-caption text-center q-pa-sm">
                URL Inválida
              </div>
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-subtitle2 text-grey-8 q-mb-sm">Identidad Visual</div>
            <q-input v-model="formData.logo" label="URL del Logotipo" outlined dense bg-color="white"
              placeholder="https://ejemplo.com/logo.png" @update:model-value="logoError = false" color="green-8"
              class="premium-input">
              <template v-slot:prepend>
                <q-icon name="link" color="green-8" />
              </template>
              <template v-slot:append>
                <q-icon v-if="formData.logo" name="cancel" class="cursor-pointer"
                  @click="formData.logo = ''; logoError = false" />
              </template>
            </q-input>
            <div class="text-caption text-grey-6 q-mt-xs">Formatos sugeridos: SVG, PNG o WebP</div>
          </div>
        </div>

        <q-separator class="q-my-md opacity-20" />

        <!-- Basic Info Section -->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-subtitle2 text-grey-8 q-mb-sm">Información Principal</div>
            <q-input v-model="formData.name" label="Nombre del Club *" outlined dense color="green-8" bg-color="white"
              class="premium-input" :rules="[(val) => (val && val.length >= 3) || 'Mínimo 3 caracteres']">
              <template v-slot:prepend>
                <q-icon name="sports_soccer" color="green-8" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input v-model.number="formData.foundedYear" label="Año de Fundación *" type="number" outlined dense
              color="green-8" bg-color="white" class="premium-input" :rules="[
                (val) => !!val || 'Requerido',
                (val) => (val > 1800 && val <= new Date().getFullYear()) || 'Año inválido',
              ]">
              <template v-slot:prepend>
                <q-icon name="history" color="green-8" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input v-model.number="formData.championshipsWon" label="Palmarés (Títulos)" type="number" outlined dense
              color="green-8" bg-color="white" class="premium-input" placeholder="0">
              <template v-slot:prepend>
                <q-icon name="emoji_events" color="green-8" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="row justify-end q-mt-xl q-gutter-sm">
          <q-btn label="Descartar" color="grey-9" flat v-close-popup no-caps class="text-weight-bold"
            @click="$emit('cancel')" />
          <q-btn :label="isEdit ? 'Actualizar Información' : 'Crear Club'" color="green-8" type="submit"
            :loading="loading" unelevated no-caps class="text-weight-bold q-px-xl py-md" style="border-radius: 12px" />
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

const emit = defineEmits(['saved', 'cancel'])
const $q = useQuasar()

const loading = ref(false)
const logoError = ref(false)

const formData = ref({
  name: '',
  foundedYear: null,
  championshipsWon: null,
  logo: '',
})

const isEdit = computed(() => !!props.team)

const initForm = () => {
  if (props.team) {
    formData.value = {
      name: props.team.name || '',
      foundedYear: props.team.foundedYear || null,
      championshipsWon: props.team.championshipsWon || null,
      logo: props.team.logo || '',
    }
  } else {
    formData.value = {
      name: '',
      foundedYear: null,
      championshipsWon: 0,
      logo: '',
    }
  }
}

const handleLogoError = () => {
  if (formData.value.logo) {
    logoError.value = true
  }
}

onMounted(() => {
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
      championshipsWon: formData.value.championshipsWon || 0,
      logo: formData.value.logo || ''
    }

    if (isEdit.value) {
      const teamId = props.team.id || props.team._id
      await api.put(`/api/teams/${teamId}`, payload)
      $q.notify({
        color: 'green-9',
        message: 'Información del club actualizada',
        icon: 'check',
      })
    } else {
      await api.post('/api/teams', payload)
      $q.notify({
        color: 'green-9',
        message: 'Club registrado exitosamente',
        icon: 'sports_soccer',
      })
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving team:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Error al guardar los datos',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.my-form-card {
  width: 100%;
  max-width: 550px;
  border-radius: 28px !important;
  overflow: hidden;
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.premium-input :deep(.q-field__control:hover) {
  background-color: #f8fcf9;
}

.border-green {
  border: 4px solid #f1f8f4;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-20 {
  opacity: 0.2;
}
</style>
