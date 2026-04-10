<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="min-width: 350px; border-radius: 16px;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6 text-green-9 text-weight-bold">
                    {{ isEdit ? 'Editar' : 'Crear' }} {{ type === 'tournament' ? 'Torneo' : 'Categoría' }}
                </div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
            </q-card-section>

            <q-card-section class="q-pt-md">
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-input v-model="formData.name"
                        :label="type === 'tournament' ? 'Nombre del Torneo' : 'Nombre de la Categoría'" outlined dense
                        color="green-8" :rules="[val => !!val || 'El nombre es requerido']" />

                    <template v-if="type === 'tournament'">
                        <q-select v-model="formData.headquartersId" :options="headquartersOptions" label="Sede / Matriz"
                            outlined dense color="green-8" emit-value map-options option-value="id" option-label="name"
                            :rules="[val => !!val || 'La sede es obligatoria']" />

                        <q-input v-model.number="formData.maxYellowCardsForSuspension" type="number"
                            label="Límite Amarillas para Suspensión" outlined dense color="green-8"
                            :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
                    </template>

                    <template v-if="type === 'category'">
                        <div class="row q-col-gutter-sm">
                            <div class="col-6">
                                <q-input v-model.number="formData.minAge" type="number" label="Edad Mínima" outlined
                                    dense color="green-8" hint="Opcional" />
                            </div>
                            <div class="col-6">
                                <q-input v-model.number="formData.maxAge" type="number" label="Edad Máxima" outlined
                                    dense color="green-8" hint="Opcional" />
                            </div>
                        </div>
                    </template>

                    <q-toggle v-if="type === 'tournament'" v-model="formData.active"
                        label="Torneo Activo (Hará que este torneo sea el seleccionado por defecto)" color="green-8" />

                    <div class="row justify-end q-mt-lg q-gutter-sm">
                        <q-btn label="Cancelar" color="grey-7" flat v-close-popup class="text-weight-bold"
                            style="border-radius: 8px" />
                        <q-btn :label="isEdit ? 'Guardar Cambios' : 'Crear'" color="green-8" unelevated type="submit"
                            :loading="loading" class="text-weight-bold q-px-md" style="border-radius: 8px" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useLeagueStore } from 'src/stores/league'

const props = defineProps({
    modelValue: Boolean,
    type: {
        type: String,
        required: true,
        validator: (value) => ['tournament', 'category'].includes(value)
    },
    initialData: {
        type: Object,
        default: () => ({})
    },
    loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.initialData?.id)

const leagueStore = useLeagueStore()
const headquartersOptions = computed(() => leagueStore.headquarters)

const formData = ref({
    name: '',
    active: false,
    headquartersId: null,
    maxYellowCardsForSuspension: 3,
    minAge: null,
    maxAge: null
})

watch(() => props.initialData, (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
        formData.value = { ...newVal }
    } else {
        formData.value = { name: '', active: false, headquartersId: null, maxYellowCardsForSuspension: 3, minAge: null, maxAge: null }
    }
}, { immediate: true })

watch(isOpen, (newVal) => {
    if (!newVal) {
        formData.value = { name: '', active: false, headquartersId: null, maxYellowCardsForSuspension: 3, minAge: null, maxAge: null }
    }
})

const onSubmit = () => {
    emit('submit', formData.value)
}
</script>
