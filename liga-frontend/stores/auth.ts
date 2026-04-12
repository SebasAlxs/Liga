import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // useCookie persiste el token en cookie (accesible en SSR + cliente)
  const tokenCookie = useCookie<string | null>('auth_token', {
    default: () => null,
    maxAge: 60 * 60 * 24, // 1 día (igual que el JWT del backend)
    sameSite: 'lax'
  })

  // Usamos también cookie para el user, para que el SSR sepa el rol y no haya errores de hidratación
  const userCookie = useCookie<any>('auth_user', {
    default: () => null,
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })

  const user = ref<any>(userCookie.value)
  const loading = ref(false)

  const token = computed(() => tokenCookie.value)
  const isLoggedIn = computed(() => !!tokenCookie.value)
  const isAdmin = computed(() => user.value?.role === 'SUPERADMIN')
  const isVocal = computed(() => user.value?.role === 'VOCAL')

  // En el cliente, sincronizar si hay un cambio o si existe en localStorage
  if (import.meta.client) {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken && !tokenCookie.value) tokenCookie.value = savedToken

    const savedUser = localStorage.getItem('auth_user')
    if (savedUser && !userCookie.value) {
      const parsed = JSON.parse(savedUser)
      userCookie.value = parsed
      user.value = parsed
    }
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
      userCookie.value = result.user
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
    userCookie.value = null
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
