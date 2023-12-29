<template>
  <div>
    <table-page-header :show-add-item-link="false">
      <template #right>
        <v-btn
          prepend-icon="custom:plusCircle"
          size="large"
          color="secondary"
          elevation="0"
          @click="handleAddUser"
        >
          افزودن همکار
        </v-btn>
        <v-btn
          v-if="!itemData?.IsSuccess && itemData?.IsSuccess !== null"
          size="large"
          class="tw-mr-2"
          elevation="0"
          color="secondary"
          @click="showAcceptDialog = true"
        >
          تایید نهایی کل لیست
        </v-btn>

        <v-btn
          v-if="itemData?.IsSuccess"
          size="large"
          class="tw-mr-2"
          elevation="0"
          variant="outlined"
          color="secondary"

          @click="showAcceptDialog = true"
        >
          لغو تایید نهایی
        </v-btn>
        <v-btn-excel
          v-if="itemData?.IsSuccess"
          :disabled="!activePlugins.includes('ExcelExport')"
          class="tw-mr-2"
          :loading="excelLoading"
          @click="getExcel"
        />
        <v-btn
          v-if="selected.length"
          size="large"
          class="tw-mr-2"
          elevation="0"
          variant="tonal"
          color="success"
          @click="onChangeStatus({IsSuccess : true , WorkspaceEmployeeIds :selected , type: 'multi' })"
        >
          تایید
        </v-btn>
        <v-btn
          v-if="selected.length"
          size="large"
          class="tw-mr-2"
          elevation="0"
          variant="tonal"
          color="info"
          @click="onChangeStatus({IsSuccess : false , WorkspaceEmployeeIds :selected, type: 'multi' })"
        >
          در انتظار تایید
        </v-btn>
        <v-btn
          v-if="selected.length"
          size="large"
          class="tw-mr-2"
          elevation="0"
          variant="tonal"
          color="error"
          @click="onDelete(selected)"
        >
          حذف دسته جمعی
        </v-btn>
      </template>
      <v-btn-back
        class="tw-mr-2"
        text="برگشت"
        @click="$router.back()"
      />
    </table-page-header>
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <v-row
      v-if="itemData"
      class="tw-mb-2"
    >
      <v-col
        cols="12"
        md="4"
      >
        <v-card-default class="tw-text-center">
          <p class="tw-text-slate-400 tw-text-sm">
            کاربر
          </p>
          <p class="tw-text-slate-900 tw-text-lg tw-mt-4">
            {{ itemData?.Title || '-' }}
          </p>
        </v-card-default>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card-default class="tw-text-center">
          <p class="tw-text-slate-400 tw-text-sm">
            از تاریخ
          </p>
          <p
            class="tw-text-slate-900 tw-text-lg tw-mt-4"
          >
            {{ $moment(itemData?.FromDate).format('jYYYY-jMM-jDD') || '-' }}
          </p>
        </v-card-default>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card-default class="tw-text-center">
          <p class="tw-text-slate-400 tw-text-sm">
            تا تاریخ
          </p>
          <p
            class="tw-text-slate-900 tw-text-lg tw-mt-4"
          >
            {{ $moment(itemData?.ToDate).format('jYYYY-jMM-jDD') || '-' }}
          </p>
        </v-card-default>
      </v-col>
    </v-row>
    <div>
      <table-page-data
        ref="tableRef"
        v-model="selected"
        :service="service"
        show-select
        :table-schema="tableSchema"
        :on-delete="onDelete"
      >
        <template #[`item.IsSuccess`]="{item}">
          <v-btn
            :color="item.raw.IsSuccess ? 'success':'info'"
            rounded="xl"
            variant="tonal"
            :loading="changeStatusSingleLoading && changeStatusSingleLoading === parseInt(item.raw.EmployeeId)"
            @click="onChangeStatus({IsSuccess : !item.raw.IsSuccess , WorkspaceEmployeeIds :[item.raw.EmployeeId] , type: 'single' })"
          >
            {{ item.raw.IsSuccess ? 'تایید شده' : 'در انتظار تایید' }}
          </v-btn>
        </template>
        <template #[`item.WorkTermCalcuError`]="{item}">
          <v-tooltip
            :disabled="!item.raw?.WorkTermCalcuError?.length"
          >
            <v-list class="tw-bg-transparent">
              <v-list-item
                v-for="(error,index) in item.raw?.WorkTermCalcuError"
                :key="index"
                class="tw-text-slate-200"
              >
                {{ error }}
              </v-list-item>
            </v-list>
            <template #activator="{ props }">
              <v-icon
                v-if="item.raw?.WorkTermCalcuError?.length"
                v-bind="props"
                icon="custom:error"
              />
            </template>
          </v-tooltip>
        </template>
      </table-page-data>
      <v-overlay
        :model-value="refreshLoading"
        contained
        persistent
        scrim="white"
      />
      <div class="tw-mt-5">
        <v-alert
          v-for="(err,i) in errMsgs"
          :key="i"
          variant="tonal"
          rounded="xl"
          type="error"
          :text="err"
          class="tw-my-2"
          closable
        />
      </div>
    </div>
  </div>
  <v-dialog-extend
    v-model="showEmployeeDialog"
    title="افزودن همکار به لیست"
    cancel-btn-text="بستن"
    :loading="loading"
    width="400px"
    color="info"
    confirm-btn-text="ثبت"
    :confirm-btn-props="{color: 'info'}"
    @on-cancel="showEmployeeDialog = false"
    @on-confirm="onAddEmployee"
  >
    <employees-selector
      v-model="WorkspaceEmployeeIds"
      class="tw-mt-3"
      :with-card="false"
      style="height: 500px;margin-bottom: 20px"
      :show-department-filter="false"
      :show-selected-list="false"
    />
  </v-dialog-extend>
  <accept-dialog
    v-model="showAcceptDialog"
    :loading="changeStatusLoading"
    :message="`وضعیت همه ی کارکردها به ${!itemData?.IsSuccess ? 'تایید نهایی' : 'لغو تایید نهایی'} تغییر یابد؟ `"
    @on-confirm="onChangeStatus({IsSuccess: !itemData?.IsSuccess , type: 'all'})"
  />
  <warn-dialog
    v-model="showWarnDialog"
    :loading="loading"
    message="بعضی رکوردها دارای خطا هستند، آیا از تایید همه موارد اطمینان دارید؟"
    @on-confirm="onChangeStatus({Confirm:true,IsSuccess: !itemData?.IsSuccess, type: 'all'})"
  />
  <v-dialog-extend
    v-model="detailDialog"
    :title="`جزئیات تردد ${item.Name + ' ' + item.Family}`"
    width="600"
    color="primary"
    @on-cancel="detailDialog = false"
  >
    <entity-detail
      :item="item"
      :schema="detailSchema"
    />
  </v-dialog-extend>
