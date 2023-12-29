<template>
  <div>
    <table-page-header />
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(val)=>onSubmitFilters(val)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=> $router.push(`${$route.fullPath}/edit/${val.ShiftCode}`)"
    >
      <template #[`item.action`]="{item}">
        <v-btn-table-archive
          v-tooltip="'آرشیو'"
          :icon="item.raw.IsArchive ? 'mdi:mdi-archive-plus-minus':'mdi:mdi-archive-plus-outline'"
          @click="handleArchive(item.raw)"
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
const tableRef = ref()
const store = useAppStore()
const archiveModal = ref(false)
const archiveLoading = ref(false)
const filters = ref({})
const showDeleteAction = ref(!filters.value.IsDelete)

const router = useRouter()
const route = useRoute()

const filterSchema = [
  'isArchive',
  'isDelete',
]

const item = ref({})

const tableSchema = computed(()=>{
  let actions = [
    { icon:"mdi:mdi-content-copy",emit:val=>onCopy(val),color:'#6F6F9D' , label: 'کپی' },
    'edit',
  ]
  if(showDeleteAction.value) actions.push('delete')

  return [
    {
      title: '#',
      key: 'ShiftCode',
      align: 'start',
      width: '80px',
    },
    {
      title: 'شیفت',
      key: 'ShiftTitle',
      align: 'start',
      width: '130px',
      type : 'ellipsis',
    },
    {
      title: 'ساعت ورود',
      key: 'Enter',
    },
    {
      title: 'ساعت خروج',
      key: 'Exit',
    },
    {
      title: 'مدت استراحت',
      key: 'Rest',
    },
    {
      title: 'مدت حضور',
      key: 'WorkTime',
    },
    {
      title: 'آرشیو',
      key: 'IsArchive',
      type : 'boolean',
    },
    {
      align: 'center',
      key: 'action',
      actions,
    },
    {
      key:'mobile',
      heading: val=>val.ShiftTitle,
    },
  ]
})

const service = async (payload = {})=>{
  let body = {
    "IsDelete": false,
    "IsArchive": false,
    "WorkspaceCode": store.WID,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpPost('shift/get-workspace-shift',{ body })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.ShiftCode
  let body = {
    "WorkspaceCode": store.WID,
    "ShiftCode": id,
  }
  try{
    const res = await useHttpPost('shift/delete-shift',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

function onCopy(val){
  store.lastItem = val
  router.push(route.fullPath + '/add/copy')
}
function handleArchive(val){
  archiveModal.value = true
  item.value = val
}

const onArchive = async()=>{
  const id = item.value.ShiftCode
  let body = {
    "WorkspaceCode": store.WID,
    "ShiftCode": id,
    "IsArchive" : !item.value.IsArchive,
  }

  try{
    archiveLoading.value = true

    const res = await useHttpPost('shift/set-archive-shift',{ body })

    archiveLoading.value = false
    archiveModal.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    archiveLoading.value = false
    throw new Error(e)
  }
}

const onSubmitFilters = values=>{
  showDeleteAction.value = !values.IsDelete
  tableRef.value.restart(values)
}
</script>


<route>
  {
    meta: {
      title: "معرفی شیفت ها"
    }
  }
</route>
