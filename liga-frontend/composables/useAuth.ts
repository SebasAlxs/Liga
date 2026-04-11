export interface User {
  id: string
  email: string
  role: 'SUPERADMIN' | 'VOCAL' | 'PUBLIC'
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  })
  
  const user = useCookie<User | null>('auth_user', {
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'SUPERADMIN')
  const isVocal = computed(() => user.value?.role === 'VOCAL')
  const userRole = computed(() => user.value?.role || 'PUBLIC')

  async function login(email: string, password: string) {
    try {
      const res: any = await $api('/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (res?.data?.token) {
        token.value = res.data.token
        user.value = res.data.user
        
        // Also sync to localStorage for $api helper in useApi.ts
        if (import.meta.client) {
          localStorage.setItem('auth_token', res.data.token)
        }
        
        return { success: true }
      }
      return { success: false, message: 'Respuesta inválida del servidor' }
    } catch (err: any) {
      console.error('Login error:', err)
      return { 
        success: false, 
        message: err.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
    }
    navigateTo('/login')
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    isVocal,
    userRole,
    login,
    logout
  }
}
