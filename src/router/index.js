import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import NotFound from '../components/NotFound'
import { setupLayouts } from 'virtual:generated-layouts'
import { useAppStore } from '@/store/app'

let routes = null
routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...routes,
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

  await store.initStore()
  if (!store.isLoggedIn && !to.fullPath.includes('/login')){
    return({ name: 'login',query: to.query })
  }
  if (store.isLoggedIn && to.fullPath === '/login') return '/'
})

export default router
