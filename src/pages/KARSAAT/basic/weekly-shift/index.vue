<template>
  <div>
    <table-page-header :show-filter-btn="false" />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>onEdit(val)"
    />
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const store = useAppStore()
const route = useRoute()
const router = useRouter()

const tableSchema = [
  {
    title: '#',
    key: 'Code',
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
    title: 'شیفت',
    key: 'ShiftList',
    type:'chipGroup',
    typeProps:{
      variant :'tonal',
    },
    value:val=>{
      return val.ShiftList.map(v=>({ ...v,Title:v.ShiftTitle }))
    },
  },
  {

    align: 'center',
    key: 'action',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading: val=>val.Title,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let params = {
    "WorkspaceCode": store.WID,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpGet('shift/get-shift-weekly',{ params })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.Code
  let body = {
    "WorkspaceCode": store.WID,
    "ShiftWeeklyCode": id,
  }
  try{
    const res = await useHttpPost('shift/remove-shift-weekly',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const onEdit = val=>{
  store.lastItem = val
  router.push(route.fullPath + '/edit/' + val.Code)
}
</script>

<route>
{
meta: {
title: "معرفی شیفت هفتگی "
}
}
</route>
