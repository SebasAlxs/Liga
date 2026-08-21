<template>
  <div class="relative overflow-hidden rounded-[2.5rem] bg-surface border border-border/5 group shadow-2xl">
    <!-- Abstract BG -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50"></div>
    
    <div class="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
      <!-- Home Team -->
      <div class="flex flex-col items-center text-center w-full md:w-1/3">
        <div class="w-20 h-20 sm:w-28 sm:h-28 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
          <img v-if="match?.homeTeam?.logo" :src="match.homeTeam.logo" class="w-full h-full object-contain" />
          <Icon v-else name="lucide:shield" class="w-full h-full text-content-muted" />
        </div>
        <h3 class="text-lg sm:text-xl font-black text-content uppercase tracking-tighter leading-tight">{{ match?.homeTeam?.name || 'Local' }}</h3>
      </div>

        <!-- Scoreboard Center -->
      <div class="flex flex-col items-center w-full md:w-1/3 shrink-0 relative z-10">
        <div class="flex items-center justify-center gap-4 sm:gap-8 py-5 px-10 rounded-[2.5rem] bg-obsidian-950/80 backdrop-blur-2xl border border-border/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:border-primary/30 transition-all min-w-[280px]">
          <div class="flex flex-col items-center">
            <span class="text-5xl sm:text-7xl font-black text-content tabular-nums tracking-tighter"
              :class="{ 'text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]': (match?.homeScore ?? 0) > (match?.awayScore ?? 0) }"
            >{{ match?.homeScore ?? 0 }}</span>
          </div>
          <div class="flex flex-col items-center gap-1">
             <span class="text-xl sm:text-3xl text-content-muted/50 font-black tracking-widest">-</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-5xl sm:text-7xl font-black text-content tabular-nums tracking-tighter"
              :class="{ 'text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]': (match?.awayScore ?? 0) > (match?.homeScore ?? 0) }"
            >{{ match?.awayScore ?? 0 }}</span>
          </div>
        </div>

        <!-- Chronometer -->
        <div v-if="minuteFormatted" class="mt-6 flex flex-col items-center gap-2">
          <div class="flex items-center gap-3 px-6 py-2 rounded-full bg-obsidian-900 border border-border/20 shadow-xl">
            <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
            <span class="text-lg font-black text-content font-mono tracking-widest">{{ minuteFormatted }}</span>
          </div>
          <div class="text-[11px] uppercase font-black tracking-[0.4em] text-rose-500 animate-pulse mt-1">
            {{ statusText }}
          </div>
        </div>
        
        <!-- Scheduled Time -->
        <div v-else-if="match?.status === 'SCHEDULED'" class="mt-6 text-center">
           <div class="px-6 py-2 rounded-xl bg-surface border border-border/10 text-sm font-black text-content-muted uppercase tracking-widest shadow-lg">
             {{ formatTime(match?.matchDate) }}
           </div>
        </div>
      </div>

      <!-- Away Team -->
      <div class="flex flex-col items-center text-center w-full md:w-1/3">
        <div class="w-20 h-20 sm:w-28 sm:h-28 mb-4 drop-shadow-2xl transition-transform group-hover:scale-105">
          <img v-if="match?.awayTeam?.logo" :src="match.awayTeam.logo" class="w-full h-full object-contain" />
          <Icon v-else name="lucide:shield" class="w-full h-full text-content-muted" />
        </div>
        <h3 class="text-lg sm:text-xl font-black text-content uppercase tracking-tighter leading-tight">{{ match?.awayTeam?.name || 'Visita' }}</h3>
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
