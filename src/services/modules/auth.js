import { useHttpPost } from '@/composables/useHttpPost'

export const login = async payload=>{
  try{
    return await useHttpPost('/login',{ body:payload })
  }catch(e){
    throw new Error(e)
  }
}
  
  
