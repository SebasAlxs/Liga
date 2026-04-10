<template>
  <q-page class="q-pa-lg bg-grey-2">
    <!-- Contenedor Principal Perfil -->
    <q-card class="my-card shadow-1 q-mb-lg" style="border-radius: 12px; overflow: hidden">
      <!-- Banner verde -->
      <div class="bg-green-9" style="height: 140px"></div>

      <q-card-section class="q-pa-none" style="position: relative">
        <div class="row q-px-xl q-pb-lg">
          <!-- Avatar (superpuesto) -->
          <div style="margin-top: -70px; position: relative" class="q-mr-xl">
            <q-avatar
              size="140px"
              class="bg-green-8 text-white shadow-2"
              style="border: 6px solid white"
            >
              <span class="text-h2 text-weight-regular">J</span>
            </q-avatar>
            <!-- Camera icon button -->
            <q-btn
              round
              color="grey-4"
              text-color="grey-8"
              icon="camera_alt"
              size="sm"
              class="absolute-bottom-right shadow-2"
              style="bottom: 8px; right: 8px; border: 2px solid white"
            />
          </div>

          <!-- Info Usuario -->
          <div class="col" style="margin-top: 16px">
            <div class="row items-center q-mb-sm">
              <div class="text-h3 text-weight-bolder text-dark q-mr-sm">Juan Pérez</div>
              <q-icon name="edit" color="green-8" size="sm" class="cursor-pointer" />
            </div>

            <!-- Etiquetas / Badges -->
            <div class="row q-gutter-sm q-mb-md items-center">
              <q-chip
                outline
                color="green-8"
                size="md"
                icon="sports_soccer"
                class="text-weight-bold no-margin"
              >
                Jugador
              </q-chip>
              <q-chip color="grey-3" text-color="dark" size="md" class="text-weight-bold no-margin">
                Delantero
              </q-chip>
              <q-chip color="grey-3" text-color="dark" size="md" class="text-weight-bold no-margin">
                #10
              </q-chip>
            </div>
            <div class="row q-mb-md">
              <q-chip outline color="green-8" size="md" class="text-weight-bold no-margin q-px-sm">
                <q-icon name="star" color="green-8" size="xs" class="q-mr-xs" />
                Los Tigres FC
              </q-chip>
            </div>

            <!-- Contactos -->
            <div class="text-grey-7 text-subtitle1 flex items-center">
              <q-icon name="email" size="xs" class="q-mr-xs" />
              juan.perez@email.com
              <span class="q-mx-sm">•</span>
              <q-icon name="phone_iphone" size="xs" class="q-mr-xs" />
              +54 11 1234-5678
            </div>
          </div>

          <!-- Botones Superiores -->
          <div class="col-auto row q-gutter-md q-pt-md">
            <q-btn
              outline
              color="grey-5"
              text-color="green-9"
              icon="settings"
              label="Configuración"
              class="bg-white text-weight-bold"
              style="border-radius: 8px; border-width: 1px"
            />
            <q-btn
              outline
              color="green-8"
              label="Cambiar a Hincha"
              class="bg-white text-weight-bold"
              style="border-radius: 8px"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabs Menú -->
    <q-card class="shadow-1 q-mb-xl" style="border-radius: 12px">
      <q-tabs
        v-model="tab"
        class="text-grey-7"
        active-color="green-8"
        indicator-color="green-8"
        align="left"
        narrow-indicator
        style="height: 64px"
      >
        <q-tab
          name="estadisticas"
          icon="trending_up"
          label="ESTADÍSTICAS"
          class="text-weight-bold q-px-lg"
        />
        <q-tab
          name="equipos"
          icon="favorite"
          label="EQUIPOS FAVORITOS"
          class="text-weight-bold q-px-lg"
        />
        <q-tab
          name="historial"
          icon="calendar_today"
          label="HISTORIAL"
          class="text-weight-bold q-px-lg"
        />
        <q-tab
          name="configuracion"
          icon="settings"
          label="CONFIGURACIÓN"
          class="text-weight-bold q-px-lg"
        />
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none">
      <q-tab-panel name="estadisticas" class="q-pa-none overflow-hidden">
        <!-- Estadísticas Cards -->
        <div class="row q-col-gutter-xl q-pt-sm">
          <!-- Partidos Jugados -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="shadow-1 text-center q-pa-xl" style="border-radius: 12px; height: 100%">
              <q-avatar size="80px" class="bg-green-8 text-white q-mb-md">
                <q-icon name="sports_soccer" size="48px" />
              </q-avatar>
              <div
                class="text-weight-bolder text-green-8 q-mb-xs"
                style="font-size: 5rem; line-height: 1"
              >
                24
              </div>
              <div class="text-subtitle1 text-grey-7 q-mt-sm">Partidos Jugados</div>
            </q-card>
          </div>

          <!-- Goles Anotados -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="shadow-1 text-center q-pa-xl" style="border-radius: 12px; height: 100%">
              <q-avatar size="80px" class="bg-green-8 text-white q-mb-md">
                <q-icon name="sports_soccer" size="48px" />
              </q-avatar>
              <div
                class="text-weight-bolder text-green-8 q-mb-xs"
                style="font-size: 5rem; line-height: 1"
              >
                15
              </div>
              <div class="text-subtitle1 text-grey-7 q-mt-sm">Goles Anotados</div>
            </q-card>
          </div>

          <!-- Asistencias -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="shadow-1 text-center q-pa-xl" style="border-radius: 12px; height: 100%">
              <q-avatar size="80px" class="bg-blue-7 text-white q-mb-md">
                <q-icon name="person" size="48px" />
              </q-avatar>
              <div
                class="text-weight-bolder text-blue-7 q-mb-xs"
                style="font-size: 5rem; line-height: 1"
              >
                8
              </div>
              <div class="text-subtitle1 text-grey-7 q-mt-sm">Asistencias</div>
            </q-card>
          </div>

          <!-- Premios MVP -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="shadow-1 text-center q-pa-xl" style="border-radius: 12px; height: 100%">
              <q-avatar size="80px" class="bg-orange-8 text-white q-mb-md">
                <q-icon name="emoji_events" size="48px" />
              </q-avatar>
              <div
                class="text-weight-bolder text-orange-8 q-mb-xs"
                style="font-size: 5rem; line-height: 1"
              >
                2
              </div>
              <div class="text-subtitle1 text-grey-7 q-mt-sm">Premios MVP</div>
            </q-card>
          </div>
        </div>

        <!-- Detalles de Estadísticas -->
        <q-card class="shadow-1 q-mt-xl q-pa-lg" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold text-dark q-mb-lg">Estadísticas Detalladas</div>

          <div class="row q-col-gutter-xl">
            <!-- Columna Izquierda (Barras de progreso) -->
            <div class="col-12 col-md-6">
              <!-- Minutos Jugados -->
              <div class="q-mb-xl">
                <div class="row justify-between items-center q-mb-sm">
                  <span class="text-subtitle1 text-grey-7">Minutos Jugados</span>
                  <span class="text-subtitle1 text-weight-bolder text-dark">1980 min</span>
                </div>
                <q-linear-progress
                  :value="0.85"
                  color="green-8"
                  track-color="green-3"
                  size="14px"
                  style="border-radius: 8px"
                />
              </div>

              <!-- Efectividad de Gol -->
              <div>
                <div class="row justify-between items-center q-mb-sm">
                  <span class="text-subtitle1 text-grey-7">Efectividad de Gol</span>
                  <span class="text-subtitle1 text-weight-bolder text-dark">62.5%</span>
                </div>
                <q-linear-progress
                  :value="0.625"
                  color="green-8"
                  track-color="green-3"
                  size="14px"
                  style="border-radius: 8px"
                />
              </div>
            </div>

            <!-- Columna Derecha (Lista) -->
            <div class="col-12 col-md-6">
              <q-list class="rounded-borders">
                <!-- Tarjetas Amarillas -->
                <q-item class="q-pa-none q-mb-md">
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-dark">Tarjetas Amarillas</q-item-label>
                    <q-item-label caption class="text-subtitle1 text-grey-6">3</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-avatar
                      size="36px"
                      color="orange-9"
                      text-color="white"
                      class="text-weight-bold shadow-1"
                      >3</q-avatar
                    >
                  </q-item-section>
                </q-item>
                <q-separator />

                <!-- Tarjetas Rojas -->
                <q-item class="q-pa-none q-my-md">
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-dark">Tarjetas Rojas</q-item-label>
                    <q-item-label caption class="text-subtitle1 text-grey-6">0</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-avatar
                      size="36px"
                      color="red-8"
                      text-color="white"
                      class="text-weight-bold shadow-1"
                      >0</q-avatar
                    >
                  </q-item-section>
                </q-item>
                <q-separator />

                <!-- Promedio Goles/Partido -->
                <q-item class="q-pa-none q-mt-md">
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-dark"
                      >Promedio Goles/Partido</q-item-label
                    >
                    <q-item-label caption class="text-subtitle1 text-grey-6"
                      >Por partido</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      outline
                      color="green-8"
                      class="text-subtitle1 text-weight-bold q-px-sm q-py-xs bg-white"
                      style="border-radius: 12px; border: 1px solid #2e7d32"
                    >
                      0.63
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card>
      </q-tab-panel>

      <!-- Panel de Equipos Favoritos -->
      <q-tab-panel name="equipos" class="q-pa-none overflow-hidden">
        <EquipoFavPage />
      </q-tab-panel>

      <!-- Panel de Historial (Placeholder) -->
      <q-tab-panel name="historial" class="q-pa-none overflow-hidden">
        <HistorialPage />
      </q-tab-panel>

      <!-- Panel de Configuración -->
      <q-tab-panel name="configuracion" class="q-pa-none overflow-hidden">
        <ConfigPage />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import EquipoFavPage from './components/EquipoFavPage.vue'
import HistorialPage from './components/HistorialPage.vue'
import ConfigPage from './components/ConfigPage.vue'

const tab = ref('estadisticas')
</script>

<style scoped>
/* Estilos adicionales si fueran necesarios */
</style>
