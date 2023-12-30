import { defineStore , getActivePinia } from 'pinia'

export const useAppStore = defineStore('tavan', ()=>{
  const router = useRouter()

  // state
  let token = ref(useLocalStorage('token', ''))
  let userInfo = ref(null)
  let isAppReady = ref(false)
  let isLoggedIn = ref(false)
  let drawer = ref(true)
  let lastItem  = ref(null)
  let tableFilter = ref({})
  let pageStepInPagination = ref(1)
  const store = useAppStore()

  // action
  const getUserData =async ()=>{
    return new Promise(async (resolve,reject)=>{
      let token = ref(useLocalStorage('token', ''))
      let user = ref(useLocalStorage('user', ''))
      if(token && user){
        store.user = user.value
        store.token = token.value
        resolve(user)
        
        return
      }
      try{
        const res = await useHttpGet('get-user')

        user.value = res.user
        user.token = res.token
      }catch(e){
        router.push('/login')
      }
    })
  }

  const resetIdentityData = ()=>{
    token.value = ''
    userInfo.value = null
    isAppReady.value = true
    isLoggedIn.value = false
  }


  async function initStore() {
    isLoggedIn.value = await getUserData() 
    isAppReady.value = true
  }

  const logout =async ()=>{
    const result = await useHttpGet('user/logout')

    resetIdentityData()
    reset()
    router.push('/login')
  }



  return {
    // state
    token,
    userInfo,
    isAppReady,
    isLoggedIn,

    // action
    resetIdentityData,
    initStore,
    drawer,
    logout,
    lastItem,
    tableFilter,
    pageStepInPagination,
    getUserData,
  }
})
