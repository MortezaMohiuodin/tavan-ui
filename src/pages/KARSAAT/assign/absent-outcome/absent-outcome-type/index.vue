<template>
  <div>
    <table-page-header
      add-modal
      :show-filter-btn="false"
      @on-add="openDialog"
    >
      <v-btn-back
        class="tw-mr-2"
        text="بازگشت"
        @click="$router.back()"
      />
    </table-page-header>
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="onEdit"
    />
    <v-dialog-extend
      v-model="dialog"
      width="450"
      :title="isEdit ? 'ویرایش' : 'جدید'"
      color="success"
      :loading="loading"
      cancel-btn-text="انصراف"
      confirm-btn-text="ثبت"
      @on-cancel="onCancel"
      @on-confirm="submit(form)"
    >
      <v-form-extend
        v-model="form"
        :schema="schema"
        :actions="false"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const dialog = ref(false)
const isEdit = ref(false)
const form = ref({})
const loading = ref(false)

const openDialog = ()=>{
  dialog.value = true
}

const schema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان' ,col : { cols: 12  } , required:true },
  ]
})


const onCancel = ()=>{
  dialog.value = false
  form.value = {}
  item.value = {}
  isEdit.value = false
}

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'عنوان مدرک',
    key: 'Title',
    width: '200px',
  },
  {

    align: 'center',
    key: 'action',
    actions:['edit','delete'],
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId":WID,
    "Page":1,
    ...payload,
  }
  try{
    return await useHttpPost('absentOutcomeType/getlist',{ body })
  }catch(e){
    throw new Error(e)
  }

}

const onEdit = val=>{
  isEdit.value = true
  item.value = val
  form.value = val
  dialog.value = true
}

const onDelete = async val=>{

  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "Id": id,
  }
  try{
    const res = await useHttpPost('absentOutcomeType/remove',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{

  const id = payload?.Id
  let url = isEdit.value ?  'absentOutcomeType/edit' : 'absentOutcomeType/add'

  let body = {
    "WorkspaceId": WID,
    ...(isEdit.value ? { 'Id' : id } : {}),
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    dialog.value = false
    loading.value = false
    item.value = {}
    form.value = {}
    isEdit.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    loading.value = false
    dialog.value = false
    throw new Error(e)
  }
}

watch(dialog,val=>{
  if(val) return
  item.value = {}
  form.value = {}
  isEdit.value = false
})
</script>


<route>
{
meta: {
title: "انواع مانده مرخصی"
}
}
</route>
