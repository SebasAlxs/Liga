// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/_backend'
    }
  },
  routeRules: {
    // Proxear la API usando un prefijo único para evitar colisiones con Nuxt
    '/_backend/**': { proxy: 'http://localhost:4000/api/**' }
  },
  app: {
    head: {
      title: 'Portal de Liga - Premium Management',
      meta: [
        { name: 'description', content: 'Sistema integral de gestión de ligas barriales.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@400;500;600;700&display=swap', crossorigin: 'anonymous' }
      ]
    }
  }
})
