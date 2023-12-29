<template>
  <div>
    <div class="tw-grid tw-grid-cols-12 sm:tw-grid-cols-6 lg:tw-grid-cols-6 tw-gap-3 sm:tw-gap-2 tw-mb-8">
      <v-card-default
        v-for="(statistic, index) in statistics"
        :key="index"
        :loading="statisticsLoading"
        class="report-item"
      >
        <v-icon
          icon="custom:time"
          class="tw-mb-2"
        />
        <b
          class="report-item__data"
          v-text="statistic.value"
        />
        <span
          class="report-item__title"
          v-text="statistic.title"
        />
        <div class="report-item__circle-b" />
        <div class="report-item__circle-s" />
      </v-card-default>
    </div>
    <table-page-header />
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="onSubmitFilter"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
    >
      <template #[`item.Amount`]="{item}">
        <template v-if="item.raw.IsHourly">
          <span>
            -
          </span>
        </template>
        <template v-else>
          <span>{{ item.raw.DayCount }} روز</span>
        </template>
      </template>
      <template #[`item.StartTime`]="{item}">
        <template v-if="item.raw.IsHourly">
          <span>
            {{ item.raw.StartTime }}
          </span>
        </template>
        <template v-else>
          <span>{{ $moment(item.raw.Date).format('jYYYY-jMM-jDD') }}</span>
        </template>
      </template>
      <template #[`item.EndTime`]="{item}">
        <template v-if="item.raw.IsHourly">
          <span>
            {{ item.raw.EndTime }}
          </span>
        </template>
        <template v-else>
          <span>{{ $moment(item.raw.EndDate).format('jYYYY-jMM-jDD') }}</span>
        </template>
      </template>
      <template #[`item.AbsentStatus`]="{item}">
        <v-chip-table :color="$getEnum($enums.replyStatus, 'key', item.raw.AbsentStatus, 'color')">
          {{ $getEnum($enums.replyStatus, 'key', item.raw.AbsentStatus, 'value') }}
        </v-chip-table>
      </template>
      <template #[`item.action`]="{item}">
        <div>
          <v-btn-table-edit
            v-if="item.raw.AbsentStatus === 0"
            v-tooltip="'ویرایش'"
            @click="handleEdit(item.raw)"
          />
          <v-btn-table-trash
            v-if="item.raw.AbsentStatus === 0"
            v-tooltip="'حذف'"
            @click="onDelete(item.raw)"
          />
        </div>
      </template>
    </table-page-data>
  </div>
  <remove-dialog
    v-model="trashModal"
    :loading="deleteLoading"
    @on-confirm="handleDelete"
    @on-cancel="trashModal = false"
  />
</template>

<script setup>
const store = useAppStore()
const route = useRoute()
const router = useRouter()

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const statistics = ref([])
const statisticsLoading = ref(false)
const trashModal = ref(false)
const deleteLoading = ref(false)

const filterSchema = [
  'fromDate',
  'toDate',
  'userStatus',
]

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const statisticsSchema = [
  { key : 'RemainedVacationTime' , title : 'مرخصی باقی مانده به ساعت' },
  { key : 'UsedVacationTime' , title : 'مرخصی استفاده شده(ساعت)' },
  { key : 'TotalHourlyTime' , title : 'مرخصی ساعتی استفاده شده' },
  { key : 'TotalDaily' , title : 'مرخصی روزانه استفاده شده' },
  { key : 'TransferableTime', title : 'قابل انتقال به سال بعد' },
  { key : 'NonTransferableTime' , title  : 'غیر قابل انتقال به سال بعد' },
]

const tableSchema = computed(()=>{
  
  return [
    {
      title: '#',
      key: 'Id',
      align: 'start',
      width: '80px',
    },
    {
      title: 'تاریخ ثبت',
      key: 'Date',
      type : 'date',
    },
    {
      title: 'نوع',
      key: 'AbsentTitle',
      type:'chip',
    },
    {
      title: 'مدت',
      key: 'Amount',
    },
    {
      title: 'شروع',
      key: 'StartTime',
    },
    {
      title: 'پایان',
      key: 'EndTime',
    },
    {
      title: 'جانشین',
      key: 'Substitute',
      value : val=>`${val.Substitute ? `${val.Substitute.Name} ${val.Substitute.Family}` : ''}`,
    },
    {
      title: 'وضعیت',
      key: 'AbsentStatus',
    },
    {

      align: 'center',
      key: 'action',
    },
    {
      key:'mobile',
      heading : val=>val.AbsentTitle,
    },
  ]
})

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const onDelete = value=>{
  item.value = value
  trashModal.value = true
}

const service = async (payload = {})=>{
  let body = {
    "Page": 1,
    ...filters.value,
    "WorkspaceCode": store.WID,
    ...payload,
  }

  try{
    const res = await useHttpPost('absent/get-all-employee-absent',{ body })

    res.Data = res.Data.map(val=>({ ...val,'Fullname':`${val.Name} ${val.Family}` , 'Id':val.Code }))

    return res
  }catch(e){
    throw new Error(e)
  }

}

const handleEdit = val=>{
  store.lastItem = val
  router.push(route.fullPath + '/edit/' + val.Code)
}

async function handleDelete(){
  const id = item.value.Code
  let body = {
    "WorkspaceCode": store.WID,
    "EmployeeAbsentCode" : [id],
  }
  deleteLoading.value = true
  try{

    const res = await useHttpPost('absent/delete-absent-by-employee',{ body })

    tableRef.value.restart()
    deleteLoading.value = false
    trashModal.value = false
    
    return res
  }catch(e){
    deleteLoading.value = false
    throw new Error(e)
  }

}
async function getRemindVacation(){
  let body = {
    WorkspaceCode : store.WID,
    ...filters.value,
  }
  statisticsLoading.value = true
  try{
    const res = await useHttpPost('employee/get-remind-vacation-by-employee', { body })

    statisticsLoading.value = false

    return statisticsSchema.map((value , index)=>{
      const key = value.key 
      
      return {
        ...value,
        value : res.Data[key],
      }
    })
    
  }catch(e){
    statisticsLoading.value = false

    console.log(e)
  }
}

const onSubmitFilter = async  val=>{
  tableRef.value.restart(val)
  statistics.value = await getRemindVacation()
}

onMounted(async()=>{
  statistics.value = await getRemindVacation()
})
</script>

<style lang="scss">
.report-item {
  @apply tw-bg-white tw-flex tw-flex-col tw-pr-4 tw-py-4 tw-rounded-3xl tw-relative tw-overflow-hidden;

  &__data {
    @apply tw-text-lg tw-font-bold tw-mb-1;
  }
  &__title {
    @apply tw-text-sm tw-font-normal tw-text-[#959499];
  }
  &__circle-b {
    @apply tw-w-[58px] tw-h-[58px] tw-bg-secondary-100 tw-rounded-full tw-absolute -tw-top-3.5 -tw-left-3.5;
  }
  &__circle-s {
    @apply tw-w-[14px] tw-h-[14px] tw-bg-secondary-100 tw-rounded-full tw-absolute tw-top-10 tw-left-10;
  }

  &--selected {
    .report-item__data {
      @apply tw-text-primary;
    }
    .report-item__circle-b {
      @apply tw-bg-gradient-to-b tw-from-[#005D34] tw-to-[#8FCCB1];
    }
    .report-item__circle-s {
      @apply tw-bg-gradient-to-b tw-from-[#005D34] tw-to-[#8FCCB1];
    }
  }
}
</style>

<route>
{
meta: {
title: "ثبت مرخصی "
}
}
</route>

