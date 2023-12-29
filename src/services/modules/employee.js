import { useHttpPost } from "@/composables/useHttpPost"
import { useAppStore } from "@/store/app"

export const getAllWorkSpaceEmployee = async (payload = {})=>{
  const { WID } = useAppStore()
  let body = {
    "WorkspaceCode": WID,
    "Status": null,
    "EmployeeCode": null,
    "DepartmentCode": null,
    "Page": 1,
    "IsEdited": 2,
    "QuitWorkStatus": null,
    "BossId": null,
    ...payload,
  }
  try{
    return await useHttpPost('employee/get-all-workspace-employee',{ body })
  }catch(e){
    throw new Error(e)
  }
  
}