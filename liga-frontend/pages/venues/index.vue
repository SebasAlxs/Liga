<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div>
      <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">
        Sedes y <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Escenarios</span>
      </h1>
      <p class="text-slate-400">Gestiona las canchas y complejos deportivos donde se juegan los partidos.</p>
    </div>

    <div class="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
        <Icon name="ph:map-pin-duotone" class="text-4xl" />
      </div>
      <div class="max-w-md">
        <h3 class="text-xl font-bold text-white mb-2">Módulo de Sedes</h3>
        <p class="text-slate-400">
          Aquí podrás registrar las sedes, su ubicación y disponibilidad para la programación de la fecha.
        </p>
      </div>
      <button v-if="authStore.isAdmin" class="btn-primary">Registrar Nueva Sede</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  layout: 'default'
})
</script>
