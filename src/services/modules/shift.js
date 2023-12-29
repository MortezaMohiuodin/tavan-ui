import { useHttpPost } from "@/composables/useHttpPost"
import { useAppStore } from "@/store/app"

export const getMyShifts = async (payload = {})=>{
  const { WID } = useAppStore()
  let body = {
    "FromDate": '2023/08/23',
    "ToDate": '2023/09/22',
    "WorkspaceId": WID,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpPost('shift/my-shift',{ body })
  }catch(e){
    throw new Error(e)
  }
  
}
