<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-content mb-2">
          Gestión de <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Torneos</span>
        </h1>
        <p class="text-content-muted">Organiza y supervisa tus campeonatos activos.</p>
      </div>
    </div>

    <!-- Empty State / Placeholder -->
    <div class="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-emerald-400 border border-primary/20 shadow-xl shadow-emerald-500/5">
        <Icon name="ph:trophy-duotone" class="text-4xl" />
      </div>
      <div class="max-w-md">
        <h3 class="text-xl font-bold text-content mb-2">Módulo en Desarrollo</h3>
        <p class="text-content-muted">
          Estamos preparando las herramientas para que puedas crear torneos, definir fases y gestionar tablas de posiciones automáticamente.
        </p>
      </div>
      <div class="flex gap-4">
        <button v-if="authStore.isAdmin" class="btn-primary flex items-center gap-2">
          <Icon name="ph:plus-bold" />
          Pre-configurar Torneo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  layout: 'default'
})
</script>
