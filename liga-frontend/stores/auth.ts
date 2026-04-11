import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // useCookie persiste el token en cookie (accesible en SSR + cliente)
  const tokenCookie = useCookie<string | null>('auth_token', {
    default: () => null,
    maxAge: 60 * 60 * 24, // 1 día (igual que el JWT del backend)
    sameSite: 'lax'
  })

  const user = ref<any>(null)
  const loading = ref(false)

  const token = computed(() => tokenCookie.value)
  const isLoggedIn = computed(() => !!tokenCookie.value)
  const isAdmin = computed(() => user.value?.role === 'SUPERADMIN')
  const isVocal = computed(() => user.value?.role === 'VOCAL')

  // Hidratar desde localStorage en el cliente
  if (import.meta.client) {
    // Migrar token de localStorage a cookie si aún no está en cookie
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken && !tokenCookie.value) {
      tokenCookie.value = savedToken
    }
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) user.value = JSON.parse(savedUser)
  }

  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    try {
      const response: any = await $api('/auth/login', {
        method: 'POST',
        body: credentials
      })

      const result = response?.data
      if (!result) throw new Error('Respuesta inválida del servidor')

      // Guardar token en cookie (SSR) y localStorage (fallback para $api client-side)
      tokenCookie.value = result.token
      user.value = result.user

      if (import.meta.client) {
        localStorage.setItem('auth_token', result.token)
        localStorage.setItem('auth_user', JSON.stringify(result.user))
      }
      return { success: true }
    } catch (err: any) {
      console.error('Login failed:', err)
      const message = err?.data?.message || err?.message || 'Credenciales incorrectas'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    tokenCookie.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    navigateTo('/login')
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    isAdmin,
    isVocal,
    login,
    logout
  }
})
