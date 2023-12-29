<template>
  <div>
    <table-page-header :show-add-item-link="false" />
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
    >
      <template #[`item.IsPresent`]="{item}">
        <v-chip-table
          variant="elevated"
          :text="item.raw.IsPresent ? 'حاضر' : 'غایب'"
          :color="item.raw.IsPresent ? 'success' : 'error'"
        />
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const filterSchema = [
  { key:'Status',label:'وضعیت',items:$enums.employeeAbsence },
  'user',
  'department',
  'quitWork',
  'userStatus',
]

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    key: 'Fullname',
    align: 'start',
    type : 'withAvatar',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitWorkDate',
    type : 'date',
  },
  {
    title: 'دپارتمان',
    key: 'Department',
    type : 'chipGroup',
  },
  {
    title: 'وضعیت حضور',
    key: 'IsPresent',
  },
  {
    title: 'توضیح',
    key: 'employeePresentStatusDesc',
    type:'ellipsis',
    width:'150px',
  },
  {
    title: 'عنوان شیفت',
    key: 'Shift',
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode": null,
    "DepartmentCode": null,
    "Status": null,
    "Page": 1,
    "QuitWorkStatus": null,
    ...payload,
  }
  try{
    const res = await useHttpPost('shift/get-employee-status-current-shift',{ body })

    res.Data = res.Data.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'Id':val.EmployeeCode }))

    return res
  }catch(e){
    throw new Error(e)
  }

}
</script>


<route>
{
meta: {
title: "همکاران غایب",
depthLevelType : 1
}
}
</route>

