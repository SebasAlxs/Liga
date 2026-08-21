<template>
  <nav class="fixed bottom-0 left-0 right-0 z-[60] pb-safe-area">
    <!-- Blur Background -->
    <div class="absolute inset-x-0 bottom-0 h-24 bg-background backdrop-blur-2xl border-t border-border/5"></div>
    
    <!-- Nav Items -->
    <div class="relative flex items-center justify-around h-16 px-4">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.label"
        :to="item.link"
        class="flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative group"
        :class="{ 'text-primary': $route.path === item.link, 'text-content-muted': $route.path !== item.link }"
      >
        <!-- Active Indicator Dot -->
        <span 
          v-if="$route.path === item.link"
          class="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
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
import { MODULE_CATALOG } from '~/stores/moduleAccess'

// Subconjunto de módulos con etiquetas cortas para la barra móvil.
// Sigue las mismas claves que el catálogo, así que respeta la visibilidad por rol.
const MOBILE_LABELS = {
  dashboard: 'Inicio',
  matches: 'Partidos',
  teams: 'Equipos',
  standings: 'Stats',
  settings: 'Ajustes',
}
const MOBILE_KEYS = Object.keys(MOBILE_LABELS)

const moduleAccessStore = useModuleAccessStore()

const navItems = computed(() =>
  MODULE_CATALOG
    .filter(item => MOBILE_KEYS.includes(item.key) && moduleAccessStore.isVisible(item.key))
    .sort((a, b) => MOBILE_KEYS.indexOf(a.key) - MOBILE_KEYS.indexOf(b.key))
    .map(item => ({ ...item, label: MOBILE_LABELS[item.key] }))
)
</script>

<style scoped>
.pb-safe-area {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
