import { useHttpPost } from '@/composables/useHttpPost'


export const getAllWorkSpaceEmployee = async (payload = {})=>{
  let body = {
  
  }
  try{
    const res = await useHttpPost('api',{ body })
    return res
  }catch(e){
    throw new Error(e)
  }
}

