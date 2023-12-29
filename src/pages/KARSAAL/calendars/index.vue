<template>
  <table-page-header :show-filter-btn="false" />
  <table-page-data
    ref="tableRef"
    :service="service"
    :table-schema="tableSchema"
    :on-delete="onDelete"
    @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
  />
</template>
  
<script setup>
const tableRef = ref()
const { WID } = useAppStore()
  
const loading = ref(false)
  
const tableSchema = computed(()=>{
  return [
    {
      title: '#',
      key: 'Id',
      align: 'start',
      width: '80px',
    },
    {
      title: 'عنوان',
      key: 'Title',
    },
    {
      title: 'تعداد روزهای تعطیل',
      key: 'holidays',
    },
    {
  
      key: 'action',
      actions : ['edit','delete'],
    },
    {
      key:'mobile',
      heading : val=>val.Title,
      subHeading : val=> val.Id,
      more : val => `روزهای تعطیل : ${val?.holidays}`,
    },
  ]
})
  
  
const service = async (payload = {})=>{
  
  let body = {
    "WorkspaceId":WID,
    "Page": 1,
    ...payload,
  }
  try{
    const res = await useHttpPost('workspacecalender/get-list',{ body })
  
    res.Data = res.Data.map(val=>{
      return {
        ...val,
        holidays : val?.Days?.length || 0,
      }
    })
  
    return res
  }catch(e){
    throw new Error(e)
  }
  
}
  
const onDelete = async val=>{
  let body = {
    "WorkspaceId": WID,
    "WorkspaceCalendarId" : val.Id ,
  }
  try{
    loading.value = true
  
    const res = await useHttpPost('workspacecalender/delete',{ body })
  
    loading.value = false
  
    tableRef.value.restart()
  
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
</script>
  
  
  <route>
  {
      meta: {
      title: "لیست تقویم ها"
      }
  }
  </route>
  