</template>

<script setup>
import { minuteToHms } from '@/helper/utility'
import { useSnackbar } from '@/composables/useSnackbar'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID,activePlugins } = useAppStore()
const router = useRouter()
const route = useRoute()
const refreshLoading = ref(false)
const itemData = ref(null)
const selected = ref([])
const WorkspaceEmployeeIds = ref([])
const showEmployeeDialog =ref(false)
const loading =ref(false)
const showAcceptDialog = ref(false)
const detailDialog = ref(false)
const message = ref(null)
const showWarnDialog = ref(false)
const changeStatusLoading = ref(false)
const changeStatusSingleLoading = ref(null)
const excelLoading = ref(false)
const errMsgs = ref([])

const filterSchema = [
  'department',
  'user',
  { key:'ErrorStatus',label:'وضعیت خطا', items: $enums.errorStatus },
  { key : 'IsSuccess' , label : 'تایید شده' , type : 'checkbox' , class : 'tw-mt-7' },
]

const filters = ref({
  "IsSuccess": null,
})

const tableSchema = computed(()=>{
  return   [
    {
      title: '#',
      key: 'Id',
      align: 'start',
      width: '80px',
    },
    {
      title: 'نام و نام خانوادگی',
      key: 'FullName',
      align: 'start',
      width: '200px',
      type: 'withAvatar',
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
      title: 'اضافه کاری',
      key: 'Overtime',
    },
    {
      title: 'کسری کار',
      key: 'ShortageTime',
    },
    {
      title: 'مرخصی',
      key: 'AbsentTime',
    },
    {
      title: 'وضعیت',
      key: 'IsSuccess',
    },
    {
      title: '',
      key: 'WorkTermCalcuError',
    },
    {

      align: 'center',
      key: 'action',
      actions:['delete',{ icon:'custom:eye',emit:val=>onEye(val) , label:'مشاهده جزئیات' } , { icon: 'fa fa-refresh' , emit : val=>onRefresh(val) , label : 'محاسبه مجدد' }],
    },
    {
      key:'mobile',
      heading : val=>val.Title,
    },
  ]
})

function onEye (val){
  item.value = {
    ...val,
    FromDate : $moment(itemData.value.FromDate).format('jYYYY-jMM-jDD'),
    ToDate : $moment(itemData.value.ToDate).format('jYYYY-jMM-jDD'),
  }
  detailDialog.value = true
}
async function onRefresh (val){
  errMsgs.value = []

  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "Id": route.params?.id,
    "WorkspaceEmployeeIds" : [id],
  }
  try{
    refreshLoading.value = true

    const res = await useHttpPost('worktermcalcu/refresh',{ body })

    refreshLoading.value = false

    return res
  }catch(e){
    errMsgs.value = e.response?._data?.Data
    refreshLoading.value = false
    throw new Error(e)
  }
}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId":WID,
    "ErrorStatus":null,
    "IsSuccess" : null,
    "DepartmentId" :  payload?.DepartmentCode,
    "EmployeeId" : payload?.EmployeeCode,
    "Page" : 1,
    "Id" : route.params.id,
    ...filters.value,
    ...payload,
  }
  try{
    const res =  await useHttpPost('workterm/get',{ body })
    const ignore = ['EmployeeId','Family','IsSuccess','LastUpdate','QuitWorkDate','WorkTermCalcuError','Pic','OverTimeMax']

    itemData.value = res.Data
    res.Data = res.Data.WorkTermCalcu.map(val=>{
      let toMinutes = {}
      Object.entries(val).forEach(([key, value])=>{
        if(!ignore.includes(key) && typeof value === 'number'){
          let toMinute = minuteToHms(value)
          toMinutes[key] = toMinute 
        }
      })
      
      return {
        ...val,
        FullName : `${val.Name} ${val.Family}`,
        Id : val.EmployeeId,
        ...toMinutes,
      }
    })
    
    return res
  }catch(e){
    throw new Error(e)
  }

}

