<template>
  <div>
    <table-page-header />
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      :on-delete="onDelete"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
    />
  </div>
</template>

<script setup>
const { WID } = useAppStore()

const filterSchema = ['user',
  'department',
  'userStatus']

const tableRef = ref(null)
const router = useRouter()
const route = useRoute()

const tableSchema = [
  {
    title: '#',
    align: 'start',
    key: 'Id',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    align : 'start',
    key: 'EmployeeFullname',
    type : 'withAvatar',
    width: '180px',
  },
  {
    title: 'دسترسی ها',
    key: 'Permission',
    type: 'chipGroup',
  },
  {
    title: 'توسط',
    key: 'AssigneeFullname',
    type : 'chip',
    typeProps:{
      variant : 'tonal',
    },
  },
  {
    key: 'action',
    align: 'center',
    actions:[
      'delete',
      { icon : 'fa fa-pen',color:'k_white-800' , emit : row=>router.push(route.fullPath + '/edit/' + row.Id),disabledCondition:row=>!row.AssigneeEmployee.CanEdit , label:'ویرایش' },
    ],
  },
  {
    key:'mobile',
    heading : val=>val.EmployeeFullname,
  },
]

const onDelete = async val=>{
  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "WorkspaceEmployeeId": id,
  }
  try{
    const res = await useHttpPost('grant/remove',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const service = async (payload = {})=>{
  const { WID } = useAppStore()
  const url = '/grant/v2/Get-list'
  // const url = '/grant/Get-list'
  let body = {
    "WorkspaceId": WID,
    "WorkspaceEmployeeId": payload?.EmployeeCode,
    "DepartmentId":payload?.DepartmentCode,
    ...payload,
  }
  try{
    const res =  await useHttpPost(url,{ body  })

    res.Data = res.Data.map(val=>({ ...val,'Id':val.Employee.Id,'AssigneeFullname' : `${val?.AssigneeEmployee?.Name} ${val?.AssigneeEmployee?.Family}`,'EmployeeFullname' : `${val?.Employee?.Name} ${val?.Employee?.Family}` , 'Pic' : val?.Employee?.Pic , 'Permission' :  val?.PermissionIds  }))

    return res
  }catch(e){
    throw new Error(e)
  }

}
</script>

<route>
  {
    meta: {
      title: "مدیریت تفویض"
    }
 }
</route>
