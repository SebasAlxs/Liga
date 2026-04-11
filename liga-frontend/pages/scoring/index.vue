<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div>
      <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">
        Mesa de <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Vocalía</span>
      </h1>
      <p class="text-slate-400">Registro de resultados, goles y eventos en tiempo real.</p>
    </div>

    <div class="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
        <Icon name="ph:clipboard-text-duotone" class="text-4xl" />
      </div>
      <div class="max-w-md">
        <h3 class="text-xl font-bold text-white mb-2">Hoja de Vocalía Digital</h3>
        <p class="text-slate-400">
          Este módulo permitirá a los vocales registrar incidencias de los partidos (goles, tarjetas, cambios) directamente desde la cancha.
        </p>
      </div>
      <button class="btn-primary">Iniciar Nueva Vocalía</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
