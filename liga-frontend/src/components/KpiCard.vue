<template>
  <q-card class="kpi-card glass shadow-premium transition-base hover-pivot overflow-hidden" flat>
    <q-card-section class="q-pa-xl">
      <div class="row items-center justify-between no-wrap">
        <div>
          <div class="text-h3 text-weight-bolder text-white tracking-tighter">{{ value }}</div>
          <div class="text-caption text-slate-400 text-uppercase tracking-widest q-mt-xs font-bold">{{ label }}</div>
        </div>
        <div class="mb-icon-box shadow-glow-emerald">
          <q-icon :name="icon" size="28px" class="text-emerald" />
        </div>
      </div>
    </q-card-section>
    <div v-if="trend" class="q-px-xl q-pb-md row items-center">
      <q-icon :name="trend > 0 ? 'las la-arrow-up' : 'las la-arrow-down'" 
              :color="trend > 0 ? 'emerald' : 'rose'" size="xs" />
      <span :class="trend > 0 ? 'text-emerald' : 'text-rose'" class="text-caption font-bold q-ml-xs">
        {{ Math.abs(trend) }}% vs anterior
      </span>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  trend: Number
})
</script>

<style scoped>
.kpi-card {
  border-radius: 28px;
  min-height: 140px;
}
</style>
