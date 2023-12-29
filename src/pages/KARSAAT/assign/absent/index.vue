<template>
  <div>
    <table-page-header title="لیست عدم حضور">
      <template #right>
        <div class="tw-flex tw-gap-1.5">
          <v-btn
            color="secondary"
            size="large"
            elevation="0"
            variant="outlined"
            :to="$route.fullPath + '/default-absent'"
          >
            ثبت عدم حضور پیش فرض
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            elevation="0"
            :disabled="!selected.length"
            variant="outlined"

            @click="groupRemoveDialog = true"
          >
            حذف دسته جمعی
          </v-btn>
          <v-btn
            class="tw-mr-1"
            elevation="0"
            size="large"
            color="secondary"
            :disabled="!selected.length"
            variant="outlined"
            @click="groupStatusDialog = true"
          >
            بررسی دسته جمعی
          </v-btn>
          <v-btn-excel
            :disabled="!activePlugins.includes('ExcelExport')"
            class="tw-mr-2"
            :loading="excelLoading"
            color="secondary"
            @click="getExcel"
          />
        </div>
      </template>
    </table-page-header>
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="onFilterSubmit"
    />
    <table-page-data
      ref="tableRef"
      v-model="selected"
      show-select
      item-value="Code"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Code)"
    >
      <template #[`item.AbsentStatus`]="{item}">
        <v-menu-confirm
          :loading="statusLoading"
          :color="$getEnum($enums.replyStatus,'key',item.raw.AbsentStatus,'color')"
          :message="item.raw.Fullname"
          icon="custom:edit"
          title="تغییر وضعیت"
        >
          <template #activator="{props}">
            <v-btn
              variant="tonal"
              :color="$getEnum($enums.replyStatus,'key',item.raw.AbsentStatus,'color')"
              v-bind="props"
            >
              {{ $getEnum($enums.replyStatus,'key',item.raw.AbsentStatus,'value') }}
            </v-btn>
          </template>
          <template #action>
            <div class="tw-flex tw-gap-2">
              <v-btn
                size="small"
                :variant="item.raw.AbsentStatus === 0 ? 'elevated' : 'tonal'"
                elevation="0"
                color="info"
                @click="onStatusEdit(item.raw , 0)"
              >
                منتظر پاسخ
              </v-btn>
              <v-btn
                size="small"
                elevation="0"
                :variant="item.raw.AbsentStatus === 1 ? 'elevated' : 'tonal'"
                color="success"
                @click="onStatusEdit(item.raw , 1)"
              >
                تایید شده
              </v-btn>
              <v-btn
                size="small"
                :variant="item.raw.AbsentStatus === 2 ? 'elevated' : 'tonal'"
                color="error"
                elevation="0"
                @click="onStatusEdit(item.raw , 2)"
              >
                رد شده
              </v-btn>
            </div>
          </template>
        </v-menu-confirm>
      </template>
      <template #[`item.Amount`]="{item}">
        {{ item.raw.IsHourly ? calcTimeDiff(item.raw.FullStartDate , item.raw.FullEndDate) : item.raw.DayCount + ' روز' }}
      </template>
    </table-page-data>
    <remove-dialog
      v-model="groupRemoveDialog"
      :loading="loading"
      :items="selected"
      @on-confirm="onDelete(selected)"
      @on-cancel="groupRemoveDialog = false"
    />
    <status-dialog
      v-model="groupStatusDialog"
      :loading="loading"
      :items="selected"
      @on-confirm="status=>onStatusEdit(selected , status)"
      @on-cancel="groupStatusDialog = false"
    />
    <v-dialog-extend
      v-model="logDialog"
      :loading="logLoading"
      title="تاریخچه"
      width="500"
    >
      <v-list v-if="!logLoading">
        <v-list-item
          v-for="(log,index) in logs"
          :key="index"
        >
          <p class="tw-font-YEKAN-BAKH-BOLD">
            {{ log.ModifiedAt && $moment(log.ModifiedAt).format('HH:mm  _ jYYYY-MM-DD') }}
          </p>
          <p class="tw-caption">
            {{
              `
               ثبت توسط
                ${log.ModifiedBy && `${log.ModifiedBy?.Name} ${log.ModifiedBy?.Family}`}
            `
            }}
          </p>
        </v-list-item>
      </v-list>
      <div v-else>
        <div class="tw-text-center tw-my-10">
          <v-progress-circular indeterminate />
        </div>
      </div>
    </v-dialog-extend>
  </div>
</template>

<script setup>
import { $getEnum , $enums } from '@/plugins/enums'
import { calcTimeDiff } from '@/helper/utility'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID, activePlugins } = useAppStore()

const selected = ref([])
const loading = ref(false)
const groupRemoveDialog = ref(false)
const groupStatusDialog = ref(false)
const statusLoading = ref(false)
const logDialog = ref(false)
const logLoading = ref(false)
const logs = ref([])
const excelLoading = ref(false)


const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
  "IsDelete" : null,
})

const showDeleteAction = ref(!filters.value.IsDelete)

