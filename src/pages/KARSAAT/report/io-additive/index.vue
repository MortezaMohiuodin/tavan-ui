<template>
  <div>
    <table-page-header :show-add-item-link="false">
      <template #right>
        <v-btn-excel
          :disabled="!activePlugins.includes('ExcelExport')"
          class="tw-mr-2"
          :loading="workTimeReportLoading"
          text="گزارش کارکرد"
          @click="workTimeReport(filters)"
        />
        <v-btn-excel
          :disabled="!activePlugins.includes('ExcelExport')"
          class="tw-mr-2"
          :loading="ioReportLoading"
          text="گزارش تردد"
          @click="ioReport(filters)"
        />
        <v-btn-search
          class="tw-mr-2"
          :variant="isAdvancedSearch ? 'tonal' : 'outlined'"
          @click="searchDialog = true"
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
              icon="custom:error"
            />
          </template>
        </v-tooltip>
      </template>
      <template #[`item.action`]="{item}">
        <v-menu-confirm
          v-if="!smAndDown"
          width="400"
          color="primary"
          :actions="false"
          @on-cancel="onCancel"
        >
          <template #activator="{props}">
            <v-btn-table-view v-bind="props" />
          </template>
          <template #title>
            <span class="!tw-text-base tw-font-YEKAN-BAKH-BOLD">{{ `جزئیات تردد ${item.raw.Fullname}` }}</span>
          </template>
          <template #message>
            <entity-detail
              :item="item.raw"
              :schema="detailSchema"
              size="small"
            />
          </template>
        </v-menu-confirm>
        <v-dialog-extend
          v-else
          :title="`جزئیات تردد${item.raw.Fullname}`"
          width="400"
          color="primary"
          :actions="false"
          @on-cancel="onCancel"
        >
          <template #activator="{props}">
            <v-btn-table-view v-bind="props" />
          </template>
          <entity-detail
            :item="item.raw"
            :schema="detailSchema"
            size="small"
          />
        </v-dialog-extend>
      </template>
    </table-page-data>

    <v-dialog-extend
      v-model="searchDialog"
      color="info"
      title="جستجوی پیشرفته"
      width="600"
      :actions="false"
      @on-cancel="searchDialog = false"
    >
      <v-form-extend
        v-model="searchForm"
        :validation="false"
        :schema="searchSchema"
        :confirm-btn-prop="{color:'info'}"
        @on-submit="searchSubmit"
        @on-cancel="searchDialog = false"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import FormSectionIterator from '@/components/uiKit/formSectionIterator.vue'
import filterTypeSelect from '@/components/common/filterTypeSelect.vue'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID,activePlugins } = useAppStore()
const detailDialog = ref(false)
const workTimeReportLoading = ref(false)
const ioReportLoading = ref(false)
const searchDialog = ref(false)
const isAdvancedSearch = ref(false)

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const { smAndDown } = useDisplay()

const filterSchema = ['fromDate',
  'toDate',
  'user',
  'department',
  'quitWork',
  'userStatus']

const searchForm = ref({
  searchRow : [{}],
})

const searchParams = computed(()=>{
  let result = {}
  searchForm.value.searchRow.forEach(val=>{
    result[`${val.filterType}Max`] = val.max && parseInt(val.max)
    result[`${val.filterType}Min`] = val.min && parseInt(val.min)
  })

  return result
})

const rowSchema = computed(()=>{
  return [
    { model : 'filterType' , title : 'نوع فیلتر' , component : filterTypeSelect , col:{ cols:12 , md: 6 } ,required: true },
    { model : 'min' , component : 'input' ,title : 'حداقل' , col:{ cols:12 , md: 3 } ,required: true },
    { model : 'max' , component : 'input' ,title : 'حداکثر', col:{ cols:12 , md: 3 } ,required: true },
  ]
})

const searchSchema = computed(()=>{
  return [
    { model : 'searchRow' , component : FormSectionIterator , schema: rowSchema.value , col:{ cols:12 } },
  ]
})

