<template>
  <div class="space-y-4">
    <div v-if="events.length === 0" class="text-center py-10 glass rounded-[2rem] border border-white/5">
      <Icon name="lucide:hourglass" class="w-8 h-8 text-obsidian-700 mb-2 mx-auto" />
      <p class="text-xs font-bold text-obsidian-600 uppercase tracking-widest">Esperando sucesos del partido...</p>
    </div>

    <div v-else class="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-emerald-500/50 before:via-white/5 before:to-emerald-500/50">
      <div 
        v-for="event in sortedEvents" 
        :key="event.id"
        class="relative group animate-fade-in"
      >
        <!-- Connector Dot -->
        <div 
          class="absolute -left-8 top-1.5 w-6 h-6 rounded-lg border-2 border-obsidian-900 flex items-center justify-center transition-all group-hover:scale-125 z-10"
          :class="getEventBg(event.type)"
        >
          <span class="text-xs">{{ emoji(event.type) }}</span>
        </div>

        <div class="glass p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
          <div class="flex items-center gap-4">
            <!-- Minute -->
            <div class="w-10 h-10 rounded-xl bg-obsidian-950/50 flex items-center justify-center border border-white/5">
              <span class="text-xs font-black text-emerald-400 font-mono">{{ event.minute }}'</span>
            </div>
            
            <!-- Context -->
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-obsidian-500 mb-0.5">{{ teamName(event.teamId) }}</p>
              <h4 class="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {{ event.type === 'SUBSTITUTION' ? 'Cambio' : event.type === 'GOAL' ? '¡GOL!' : 'Amonestación' }}
              </h4>
              <p class="text-xs text-obsidian-300">
                {{ playerName(event.playerId) }}
                <span v-if="event.relatedPlayerId" class="text-obsidian-500">
                   ↔ {{ playerName(event.relatedPlayerId) }}
                </span>
              </p>
            </div>
          </div>

          <!-- Team Logo Mini -->
          <div class="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <img v-if="teamLogo(event.teamId)" :src="teamLogo(event.teamId)" class="w-full h-full object-contain grayscale" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  events: { type: Array, default: () => [] },
  teams: { type: Array, default: () => [] },
  players: { type: Array, default: () => [] }
})

const sortedEvents = computed(() => [...props.events].sort((a, b) => (b.minute || 0) - (a.minute || 0)))

function emoji(type) {
  const map = { GOAL: '⚽', YELLOW_CARD: '🟨', RED_CARD: '🟥', SUBSTITUTION: '🔄', PLAYER_ENTRY: '🏃' }
  return map[type] || '📌'
}

function getEventBg(type) {
  const map = { 
    GOAL: 'bg-emerald-500', 
    YELLOW_CARD: 'bg-yellow-500', 
    RED_CARD: 'bg-rose-500', 
    SUBSTITUTION: 'bg-blue-500', 
    PLAYER_ENTRY: 'bg-emerald-400' 
  }
  return map[type] || 'bg-obsidian-800'
}

function teamName(id) { return props.teams.find(t => t.id === id)?.name || '' }
function teamLogo(id) { return props.teams.find(t => t.id === id)?.logo || '' }
function playerName(id) {
  const p = props.players.find(p => p.id === id)
  return p ? `${p.firstName} ${p.lastName}` : 'Desconocido'
}
</script>

<style scoped>
.glass {
  background: rgba(14, 20, 27, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
