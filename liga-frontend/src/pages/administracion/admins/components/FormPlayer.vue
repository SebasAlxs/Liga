<template>
    <q-card style="min-width: 400px; border-radius: 20px">
        <q-card-section class="bg-green-8 text-white q-pa-md">
            <div class="row items-center justify-between">
                <div class="text-h6 text-weight-bold">
                    {{ isEdit ? 'Editar Jugador' : 'Nuevo Jugador' }}
                </div>
                <q-btn icon="close" flat round dense v-close-popup />
            </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
            <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                        <q-input v-model="formData.firstName" label="Nombre *" outlined dense color="green-8"
                            :rules="[(val) => !!val || 'El nombre es obligatorio']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model="formData.lastName" label="Apellido *" outlined dense color="green-8"
                            :rules="[(val) => !!val || 'El apellido es obligatorio']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model.number="formData.number" label="Número (Dorsal) *" type="number" outlined dense
                            color="green-8" :rules="[
                                (val) => val !== null || 'El número es obligatorio',
                                (val) => (val >= 0 && val <= 99) || 'Número entre 0 y 99',
                            ]" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model="formData.dni" label="Cédula (DNI) *" outlined dense color="green-8"
                            hint="Documento de identidad único"
                            :rules="[(val) => !!val || 'La cédula es obligatoria']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model="formData.birthDate" label="Fecha de Nacimiento" outlined dense color="green-8"
                            type="date" hint="Para validación de categoría" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-select v-model="formData.isLocal" label="Origen *" outlined dense color="green-8"
                            :options="[{ label: 'Tumbaqueño', value: true }, { label: 'Foráneo', value: false }]"
                            emit-value map-options />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model="formData.position" label="Posición (Opcional)" outlined dense color="green-8"
                            placeholder="Ej: Delantero" />
                    </div>
                    <div class="col-12">
                        <div class="row items-center q-gutter-md">
                            <q-avatar size="80px" class="bg-grey-2 shadow-1">
                                <img v-if="previewImage" :src="previewImage" />
                                <q-icon v-else name="person" color="grey-5" />
                            </q-avatar>
                            <div class="col">
                                <q-file v-model="fileInput" label="Foto del Jugador" outlined dense color="green-8"
                                    accept=".jpg, .jpeg, .png" hint="Selecciona una imagen (JPG, PNG)"
                                    @update:model-value="onFileChange">
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" />
                                    </template>
                                    <template v-slot:append v-if="fileInput">
                                        <q-icon name="close" @click.stop.prevent="clearFile" class="cursor-pointer" />
                                    </template>
                                </q-file>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-end q-mt-md q-gutter-sm">
                    <q-btn label="Cancelar" color="grey-7" flat v-close-popup />
                    <q-btn :label="isEdit ? 'Actualizar' : 'Guardar Jugador'" color="green-8" type="submit"
                        :loading="loading" class="text-weight-bold" unelevated style="border-radius: 8px" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
    player: {
        type: Object,
        default: null,
    },
    teamId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['saved'])
const $q = useQuasar()
const loading = ref(false)

const formData = ref({
    firstName: '',
    lastName: '',
    number: null,
    dni: '',
    birthDate: '',
    isLocal: true,
    position: '',
    picture: '',
})

const isEdit = computed(() => !!props.player)
const fileInput = ref(null)
const localPreview = ref('')

const previewImage = computed(() => {
    if (localPreview.value) return localPreview.value
    if (formData.value.picture) {
        // If it starts with data: it's already base64 with prefix
        if (formData.value.picture.startsWith('data:')) return formData.value.picture
        // Otherwise, assume it's raw base64 from backend
        return `data:image/png;base64,${formData.value.picture}`
    }
    return null
})

const onFileChange = (file) => {
    if (!file) {
        localPreview.value = ''
        formData.value.picture = ''
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        localPreview.value = e.target.result
        // Strip prefix for backend if needed, or send full base64
        // Looking at backend, I use Buffer.from(request.picture, 'base64')
        // Buffer.from handles 'data:image/png;base64,abc'? Usually not.
        // I will strip the prefix.
        formData.value.picture = e.target.result.split(',')[1]
    }
    reader.readAsDataURL(file)
}

const clearFile = () => {
    fileInput.value = null
    localPreview.value = ''
    formData.value.picture = props.player?.picture || ''
}

onMounted(() => {
    if (props.player) {
        formData.value = {
            firstName: props.player.firstName || '',
            lastName: props.player.lastName || '',
            number: props.player.number || null,
            dni: props.player.dni || '',
            birthDate: props.player.birthDate ? props.player.birthDate.split('T')[0] : '',
            isLocal: props.player.isLocal !== undefined ? props.player.isLocal : true,
            position: props.player.position || '',
            picture: props.player.picture || '',
        }
    }
})

const onSubmit = async () => {
    try {
        loading.value = true
        const payload = {
            ...formData.value,
            teamId: props.teamId,
        }

        if (isEdit.value) {
            await api.put(`/api/players/${props.player.id || props.player._id}`, payload)
            $q.notify({ color: 'positive', message: 'Jugador actualizado' })
        } else {
            await api.post('/api/players', payload)
            $q.notify({ color: 'positive', message: 'Jugador agregado correctamente' })
        }
        emit('saved')
    } catch (error) {
        console.error('Error saving player:', error)
        $q.notify({
            color: 'negative',
            message: error.response?.data?.message || 'Error al guardar el jugador',
        })
    } finally {
        loading.value = false
    }
}
</script>
