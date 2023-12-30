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
    try {
      const res = await useHttpGet('/get-user')

      userInfo.value = res.data.user
      
      return true
    }catch (err) {
      return true
    }
  }

  const resetIdentityData = ()=>{
    token.value = ''
    userInfo.value = null
    isAppReady.value = true
    isLoggedIn.value = false
  }


  async function initStore() {
    // isLoggedIn.value = await getUserData() 
    isLoggedIn.value = true
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
