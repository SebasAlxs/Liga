<template>
  <div 
    :class="[
      'flex flex-col items-center gap-1 transition-all',
      clickable ? 'cursor-pointer hover:scale-110' : ''
    ]"
    :style="containerStyle"
  >
    <!-- Circle Token -->
    <div 
      :class="[
        'rounded-full overflow-hidden border flex items-center justify-center backdrop-blur-sm transition-all shadow-lg',
        isActive ? 'border-emerald-500 ring-2 ring-emerald-500/50' : isHome ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-blue-500/40 bg-blue-500/10'
      ]"
      :style="tokenStyle"
    >
      <img 
        v-if="player?.photo" 
        :src="player.photo.startsWith('data:') ? player.photo : `data:image/jpeg;base64,${player.photo}`" 
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center">
        <span :class="['font-black uppercase', size === 'lg' ? 'text-lg' : 'text-[10px]']" :style="{ color: isHome ? '#10b981' : '#3b82f6' }">
          {{ player?.firstName?.[0] || '?' }}{{ player?.lastName?.[0] || '' }}
        </span>
      </div>
    </div>

    <!-- Info Label -->
    <div v-if="showName" class="flex flex-col items-center">
      <div 
        class="whitespace-nowrap font-bold text-white bg-obsidian-950/80 px-2 py-0.5 rounded-md border border-white/5 shadow-md"
        :style="{ fontSize: size === 'lg' ? '0.65rem' : '0.55rem' }"
      >
        {{ player?.firstName }}
      </div>
      <EventIndicators v-if="stats" :stats="stats" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  player: Object,
  stats: Object,
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  isActive: Boolean,
  isHome: Boolean,
  clickable: {
    type: Boolean,
    default: true
  },
  showName: {
    type: Boolean,
    default: true
  }
})

const tokenSize = computed(() => {
  if (props.size === 'lg') return '3.5rem'
  if (props.size === 'sm') return '2rem'
  return '2.8rem'
})

const containerStyle = computed(() => {
  if (props.size === 'sm') return { minWidth: '52px' }
  return {}
})

const tokenStyle = computed(() => ({
  width: tokenSize.value,
  height: tokenSize.value,
  boxShadow: props.isActive ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(0,0,0,0.4)'
}))
</script>
