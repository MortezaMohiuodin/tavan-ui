<template>
  <div>
    <table-page-header />
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="onFilterSubmit"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.AbsentCode)"
    />
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const filters = ref({})
const showDeleteAction = ref(!filters.value.IsDelete)

const filterSchema = [
  { key:'Type', type : 'select' , items : $enums.absentTypeAdd , label : 'نوع عدم حضور' },
  'isDelete',
]

const tableSchema = computed(()=>{
  let actions = ['edit']
  if(showDeleteAction.value) actions.push('delete')

  return [
    {
      title: '#',
      key: 'AbsentCode',
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
      title: 'نوع',
      key: 'Type',
      type :'chip',
      value : val=> $getEnum($enums.absentTypeAdd,'key',val.Type,'value'),
    },
    {
      title: 'ساعتی',
      key: 'IsHourly',
      type : 'boolean',
    },
    {
      title: 'نمایش به همکار',
      key: 'ShowToEmployee',
      type : 'boolean',
    },
    {
      title: 'توضیحات',
      key: 'Description',
      width : '170px',
      type : 'ellipsis',
    },
    {

      align: 'center',
      key: 'action',
      actions,
    },
    {
      key:'mobile',
      heading : val=>val.Title,
    },
  ]
})

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpGet('absent/get-workspace-absent',{ params })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.AbsentCode
  let body = {
    "WorkspaceCode": WID,
    "AbsentCode": id,
  }
  try{
    const res = await useHttpPost('absent/delete-absent',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const onFilterSubmit = val=>{
  showDeleteAction.value = !val.IsDelete
  tableRef.value.restart(val)
}
</script>


    <route>
      {
        meta: {
          title: "معرفی انواع عدم حضور"
        }
      }
    </route>
