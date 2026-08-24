import { useAuthStore } from '~/stores/auth'
import { useModuleAccessStore, MODULE_CATALOG } from '~/stores/moduleAccess'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const moduleAccessStore = useModuleAccessStore()

  // Wait for auth initialization if needed (usually handled by app.vue, but just in case)
  // If not logged in, we only allow public routes.
  const publicRoutes = ['/login', '/', '/matches', '/teams', '/standings']
  
  if (!authStore.isLoggedIn) {
    if (!publicRoutes.includes(to.path)) {
      return navigateTo('/login')
    }
    return
  }

  // If they are logged in, make sure their modules are loaded so we can check access
  if (!moduleAccessStore.loaded) {
    await moduleAccessStore.fetchMyModules()
  }

  // Allow Super Admin to access the special /admin/modules page
  if (to.path === '/admin/modules' && authStore.isSuperAdmin) {
    return
  }

  // Find the module corresponding to this route
  const targetModule = MODULE_CATALOG.find(m => to.path.startsWith(m.link) && m.link !== '/')
  
  // If the route belongs to a module and the user doesn't have access, redirect to dashboard
  if (targetModule && !moduleAccessStore.isVisible(targetModule.key)) {
    return navigateTo('/')
  }
})
