import { useAppStore } from '@/store/app'
import { useHttpPost } from '@/composables/useHttpPost'

const { WID } = useAppStore()

export const getAllWorkSpaceEmployee = async (payload = {})=>{
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
    const res = await useHttpPost('employee/get-all-workspace-employee',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        FullName : `${val.Name} ${val.Family}`,
        Id : val.EmployeesCode,
        Department : val.Department.map(v=>({ ...v,value: v.Title , key:v.Id })),
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }
}
export const getWorkspaceDepartments = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    "Page": 1,
    ...payload,
  }
  try{
    const res = await useHttpGet('department/get-workspace-department',{ params  })

    res.Data = res.Data.map(val=>({ ...val, Id : val.DepartmentCode }))

    return res
  }catch(e){
    throw new Error(e)
  }
}

export const getWorkspaceRoles = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    ...payload,
  }
  try{
    return await useHttpGet('role/v2/get-workspace-role',{ params  })
  }catch(e){
    throw new Error(e)
  }
}
export const getWorkspaceOrgPositions = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    ...payload,
  }
  try{
    const res = await useHttpGet('org-position/get-workspace-org-position',{ params  })

    res.Data = res.Data.map(val=>({ ...val,key: val.OrgPositionCode , value: val.Title }))

    return res
  }catch(e){
    throw new Error(e)
  }
}

