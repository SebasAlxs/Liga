<script setup>
// ESTO ES ESENCIAL: Define que este componente recibirá un objeto llamado 'job'.
const props = defineProps({
  job: {
    type: Object,
    required: false,
    default: () => ({
      bgColor: '#fff',
      date: 'N/A',
      company: 'Empresa Demo',
      title: 'Puesto de Ejemplo',
      logo: 'https://cdn.quasar.dev/img/boy-avatar.png',
      tags: ['Demo', 'Ejemplo'],
      rate: 0,
      location: 'Ubicación Desconocida',
    }),
  },
})
</script>

<template>
  <q-card class="job-card" flat :style="{ backgroundColor: props.job.bgColor }">
    <q-card-section class="q-pa-md row items-center no-wrap">
      <div class="text-grey-8">{{ job.date }}</div>
      <q-space />
      <q-btn icon="bookmark_border" round flat dense color="grey-9" />
    </q-card-section>

    <q-card-section class="q-pt-none q-px-md">
      <q-item class="q-pa-none">
        <q-item-section>
          <q-item-label class="text-weight-regular text-grey-9">{{
            props.job.company
          }}</q-item-label>
          <q-item-label class="text-h6 text-weight-bold text-black">{{
            props.job.title
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-avatar size="48px">
            <img :src="job.logo" alt="logo" />
          </q-avatar>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="q-pt-sm q-px-md">
      <div class="q-gutter-sm">
        <q-chip v-for="tag in job.tags" :key="tag" class="tag-chip" text-color="black" size="sm">
          {{ tag }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-section class="q-px-md q-pb-md">
      <div class="row items-center justify-between">
        <div>
          <span class="text-h6 text-weight-bolder">${{ props.job.rate }}/hr</span>
          <div class="text-caption text-grey-8">{{ props.job.location }}</div>
        </div>
        <q-btn label="Details" color="dark" rounded unelevated no-caps class="details-btn" />
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.job-card {
  border-radius: 24px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.tag-chip {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  font-weight: 500;
  // Aseguramos que el texto de los tags sea oscuro sobre el fondo pastel
  color: #333 !important;
}

.details-btn {
  font-weight: bold;
  padding: 8px 24px;
}
</style>
