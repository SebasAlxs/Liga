<template>
  <q-card class="shadow-1 q-pa-lg" style="border-radius: 12px">
    <div class="text-h5 text-weight-bolder text-dark q-mb-lg">Partidos Recientes</div>

    <q-list class="q-gutter-y-md">
      <!-- Match 1 -->
      <q-item
        class="match-item q-pa-md bg-grey-1"
        style="border-left: 6px solid #2e7d32; border-radius: 8px"
      >
        <q-item-section avatar>
          <q-avatar color="green-8" text-color="white" icon="sports_soccer" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold text-dark row items-center">
            Los Tigres FC vs Leones FC
            <q-badge
              color="grey-3"
              text-color="dark"
              class="q-ml-sm text-weight-bold q-px-sm"
              style="border-radius: 12px; font-size: 14px; padding-top: 4px; padding-bottom: 4px"
              >3 - 2</q-badge
            >
          </q-item-label>
          <q-item-label caption class="row items-center q-mt-xs">
            <q-icon name="calendar_today" size="xs" color="grey-6" class="q-mr-xs" />
            <span class="text-grey-7 q-mr-md text-weight-medium">28/02/2026</span>

            <q-icon name="sports_soccer" size="xs" color="grey-6" class="q-mr-xs" />
            <span class="text-green-8 text-weight-bold">2 goles</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            color="green-8"
            class="text-weight-bold q-px-md q-py-sm"
            style="border-radius: 20px; font-size: 13px"
          >
            Victoria
          </q-badge>
        </q-item-section>
      </q-item>

      <!-- Match 2 -->
      <q-item
        class="match-item q-pa-md bg-grey-1"
        style="border-left: 6px solid #ef6c00; border-radius: 8px"
      >
        <q-item-section avatar>
          <q-avatar color="orange-9" text-color="white" icon="sports_soccer" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold text-dark row items-center">
            Águilas United vs Los Tigres FC
            <q-badge
              color="grey-3"
              text-color="dark"
              class="q-ml-sm text-weight-bold q-px-sm"
              style="border-radius: 12px; font-size: 14px; padding-top: 4px; padding-bottom: 4px"
              >1 - 1</q-badge
            >
          </q-item-label>
          <q-item-label caption class="row items-center q-mt-xs">
            <q-icon name="calendar_today" size="xs" color="grey-6" class="q-mr-xs" />
            <span class="text-grey-7 q-mr-md text-weight-medium">21/02/2026</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            color="orange-9"
            class="text-weight-bold q-px-md q-py-sm"
            style="border-radius: 20px; font-size: 13px"
          >
            Empate
          </q-badge>
        </q-item-section>
      </q-item>

      <!-- Match 3 -->
      <q-item
        class="match-item q-pa-md bg-grey-1"
        style="border-left: 6px solid #2e7d32; border-radius: 8px"
      >
        <q-item-section avatar>
          <q-avatar color="green-8" text-color="white" icon="sports_soccer" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold text-dark row items-center">
            Los Tigres FC vs Pumas FC
            <q-badge
              color="grey-3"
              text-color="dark"
              class="q-ml-sm text-weight-bold q-px-sm"
              style="border-radius: 12px; font-size: 14px; padding-top: 4px; padding-bottom: 4px"
              >2 - 0</q-badge
            >
          </q-item-label>
          <q-item-label caption class="row items-center q-mt-xs">
            <q-icon name="calendar_today" size="xs" color="grey-6" class="q-mr-xs" />
            <span class="text-grey-7 q-mr-md text-weight-medium">14/02/2026</span>

            <q-icon name="sports_soccer" size="xs" color="grey-6" class="q-mr-xs" />
            <span class="text-green-8 text-weight-bold">1 gol</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            color="green-8"
            class="text-weight-bold q-px-md q-py-sm"
            style="border-radius: 20px; font-size: 13px"
          >
            Victoria
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup></script>

<style scoped>
.match-item {
  border: 1px solid #e0e0e0;
}
</style>
