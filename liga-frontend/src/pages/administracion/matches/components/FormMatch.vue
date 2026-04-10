<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="min-width: 400px; border-radius: 16px;">
            <q-card-section class="row items-center q-pb-none bg-green-8 text-white">
                <div class="text-h6 text-weight-bold">
                    Programar Partido
                </div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup color="white" />
            </q-card-section>

            <q-card-section class="q-pt-md">
                <q-form @submit="onSubmit" class="q-gutter-md">

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-6">
                            <q-select v-model="formData.tournamentId" :options="tournamentOptions" label="Torneo *"
                                outlined dense color="green-8" emit-value map-options option-value="id"
                                option-label="name" :rules="[val => !!val || 'El torneo es requerido']" />
                        </div>
                        <div class="col-12 col-md-6">
                            <q-select v-model="formData.categoryId" :options="categoryOptions" label="Categoría *"
                                outlined dense color="green-8" emit-value map-options option-value="id"
                                option-label="name" :rules="[val => !!val || 'La categoría es requerida']" />
                        </div>
                    </div>

                    <q-select v-model="formData.homeTeamId" :options="teamOptions" label="Equipo Local *" outlined dense
                        color="green-8" emit-value map-options option-value="id" option-label="name" :rules="[
                            val => !!val || 'El equipo local es requerido',
                            val => val !== formData.awayTeamId || 'El equipo local y visitante no pueden ser el mismo'
                        ]" />

                    <q-select v-model="formData.awayTeamId" :options="teamOptions" label="Equipo Visitante *" outlined
                        dense color="blue-8" emit-value map-options option-value="id" option-label="name" :rules="[
                            val => !!val || 'El equipo visitante es requerido',
                            val => val !== formData.homeTeamId || 'El equipo local y visitante no pueden ser el mismo'
                        ]" />

                    <q-input v-model="formData.matchDate" type="datetime-local" label="Fecha y Hora del Partido *"
                        outlined dense color="green-8" :rules="[val => !!val || 'La fecha es requerida']" />

                    <div class="row justify-end q-mt-lg q-gutter-sm">
                        <q-btn label="Cancelar" color="grey-7" flat v-close-popup class="text-weight-bold"
                            style="border-radius: 8px" />
                        <q-btn label="Crear Partido" color="green-8" unelevated type="submit" :loading="loading"
                            class="text-weight-bold q-px-md" style="border-radius: 8px" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'

const props = defineProps({
    modelValue: Boolean,
    loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const leagueStore = useLeagueStore()
const teamStore = useTeamStore()

const tournamentOptions = computed(() => leagueStore.tournaments)
const categoryOptions = computed(() => leagueStore.categories)

const teamOptions = computed(() => {
    if (!formData.value.tournamentId || !formData.value.categoryId) return []
    return teamStore.teams.filter(t =>
        t.tournamentId === formData.value.tournamentId &&
        t.categoryId === formData.value.categoryId
    )
})

const formData = ref({
    tournamentId: null,
    categoryId: null,
    homeTeamId: null,
    awayTeamId: null,
    matchDate: ''
})

watch(isOpen, (newVal) => {
    if (newVal) {
        formData.value = {
            tournamentId: leagueStore.activeTournamentId || null,
            categoryId: leagueStore.activeCategoryId || null,
            homeTeamId: null,
            awayTeamId: null,
            matchDate: ''
        }
    }
})

// Reset teams when tournament/category change
watch([() => formData.value.tournamentId, () => formData.value.categoryId], () => {
    formData.value.homeTeamId = null
    formData.value.awayTeamId = null
})

const onSubmit = () => {
    emit('submit', {
        ...formData.value,
        // Format datetime to valid ISO string if needed by backend, 
        // HTML datetime-local outputs "YYYY-MM-DDTHH:mm" which is a valid ISO format
        matchDate: new Date(formData.value.matchDate).toISOString(),
        status: "SCHEDULED"
    })
}
</script>
