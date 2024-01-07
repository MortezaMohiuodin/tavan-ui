import { defineStore  } from 'pinia'
import { addMinutes, format } from 'date-fns'

const MINUTES_TO_CHECK_FOR_TOKEN_REFRESH = 1440

export const useAppStore = defineStore('tavan', ()=>{
  const router = useRouter()

  // state
  let token = ref(useLocalStorage('token'))
  let tokenExpiration = ref(useLocalStorage('token'))
  let userInfo = ref(null)
  let isAppReady = ref(false)
  let isLoggedIn = ref(false)
  let drawer = ref(true)

  // action
  const getUserData =async ()=>{
    
    return new Promise(async (resolve,reject)=>{
      let user = ref(useLocalStorage('user'))
      userInfo.value = user      
      if(!token.value) reject(false)
      resolve(true)
      // if(user.value){
      //   resolve(user.value)
      // }else{
      //   reject(false)
      // }
      // try{
      //   const res = await useHttpGet('/profile')

      //   user.value = res.user
      //   resolve(user)
      // }catch(e){
      //   reject(false)
      //   router.push('/login')
      // }
    })
  }

  const refreshToken = async ()=>{
    try{
      const res = await useHttpGet('/token')
      if (res.status === 200) {
        token.value = res.token
        tokenExpiration.value =  format(
          addMinutes(new Date(), MINUTES_TO_CHECK_FOR_TOKEN_REFRESH),
          't',
        )
       
      }
    }catch(e){
      console.log(e)
      router.push('/login')
    }
  }

  const resetIdentityData = ()=>{
    token.value = ''
    userInfo.value = null
    isAppReady.value = false
    isLoggedIn.value = false
  }


  async function initStore() {
    isLoggedIn.value = await getUserData() 
    isAppReady.value = true
  }

  const logout =async ()=>{
    // const result = await useHttpGet('user/logout')

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
