<template>
  <nav class="fixed bottom-0 left-0 right-0 z-[60] pb-safe-area">
    <!-- Blur Background -->
    <div class="absolute inset-x-0 bottom-0 h-24 bg-obsidian-950/80 backdrop-blur-2xl border-t border-white/5"></div>
    
    <!-- Nav Items -->
    <div class="relative flex items-center justify-around h-16 px-4">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.label"
        :to="item.link"
        class="flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative group"
        :class="{ 'text-emerald-500': $route.path === item.link, 'text-obsidian-500': $route.path !== item.link }"
      >
        <!-- Active Indicator Dot -->
        <span 
          v-if="$route.path === item.link"
          class="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        ></span>
        
        <Icon 
          :name="item.icon" 
          class="text-2xl transition-transform group-active:scale-90"
        />
        <span class="text-[9px] font-black uppercase tracking-widest">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { label: 'Inicio', icon: 'lucide:layout-dashboard', link: '/' },
  { label: 'Partidos', icon: 'lucide:calendar-check', link: '/matches' },
  { label: 'Equipos', icon: 'lucide:users-2', link: '/teams' },
  { label: 'Stats', icon: 'lucide:bar-chart-3', link: '/standings' },
  { label: 'Ajustes', icon: 'lucide:settings-2', link: '/settings' },
]
</script>

<style scoped>
.pb-safe-area {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
