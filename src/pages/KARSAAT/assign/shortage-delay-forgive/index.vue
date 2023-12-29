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
      :on-delete="onDelete"
    />
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const filterSchema = ['fromDate',
  'toDate',
  'user',
  'department',
  { key:'Type',label:'نوع', items: $enums.overtimeStatus },
  { key:'Status',label:'وضعیت', items: $enums.forgiveStatus },
  'userStatus']

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
    type:'withAvatar',
    align: 'start',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type:'date',
  },
  {
    title: 'مدت زمان',
    key: 'Time',
  },
  {
    title: 'نوع',
    key: 'Type',
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
    value : val=>val.Status ? 'با بخشش' : 'بدون بخشش',
  },
  {

    align: 'center',
    key: 'action',
    width: '200px',
    actions:[{ icon:'fa fa-history',emit:val=>onHistory(val) }],
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
    "WorkspaceCode":WID,
    "FromDate":"2023/08/23",
    "ToDate":"2023/09/22",
    "DepartmentCode":null,
    "EmployeeCode":null,
    "Page":1,
    "Status":null,
    "Type":null,
    ...payload,
  }
  try{
    const res = await useHttpPost('inputoutputcalcu/get-shortage-or-delay-can-forgiven',{ body })

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

const onDelete = async val=>{
  const id = val.Code
  let body = {
    "WorkspaceCode": WID,
    "Codes": [id],
  }
  try{
    const res = await useHttpPost('mission/remove-employee-mission',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}
</script>


    <route>
    {
        meta: {
        title: "بخشش تاخیر یا کسری کار"
        }
    }
    </route>
