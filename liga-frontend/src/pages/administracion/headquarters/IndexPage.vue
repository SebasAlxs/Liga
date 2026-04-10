<template>
    <q-page class="q-pa-xl bg-slate-50">
        <div class="row items-center justify-between q-mb-xl">
            <div>
                <div class="text-h3 text-weight-bolder text-slate-900 tracking-tighter">Gestión de Sedes</div>
                <div class="text-subtitle1 text-slate-500 q-mt-sm font-medium">Configurar Sedes y Ligas matrices del sistema</div>
            </div>
            <q-btn color="slate-900" label="Nueva Sede" icon="add" unelevated @click="openCreateModal"
                class="text-weight-bold q-px-xl shadow-soft transition-base" style="border-radius: 12px; height: 50px" />
        </div>

        <q-card class="shadow-premium no-border overflow-hidden" style="border-radius: 20px">
            <q-table :rows="leagueStore.headquarters" :columns="columns" row-key="id" flat
                :loading="leagueStore.loading" table-header-class="text-slate-400 font-bold text-uppercase"
                no-data-label="No hay sedes registradas"
                class="modern-table">

                <template v-slot:header="props">
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-overline">
                            {{ col.label }}
                        </q-th>
                    </q-tr>
                </template>

                <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                        <div class="text-weight-bold text-slate-900">{{ props.row.name }}</div>
                    </q-td>
                </template>

                <template v-slot:body-cell-active="props">
                    <q-td :props="props" class="text-center">
                        <q-badge :color="props.row.active ? 'emerald-50' : 'slate-100'"
                            :text-color="props.row.active ? 'emerald' : 'slate-500'"
                            :label="props.row.active ? 'Activo' : 'Inactivo'" 
                            class="text-weight-bold q-px-md q-py-xs no-shadow"
                            style="border-radius: 6px;" />
                    </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <div class="row q-gutter-x-sm justify-end">
                            <q-btn flat round dense color="slate-400" icon="las la-edit" 
                                class="border-hover-emerald" @click="openEditModal(props.row)" />
                            <q-btn flat round dense color="slate-400" icon="las la-trash-alt" 
                                class="border-hover-rose" @click="confirmDelete(props.row)" />
                        </div>
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <!-- Create/Edit Modal -->
        <FormModal v-model="modalOpen" :initialData="selectedItem" :loading="isSubmitting" @submit="handleFormSubmit" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLeagueStore } from 'src/stores/league'
import { useQuasar } from 'quasar'
import FormModal from './components/FormModal.vue'

const $q = useQuasar()
const leagueStore = useLeagueStore()

const modalOpen = ref(false)
const selectedItem = ref({})
const isSubmitting = ref(false)

const columns = [
    { name: 'name', label: 'NOMBRE DE SEDE', align: 'left', field: 'name', sortable: true },
    { name: 'city', label: 'CIUDAD', align: 'left', field: 'city', sortable: true },
    { name: 'address', label: 'DIRECCIÓN', align: 'left', field: 'address' },
    { name: 'active', label: 'ESTADO', align: 'center', field: 'active' },
    { name: 'actions', label: 'ACCIONES', align: 'right' }
]

onMounted(() => {
    if (leagueStore.headquarters.length === 0) {
        leagueStore.fetchLeagueData()
    }
})

const openCreateModal = () => {
    selectedItem.value = { active: true }
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

        if (isEdit) {
            await leagueStore.updateHeadquarters(selectedItem.value.id, formData)
            $q.notify({ color: 'emerald', message: 'Sede actualizada correctamente.', icon: 'check', classes: 'shadow-premium' })
        } else {
            await leagueStore.createHeadquarters(formData)
            $q.notify({ color: 'emerald', message: 'Sede creada correctamente.', icon: 'check', classes: 'shadow-premium' })
        }

        modalOpen.value = false
    } catch (error) {
        $q.notify({ color: 'rose-6', message: 'Ocurrió un error al guardar los datos.', icon: 'error', classes: 'shadow-premium' })
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = (item) => {
    $q.dialog({
        title: `Confirmar Eliminación`,
        message: `¿Estás seguro de que deseas eliminar la sede "${item.name}"?`,
        class: 'shadow-premium',
        style: 'border-radius: 20px',
        cancel: {
            label: 'Cancelar',
            color: 'slate-500',
            flat: true,
            noCaps: true
        },
        ok: {
            label: 'Eliminar Sede',
            color: 'rose-6',
            unelevated: true,
            noCaps: true,
            style: 'border-radius: 8px'
        },
        persistent: true
    }).onOk(async () => {
        try {
            await leagueStore.deleteHeadquarters(item.id)
            $q.notify({ color: 'emerald', message: 'Eliminado correctamente.', icon: 'check', classes: 'shadow-premium' })
        } catch (error) {
            $q.notify({ color: 'rose-6', message: 'No se pudo eliminar la sede verificada.', icon: 'error', classes: 'shadow-premium' })
        }
    })
}
</script>

<style scoped>
.modern-table {
    border-radius: 20px;
}

.text-overline {
    font-size: 11px;
    letter-spacing: 1px;
    padding-top: 20px !important;
    padding-bottom: 20px !important;
}

.border-hover-emerald:hover {
    color: #10b981 !important;
    background: #ecfdf5 !important;
}

.border-hover-rose:hover {
    color: #f43f5e !important;
    background: #fff1f2 !important;
}
</style>
