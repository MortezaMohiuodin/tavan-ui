<template>
  <div>
    <table-page-header />
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
    >
      <template #[`item.IsSuccess`]="{item}">
        <v-chip
          :color="item.raw.IsSuccess ? 'success':'info'"
          rounded="xl"
          variant="tonal"
        >
          {{ item.raw.IsSuccess ? 'تایید شده' : 'در حال بررسی' }}
        </v-chip>
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const router = useRouter()
const route = useRoute()

const filterSchema = [
  'fromDate',
  'toDate',
  { key:'Status',label:'وضعیت', items: $enums.workTermStatus },
]

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'عنوان',
    key: 'Title',
    align: 'start',
    width: '200px',
  },
  {
    title: 'از تاریخ',
    key: 'FromDate',
    type:'date',
  },
  {
    title: 'تا تاریخ',
    key: 'ToDate',
    type : 'date',
  },
  {
    title: 'وضعیت',
    key: 'IsSuccess',
  },
  {
    align: 'center',
    key: 'action',
    actions:['delete',{ icon:'custom:edit', label:'جزئیات' ,  color:'k_white-800', emit:val=>onLink(val) }],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

function onLink (val){
  router.push(route.fullPath + '/detail/' + val.Id)
}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId":WID,
    "FromDate":"",
    "ToDate":"",
    "IsSuccess":null,
    ...filters.value,
    ...payload,
  }
  try{
    return await useHttpPost('workterm/get-list',{ body })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "Id": id,
  }
  try{
    const res = await useHttpPost('workterm/remove',{ body })

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
          title: "دوره های کارکرد"
          }
      }
      </route>
