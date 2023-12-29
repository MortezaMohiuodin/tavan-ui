<template>
  <div>
    <table-page-header :show-add-item-link="false" />
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
  </div>
</template>

<script setup>
import { secondToHms } from "@/helper/utility"

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const filterSchema = ['fromDate',
  'toDate',
  'user',
  'department',
  { key:'Status',items:$enums.OvertimeStatus,label:'وضعیت مرخصی' },
  'userStatus']

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const tableSchema = [
  {
    title: '#',
    key: 'Code',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    key: 'Fullname',
    align: 'start',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date',
  },
  {
    title: 'عنوان',
    key: 'AbsentTitle',
  },
  {
    title: 'اضافه کاری',
    key: 'Overtime',
  },
  {
    title: 'تعطیل کاری',
    key: 'OvertimeHoliday',
  },
  {
    title: 'جمعه کاری',
    key: 'OvertimeFriday',
  },
  {
    title: 'کل کارکرد',
    key: 'TotalWorkTime',
  },
  {
    title: 'کارکرد شیفت',
    key: 'WorkTime',
  },
  {
    title: 'وضعیت',
    key: 'Status',
    type:'chip',
    value : val=>$getEnum($enums.OvertimeStatus,'key',val.Status,'value'),
  },
  {

    align: 'center',
    key: 'action',
    actions:[{ icon:'fa fa-history',emit:val=>onHistory(val) },{ icon:'fa fa-sticky-note',emit:val=>onDocument(val) }],
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

const onHistory = val=>{

}

const onDocument = val=>{

}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode":WID,
    "FromDate":"2023/08/23",
    "ToDate":"2023/09/22",
    "DepartmentCode":null,
    "EmployeeCode":null,
    "Page":1,
    "Status":null,
    ...payload,
  }
  try{
    const res = await useHttpPost('inputoutputcalcu/get-overtime-need-confirm',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        Fullname : `${val?.Name} ${val?.Family}`,
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }

}
</script>


  <route>
  {
      meta: {
      title: "اضافه کاری های منتظر تایید"
      }
  }
  </route>
