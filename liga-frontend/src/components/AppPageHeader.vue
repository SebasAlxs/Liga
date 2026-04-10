<template>
  <div class="app-page-header row items-center q-mb-xl staggered-entrance">
    <div class="col-12 col-md-8">
      <div v-if="overline" class="text-overline text-emerald q-mb-xs text-weight-bold tracking-widest">{{ overline }}</div>
      <div class="row items-center no-wrap">
        <q-btn v-if="back" flat round icon="las la-arrow-left" color="slate-400" @click="$router.back()" class="q-mr-md glass border-hover-emerald" />
        <h1 class="text-h3 text-weight-bolder text-white q-ma-none tracking-tighter">{{ title }}</h1>
      </div>
      <p v-if="subtitle" class="text-h6 text-slate-400 q-mt-sm font-medium">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="col-12 col-md-4 text-right row q-gutter-md justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: String,
  overline: String,
  back: { type: Boolean, default: false }
})
</script>

<style scoped>
.app-page-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 24px;
}
</style>
