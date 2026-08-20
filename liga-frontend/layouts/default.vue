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

const allMenuItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', link: '/' },
  { label: 'Partidos', icon: 'lucide:calendar-check', link: '/matches' },
  { label: 'Equipos', icon: 'lucide:users-2', link: '/teams' },
  { label: 'Jugadores', icon: 'lucide:user-check', link: '/players' },
  { label: 'Posiciones', icon: 'lucide:list-ordered', link: '/standings' },
  { label: 'Vocalía', icon: 'lucide:clipboard-list', link: '/vocalia', hideFor: ['DIRIGENTE'] },
  { label: 'Configuración', icon: 'lucide:settings-2', link: '/settings' },
]

const menuItems = computed(() => allMenuItems.filter(item => !item.hideFor?.includes(authStore.user?.role)))

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-content relative overflow-x-hidden selection:bg-primary/30 selection:text-emerald-800">
    <template v-if="isMounted">
      <!-- Minimalist Light Layout -->

      <!-- Sidebar Wrapper (Desktop only - Admin Only) -->
      <aside 
        v-if="!isMobile && authStore.isLoggedIn"
        :class="[
          'fixed top-0 left-0 z-50 h-full transition-all duration-300 bg-surface border-r border-border shadow-xl shadow-border/50',
          isSidebarOpen ? 'w-72' : 'w-20'
        ]"
      >
        <div class="flex flex-col h-full py-6 px-4">
          <!-- Logo Section -->
          <div class="flex items-center gap-4 mb-10 px-2 mt-4">
            <div class="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Icon name="lucide:trophy" class="text-xl text-emerald-400" />
            </div>
            <div v-show="isSidebarOpen" class="transition-opacity duration-300 overflow-hidden">
              <h1 class="text-xl font-display tracking-wider leading-none text-content">
                Liga<span class="text-primary">.</span>
              </h1>
              <p class="text-[10px] text-content-muted font-bold uppercase tracking-widest mt-1">Admin</p>
            </div>
          </div>

          <!-- Nav Links -->
          <nav class="flex-1 space-y-2 overflow-y-auto">
            <template v-for="item in menuItems" :key="item.label">
              <NuxtLink 
                :to="item.link"
                class="flex items-center gap-4 p-3.5 rounded-xl group transition-all duration-300 hover:bg-background"
                :class="{ 'bg-emerald-50 border border-emerald-100': $route.path === item.link }"
              >
                <Icon 
                  :name="item.icon" 
                  class="text-xl transition-colors" 
                  :class="$route.path === item.link ? 'text-primary' : 'text-content-muted group-hover:text-primary'"
                />
                <span v-show="isSidebarOpen" class="text-sm font-semibold whitespace-nowrap transition-colors"
                  :class="$route.path === item.link ? 'text-emerald-700' : 'text-content-muted group-hover:text-emerald-700'">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </template>
          </nav>

          <!-- Logout & Toggle Section -->
          <div class="space-y-2 pt-4 border-t border-border mt-4">
            <button 
              @click="handleLogout"
              class="w-full flex items-center gap-4 p-3.5 rounded-xl group transition-all duration-300 hover:bg-red-50 text-content-muted hover:text-red-600"
            >
              <Icon 
                name="lucide:log-out" 
                class="text-xl" 
              />
              <span v-show="isSidebarOpen" class="text-sm font-semibold">Salir</span>
            </button>

            <button 
              @click="isSidebarOpen = !isSidebarOpen"
              class="w-full p-3.5 rounded-xl hover:bg-background flex items-center gap-4 group transition-all duration-300 text-content-muted hover:text-content"
            >
              <Icon 
                :name="isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'" 
                class="text-xl" 
              />
              <span v-show="isSidebarOpen" class="text-sm font-semibold">Colapsar</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Container -->
      <div class="transition-all duration-300 min-h-screen">
        <!-- Public Header -->
        <header 
          v-if="!authStore.isLoggedIn"
          class="fixed top-0 left-0 w-full z-40 h-20 flex items-center justify-between px-6 sm:px-12 bg-emerald-600 border-b border-primary shadow-md"
        >
          <!-- Public Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface/20 border border-border/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Icon name="lucide:trophy" class="text-xl text-content" />
            </div>
            <span class="text-xl font-display tracking-wider text-content">Liga<span class="text-emerald-200">.</span></span>
          </NuxtLink>

          <!-- Public Nav Links (Desktop) -->
          <nav class="hidden md:flex items-center gap-10">
            <NuxtLink to="/" class="text-sm font-semibold text-emerald-50 hover:text-content transition-colors">Inicio</NuxtLink>
            <NuxtLink to="/matches" class="text-sm font-semibold text-emerald-50 hover:text-content transition-colors">Partidos</NuxtLink>
            <NuxtLink to="/teams" class="text-sm font-semibold text-emerald-50 hover:text-content transition-colors">Equipos</NuxtLink>
            <NuxtLink to="/standings" class="text-sm font-semibold text-emerald-50 hover:text-content transition-colors">Posiciones</NuxtLink>
          </nav>

          <!-- Login Button -->
          <NuxtLink to="/login" class="bg-surface hover:bg-background text-emerald-700 px-6 py-2.5 rounded-full font-bold transition-colors flex items-center gap-2 text-sm shadow-md">
            <Icon name="lucide:user" class="w-4 h-4" />
            <span class="hidden sm:inline">Iniciar Sesión</span>
          </NuxtLink>
        </header>

        <!-- Admin Header Bar -->
        <header 
          v-else
          class="fixed top-0 right-0 left-0 z-40 h-20 flex items-center justify-between transition-all px-6 sm:px-8 bg-emerald-600 border-b border-primary shadow-md" 
          :class="isMobile ? '' : (isSidebarOpen ? 'left-72' : 'left-20')"
        >
          <div v-if="!isMobile" class="flex items-center gap-3 bg-black/10 px-4 py-2.5 rounded-full border border-black/5 focus-within:border-black/10 focus-within:bg-black/20 transition-colors w-80">
            <Icon name="lucide:search" class="text-lg text-emerald-100" />
            <input type="text" placeholder="Buscar..." class="bg-transparent border-none outline-none text-sm font-medium w-full text-content placeholder:text-emerald-200" />
          </div>
          
          <div v-else class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface/20 border border-border/30 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <Icon name="lucide:trophy" class="text-xl text-content" />
            </div>
            <span class="text-xl font-display tracking-wider text-content">Liga<span class="text-emerald-200">.</span></span>
          </div>
          
          <div class="flex items-center gap-4 sm:gap-6">
            <button v-if="isMobile" @click="handleLogout" class="p-2 rounded-full hover:bg-black/10 text-emerald-50 hover:text-content transition-colors">
               <Icon name="lucide:log-out" class="text-xl" />
            </button>
            <button class="relative p-2 rounded-full hover:bg-black/10 text-emerald-50 hover:text-content transition-colors">
              <Icon name="lucide:bell" class="text-xl" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-emerald-600 shadow-sm"></span>
            </button>
            
            <div class="flex items-center gap-3 pl-4 sm:pl-6 border-l border-primary">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-content leading-none mb-1">{{ authStore.user?.email?.split('@')[0] ?? 'Admin' }}</p>
                <p class="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">{{ authStore.user?.role ?? 'SUPERADMIN' }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-primary font-display text-lg">
                {{ (authStore.user?.email?.[0] ?? 'A').toUpperCase() }}
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main 
          class="flex-1 transition-all duration-300 pt-20 pb-24 md:pb-8 min-h-screen" 
          :class="!authStore.isLoggedIn ? '' : (isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-72' : 'ml-20'))"
        >
          <NuxtPage />
        </main>
      </div>

      <MobileNav v-if="isMobile && authStore.isLoggedIn" />
      
      <!-- Public Mobile Navigation (If not logged in) -->
      <nav v-else-if="isMobile && !authStore.isLoggedIn" class="fixed bottom-0 left-0 w-full z-40 bg-emerald-600 border-t border-primary px-6 py-4 flex justify-around shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 text-emerald-100 hover:text-content" active-class="text-content">
          <Icon name="lucide:home" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Inicio</span>
        </NuxtLink>
        <NuxtLink to="/matches" class="flex flex-col items-center gap-1 text-emerald-100 hover:text-content" active-class="text-content">
          <Icon name="lucide:calendar" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Partidos</span>
        </NuxtLink>
        <NuxtLink to="/standings" class="flex flex-col items-center gap-1 text-emerald-100 hover:text-content" active-class="text-content">
          <Icon name="lucide:list-ordered" class="text-xl" />
          <span class="text-[10px] font-bold uppercase tracking-widest">Tablas</span>
        </NuxtLink>
      </nav>
    </template>
    
    <!-- Loading State for Hydration -->
    <div v-else class="min-h-screen flex items-center justify-center bg-background">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  </div>
</template>
