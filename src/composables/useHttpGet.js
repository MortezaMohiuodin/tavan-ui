import { ofetch } from 'ofetch'
import { useSnackbar } from '@/composables/useSnackbar'
import router from '@/router'
import { useAppStore } from '@/store/app'

export const useHttpGet = ofetch.create({
  baseURL: '/api',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  async onRequest({ request, options }) {
    options.headers.Authorization = useAppStore().token
  },
  async onResponse({ request, response, options }) {
    let is_country_req = request && request.indexOf('tax/get-country') > -1
    if (response._data.Message) {
      if(is_country_req) return
      useSnackbar(response._data.Message, response.status === 200 ? 'success' : 'error')
    }
    if (response.status === 401 && useAppStore().isLoggedIn === true) {
      useAppStore().resetIdentityData()
      router.push('/login')
    }
    if(response.status === 500){
      useSnackbar('خطای سرور', 'error')
    }
  },
})
