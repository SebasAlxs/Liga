<template>
  <div v-if="hasStats" class="flex items-center gap-1 mt-0.5">
    <!-- Goals -->
    <template v-if="stats.GOAL > 0">
      <span v-for="i in Math.min(stats.GOAL, 3)" :key="'g-'+i" class="text-[10px]">⚽</span>
      <span v-if="stats.GOAL > 3" class="text-[10px] font-black text-emerald-400 ml-0.5">+{{ stats.GOAL - 3 }}</span>
    </template>
    
    <!-- Yellow Cards -->
    <span v-for="i in stats.YELLOW_CARD" :key="'y-'+i" class="text-[10px]">🟨</span>
    
    <!-- Red Cards -->
    <span v-for="i in stats.RED_CARD" :key="'r-'+i" class="text-[10px]">🟥</span>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ GOAL: 0, YELLOW_CARD: 0, RED_CARD: 0 })
  }
})

const hasStats = computed(() => {
  if (!props.stats) return false
  return (props.stats.GOAL || 0) > 0 || (props.stats.YELLOW_CARD || 0) > 0 || (props.stats.RED_CARD || 0) > 0
})
</script>
