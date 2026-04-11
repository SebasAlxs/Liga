import type { UseFetchOptions } from '#app'

export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/_backend'

  // useCookie es accesible en cualquier contexto Nuxt (SSR + cliente)
  const tokenCookie = useCookie<string | null>('auth_token')
  // Fallback a localStorage si la cookie no está disponible (compatibilidad)
  const token = tokenCookie.value ?? (import.meta.client ? localStorage.getItem('auth_token') : null)

  return useFetch(url, {
    baseURL,
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    },
    onResponse({ response }) {
      if (!response._data && response.status >= 400) {
        console.error('API Error:', response.statusText)
      }
    }
  })
}

// Helper para acciones imperativas (POST, PUT, DELETE)
// Base URL hardcodeada para evitar problemas de contexto fuera de setup.
export const $api = (url: string, options: any = {}) => {
  const token = import.meta.client ? localStorage.getItem('auth_token') : null

  return $fetch(url, {
    baseURL: '/_backend',
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })
}
