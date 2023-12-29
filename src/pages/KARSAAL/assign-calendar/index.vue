<template>
  <table-page-header add-item-text="اختصاص تقویم" />
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
    @on-edit="onEdit"
  />
  <v-dialog-extend
    v-model="showEditDialog"
    width="500"
  >
    <v-form-extend
      v-model="editForm"
      :title="`ویرایش تقویم سازمانی ${item.Name + ' ' + item.Family}`"
      :schema="schema"
      :loading="loading"
      @on-submit="submit(form)"
      @on-cancel="showEditDialog = false"
    />
  </v-dialog-extend>
</template>

<script setup>
import calendarSelect from '@/components/common/calendarSelect.vue'

const tableRef = ref()
const { WID } = useAppStore()
const loading = ref(false)
const item = ref({})
const showEditDialog = ref(false)
const editForm = ref({})

const filterSchema = [
  'fromDate',
  'toDate',
  'department',
  'user',
  'calendar',
  'userStatus',
]

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const tableSchema = computed(()=>{
  return [
    {
      title: '#',
      key: 'Id',
      align: 'start',
      width: '80px',
    },
    {
      title: 'نام و نام خانوادگی',
      key: 'Fullname',
      type:'withAvatar',
    },
    {
      title: 'تقویم',
      key: 'Calendar',
    },
    {
      title: 'از تاریخ',
      key: 'FromDate',
      type : 'date',
    },
    {
      title: 'تا تاریخ',
      key: 'ToDate',
      type:'date',
    },
    {
  
      key: 'action',
      actions : ['edit','delete'],
    },
    {
      key:'mobile',
      heading : val=>val.Fullname,
      subHeading : val=> val.Calendar,
    },
  ]
})

const schema = computed(()=>{
  return [
    { model:'workspaceCalendarId', component : calendarSelect, title : 'انتخاب تقویم سازمانی' , required:true , col:{ cols:12 } },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , col:{ cols:12 , lg:6 }, required:true },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ' , col:{ cols:12 , lg:6 }, required:true },
  ]
})

const service = async (payload = {})=>{
  
  let body = {
    "WorkspaceId":WID,
    "Page": 1,
    ...filters.value,
    "EmployeeId": payload?.EmployeeCode,
    ...payload,
  }
  try{
    const res = await useHttpPost('employeecalender/get-list',{ body })
  
    res.Data = res.Data.map(val=>{
      return {
        ...val,
        'Fullname' : val.Name + ' ' + val.Family,
        'Calendar' : val.WorkspaceCalendar?.Title,
      }
    })
  
    return res
  }catch(e){
    throw new Error(e)
  }
  
}

const onDelete = async val=>{
  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "EmployeeCalendarId": id,
  }
  try{
    const res = await useHttpPost('employeecalender/delete',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const onEdit = val=>{
  editForm.value = {
    workspaceCalendarId :val.WorkspaceCalendar?.Id,
    ToDate : val.ToDate,
    FromDate : val.FromDate,
    EmployeeCalendarId : val.Id,
  }
  item.value = val
  showEditDialog.value = true
}

const submit = async (payload = {})=>{
  let url = 'employeecalender/edit'
  let body = {
    "WorkspaceId": WID,
    ...editForm.value,
    ...payload,
  }
  
  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })
  
    loading.value = false
    showEditDialog.value = false
    tableRef.value.restart()
    
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

watch(showEditDialog,val=>{
  // when edit dialog close
  if(!val) {
    item.value = {}
    editForm.value = {}
  }
  
})
</script>

<route>
  {
    meta: {
      title: "اختصاص تقویم"
    }
  }
  </route>