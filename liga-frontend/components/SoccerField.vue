<template>
  <div 
    class="relative w-full rounded-[2.5rem] overflow-hidden border border-border/5 shadow-2xl transition-all"
    :style="fieldContainerStyle"
  >
    <!-- Field background with lines -->
    <div class="absolute inset-0 bg-[#081208]">
      <div 
        class="absolute inset-0 opacity-80"
        style="background: linear-gradient(180deg, #1a4a0e 0%, #1d5410 25%, #1a4a0e 50%, #1d5410 75%, #1a4a0e 100%);"
      ></div>
      
      <!-- Field markings -->
      <div class="absolute inset-0 pointer-events-none p-[4%]">
        <div class="w-full h-full border-2 border-border/20 rounded-sm relative">
          <!-- Center line -->
          <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-surface/15 -translate-y-1/2"></div>
          <!-- Center circle -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 aspect-square border-2 border-border/15 rounded-full"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-surface/30 rounded-full"></div>
          
          <!-- Penalty areas -->
          <div class="absolute top-0 left-1/4 right-1/4 h-[18%] border-x-2 border-b-2 border-border/15 rounded-b-sm"></div>
          <div class="absolute bottom-0 left-1/4 right-1/4 h-[18%] border-x-2 border-t-2 border-border/15 rounded-t-sm"></div>
          
          <!-- Goals -->
          <div class="absolute -top-[2%] left-[40%] right-[40%] h-[2%] border-2 border-border/25 border-t-0 rounded-b-md bg-surface/5"></div>
          <div class="absolute -bottom-[2%] left-[40%] right-[40%] h-[2%] border-2 border-border/25 border-b-0 rounded-t-md bg-surface/5"></div>
        </div>
      </div>
    </div>

    <!-- Players -->
    <template v-for="p in allPositioned" :key="p.id">
      <div 
        class="absolute transition-all duration-700 ease-in-out"
        :class="{ 'opacity-50 grayscale pointer-events-none shadow-[inset_0_0_20px_rgba(225,29,72,0.5)] rounded-full': redCardedIds?.includes(p.playerId) }"
        :style="{ 
          left: `${p.fieldX}%`, 
          top: `${p.fieldY}%`, 
          transform: 'translate(-50%, -50%)',
          zIndex: activePlayerId === p.playerId ? 50 : 10
        }"
      >
        <PlayerToken 
          :player="p.player"
          :stats="statsMap?.[p.playerId]"
          :isHome="p.isHome"
          :isActive="activePlayerId === p.playerId"
          :clickable="clickable"
          :size="isMobile ? 'md' : 'lg'"
          @click="emit('playerClick', p)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  homeStarters: Array,
  awayStarters: Array,
  homeTeam: Object,
  awayTeam: Object,
  isMobile: Boolean,
  clickable: Boolean,
  activePlayerId: String,
  statsMap: Object,
  redCardedIds: Array
})

const emit = defineEmits(['playerClick'])

const fieldContainerStyle = computed(() => ({
  aspectRatio: props.isMobile ? '4/5' : '2/3',
}))

function distributeTeam(starters, isHome) {
  if (!starters?.length) return []
  const zones = isHome
    ? [{ y: 88, label: 'GK' }, { y: 70, label: 'DEF' }, { y: 52, label: 'MID' }, { y: 34, label: 'FWD' }]
    : [{ y: 12, label: 'GK' }, { y: 30, label: 'DEF' }, { y: 48, label: 'MID' }, { y: 66, label: 'FWD' }]

  const gk = starters.slice(0, 1)
  const rest = starters.slice(1)
  
  // Tactical distribution (simplistic but works for visual)
  const def = rest.slice(0, Math.ceil(rest.length * 0.4))
  const mid = rest.slice(def.length, def.length + Math.ceil(rest.length * 0.35))
  const fwd = rest.slice(def.length + mid.length)

  const rows = [gk, def, mid, fwd]
  const result = []
  
  rows.forEach((group, ri) => {
    const y = zones[ri].y
    group.forEach((item, i) => {
      const x = ((i + 1) / (group.length + 1)) * 100
      result.push({ ...item, fieldX: x, fieldY: y, isHome })
    })
  })
  
  return result
}

const allPositioned = computed(() => {
  const home = distributeTeam(props.homeStarters, true)
  const away = distributeTeam(props.awayStarters, false)
  return [...home, ...away]
})
</script>
