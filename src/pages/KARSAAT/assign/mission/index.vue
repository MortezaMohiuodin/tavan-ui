<template>
  <div>
    <table-page-header>
      <template #right>
        <v-menu-confirm
          message="تغییر وضعیت دسته جمعی"
        >
          <template #activator="{props}">
            <v-btn
              v-bind="props"
              :disabled="!selected.length"
              color="secondary"
              size="large"
              elevation="0"
              variant="outlined"
            >
              تغییر وضعیت دسته جمعی
            </v-btn>
          </template>
          <template #action>
            <v-btn
              v-for="status in $enums.replyStatus"
              :key="status.key"
              :text="status.value"
              :loading="statusLoading && statusLoading === status.key.toString()"
              :color="status.color"
              variant="tonal"
              @click="handleStatusChange(selected,status.key)"
            />
          </template>
        </v-menu-confirm>
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
      v-model="selected"
      :service="service"
      item-value="Code"
      show-select
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>onEdit(val)"
    >
      <template #[`item.MissionStatus`]="{item}">
        <v-menu-confirm
          :loading="statusLoading"
          :color="$getEnum($enums.replyStatus, 'key' , item.raw.MissionStatus , 'color')"
          :message="`
            تغییر وضعیت
           ${item.raw.Name + ' ' + item.raw.Family}
             `"
        >
          <template #activator="{props}">
            <v-btn
              rounded
              :color="$getEnum($enums.replyStatus,'key',item.raw.MissionStatus,'color')"
              variant="tonal"
              v-bind="props"
            >
              {{ $getEnum($enums.replyStatus,'key',item.raw.MissionStatus,'value') }}
            </v-btn>
          </template>
          <template #action>
            <v-btn
              v-for="status in $enums.replyStatus"
              :key="status.key"
              :text="status.value"
              :color="status.color"
              :variant="item.raw.MissionStatus === status.key ? 'elevated' : 'tonal'"
              @click="handleStatusChange(item.raw,status.key)"
            />
          </template>
        </v-menu-confirm>
      </template>
    </table-page-data>
    <v-dialog-extend
      v-model="dialog"
      width="450"
      title="ویرایش ماموریت"
      color="success"
      :loading="formLoading"
    >
      <v-form-extend
        v-model="form"
        :schema="formSchema"
        :loading="formLoading"
        :with-card="false"
        @on-cancel="onClose"
        @on-submit="submit(form)"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
import missionSelect from '@/components/common/missionSelect.vue'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const store = useAppStore()
const dialog = ref(false)
const formLoading = ref(false)
const form = ref({ IsHourly:false,ShowToEmployee:false })
const selected = ref([])
const statusLoading = ref(null)
const router = useRouter()
const route =useRoute()

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

console.log(filters.value)

const filterSchema = [
  'fromDate',
  'toDate',
  'user',
  'department',
  { key:'Status',items:$enums.replyStatus,label:'وضعیت' },
  'userStatus',
]

const tableSchema = [
  {
    title: '#',
    key: 'Code',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام کارمند',
    key: 'Fullname',
    type : 'withAvatar',
    align: 'start',
  },
  {
    title: 'عنوان ماموریت',
    key: 'MissionTitle',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date',
  },
  {
    title: 'نوع',
    key: 'IsHourly',
    type : 'chip',
    value : val=> val.IsHourly ? 'ساعتی' : 'روزانه',
  },
  {
    title: 'شروع',
    key: 'StartTime',
    value : val=>{
      if(!val.StartTime) return '-'

      let value = val.StartTime.split(':')
      value.pop()

      return value.join(':')
    },
  },
  {
    title: 'پایان',
    key: 'EndTime',
    value : val=>{
      if(!val.EndTime) return '-'

      let value = val.EndTime.split(':')
      value.pop()

      return value.join(':')
    },
  },
  {
    title: 'مدت',
    key: 'Amount',
    value : val=>val.IsHourly ? `${calcTimeDiff(val.StartTime , val.EndTime)} ساعت` : `${val.DayCount} روز`,
  },
  {
    title: 'وضعیت',
    key: 'MissionStatus',
  },
  {
    title: 'توضیحات',
    key: 'Description',
  },
  {
    align: 'center',
    class : 'actionsfdas',
    key: 'action',
    width: '120px',
    lasFixed : true,
    actions:['delete','edit'],
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

const formSchema = computed(()=>{
  return [
    { model: 'MissionCode' , component : missionSelect , title : 'نوع ماموریت' , returnObject:true , col: { cols:12 } },
    { model: 'Date' , component : 'datepicker' , title:'تاریخ' , required:true , col: { cols:12 , lg:6 } },
    { model: 'DayCount' , component : 'input' , title: 'مدت به روز'  , condition:val=>!val?.MissionCode?.IsHourly,required : !form.value?.MissionCode?.IsHourly ,col: { cols:12 , lg :6   } },
    { model:'StartTime', component : 'datepicker', type: 'time' ,title : 'زمان شروع'  ,condition:val=>val?.MissionCode?.IsHourly,required : form.value?.MissionCode?.IsHourly,col: { cols:12 , lg : 6 } },
    { model:'EndTime', component : 'datepicker', type: 'time' ,title : 'زمان پایان'  ,condition:val=>val?.MissionCode?.IsHourly ,required : !form.value?.MissionCode?.IsHourly ,col: { cols:12 , lg : 6 } },
    { model: 'Description', component : 'textarea' , title :  'توضیحات' , col: { cols: 12   } },
  ]
})

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode":store.WID,
    "FromDate":"2023/08/23",
    "ToDate":"2023/09/22",
    "DepartmentCode":"",
    "Page":1,
    "Type":0,
    "Status":null,
    ...filters.value,
    ...payload,
  }
  try{
    const res = await useHttpPost('mission/get-workspace-employee-mission',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        Fullname : `${val.Name} ${val.Family}`,
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
    "WorkspaceCode": store.WID,
    "EmployeeAbsentCode": [id],
  }
  try{
    const res = await useHttpPost('mission/remove-employee-mission',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const openEditDialog = (val={})=>{
  form.value = {
    Id : val.Code,
    MissionCode : {
      key : val.MissionCode,
      Code : val.MissionCode,
      IsHourly : val.IsHourly,
      Title : val.MissionTitle,
      value : val.MissionTitle,
    },
    Date : val.Date,
    DayCount : val.DayCount,
    StartTime : val.StartTime,
    EndTime : val.EndTime,
    Description : val.Description,
  }
  dialog.value = true
}

function onClose(){
  formLoading.value = false
  form.value = { IsHourly:false,ShowToEmployee:false }
  dialog.value = false
}

const submit = async (payload = {})=>{
  const id = payload?.MissionCode?.MissionCode
  let url = 'mission/edit-employee-mission'
  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
    "MissionCode" : id,
  }

  formLoading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    formLoading.value = false
    router.push('/KARSAAT/assign/mission')

    return res
  }catch(e){
    formLoading.value = false
    throw new Error(e)
  }
}

const onEdit = val=>{
  store.lastItem = val
  router.push(route.fullPath + '/edit/' + val.Code)
}

const handleStatusChange = async (payload,Status)=>{
  let EmployeesMissionCodes = Array.isArray(payload) ? payload : [payload.Code]
  let url = 'mission/set-all-mission-status-by-admin'
  let body = {
    "WorkspaceCode": store.WID,
    Status ,
    EmployeesMissionCodes,
  }

  statusLoading.value = Status.toString()
  try{
    const res = await useHttpPost(url,{ body })

    statusLoading.value = null
    tableRef.value.restart()

    return res
  }catch(e){
    formLoading.value = false

    statusLoading.value = null
    throw new Error(e)
  }
}
</script>


<route>
{
    meta: {
    title: "اختصاص ماموریت"
    }
}
</route>
