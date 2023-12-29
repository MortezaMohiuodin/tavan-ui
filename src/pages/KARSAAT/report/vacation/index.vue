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
    >
      <template #[`item.Error`]="{item}">
        <v-tooltip
          :disabled="!item.raw?.Error?.length"
        >
          <v-list class="tw-bg-transparent">
            <v-list-item
              v-for="(error,index) in item.raw?.Error"
              :key="index"
              class="tw-text-slate-200"
            >
              {{ error }}
            </v-list-item>
          </v-list>
          <template #activator="{ props }">
            <v-icon
              v-if="item.raw?.Error?.length"
              v-bind="props"
              icon="mdi:mdi-information-outline"
              color="k_white-800"
            />
          </template>
        </v-tooltip>
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID,activePlugins } = useAppStore()

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const excelLoading = ref(false)

const filterSchema = [
  'fromDate',
  'toDate',
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
    title: 'مانده از قبل',
    key: 'RemaindOfBeforeTime',
  },
  {
    title: 'استحقاق دوره',
    key: 'TotalVacationTime',
  },
  {
    title: 'استفاده شده دوره',
    key: 'UsedVacationTime',
  },
  {
    title: 'باقی مانده',
    key: 'RemainedVacationTime',
  },
  {
    title: 'قابل انتقال',
    key: 'TransferableTime',
  },
  {
    title: 'غیر قابل انتقال',
    key: 'NonTransferableTime',
  },
  {
    title: '',
    key: 'Error',
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
  let body ={
    "WorkspaceCode": WID,
    "EmployeesCode": null,
    "Page": 1,
    "DepartmentCode": null,
    "ClearCache": false,
    "FromDate": "2023-03-21T00:00:00",
    "ToDate": "2024-03-19T00:00:00",
    "QuitWorkStatus": null,
    ...payload,
  }
  try{
    const res = await useHttpPost('absent/get-employee-used-vacation',{ body })

    res.Data = res.Data.Employees.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'Id':val.EmployeeCode }))

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

    const res = await useHttpExcel('absent/get-employee-used-vacation-to-excel-for-dotin',{ params })

    excelLoading.value = false

    return res
  }catch(e){
    excelLoading.value = false
    throw new Error(e)
  }
}
</script>


<route>
{
meta: {
title: "گزارش مرخصی همکاران",
depthLevelType : 0
}
}
</route>