const detailSchema = [

  { key : 'WorkTime', title : 'کارکرد شیفت' },
  { key : 'TotalWorkTime', title : 'کل کارکرد' },
  { key : 'DelayTime ', title : 'تاخیر' },
  { key : 'RushTime', title : 'تعجیل' },
  { key : 'Vacation', title : 'تعطیل کاری' },
  { key : 'Overtime', title : 'اضافه کاری' },
  { key : 'OvertimeFriday', title : 'جمعه کاری' },
  { key : 'ShortageTime', title : 'کسری کار' },
  { key : 'RotateWork1', title : 'کار گردشی صبح عصر' },
  { key : 'RotateWork2', title : 'کار گردشی صبح شب' },
  { key : 'RotateWork3', title : 'کار گردشی عصر شب' },
  { key : 'RotateWork4', title : 'کار گردشی صبح عصر شب' },
  { key : 'AbsentTime', title : 'عدم حضور' },
  { key : 'MissionHourly', title : 'ماموریت' },
  { key : 'NightWork', title : 'شب کاری' },
  { key : 'Vacation', title : 'مرخصی' },
  { key : 'VacationHourly', title : 'مرخصی ساعتی' },
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
    type:'withAvatar',
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
    title: 'کل کارکرد',
    key: 'TotalWorkTime',
  },
  {
    title: 'اضافه کار',
    key: 'Overtime',
  },
  {
    title: 'کسری کار',
    key: 'ShortageTime',
  },
  {
    title: '',
    key: 'Error',
  },
  {

    align: 'center',
    key: 'action',
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

function onEye(val){
  item.value = val
  detailDialog.value = true
}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

function onCancel(){
  detailDialog.value = false
  item.value = false
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "EmployeesCode": [],
    "FromDate": "2023/08/23",
    "ToDate": "2023/09/22",
    "Page": 1,
    "ClearCache": false,
    "QuitWorkStatus": null,
    "TotalWorkTimeMin": null,
    "TotalWorkTimeMax": null,
    "WorkTimeMin": null,
    "WorkTimeMax": null,
    "OvertimeMin": null,
    "OvertimeMax": null,
    "OvertimeHolidayMin": null,
    "OvertimeHolidayMax": null,
    "OvertimeFridayMin": null,
    "OvertimeFridayMax": null,
    "RushTimeMin": null,
    "RushTimeMax": null,
    "RotateWork1Min": null,
    "RotateWork1Max": null,
    "RotateWork2Min": null,
    "RotateWork2Max": null,
    "RotateWork3Min": null,
    "RotateWork3Max": null,
    "NightWorkMin": null,
    "NightWorkMax": null,
    "VacationHourlyMin": null,
    "VacationHourlyMax": null,
    "VacationMin": null,
    "VacationMax": null,
    "MissionTimeMin": null,
    "MissionTimeMax": null,
    "AbsentTimeMin": null,
    "AbsentTimeMax": null,
    "DelayTimeMin": null,
    "DelayTimeMax": null,
    "ShortageTimeMin": null,
    "ShortageTimeMax": null,
    ...payload,
  }
  try{
    const res = await useHttpPost('inputoutputcalcu/calcu-employees-timework',{ body })

    res.Data = res.Data.Employees.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'Id':val.EmployeeCode }))

    return res
  }catch(e){
    throw new Error(e)
  }

}

async function workTimeReport(payload = {}){
  let url = 'inputoutputcalcu/calcu-employees-timework-excel-dotin'

  let params = {
    "WorkspaceCode": WID,
    "FromDate" : filters.value.FromDate && $moment(filters.value.FromDate).format('YYYY-MM-DD'),
    "ToDate" : filters.value.ToDate && $moment(filters.value.ToDate).format('YYYY-MM-DD'),
    ...payload,
  }

  workTimeReportLoading.value = true
  try{
    const res = await useHttpExcel(url,{ params })

    workTimeReportLoading.value = false

    return res
  }catch(e){
    workTimeReportLoading.value = false
    throw new Error(e)
  }
}
async function ioReport(payload = {}){
  let url = 'inputoutput/get-all-employee-io-excel-dotin'
  let params = {
    "WorkspaceCode": WID,
    "FromDate" : filters.value.FromDate && $moment(filters.value.FromDate).format('YYYY-MM-DD'),
    "ToDate" : filters.value.ToDate && $moment(filters.value.ToDate).format('YYYY-MM-DD'),
    ...payload,
  }

  ioReportLoading.value = true
  try{
    const res = await useHttpExcel(url,{ params })

    ioReportLoading.value = false

    return res
  }catch(e){
    ioReportLoading.value = false
    throw new Error(e)
  }
}
function resetSearch(){
  isAdvancedSearch.value = false
  searchForm.value.searchRow = [{}]
  tableRef.value.restart({ ...filters.value })
}
function searchSubmit(){
  isAdvancedSearch.value =true
  searchDialog.value = false
  tableRef.value.restart({ ...filters.value,...searchParams.value })
}
</script>


<route>
{
meta: {
title: "گزارش تجمیعی ترددها",
depthLevelType : 1
}
}
</route>

