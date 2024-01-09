import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import NotFound from '../components/NotFound'
import { useAppStore } from '@/store/app'
import { setupLayouts } from 'virtual:generated-layouts'

const generatedRoutes  = setupLayouts(routes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...generatedRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  },
})

router.beforeEach(async (to, from) => {
  const store = useAppStore()

  if (to.fullPath.includes('dashboard') && !store.token) {
    return '/login'
  }

  if (store.isLoggedIn && to.fullPath === '/login') return '/'
})

export default router
