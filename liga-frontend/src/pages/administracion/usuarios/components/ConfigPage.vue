<template>
  <div class="row q-col-gutter-lg q-pt-md">
    <!-- Columna Izquierda: Información Personal -->
    <div class="col-12 col-md-5">
      <q-card class="shadow-1 q-pa-lg bg-white" style="border-radius: 12px; height: 100%">
        <div class="text-h5 text-weight-bolder text-dark q-mb-lg">Información Personal</div>

        <q-form class="q-gutter-y-md">
          <!-- Nombre Completo -->
          <q-input
            v-model="form.nombre"
            label="Nombre Completo"
            outlined
            color="green-8"
            readonly
            class="config-input"
          />

          <!-- Email -->
          <q-input
            v-model="form.email"
            label="Email"
            outlined
            color="green-8"
            readonly
            class="config-input"
          />

          <!-- Teléfono -->
          <q-input
            v-model="form.telefono"
            label="Teléfono"
            outlined
            color="green-8"
            readonly
            class="config-input"
          />

          <!-- Posición -->
          <q-input
            v-model="form.posicion"
            label="Posición"
            outlined
            color="green-8"
            readonly
            class="config-input"
          />

          <!-- Número de Camiseta -->
          <q-input
            v-model="form.numero"
            label="Número de Camiseta"
            outlined
            color="green-8"
            readonly
            class="config-input"
          />

          <!-- Botón de Editar -->
          <q-btn
            color="green-8"
            icon="edit"
            label="Editar Información"
            class="full-width q-mt-md text-weight-bold"
            style="border-radius: 8px; padding-top: 10px; padding-bottom: 10px"
            unelevated
          />
        </q-form>
      </q-card>
    </div>

    <!-- Columna Derecha: Preferencias y Zona de Peligro -->
    <div class="col-12 col-md-7 column q-gutter-y-lg">
      <!-- Card Preferencias -->
      <q-card class="shadow-1 q-pa-lg bg-white" style="border-radius: 12px">
        <div class="text-h5 text-weight-bolder text-dark q-mb-lg">Preferencias</div>

        <q-list>
          <!-- Notificaciones de Partidos -->
          <q-item tag="label" v-ripple class="q-px-none q-py-sm">
            <q-item-section>
              <q-item-label class="text-subtitle1 text-dark"
                >Notificaciones de Partidos</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settings.notificaciones" color="green-8" />
            </q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <!-- Perfil Público -->
          <q-item tag="label" v-ripple class="q-px-none q-py-sm">
            <q-item-section>
              <q-item-label class="text-subtitle1 text-dark">Perfil Público</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settings.perfilPublico" color="green-8" />
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md q-mb-lg" />

          <!-- Botón Configurar Notificaciones -->
          <q-btn
            outline
            color="green-8"
            icon="notifications"
            label="Configurar Notificaciones"
            class="full-width text-weight-bold"
            style="border-radius: 8px; border-width: 1px"
          />
        </q-list>
      </q-card>

      <!-- Card Zona de Peligro -->
      <q-card class="shadow-1 q-pa-lg bg-white q-mt-auto" style="border-radius: 12px">
        <div class="text-h5 text-weight-bolder text-red-8 q-mb-sm">Zona de Peligro</div>
        <div class="text-subtitle1 text-grey-7 q-mb-lg">
          Estas acciones son irreversibles. Procede con precaución.
        </div>

        <!-- Botón Eliminar Cuenta -->
        <q-btn
          outline
          color="red-5"
          text-color="red-8"
          label="Eliminar Cuenta"
          class="full-width text-weight-bold"
          style="border-radius: 8px; border-width: 1px"
        />
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  nombre: 'Juan Pérez',
  email: 'juan.perez@email.com',
  telefono: '+54 11 1234-5678',
  posicion: 'Delantero',
  numero: '10',
})

const settings = reactive({
  notificaciones: true,
  perfilPublico: true,
})
</script>

<style scoped>
/* Estilizar los inputs para que se parezcan a la imagen (outline gris claro) */
:deep(.config-input .q-field__control) {
  border-radius: 8px;
}
:deep(.config-input .q-field__native) {
  color: #757575 !important;
}
</style>
