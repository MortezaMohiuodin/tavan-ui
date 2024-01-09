import { defineStore  } from 'pinia'
import { addMinutes, format } from 'date-fns'
import { isTokenValid } from '@/helper/validations'

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
      if(!isTokenValid(token.value)) reject(false)
      else{
        try{
          const res = await useHttpGet('/profile')

          resolve(res)
        }catch(e){
          reject(false)
        }
      }
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
    const user = await getUserData()
    if(user){
      userInfo.value = user 
      isLoggedIn.value = true  
    }
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
