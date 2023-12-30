import { ofetch } from 'ofetch'
import { useSnackbar } from '@/composables/useSnackbar'
import { useStorage } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import router from '@/router'


let token = useStorage('token').value
export const useHttpPost = ofetch.create({
  baseURL: 'http://localhost:3000',
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  async onRequest({ request, options }) {
    options.headers.Authorization = 'Bearer ' + useAppStore().token
  },
  async onResponse({ request, response, options }) {
    
    // if (response._data.Message && !dont_show_success_message_requests.includes(request)){
    //   response._data.Message.split(';').forEach((msg,index) =>{
    //     setTimeout(()=>{
    //       useSnackbar(msg, response.status === 200 ? 'success' : 'error')
    //     },index * 300)
    //   })
    // }
    if (response.status === 401 && useAppStore.isLoggedIn === true) {
      useAppStore().resetIdentityData()
      router.push('/login')
    }
    if(response.status === 500){
      useSnackbar('خطای سرور', 'error')
    }
  },
})
