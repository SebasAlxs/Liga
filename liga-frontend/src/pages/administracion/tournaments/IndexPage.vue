<template>
    <q-page class="q-pa-lg bg-grey-1">
        <div class="row items-center justify-between q-mb-md">
            <div>
                <div class="text-h4 text-weight-bolder text-green-9">Gestión de Liga</div>
                <div class="text-subtitle1 text-grey-7 q-mt-xs">Configurar Torneos y Categorías</div>
            </div>
            <q-btn color="green-8" :label="activeTab === 'tournaments' ? 'Crear Torneo' : 'Crear Categoría'" icon="add"
                unelevated @click="openCreateModal" class="text-weight-bold q-px-md shadow-2"
                style="border-radius: 8px" />
        </div>

        <!-- Tabs Navigation -->
        <q-tabs v-model="activeTab" dense class="text-grey-7 q-mb-md" active-color="green-8" indicator-color="green-8"
            align="left" narrow-indicator no-caps inline-label style="border-bottom: 2px solid #e0e0e0;">
            <q-tab name="tournaments" label="Torneos" icon="emoji_events" />
            <q-tab name="categories" label="Categorías" icon="category" />
        </q-tabs>

        <q-card class="my-card shadow-1"
            v-bind:style="{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e0e0' }">
            <!-- Tournaments Table -->
            <q-table v-if="activeTab === 'tournaments'" :rows="leagueStore.tournaments" :columns="tournamentColumns"
                row-key="id" flat bordered :loading="leagueStore.loading"
                table-header-class="bg-green-8 text-white text-weight-bold" no-data-label="No hay torneos registrados">
                <template v-slot:body-cell-active="props">
                    <q-td :props="props">
                        <q-badge :color="props.row.active ? 'green-8' : 'grey-5'"
                            :label="props.row.active ? 'Activo' : 'Inactivo'" class="text-weight-bold q-pa-sm"
                            style="border-radius: 6px;" />
                    </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <div class="row q-gutter-sm justify-end">
                            <q-btn flat round dense color="green-8" icon="edit" @click="openEditModal(props.row)" />
                            <q-btn flat round dense color="red-8" icon="delete" @click="confirmDelete(props.row)" />
                        </div>
                    </q-td>
                </template>
            </q-table>

            <!-- Categories Table -->
            <q-table v-if="activeTab === 'categories'" :rows="leagueStore.categories" :columns="categoryColumns"
                row-key="id" flat bordered :loading="leagueStore.loading"
                table-header-class="bg-green-8 text-white text-weight-bold"
                no-data-label="No hay categorías registradas">
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <div class="row q-gutter-sm justify-end">
                            <q-btn flat round dense color="green-8" icon="edit" @click="openEditModal(props.row)" />
                            <q-btn flat round dense color="red-8" icon="delete" @click="confirmDelete(props.row)" />
                        </div>
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <!-- Create/Edit Modal -->
        <FormModal v-model="modalOpen" :type="activeTab === 'tournaments' ? 'tournament' : 'category'"
            :initialData="selectedItem" :loading="isSubmitting" @submit="handleFormSubmit" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLeagueStore } from 'src/stores/league'
import { useQuasar } from 'quasar'
import FormModal from './components/FormModal.vue'

const $q = useQuasar()
const leagueStore = useLeagueStore()

const activeTab = ref('tournaments')
const modalOpen = ref(false)
const selectedItem = ref({})
const isSubmitting = ref(false)

const tournamentColumns = [
    { name: 'name', label: 'NOMBRE', align: 'left', field: 'name', sortable: true },
    { name: 'active', label: 'ESTADO', align: 'center', field: 'active' },
    { name: 'createdAt', label: 'CREADO EL', align: 'center', field: 'createdAt', format: val => new Date(val).toLocaleDateString() },
    { name: 'actions', label: 'ACCIONES', align: 'right' }
]

const categoryColumns = [
    { name: 'name', label: 'NOMBRE', align: 'left', field: 'name', sortable: true },
    { name: 'createdAt', label: 'CREADO EL', align: 'center', field: 'createdAt', format: val => new Date(val).toLocaleDateString() },
    { name: 'actions', label: 'ACCIONES', align: 'right' }
]

onMounted(() => {
    if (leagueStore.tournaments.length === 0 || leagueStore.categories.length === 0) {
        leagueStore.fetchLeagueData()
    }
})

const openCreateModal = () => {
    selectedItem.value = {}
    modalOpen.value = true
}

const openEditModal = (item) => {
    selectedItem.value = { ...item }
    modalOpen.value = true
}

const handleFormSubmit = async (formData) => {
    isSubmitting.value = true
    try {
        const isEdit = !!selectedItem.value?.id
        const type = activeTab.value === 'tournaments' ? 'Tournament' : 'Category'

        if (isEdit) {
            await leagueStore[`update${type}`](selectedItem.value.id, formData)
            $q.notify({ type: 'positive', message: 'Actualizado correctamente.' })
        } else {
            await leagueStore[`create${type}`](formData)
            $q.notify({ type: 'positive', message: 'Creado correctamente.' })
        }

        modalOpen.value = false
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Ocurrió un error al guardar los datos.' })
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = (item) => {
    const isTournament = activeTab.value === 'tournaments'
    const itemName = isTournament ? 'Torneo' : 'Categoría'

    $q.dialog({
        title: `Eliminar ${itemName}`,
        message: `¿Estás seguro de que deseas eliminar "${item.name}"? Esta acción no se puede deshacer.`,
        cancel: {
            label: 'Cancelar',
            color: 'grey-7',
            flat: true
        },
        ok: {
            label: 'Eliminar',
            color: 'red-8',
            unelevated: true
        },
        persistent: true
    }).onOk(async () => {
        try {
            const type = isTournament ? 'Tournament' : 'Category'
            await leagueStore[`delete${type}`](item.id)
            $q.notify({ type: 'positive', message: 'Eliminado correctamente.' })
        } catch (error) {
            $q.notify({ type: 'negative', message: 'No se pudo eliminar. Verifique que no tenga partidos/equipos asociados.' })
        }
    })
}
</script>

<style scoped>
.my-card {
    border-radius: 24px;
}

.q-table__container {
    border-radius: 24px !important;
}
</style>
