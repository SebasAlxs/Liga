<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse duration-700"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/20 mb-6 group hover:rotate-12 transition-all duration-500">
          <Icon name="lucide:trophy" class="w-10 h-10 text-obsidian-950" />
        </div>
        <h1 class="text-4xl font-black text-content tracking-tighter mb-2">LIGA MASTER</h1>
        <p class="text-content-muted text-sm font-medium tracking-widest uppercase">Panel de Gestión</p>
      </div>

      <!-- Login Form -->
      <div class="bg-surface/5 backdrop-blur-2xl rounded-[3rem] border border-border/10 p-8 shadow-2xl relative">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-content-muted mb-2 ml-1">Correo Electrónico</label>
            <div class="relative group">
              <Icon name="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted group-focus-within:text-emerald-400 transition-colors" />
              <input 
                v-model="form.email"
                type="email" 
                required
                placeholder="usuario@liga.com"
                class="w-full bg-surface border border-border/5 rounded-2xl py-4 pl-12 pr-4 text-content text-sm placeholder:text-content-muted focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-content-muted mb-2 ml-1">Contraseña</label>
            <div class="relative group">
              <Icon name="lucide:lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted group-focus-within:text-emerald-400 transition-colors" />
              <input 
                v-model="form.password"
                type="password" 
                required
                placeholder="••••••••"
                class="w-full bg-surface border border-border/5 rounded-2xl py-4 pl-12 pr-4 text-content text-sm placeholder:text-content-muted focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div v-if="error" class="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 animate-head-shake">
            <Icon name="lucide:alert-circle" class="w-5 h-5 text-rose-500 flex-shrink-0" />
            <p class="text-xs font-bold text-rose-200">{{ error }}</p>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian-950 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <!-- Tooltip / Hint -->
        <div class="mt-8 pt-6 border-t border-border/5 text-center">
          <p class="text-xs text-content-muted font-medium italic">Solo personal autorizado puede acceder al panel de vocalía y gestión administrativa.</p>
        </div>
      </div>

      <div class="mt-8 flex justify-center gap-6">
        <NuxtLink to="/" class="text-xs font-black text-content-muted hover:text-content transition-colors uppercase tracking-widest flex items-center gap-2 group">
          <Icon name="lucide:eye" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          Ver como Público
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const form = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const res = await authStore.login({ email: form.email, password: form.password })
    if (res.success) {
      navigateTo('/')
    } else {
      error.value = res.message
    }
  } catch (err) {
    error.value = 'Error inesperado al intentar iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes head-shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
.animate-head-shake {
  animation: head-shake 0.4s ease-in-out;
}
</style>
