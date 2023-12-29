<template>
  <div>
    <table-page-header
      :show-add-item-link="false"
      desc="در این بخش شیفت همکاران در هر روز را نمایش میدهد"
    >
      <template #right>
        <v-btn-excel
          :disabled="!activePlugins.includes('ExcelExport')"
          class="tw-mr-2"
          :loading="excelLoading"
          @click="getExcel"
        />
      </template>
    </table-page-header>
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
    />
    <v-dialog-extend
      v-model="logDialog"
      :loading="logLoading"
      title="اطلاعات شیفت"
      width="500"
    >
      <v-list class="tw-bg-transparent">
        <v-list-item
          v-for="(log,index) in logs"
          :key="index"
        >
          {{ log }}
        </v-list-item>
      </v-list>
    </v-dialog-extend>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID,activePlugins } = useAppStore()
const excelLoading = ref(false)
const logLoading = ref(false)
const logDialog  = ref(false)
const logs = ref([])

const filterSchema = [
  'fromDate',
  'toDate',
  'user',
  'department',
  'shift',
  'quitWork',
  'userStatus',
]

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

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
    title: 'تاریخ',
    key: 'Date',
  },
  {
    title: 'نحوه کارکرد',
    key: 'ShiftTitle',
    type:'chip',
  },
  {

    align: 'center',
    key: 'action',
    actions:[{ icon:'fa fa-list',color:'k_white-800' , emit:val=>onLog(val) }],
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
    "DepartmentCode": null,
    "ShiftCode": null,
    "Page": 1,
    "ClearCache": false,
    "FromDate": "2023/08/23",
    "ToDate": "2023/09/22",
    "EmployeeCode": null,
    "ShiftType": null,
    ...filters.value,
    ...payload,
  }

  try{
    const res = await useHttpPost('shift/get-list-assignment-shift-employees',{ body })

    res.Data = res.Data.EmployeeShiftList.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'Id':val.EmployeeCode }))

    return res
  }catch(e){
    throw new Error(e)
  }

}

async function onLog(val){
  logDialog.value = true
  item.value = val

  const res = await getLog(val)

  logs.value = res?.Data
}
async function getExcel(){
  let params ={
    "WorkspaceCode": WID,
    ...filters.value,
  }
  try{
    excelLoading.value = true

    const res = await useHttpExcel('InputOutput/get-list-employee-io-excel',{ params })

    excelLoading.value = false

    return res
  }catch(e){
    excelLoading.value = false
    throw new Error(e)
  }
}
async function getLog(val){
  const id = val.ShiftCode
  let body ={
    "WorkspaceCode": WID,
    "Code" : id,
  }
  try{
    logLoading.value = true

    const res = await useHttpPost('shift/get-description-shift-by-code',{ body })

    logLoading.value = false

    return res
  }catch(e){
    logLoading.value = false
    throw new Error(e)
  }
}
watch(logDialog,val=>{
  if(!val){
    logs.value = []
  }
})
</script>


<route>
{
meta: {
title: "گزارش شیفت همکاران"
}
}
</route>

