<template>
  <q-page :class="$q.screen.lt.md ? 'q-pa-md mobile-dark-theme' : 'q-pa-xl premium-layout'">
    <!-- Desktop View (Existing) -->
    <template v-if="!$q.screen.lt.md">
      <!-- Header Section -->
      <AppPageHeader 
        title="Panel de Control" 
        :subtitle="`Hola, ${userName} 👋 Hoy es un buen día para gestionar la liga.`"
        overline="SISTEMA INTEGRAL DE GESTIÓN"
      >
        <template #actions>
          <q-btn color="slate-800" text-color="white" label="Reportes" icon="las la-file-alt" unelevated rounded padding="12px 24px" class="glass shadow-soft border-hover-emerald" />
          <q-btn color="emerald" label="Programar Partido" icon="las la-plus" unelevated rounded padding="12px 24px" class="text-weight-bold shadow-glow-emerald" @click="$router.push('/matches')" />
        </template>
      </AppPageHeader>

      <!-- KPI Cards Row -->
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.label">
          <KpiCard v-bind="stat" />
        </div>
      </div>

      <!-- Management Modules Grid -->
      <div class="row q-col-gutter-xl staggered-entrance">
        <div class="col-12 col-md-4" v-for="module in modules" :key="module.title">
          <q-card class="module-card glass shadow-premium cursor-pointer transition-base hover-pivot" flat v-ripple @click="$router.push(module.link)">
            <q-card-section class="q-pa-xl">
              <div class="mb-icon-box q-mb-xl">
                <q-icon :name="module.icon" size="32px" class="text-emerald" />
              </div>
              <div class="text-h5 text-weight-bolder text-white q-mb-md tracking-tight">{{ module.title }}</div>
              <p class="text-slate-400 font-medium leading-relaxed">{{ module.description }}</p>
              <div class="row items-center text-emerald text-weight-bold q-mt-xl">
                Configurar módulo <q-icon name="las la-arrow-right" size="xs" class="q-ml-sm" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>

    <!-- Mobile View (New) -->
    <template v-else>
      <div class="staggered-entrance">
        <div class="row items-center q-mb-lg">
          <div class="col">
            <div class="text-h5 text-weight-bolder tracking-tighter">Gestión de Liga</div>
            <div class="text-caption text-mb-subtext font-medium">Panel de control premium</div>
          </div>
          <q-btn flat round icon="notifications_none" color="mb-accent" class="mb-card q-ma-none" style="padding: 10px;" />
        </div>

        <div class="mb-search-bar glass-panel q-mb-xl">
          <q-icon name="search" size="xs" color="mb-subtext" />
          <span class="q-ml-sm">Buscar en la liga...</span>
          <q-space />
          <q-btn flat dense round icon="tune" size="sm" color="mb-accent" />
        </div>

        <div class="row items-center justify-between q-mb-md">
          <div class="text-weight-bold text-mb-subtext letter-spacing-1" style="font-size: 11px;">ESTADÍSTICAS EN VIVO</div>
          <div class="text-mb-accent text-caption font-bold">Ver todo</div>
        </div>
        
        <div class="horizontal-scroll-container q-mb-xl">
          <div v-for="stat in stats" :key="stat.label" class="mb-card q-pa-lg text-center shadow-glow" style="min-width: 150px;">
            <q-icon :name="stat.icon" color="mb-accent" size="md" class="q-mb-sm icon-pop" />
            <div class="text-h4 text-weight-bolder">{{ stat.value }}</div>
            <div class="text-caption text-mb-subtext">{{ stat.label }}</div>
          </div>
        </div>

        <div class="q-mb-md text-weight-bold text-mb-subtext letter-spacing-1" style="font-size: 11px;">MÓDULOS DEL SISTEMA</div>
        <div v-for="module in modules" :key="module.title" 
          class="mb-card row items-center no-wrap cursor-pointer q-mb-md" 
          v-ripple
          @click="$router.push(module.link)">
          <div class="mb-icon-box q-mr-md">
            <q-icon :name="module.icon" size="sm" />
          </div>
          <div class="col">
            <div class="text-weight-bold">{{ module.title }}</div>
            <div class="text-caption text-mb-subtext">Optimizar ahora</div>
          </div>
          <q-icon name="arrow_forward_ios" size="12px" color="mb-subtext" />
        </div>
      </div>
    </template>

  </q-page>
</template>


<script setup>
import { computed } from 'vue'
import KpiCard from 'components/KpiCard.vue'
import AppPageHeader from 'components/AppPageHeader.vue'
import { useLeagueStore } from 'src/stores/league'
import { useTeamStore } from 'src/stores/teamStore'
import { usePlayerStore } from 'src/stores/playerStore'
import { useMatchStore } from 'src/stores/matchStore'
import { useAuthStore } from 'src/stores/auth'

const leagueStore = useLeagueStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const matchStore = useMatchStore()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.email.split('@')[0] || 'Administrador')

const stats = computed(() => [
  { label: 'Sedes Activas', value: leagueStore.headquarters.length, icon: 'las la-building' },
  { label: 'Torneos', value: leagueStore.tournaments.length, icon: 'las la-trophy' },
  { label: 'Equipos', value: teamStore.teams.length, icon: 'las la-users' },
  { label: 'Jugadores', value: playerStore.players.length, icon: 'las la-user-tie' }
])

const modules = [
  { 
    title: 'Sedes y Ubicaciones', 
    description: 'Gestiona los recintos deportivos y sedes locales disponibles para el torneo.',
    icon: 'las la-building', 
    link: '/headquarters'
  },
  { 
    title: 'Estructura de Torneos', 
    description: 'Configura las fechas, categorías y reglamentos de los torneos activos.',
    icon: 'las la-trophy', 
    link: '/tournaments'
  },
  { 
    title: 'Usuarios y Permisos', 
    description: 'Administra las cuentas de vocales y otros administradores del sistema.',
    icon: 'las la-user-shield', 
    link: '/usuario'
  },
  { 
    title: 'Contenido de Inicio', 
    description: 'Modifica los banners, noticias y avisos de la página principal pública.',
    icon: 'las la-desktop', 
    link: '/inicio'
  },
  { 
    title: 'Equipos y Filtros', 
    description: 'Administra la nómina completa de equipos, grupos y categorías de la liga.',
    icon: 'las la-users-cog', 
    link: '/groups'
  },
  { 
    title: 'Personal de Arbitraje', 
    description: 'Gestione el staff de árbitros centrales y asistentes de la liga.',
    icon: 'las la-whistle', 
    link: '/referees'
  },
  { 
    title: 'Calendario Maestro', 
    description: 'Programa partidos, asigna canchas y gestiona el calendario general.',
    icon: 'las la-calendar', 
    link: '/matches'
  }
]
</script>

<style scoped>
.dashboard-kpi {
  border-radius: 24px;
  transition: all 0.3s ease;
}
.dashboard-kpi:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

.module-card {
  border-radius: 24px;
  transition: all 0.3s ease;
  height: 100%;
}
.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
