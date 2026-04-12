<template>
  <div class="relative overflow-hidden rounded-[2.5rem] bg-obsidian-900 border border-white/5 group shadow-2xl">
    <!-- Abstract BG -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50"></div>
    
    <div class="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
      <!-- Home Team -->
      <div class="flex flex-col items-center text-center w-full md:w-1/3">
        <div class="w-20 h-20 sm:w-28 sm:h-28 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
          <img v-if="match?.homeTeam?.logo" :src="match.homeTeam.logo" class="w-full h-full object-contain" />
          <Icon v-else name="lucide:shield" class="w-full h-full text-obsidian-700" />
        </div>
        <h3 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-tight">{{ match?.homeTeam?.name || 'Local' }}</h3>
      </div>

      <!-- Scoreboard Center -->
      <div class="flex flex-col items-center w-full md:w-1/3 shrink-0">
        <div class="flex items-center gap-4 sm:gap-6 py-4 px-8 rounded-[2rem] bg-obsidian-950/80 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:border-emerald-500/20 transition-all">
          <div class="flex flex-col items-center">
            <span class="text-4xl sm:text-6xl font-black text-white tabular-nums tracking-tighter">{{ match?.homeScore ?? 0 }}</span>
          </div>
          <div class="flex flex-col items-center gap-1">
             <span class="text-lg sm:text-2xl text-obsidian-600 font-black tracking-widest">:</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-4xl sm:text-6xl font-black text-white tabular-nums tracking-tighter">{{ match?.awayScore ?? 0 }}</span>
          </div>
        </div>

        <!-- Chronometer -->
        <div v-if="minuteFormatted" class="mt-4 flex flex-col items-center gap-2">
          <div class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-sm font-black text-emerald-400 font-mono tracking-widest">{{ minuteFormatted }}</span>
          </div>
          <div class="text-[10px] uppercase font-black tracking-[0.3em] text-obsidian-500 animate-pulse">
            {{ statusText }}
          </div>
        </div>
        
        <!-- Scheduled Time -->
        <div v-else-if="match?.status === 'SCHEDULED'" class="mt-4 text-center">
           <div class="px-4 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-obsidian-400 uppercase tracking-widest">
             {{ formatTime(match?.matchDate) }}
           </div>
        </div>
      </div>

      <!-- Away Team -->
      <div class="flex flex-col items-center text-center w-full md:w-1/3">
        <div class="w-20 h-20 sm:w-28 sm:h-28 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
          <img v-if="match?.awayTeam?.logo" :src="match.awayTeam.logo" class="w-full h-full object-contain" />
          <Icon v-else name="lucide:shield" class="w-full h-full text-obsidian-700" />
        </div>
        <h3 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter leading-tight">{{ match?.awayTeam?.name || 'Visita' }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  match: Object,
  minuteFormatted: String
})

const statusText = computed(() => {
  if (props.match?.status === 'FINISHED') return 'Finalizado'
  if (props.match?.status === 'IN_PROGRESS') return 'Live'
  return ''
})

function formatTime(iso) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>
