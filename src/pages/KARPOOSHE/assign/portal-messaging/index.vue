<template>
  <div>
    <table-page-header />
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
    >
      <template #[`item.action`]="{item}">
        <v-btn-table-archive
          v-tooltip="'آرشیو'"
          :icon="item.raw.IsArchive ?'mdi:mdi-archive': 'mdi:mdi-archive-outline'"
          @click="handleArchive(item)"
        />
      </template>
    </table-page-data>
    <archive-dialog
      v-model="archiveModal"
      :is-archive="item.IsArchive"
      :loading="archiveLoading"
      @on-confirm="onArchive"
    />
  </div>
</template>

<script setup>
const { WID } = useAppStore()

const filterSchema = [
  'department',
  { key:'Status', label : 'نحوه نمایش پیام' , type:'select',items: $enums.noticeArchive , props:{ multiple:true } },
  { key:'Description',type:'input' , label : 'متن' },
  'fromDate',
  'toDate',
]

const archiveModal = ref(false)
const archiveLoading = ref(false)
const item = ref({})

const tableRef = ref(null)

const tableSchema = [
  {
    title: 'عنوان',
    align : 'start',
    key: 'Title',
  },
  {
    title: 'متن',
    key: 'Description',
    type : 'ellipsis',
    width: '100px',
  },
  {
    title: 'شروع نمایش',
    key: 'StartDate',
    type : 'date',
  },
  {
    title: 'پایان نمایش',
    key: 'EndDate',
    type : 'date',
  },
  {
    title: 'در داشبورد',
    key: 'ShowInDashboard',
    type : 'boolean',
  },
  {
    title: 'در صفحه لاگین',
    key: 'ShowInLogin',
    type : 'boolean',
  },
  {
    title: 'در صندوق',
    key: 'ShowInInbox',
    type : 'boolean',
  },
  {
    title: 'با نوتیف',
    key: 'ShowPushNotif',
    type : 'boolean',
  },
  {
    title: 'دپارتمان',
    key: 'DepartmentList',
    type: 'chipGroup',
    typeProps:{
      variant:'tonal',
    },
  },
  {
    title: 'آرشیو',
    key: 'IsArchive',
    type: 'boolean',
  },
  {

    align: 'center',
    actions : ['delete','edit'],
    key: 'action',
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

const onDelete = async val=>{
  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "Id": id,
  }
  try{
    const res = await useHttpPost('notice/remove',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "Page": 1,
    "DepartmentId" : payload.DepartmentCode,
    "StartDate":payload.ToDate,
    "EndDate": payload.FromDate,
    ...payload,
  }
  try{
    return await useHttpPost('notice/getlist',{ body  })
  }catch(e){
    throw new Error(e)
  }

}

function handleArchive(val){
  item.value = val.raw
  archiveModal.value = true
}

const onArchive = async()=>{
  const id = item.value.Id
  let body = {
    "WorkspaceId": WID,
    "Id": id,
    "IsArchive" : !item.value.IsArchive,
  }

  try{
    archiveLoading.value = true

    const res = await useHttpPost('notice/archive',{ body })

    archiveLoading.value = false
    archiveModal.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    archiveLoading.value = false
    throw new Error(e)
  }
}
</script>



<route>
  {
    meta: {
      title: "مدیریت اطلاع رسانی"
    }
 }
</route>
