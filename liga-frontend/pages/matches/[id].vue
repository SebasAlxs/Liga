<template>
  <div class="page-container p-6 min-h-screen">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="w-10 h-10 text-emerald-500 animate-spin mb-4" />
      <p class="text-obsidian-500 font-bold uppercase tracking-widest text-xs">Cargando transmisión en vivo...</p>
    </div>

    <div v-else-if="!v.activeMatch.value" class="text-center py-20">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-rose-500 mb-4 mx-auto" />
      <h1 class="text-2xl font-black text-white uppercase tracking-tighter">Partido no encontrado</h1>
      <NuxtLink to="/" class="mt-6 inline-block px-6 py-2 rounded-xl bg-emerald-500 text-obsidian-950 font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-lg shadow-emerald-500/20">
        Volver al inicio
      </NuxtLink>
    </div>

    <div v-else class="animate-fade-in max-w-7xl mx-auto space-y-8">
      
      <!-- Public Scoreboard -->
      <section>
        <MatchScoreboard 
          :match="v.activeMatch.value" 
          :minute-formatted="v.matchMinuteFormatted.value" 
        />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Live Pitch (Tactical) -->
        <div class="lg:col-span-8">
          <div class="flex items-center justify-between mb-4 px-2">
             <h2 class="text-xs font-black text-obsidian-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Campo de Juego Virtual
             </h2>
          </div>
          <SoccerField 
            :home-starters="v.homeActiveLineup.value"
            :away-starters="v.awayActiveLineup.value"
            :is-mobile="isMobile"
            :clickable="false"
            :stats-map="statsMap"
          />
        </div>

        <!-- Sidebar: Info & Timeline -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Action Summary -->
          <div class="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-5">
              <Icon name="lucide:activity" class="text-6xl text-emerald-500" />
            </div>
            <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon name="lucide:history" class="text-emerald-500" /> Historial de Jugadas
            </h3>
            
            <MatchTimeline 
              :events="v.events.value"
              :teams="teamStore.teams"
              :players="playerStore.players"
            />
          </div>

          <!-- Quick Return -->
          <NuxtLink to="/" class="flex items-center justify-center gap-2 w-full py-4 rounded-3xl bg-white/5 border border-white/10 text-obsidian-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
            <Icon name="lucide:chevron-left" class="w-4 h-4" /> Ver otros partidos
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const v = useVocalia()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()

const loading = ref(true)
const isMobile = ref(false)

// Organize stats for field indicators
const statsMap = computed(() => {
  const map = {}
  v.events.value.forEach(ev => {
    if (!ev.playerId) return
    if (!map[ev.playerId]) map[ev.playerId] = { GOAL: 0, YELLOW_CARD: 0, RED_CARD: 0 }
    if (ev.type === 'GOAL') map[ev.playerId].GOAL++
    if (ev.type === 'YELLOW_CARD') map[ev.playerId].YELLOW_CARD++
    if (ev.type === 'RED_CARD') map[ev.playerId].RED_CARD++
  })
  return map
})

onMounted(async () => {
  isMobile.value = window.innerWidth < 768
  loading.value = true
  
  // Ensure basic data is loaded
  await Promise.all([
    teamStore.fetchTeams(),
    playerStore.fetchPlayers()
  ])
  
  // Load match specifics
  await v.selectMatch(route.params.id)
  
  loading.value = false
})
</script>

<style scoped>
.glass {
  background: rgba(14, 20, 27, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
