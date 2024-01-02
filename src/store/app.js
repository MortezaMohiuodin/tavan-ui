import { defineStore  } from 'pinia'

export const useAppStore = defineStore('tavan', ()=>{
  const router = useRouter()

  // state
  let token = ref(useLocalStorage('token', ''))
  let userInfo = ref(null)
  let isAppReady = ref(false)
  let isLoggedIn = ref(false)
  let drawer = ref(true)
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
    isAppReady.value = false
    isLoggedIn.value = false
  }


  async function initStore() {
    isAppReady.value = true

    isLoggedIn.value = await getUserData() 
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
    drawer,
    // action
    resetIdentityData,
    initStore,
    logout,
    getUserData,
  }
})
