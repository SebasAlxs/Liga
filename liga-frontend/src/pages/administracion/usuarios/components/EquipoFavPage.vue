<template>
  <div class="row q-col-gutter-lg q-pt-md">
    <!-- Team 1 -->
    <div class="col-12 col-sm-6 col-md-4">
      <q-card class="shadow-1 q-pa-md bg-white team-card" style="border-radius: 12px">
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center">
            <q-avatar size="60px" class="bg-grey-3 q-mr-md shadow-1" style="font-size: 32px">
              🐯
            </q-avatar>
            <div>
              <div class="text-h6 text-weight-bolder text-dark">Los Tigres FC</div>
              <div class="text-subtitle2 text-grey-6">Posición: #1 • 45 puntos</div>
            </div>
          </div>
          <q-btn flat round color="red-7" icon="favorite" />
        </div>

        <q-separator class="q-my-md" />

        <div class="row text-center q-pb-md">
          <div class="col">
            <div class="text-h5 text-weight-bold text-dark">12</div>
            <div class="text-caption text-grey-6">Partidos</div>
          </div>
          <div class="col">
            <div class="text-h5 text-weight-bold text-green-8">8</div>
            <div class="text-caption text-grey-6">Victorias</div>
          </div>
          <div class="col">
            <div class="text-h5 text-weight-bold text-dark">25</div>
            <div class="text-caption text-grey-6">Goles</div>
          </div>
        </div>

        <q-btn
          outline
          color="green-8"
          label="Ver Detalles"
          class="full-width text-weight-bold"
          style="border-radius: 8px"
        />
      </q-card>
    </div>

    <!-- Team 2 -->
    <div class="col-12 col-sm-6 col-md-4">
      <q-card class="shadow-1 q-pa-md bg-white team-card" style="border-radius: 12px">
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center">
            <q-avatar size="60px" class="bg-grey-3 q-mr-md shadow-1" style="font-size: 32px">
              🦅
            </q-avatar>
            <div>
              <div class="text-h6 text-weight-bolder text-dark">Águilas United</div>
              <div class="text-subtitle2 text-grey-6">Posición: #3 • 38 puntos</div>
            </div>
          </div>
          <q-btn flat round color="red-7" icon="favorite" />
        </div>

        <q-separator class="q-my-md" />

        <div class="row text-center q-pb-md">
          <div class="col">
            <div class="text-h5 text-weight-bold text-dark">12</div>
            <div class="text-caption text-grey-6">Partidos</div>
          </div>
          <div class="col">
            <div class="text-h5 text-weight-bold text-green-8">8</div>
            <div class="text-caption text-grey-6">Victorias</div>
          </div>
          <div class="col">
            <div class="text-h5 text-weight-bold text-dark">25</div>
            <div class="text-caption text-grey-6">Goles</div>
          </div>
        </div>

        <q-btn
          outline
          color="green-8"
          label="Ver Detalles"
          class="full-width text-weight-bold"
          style="border-radius: 8px"
        />
      </q-card>
    </div>

    <!-- Add Team -->
    <div class="col-12 col-sm-6 col-md-4">
      <q-card
        class="dashed-card bg-grey-1 column items-center justify-center text-center q-pa-xl"
        style="height: 100%; border-radius: 12px; min-height: 250px"
      >
        <q-avatar size="72px" class="bg-green-7 text-white q-mb-md shadow-2">
          <q-icon name="star" size="40px" />
        </q-avatar>
        <div class="text-h6 text-weight-bold text-dark q-mb-xs">Agregar Equipo Favorito</div>
        <div class="text-subtitle2 text-grey-7">Sigue a más equipos de la liga</div>
      </q-card>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.team-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.dashed-card {
  border: 2px dashed #bdbdbd;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dashed-card:hover {
  background-color: #f5f5f5 !important;
  border-color: #2e7d32;
}
</style>
