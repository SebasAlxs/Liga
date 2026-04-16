<script setup>
import { useWindowSize } from '@vueuse/core'
import MobileNav from '~/components/layout/MobileNav.vue'

const isSidebarOpen = ref(true)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const authStore = useAuthStore()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

// Auto-close sidebar on mobile
watchEffect(() => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
})

const menuItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', link: '/' },
  { label: 'Partidos', icon: 'lucide:calendar-check', link: '/matches' },
  { label: 'Equipos', icon: 'lucide:users-2', link: '/teams' },
  { label: 'Jugadores', icon: 'lucide:user-check', link: '/players' },
  { label: 'Posiciones', icon: 'lucide:list-ordered', link: '/standings' },
  { label: 'Vocalía', icon: 'lucide:clipboard-list', link: '/vocalia' },
  { label: 'Configuración', icon: 'lucide:settings-2', link: '/settings' },
]

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-obsidian-950 font-sans text-slate-50 relative overflow-x-hidden">
    <template v-if="isMounted">
      <!-- Background Accents -->
      <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <!-- Sidebar Wrapper (Desktop only - Admin Only) -->
      <aside 
        v-if="!isMobile && authStore.isLoggedIn"
        :class="[
          'fixed top-0 left-0 z-50 h-full transition-all duration-500 glass border-r border-white/5',
          isSidebarOpen ? 'w-72' : 'w-20'
        ]"
      >
        <div class="flex flex-col h-full p-4">
          <!-- Logo Section -->
          <div class="flex items-center gap-4 mb-12 px-2">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Icon name="lucide:trophy" class="text-2xl text-obsidian-950" />
            </div>
            <div v-show="isSidebarOpen" class="transition-opacity duration-300">
              <h1 class="text-xl font-black tracking-tighter uppercase leading-none">
                Liga <span class="text-emerald-500">.</span>
              </h1>
              <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            <template v-for="item in menuItems" :key="item.label">
              <NuxtLink 
                :to="item.link"
                class="flex items-center gap-4 p-4 rounded-2xl group transition-all duration-300 hover:bg-white/5"
                :class="{ 'bg-emerald-500/10 text-emerald-400': $route.path === item.link }"
              >
                <Icon 
                  :name="item.icon" 
                  class="text-2xl transition-transform group-hover:scale-110" 
                  :class="$route.path === item.link ? 'text-emerald-500' : 'text-slate-400'"
                />
                <span v-show="isSidebarOpen" class="font-bold tracking-tight whitespace-nowrap">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </template>
          </nav>

          <!-- Logout & Toggle Section -->
          <div class="space-y-2 pt-4 border-t border-white/5">
            <button 
              @click="handleLogout"
              class="w-full flex items-center gap-4 p-4 rounded-2xl group transition-all duration-300 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
            >
              <Icon 
                name="lucide:log-out" 
                class="text-2xl transition-transform group-hover:scale-110" 
              />
              <span v-show="isSidebarOpen" class="font-bold tracking-tight">Cerrar Sesión</span>
            </button>

            <button 
              @click="isSidebarOpen = !isSidebarOpen"
              class="w-full p-4 rounded-2xl hover:bg-white/5 flex items-center gap-4 group transition-all duration-300"
            >
              <Icon 
                :name="isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'" 
                class="text-2xl text-slate-400 group-hover:text-emerald-500" 
              />
              <span v-show="isSidebarOpen" class="font-bold tracking-tight text-slate-400">Colapsar</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main 
        :class="[
          'transition-all duration-500 min-h-screen pt-20',
          !authStore.isLoggedIn ? 'px-4 sm:px-8 pb-12' : (isMobile ? 'pb-32 px-4' : (isSidebarOpen ? 'pl-80 pr-8 pb-12' : 'pl-28 pr-8 pb-12'))
        ]"
      >
        <!-- Public Header -->
        <header 
          v-if="!authStore.isLoggedIn"
          class="fixed top-0 left-0 w-full z-40 h-20 flex items-center justify-between px-4 sm:px-8 bg-black/10 backdrop-blur-md border-b border-white/5"
        >
          <!-- Public Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Icon name="lucide:trophy" class="text-xl text-obsidian-950" />
            </div>
            <span class="text-lg font-black tracking-tighter uppercase whitespace-nowrap">Liga <span class="text-emerald-500">.</span></span>
          </NuxtLink>

          <!-- Public Nav Links (Desktop) -->
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink to="/" class="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-widest">Inicio</NuxtLink>
            <NuxtLink to="/matches" class="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-widest">Partidos</NuxtLink>
            <NuxtLink to="/teams" class="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-widest">Equipos</NuxtLink>
            <NuxtLink to="/standings" class="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-widest">Posiciones</NuxtLink>
          </nav>

          <!-- Login Button -->
          <NuxtLink to="/login" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Icon name="lucide:log-in" class="w-4 h-4" />
            <span class="hidden sm:inline">Iniciar Sesión</span>
          </NuxtLink>
        </header>

        <!-- Admin Header Bar -->
        <header 
          v-else
          class="fixed top-0 right-0 z-40 h-20 flex items-center justify-between transition-all px-4 sm:px-8 bg-black/10 backdrop-blur-md border-b border-white/5" 
          :class="isMobile ? 'left-0' : (isSidebarOpen ? 'left-72' : 'left-20')"
        >
          <div v-if="!isMobile" class="flex items-center gap-4">
            <Icon name="lucide:search" class="text-xl text-slate-400" />
            <input type="text" placeholder="Buscar en la liga..." class="bg-transparent border-none outline-none text-sm font-medium w-64 text-slate-200 placeholder:text-slate-500" />
          </div>
          
          <div v-else class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Icon name="lucide:trophy" class="text-lg text-obsidian-950" />
            </div>
            <span class="text-sm font-black tracking-tighter uppercase whitespace-nowrap">Liga <span class="text-emerald-500">.</span></span>
          </div>
          
          <div class="flex items-center gap-4 sm:gap-6">
            <button v-if="isMobile" @click="handleLogout" class="relative p-2 rounded-xl hover:bg-rose-500/10 transition-colors text-slate-400 hover:text-rose-400">
               <Icon name="lucide:log-out" class="text-xl" />
            </button>
            <button class="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Icon name="lucide:bell" class="text-xl text-slate-400" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </button>
            
            <div class="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold tracking-tight leading-none mb-1">{{ authStore.user?.email?.split('@')[0] ?? 'Admin' }}</p>
                <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{{ authStore.user?.role ?? 'SUPERADMIN' }}</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-obsidian-800 border border-white/5 flex items-center justify-center">
                <Icon name="lucide:user" class="text-xl text-emerald-400" />
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content View -->
        <div class="animate-fade-up">
          <slot />
        </div>
      </main>

      <!-- Mobile Navigation (Only for logged in users) -->
      <MobileNav v-if="isMobile && authStore.isLoggedIn" />
      
      <!-- Public Mobile Navigation (If not logged in) -->
      <nav v-else-if="isMobile && !authStore.isLoggedIn" class="fixed bottom-0 left-0 w-full z-40 bg-obsidian-900/90 backdrop-blur-md border-t border-white/5 px-6 py-4 flex justify-around">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-400" active-class="text-emerald-500">
          <Icon name="lucide:home" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Inicio</span>
        </NuxtLink>
        <NuxtLink to="/matches" class="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-400" active-class="text-emerald-500">
          <Icon name="lucide:calendar" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Partidos</span>
        </NuxtLink>
        <NuxtLink to="/standings" class="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-400" active-class="text-emerald-500">
          <Icon name="lucide:list-ordered" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Tablas</span>
        </NuxtLink>
      </nav>
    </template>
    
    <!-- Loading State for Hydration -->
    <div v-else class="min-h-screen flex items-center justify-center bg-obsidian-950">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  </div>
</template>