const filterSchema = [
  'quitWork',
  'department',
  'user',
  'absentType',
  'fromDate',
  'toDate',
  { key:'AbsentStatus',items:$enums.absentStatus,label:'وضعیت مرخصی' },
  'isDelete',
  'userStatus',
]

const tableSchema = computed(()=>{
  let actions = ['edit', { icon:'fa-solid fa-clock-rotate-left',label:'تاریخچه', color:'k_white-800', emit:val=>onLog(val) }]
  if(showDeleteAction.value){
    actions.push('delete')
  }

  return [
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
      type:'withAvatar',
      width:'180px',
    },
    // {
    //   title: 'تاریخ ترک کار',
    //   key: 'QuitWorkDate',
    // },
    {
      title: 'عنوان',
      key: 'AbsentTitle',
    },
    {
      title: 'تاریخ ثبت',
      key: 'CreatedAt',
      type : 'date',
    },
    {
      title: 'شروع',
      key: 'FullStartDate',
      type:'datetime',
    },
    {
      title: 'پایان',
      key: 'FullEndDate',
      type:'datetime',
    },
    {
      title: 'مدت',
      key: 'Amount',
    },
    {
      title: 'نوع',
      key: 'IsHourly',
      type: 'chip',
      typeProps:{
        color: 'primary',
      },
      value : val=>val.IsHourly ? 'ساعتی' : 'روزانه',
    },
    {
      title: 'توضیحات',
      key: 'Description',
    },
    {
      title: 'وضعیت',
      key: 'AbsentStatus',
    },
    {
      title: 'تاریخ تایید',
      key: 'SuccessedAt',
      type : 'date',
    },
    {

      align: 'center',
      key: 'action',
      actions,
    },
    {
      key:'mobile',
      heading : val=>val.Fullname,
    },
  ]
})

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{

  let body = {
    "WorkspaceCode":WID,
    "WorkspaceEmployeeCode":"",
    "AbsentCode":"",
    "DepartmentCode":"",
    "AbsentStatus":null,
    "IsDelete":null,
    "QuitWorkStatus":null,
    "Page": 1,
    ...filters.value,
    "WorkspaceEmployeeCode" : filters.value.EmployeeCode,
    ...payload,
  }
  try{
    const res = await useHttpPost('absent/get-workspace-employee-absent',{ body })

    res.Data = res.Data.map(val=>{
      let startDate = $moment(val?.Date).format('YYYY-MM-DD')
      let endDate = $moment(val?.EndDate).format('YYYY-MM-DD')

      return {
        ...val,
        Fullname : `${val?.Name} ${val?.Family}`,
        FullStartDate : val?.IsHourly ? $moment(startDate+'T'+val.StartTime).format('YYYY-MM-DD HH:mm') : $moment(startDate+'T'+ '00:00:00').format('YYYY-MM-DD HH:mm') ,
        FullEndDate : val?.IsHourly ? $moment(endDate+'T'+val.EndTime).format('YYYY-MM-DD HH:mm') : $moment(endDate+'T'+ '00:00:00').format('YYYY-MM-DD HH:mm'),
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }

}

async function onLog(val){
  logs.value = []
  logDialog.value = true

  const res = await getLog(val)

  logs.value = res?.Data
}
async function getLog(val){
  let body = {
    "WorkspaceCode":WID,
    "Code":val.Code,
  }
  try{
    const res = await useHttpPost('absent/get-employee-absent-logs',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }
}

const onDelete = async (val = null)=>{
  if(!val) return
  let EmployeeAbsentCode = []

  Array.isArray(val)  ? EmployeeAbsentCode = val : EmployeeAbsentCode.push(val.Code)

  let body = {
    "WorkspaceCode": WID,
    EmployeeAbsentCode,
  }
  try{
    loading.value = true

    const res = await useHttpPost('absent/delete-employee-absent-by-admin',{ body })

    loading.value = false
    selected.value = []
    groupRemoveDialog.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const onSubmit = val=>{
  showDeleteAction.value = !val.IsDelete
  tableRef.value.restart(val)
}

const onStatusEdit = async (val = null,status)=>{
  if(!val || typeof status === 'undefined') return
  let EmployeeAbsentIds = []

  Array.isArray(val)  ? EmployeeAbsentIds = val : EmployeeAbsentIds.push(val.Code)

  let body = {
    "WorkspaceId": WID,
    EmployeeAbsentIds,
    AbsentStatus : status,
  }
  try{
    loading.value = true
    statusLoading.value = true

    const res = await useHttpPost('absent/set-all-employee-absent-by-admin',{ body })

    loading.value = false
    groupStatusDialog.value = false
    statusLoading.value = false
    selected.value = []
    tableRef.value.restart()

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const onFilterSubmit = val=>{
  showDeleteAction.value = !val.IsDelete
  tableRef.value.restart(val)
}

async function getExcel(){
  let params ={
    "WorkspaceCode": WID,
    "Page" : tableRef.value.page || 1,
    ...filters.value,
  }
  try{
    excelLoading.value = true

    const res = await useHttpExcel('absent/get-workspace-employee-absent-excel',{ params })

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
      title: "لیست عدم حضور",
      depthLevelType : 0
    }
}
</route>
