<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="width: 700px; max-width: 90vw; border-radius: 16px;">
            <q-card-section class="row items-center q-pb-none bg-green-8 text-white">
                <div class="text-h6 text-weight-bold">
                    {{ isEdit ? 'Editar Sede' : 'Nueva Sede' }}
                </div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup color="white" />
            </q-card-section>

            <q-card-section class="q-pt-md">
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-6">
                            <q-input v-model="formData.name" label="Nombre de la Sede" outlined dense color="green-8"
                                :rules="[val => !!val || 'El nombre es obligatorio']">
                                <template v-slot:prepend>
                                    <q-icon name="apartment" color="green-8" />
                                </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-input v-model="formData.city" label="Ciudad" outlined dense color="green-8"
                                :rules="[val => !!val || 'La ciudad es obligatoria']">
                                <template v-slot:prepend>
                                    <q-icon name="location_city" color="green-8" />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <q-input v-model="formData.address" label="Dirección / Ubicación" outlined dense
                                color="green-8" :rules="[val => !!val || 'La dirección es obligatoria']">
                                <template v-slot:prepend>
                                    <q-icon name="place" color="green-8" />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="row q-mt-sm">
                        <q-toggle v-model="formData.active" label="Sede Activa" color="green-8" />
                    </div>

                    <div class="row justify-end q-mt-lg q-gutter-sm">
                        <q-btn label="Cancelar" color="grey-7" flat v-close-popup class="text-weight-bold" style="border-radius: 8px" />
                        <q-btn :label="isEdit ? 'Guardar Cambios' : 'Crear Sede'" color="green-8" type="submit"
                            :loading="loading" unelevated class="text-weight-bold q-px-md" style="border-radius: 8px" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    initialData: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.initialData?.id)

const formData = ref({
    name: '',
    city: '',
    address: '',
    active: true
})

// Initialize form when opened
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        if (isEdit.value) {
            formData.value = { ...props.initialData }
        } else {
            formData.value = {
                name: '',
                city: '',
                address: '',
                active: true
            }
        }
    }
})

const onSubmit = () => {
    emit('submit', formData.value)
}
</script>
