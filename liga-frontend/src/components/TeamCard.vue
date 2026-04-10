<template>
  <q-card class="team-card glass shadow-premium transition-base hover-pivot cursor-pointer overflow-hidden" flat @click="$emit('click')">
    <div class="card-gradient-overlay"></div>
    <q-card-section class="q-pa-lg relative-position">
      <div class="row items-center no-wrap">
        <q-avatar size="64px" class="shadow-glow-emerald bg-slate-800 q-mr-lg">
          <q-img v-if="team.logo" :src="team.logo" />
          <div v-else class="text-emerald text-h4 text-weight-bolder">{{ team.name.charAt(0) }}</div>
        </q-avatar>
        <div class="col">
          <div class="text-h6 text-weight-bolder text-white tracking-tight line-clamp-1">{{ team.name }}</div>
          <div class="text-caption text-slate-400 font-bold uppercase tracking-widest">{{ team.category?.name || 'Categoría' }}</div>
        </div>
        <q-btn flat round color="slate-400" icon="las la-ellipsis-v" @click.stop />
      </div>

      <div class="row q-mt-xl q-col-gutter-sm">
        <div class="col-6">
          <div class="text-caption text-slate-500 font-bold text-uppercase" style="font-size: 9px">Fundación</div>
          <div class="text-body2 text-white font-medium">{{ team.foundedDate || '---' }}</div>
        </div>
        <div class="col-6">
          <div class="text-caption text-slate-500 font-bold text-uppercase" style="font-size: 9px">Jugadores</div>
          <div class="text-body2 text-white font-medium">{{ team.playerCount || 0 }} Inscritos</div>
        </div>
      </div>
    </q-card-section>
    
    <q-card-actions class="bg-slate-900 q-px-lg q-py-md">
      <div class="row items-center full-width justify-between">
        <q-badge color="emerald-9" text-color="emerald" class="q-px-md text-weight-bold glass" style="border-radius: 8px">
          {{ team.status || 'Activo' }}
        </q-badge>
        <q-btn flat color="emerald" label="Ver Nómina" icon-right="las la-arrow-right" dense no-caps class="text-weight-bold" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineProps({
  team: {
    type: Object,
    required: true
  }
})
defineEmits(['click'])
</script>

<style scoped>
.team-card {
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.card-gradient-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
  pointer-events: none;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
