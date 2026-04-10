<template>
  <q-layout view="lHh Lpr lFf" :class="$q.screen.lt.md ? 'mobile-dark-theme' : 'bg-slate-50'">
    <q-header v-if="!$q.screen.lt.md" class="glass text-white shadow-premium" height-hint="64" style="background: rgba(2, 6, 23, 0.8)">
      <q-toolbar class="q-py-md q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          color="emerald"
          class="q-mr-md"
        />
        <div class="text-h6 text-weight-bolder tracking-tighter text-white">
          Portal de Liga <span class="text-emerald text-h5">.</span>
        </div>
        <q-space />
        <q-btn
          color="emerald"
          label="Inscripción Abierta"
          no-caps
          unelevated
          class="text-weight-bold q-px-xl shadow-glow-emerald transition-base"
          style="border-radius: 12px"
        />
      </q-toolbar>
    </q-header>
    
    <q-header v-else class="transparent q-pa-md">
      <q-toolbar class="glass q-px-md shadow-premium" style="border-radius: 20px; min-height: 64px;">
        <q-btn flat round dense icon="las la-user-circle" color="emerald" class="q-ma-none" />
        <q-toolbar-title class="text-subtitle1 text-weight-bolder text-white q-ml-md tracking-tight">
          Portal Liga
        </q-toolbar-title>
        <q-btn flat round dense icon="las la-bell" color="slate-400" />
      </q-toolbar>
    </q-header>


    <q-drawer v-model="leftDrawerOpen" show-if-above :width="300" class="glass border-r" style="background: rgba(15, 23, 42, 0.95)">
      <div class="column full-height">
        <!-- Contenido Superior -->
        <div class="col">
          <div class="column flex-center q-pt-xl q-pb-lg text-center staggered-entrance">
            <!-- Logo / Icon -->
            <div class="mb-icon-box q-mb-md shadow-glow-emerald" style="width: 80px; height: 80px; border-radius: 24px">
              <q-icon name="las la-trophy" color="emerald" size="44px" />
            </div>

            <!-- Title -->
            <div class="text-white text-weight-bolder text-h5 q-mt-sm tracking-tighter">
              LIGA BARRIAL <span class="text-emerald">.</span>
            </div>

            <!-- Subtitle -->
            <div class="text-slate-400 text-subtitle2 q-mt-xs font-bold tracking-widest text-uppercase" style="font-size: 10px">Torneo Apertura 2026</div>
          </div>

          <q-separator class="q-mx-xl q-my-lg" style="background: rgba(255,255,255,0.05)" />

          <!-- Menú de Navegación -->
          <q-list class="q-px-sm q-mt-md">
            <!-- Sección Pública -->
            <div class="q-pb-lg">
              <div class="text-overline text-slate-400 q-px-lg q-mb-sm font-bold" style="font-size: 10px; letter-spacing: 1px">CENTRO DE INFORMACIÓN</div>
              <EssentialLink v-for="link in publicLinks" :key="link.title" v-bind="link" />
            </div>

            <!-- Sección Vocalía -->
            <div v-if="vocalLinks.length > 0" class="q-pb-lg">
              <div class="text-overline text-slate-400 q-px-lg q-mb-sm font-bold" style="font-size: 10px; letter-spacing: 1px">GESTIÓN DE CAMPO</div>
              <EssentialLink v-for="link in vocalLinks" :key="link.title" v-bind="link" />
            </div>

            <!-- Sección Admin -->
            <div v-if="adminLinks.length > 0" class="q-pb-lg">
              <div class="text-overline text-slate-400 q-px-lg q-mb-sm font-bold" style="font-size: 10px; letter-spacing: 1px">ADMINISTRACIÓN</div>
              <EssentialLink v-for="link in adminLinks" :key="link.title" v-bind="link" />
            </div>
          </q-list>
        </div>

        <!-- Botón Inferior Dinámico -->
        <div class="col-auto q-pa-xl">
          <template v-if="!authStore.isAuthenticated">
            <q-btn color="emerald" icon="las la-sign-in-alt" label="Iniciar Sesión" class="full-width text-weight-bold shadow-glow-emerald"
              size="16px" style="border-radius: 16px; height: 60px" unelevated
              @click="showLogin = true" />
          </template>
          <template v-else>
            <div class="column q-gutter-sm glass q-pa-lg" style="border-radius: 24px; border: 1px solid rgba(255,255,255,0.05)">
              <div class="row items-center no-wrap">
                <q-avatar size="48px" color="slate-800" text-color="emerald" icon="las la-user" class="q-mr-md shadow-soft" />
                <div class="column">
                  <div class="text-subtitle1 text-weight-bolder text-white tracking-tight">{{ authStore.user?.email.split('@')[0] }}</div>
                  <div class="text-caption text-emerald text-weight-bold text-uppercase" style="font-size: 9px">{{ authStore.userRole }}</div>
                </div>
              </div>
              <q-btn flat color="rose-4" icon="las la-power-off" label="Cerrar Sesión" class="full-width text-weight-bold q-mt-md"
                size="14px" style="border-radius: 12px" @click="authStore.logout()" />
            </div>
          </template>
        </div>
      </div>
    </q-drawer>

    <!-- Login Dialog -->
    <q-dialog v-model="showLogin" persistent transition-show="fade" transition-hide="fade">
      <q-card style="width: 420px; border-radius: 28px;" class="q-pa-xl shadow-premium">
        <q-card-section class="column items-center q-pb-xl">
          <div class="bg-emerald-50 q-mb-lg flex flex-center" style="width: 80px; height: 80px; border-radius: 24px">
            <q-icon name="lock_open" color="emerald" size="40px" />
          </div>
          <div class="text-h4 text-weight-bolder text-slate-900 tracking-tighter">Bienvenido</div>
          <div class="text-subtitle1 text-slate-500 q-mt-sm">Ingresa a tu cuenta para continuar</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleLogin" class="q-gutter-y-lg">
            <q-input v-model="loginForm.email" label="Correo Electrónico" stack-label outlined 
              placeholder="admin@liga.com" color="emerald" bg-color="slate-50" 
              input-class="text-weight-medium" style="border-radius: 16px">
              <template v-slot:prepend><q-icon name="las la-envelope" color="slate-400" /></template>
            </q-input>

            <q-input v-model="loginForm.password" label="Contraseña" stack-label type="password" outlined
              color="emerald" bg-color="slate-50" style="border-radius: 16px">
              <template v-slot:prepend><q-icon name="las la-key" color="slate-400" /></template>
            </q-input>

            <div class="q-pt-lg column q-gutter-y-sm">
              <q-btn :loading="authStore.loading" label="Acceder" type="submit" color="slate-900"
                class="full-width text-weight-bold shadow-soft" size="lg" unelevated
                style="border-radius: 16px; height: 56px" />
              <q-btn flat label="Regresar" color="slate-500" class="full-width text-weight-bold" 
                no-caps v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container :class="{ 'staggered-entrance': $q.screen.lt.md }">
      <router-view />
    </q-page-container>

    <q-footer v-if="$q.screen.lt.md" class="transparent q-pb-safe">
      <div class="row justify-around items-center q-py-sm relative-position">
        <div v-for="tab in tabs" :key="tab.id" class="column items-center">
          <q-btn flat round dense 
            :color="activeTab === tab.id ? 'mb-accent' : 'mb-subtext'" 
            :icon="tab.icon" 
            :class="{ 'icon-pop': activeTab === tab.id }"
            @click="activeTab = tab.id; tab.action ? tab.action() : $router.push(tab.link)" />
          <div v-if="activeTab === tab.id" class="active-pill bg-mb-accent"></div>
        </div>
      </div>
    </q-footer>
  </q-layout>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { linksList } from '../router/link-list.js'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)