const detailSchema = [
  { key : 'FromDate', title : 'از تاریخ' },
  { key : 'ToDate', title : 'تا تاریخ' },
  { key : 'EmployeeCode', title : 'کد کارمندی' },
  { key : 'TotalWorkTime', title : 'کارکرد شیفت' },
  { key : 'WorkTime', title : 'کل کارکرد' },
  { key : 'Overtime', title : 'اضافه کاری' },
  { key : 'DelayTime', title : 'تاخیر' },
  { key : 'RushTime', title : 'تعجیل' },
  { key : 'Vacation', title : 'تعطیل کاری' },
  { key : 'OvertimeFriday', title : 'جمعه کاری' },
  { key : 'ShortageTime', title : 'کسری کار' },
  { key : 'RotateWork1', title : 'کار گردشی صبح عصر' },
  { key : 'RotateWork2', title : 'کار گردشی صبح شب' },
  { key : 'RotateWork3', title : 'کار گردشی عصر شب' },
  { key : 'RotateWork4', title : 'کار گردشی صبح عصر شب' },
  { key : 'AbsentTime', title : 'عدم حضور' },
  { key : 'MissionTime', title : 'ماموریت روزانه' },
  { key : 'MissionHourly', title : 'ماموریت ساعتی' },
  { key : 'NightWork', title : 'شب کاری' },
  { key : 'NightWork', title : 'مرخصی استعلاجی' },
  { key : 'Vacation', title : 'مرخضی روزانه' },
  { key : 'VacationHourly', title : 'مرخصی ساعتی' },
]

const onDelete = async val=>{
  errMsgs.value = []

  const isGroup = Array.isArray(val)
  let WorkspaceEmployeeIds = isGroup  ? val : [val.Id]
  let body = {
    "WorkspaceId": WID,
    "Id": route.params?.id,
    WorkspaceEmployeeIds,
  }
  try{
    const res = await useHttpPost('worktermcalcu/remove',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    errMsgs.value = e.response?._data?.Data || []

    return true
  }
}

function handleAddUser(){
  showEmployeeDialog.value = true
}

onMounted(async () => {
  let res
  if(route.params.id){
    res = await service()
  }
})
async function onAddEmployee (){
  let body = {
    "WorkspaceId": WID,
    "Id": route.params?.id,
    "WorkspaceEmployeeIds" :WorkspaceEmployeeIds.value,
  }
  try{
    loading.value = true

    const res = await useHttpPost('worktermcalcu/add',{ body })

    loading.value = false
    tableRef.value.restart()
    showEmployeeDialog.value = false

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
async function onChangeStatus (val={ type : 'single' }){
  let url
  if(val?.type === 'single' || val?.type === 'multi') url = 'worktermcalcu/change-status'
  else if(val?.type === 'all') url = 'workterm/change-status'
  else return
  let body = {
    "WorkspaceId": WID,
    "Id": route.params?.id,
    ...val,
  }

  try{
    if(val?.type === 'single'){
      changeStatusSingleLoading.value = val?.WorkspaceEmployeeIds[0] && parseInt(val?.WorkspaceEmployeeIds[0])
    }else if(val?.type === 'multi'){
      changeStatusLoading.value = true
    }

    const res = await useHttpPost(url,{ body })

    changeStatusSingleLoading.value = false
    changeStatusLoading.value = false
    showWarnDialog.value = false
    showAcceptDialog.value = false
    tableRef.value.restart({ ...filters.value })
    selected.value = []

    return res
  }catch(e){
    changeStatusSingleLoading.value = false
    changeStatusLoading.value = false
    let message = e.response['_data']?.Modal
    if(message){
      showWarnDialog.value = true
      showAcceptDialog.value = false
      message.value = message
    }else if(e.response.status  === 400){
      const errMsg = e.response?._data?.Data[0]

      useSnackbar(errMsg, 'error')
    }
    throw new Error(e)
  }
}

async function getExcel(){
  let params ={
    "WorkspaceId": WID,
    "Id" : route.params?.id,
    ...filters.value,
  }
  try{
    excelLoading.value = true

    const res = await useHttpExcel('workterm/get-to-excel',{ params })

    excelLoading.value = false

    return res
  }catch(e){
    excelLoading.value = false
    throw new Error(e)
  }
}

watch(showEmployeeDialog , val=>{
  if(!val){
    WorkspaceEmployeeIds.value = []
  }
})
</script>


<route>
{
    meta: {
    title: "جزئیات دوره های کارکرد"
    }
}
</route>
