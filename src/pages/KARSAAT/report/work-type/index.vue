<template>
  <div>
    <table-page-header :show-add-item-link="false">
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
      :title="`تاریخچه ( ${logs?.length} )`"
      width="500"
    >
      <v-list>
        <v-list-item
          v-for="(log,index) in logs"
          :key="index"
        >
          <p class="tw-font-YEKAN-BAKH-BOLD">
            {{ log.Time && $moment(log.Time).format('HH:mm') }}
          </p>
          <p class="tw-caption">
            {{
              `
                ثبت وضعیت
                ${log.TemporaryStatus}
                توسط
                ${log.ModifiedBy && `${log.ModifiedBy?.Name} ${log.ModifiedBy?.Family}`}
            `
            }}
          </p>
        </v-list-item>
      </v-list>
    </v-dialog-extend>
  </div>
</template>

<script setup>
const logs = ref([])
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID,activePlugins } = useAppStore()
const excelLoading = ref(false)
const logLoading = ref(false)
const logDialog  = ref(false)

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const filterSchema = [
  'toDate',
  'fromDate',
  { key:'IOType',items:$enums.inputOutputType,label:'نوع تردد' },
  'user',
  'department',
  'quitWork',
  'userStatus',
]

const tableSchema = [
  {
    title: '#',
    key: 'EmployeeCode',
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
    title: 'ساعت',
    key: 'Time',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type:'date',
  },
  {
    title: 'نحوه کارکرد',
    key: 'IOTypeTitle',
    type:'chip',
  },
  {

    align: 'center',
    key: 'action',
    actions:[{ icon:'mdi:mdi-eye',color:'k_white-800',label:'تاریخچه',emit:val=>onLog(val.raw) }],
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

async function onLog(val){
  logDialog.value = true
  item.value = val

  const res = await getLog(val)

  logs.value = res?.Data
}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "EmployeesCode": null,
    "Page": 1,
    "DepartmentCode": null,
    "IOType": null,
    "QuitWorkStatus": null,
    ...filters.value,
    ...payload,
  }

  try{
    const res = await useHttpPost('InputOutput/get-list-employee-io',{ body })

    res.Data = res.Data.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'EmployeeCode':val.EmployeeCode }))

    return res
  }catch(e){
    throw new Error(e)
  }

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
  const id = val.Id
  let body ={
    "WorkspaceCode": WID,
    "Code" : id,
    "ActionType" : 3,
  }
  try{
    logLoading.value = true

    const res = await useHttpPost('inputoutput/get-inputoutput-logs',{ body })

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
title: "گزارش نحوه کارکرد همکاران",
depthLevelType : 1
}
}
</route>