const showLogin = ref(false)
const activeTab = ref('home')

const tabs = [
  { id: 'home', icon: 'home', link: '/' },
  { id: 'search', icon: 'explore', link: '/search' },
  { id: 'groups', icon: 'groups', link: '/groups' },
  { id: 'menu', icon: 'menu', link: '/menu' },
  { id: 'profile', icon: 'account_circle', link: '/profile' }
]



const loginForm = ref({
  email: '',
  password: ''
})

const publicLinks = computed(() => {
  const role = authStore.userRole
  return linksList.filter(link => link.roles.includes(role) && link.roles.includes('PUBLIC'))
})

const vocalLinks = computed(() => {
  const role = authStore.userRole
  return linksList.filter(link => link.roles.includes(role) && link.roles.includes('VOCAL') && !link.roles.includes('PUBLIC'))
})

const adminLinks = computed(() => {
  const role = authStore.userRole
  return linksList.filter(link => link.roles.includes(role) && link.roles.includes('SUPERADMIN') && !link.roles.includes('VOCAL'))
})

async function handleLogin() {
  const result = await authStore.login(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    showLogin.value = false
    $q.notify({
      color: 'emerald',
      message: 'Bienvenido de nuevo',
      icon: 'check_circle',
      position: 'top',
      classes: 'shadow-premium'
    })
  } else {
    $q.notify({
      color: 'rose-6',
      message: result.message,
      icon: 'error',
      position: 'top',
      classes: 'shadow-premium'
    })
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  authStore.init()
})
</script>

<style lang="scss" scoped>
.active-pill {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin-top: 2px;
  box-shadow: 0 0 10px var(--q-mb-accent);
}

.bg-mb-accent {
  background-color: var(--q-mb-accent);
}
</style>

