import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.role === 'SUPERADMIN',
    isVocal: (state) => state.user?.role === 'VOCAL' || state.user?.role === 'SUPERADMIN',
    userRole: (state) => state.user?.role || 'PUBLIC'
  },

  actions: {
    async login(email, password) {
      this.loading = true
      try {
        const response = await api.post('/api/auth/login', { email, password })
        const { user, token } = response.data.data
        
        this.user = user
        this.token = token
        
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        
        // Set default header for axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al iniciar sesión' 
        }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/' // Redirect to home
    },

    init() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    }
  }
})
