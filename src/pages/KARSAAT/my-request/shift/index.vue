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
    >
      <template #[`item.action`]="{item}">
        <v-menu
          location="right"
          @update:model-value="(val)=>handleHistory(val , item.raw)"
        >
          <template #activator="{ props }">
            <v-btn-table-info
              v-bind="props"
            />
          </template>
          <v-list
            v-if="historyItems?.length && !historyLoading"
            density="compact"
            width="250"
            min-height="300"
          >
            <v-list-item class="tw-bg-slate-800 tw-text-sm tw-rounded-xl tw-relative -tw-top-2">
              <div class="tw-text-slate-50 tw-text-center">
                اطلاعات شیفت
              </div>
            </v-list-item>
            <v-list-item
              v-for="(item,index) in historyItems"
              :key="index"
              class="!tw-text-sm tw-py-0 tw-my-0"
            >
              {{ item }}
            </v-list-item>
          </v-list>
          <v-list
            v-else
            density="compact"
            width="250"
            min-height="300"
            class="tw-flex tw-flex-col"
          >
            <v-list-item class="tw-bg-slate-800 tw-text-xs tw-rounded-xl tw-relative -tw-top-2">
              <div class="tw-text-slate-50 tw-text-center">
                اطلاعات شیفت
              </div>
            </v-list-item>
            <div class="tw-flex tw-justify-center tw-items-center tw-h-full tw-flex-1">
              <v-progress-circular
                :size="30"
                indeterminate
                class="tw-m-auto"
              />
            </div>
          </v-list>
        </v-menu>
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const historyItems = ref([])
const historyLoading = ref(false)

const filterSchema = [
  'fromDate',
  'toDate',
]

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date',
  },
  {
    title: 'شیفت',
    key: 'ShiftTitle',
  },
  // {
  //   title: 'نوع',
  //   key: 'ShiftType',
  // },
  {
    title: 'ورود',
    key: 'Enter',
  },
  {
    title: 'خروج',
    key: 'Exit',
  },
  {
    title: 'استراحت',
    key: 'Rest',
  },
  {
    title: 'مدت کارکرد',
    key: 'WorkTime',
  },
  {
    title: 'اضافه کاری',
    key: 'Overtime',
    type:'boolean',
  },
  {

    align: 'center',
    key: 'action',
    actions:[],
  },
  {
    key:'mobile',
    heading : val=>val.ShiftTitle,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body ={
    "WorkspaceId": WID,
    "Page": 1,
    ...filters.value,
    ...payload,
  }


  try{
    const res = await useHttpPost('shift/my-shift',{ body })

    res.Data = res.Data.map(val=>({ ...val , 'Id':val.ShiftCode }))

    return res
  }catch(e){
    throw new Error(e)
  }

}

async function handleHistory (isOpen,item){
  if(!isOpen) {
    historyItems.value = []

    return
  }
  historyLoading.value = true

  try{
    let body ={
      "WorkspaceCode": WID,
      "Code" : item.ShiftCode,
    }
    const res = await useHttpPost('shift/get-description-shift-by-code',{ body })

    historyLoading.value = false

    historyItems.value = res.Data
  }catch(e){
    historyLoading.value = false
    throw new Error(e)
  }
}
</script>


<route>
{
meta: {
title: "شیفت های من"
}
}
</route>

