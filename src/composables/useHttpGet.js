import { ofetch } from 'ofetch'
import { useSnackbar } from '@/composables/useSnackbar'
import router from '@/router'
import { useAppStore } from '@/store/app'

export const useHttpGet = ofetch.create({
  baseURL : 'http://localhost:3000',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  async onRequest({ request, options }) {
    options.headers.Authorization = 'Bearer ' + useAppStore().token
  },
  async onResponse({ request, response, options }) {
    if (response.status === 401 && useAppStore().isLoggedIn === true) {
      useAppStore().resetIdentityData()
      router.push('/login')
    }
    if(response.status === 500){
      useSnackbar('خطای سرور', 'error')
    }
  },
})
