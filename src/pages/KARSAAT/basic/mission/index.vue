<template>
  <div>
    <table-page-header
      add-modal
      :show-filter-btn="false"
      @on-add="openDialog"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>openEditDialog(val)"
    />

    <v-dialog-extend
      v-model="dialog"
      width="450"
      title="تعریف ماموریت جدید"
      color="success"
      :loading="formLoading"
    >
      <v-form-extend
        v-model="form"
        :schema="formSchema"
        :loading="formLoading"
        :with-card="false"
        @on-cancel="onClose"
        @on-submit="submit(form)"
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
const formLoading = ref(false)
const form = ref({ IsHourly:false,ShowToEmployee:false })
const isEdit = ref(false)

const openDialog = ()=>{
  dialog.value = true
}


const openEditDialog = (val={})=>{
  isEdit.value = true
  form.value = {
    ...val,
  }
  dialog.value = true
}

watch(dialog, val=>{
  if(!val) {
    onClose()
  }
})

const submit = async (payload = {})=>{
  if(!form.value.Title) return
  let body = {
    "WorkspaceCode": WID,
    ...payload,
  }
  if(isEdit.value){
    body.Code = payload.Code
  }
  formLoading.value = true
  try{
    let url = isEdit.value ? `mission/edit-mission` : `mission/add-new-mission`
    const res = await useHttpPost(url,{ body })

    formLoading.value = false
    tableRef.value.restart()
    onClose()

    return res
  }catch(e){
    formLoading.value = false
    throw new Error(e)
  }
}

function onClose(){
  formLoading.value = false
  form.value = { IsHourly:false,ShowToEmployee:false }
  dialog.value = false
  isEdit.value =false
}

const formSchema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان ماموریت' ,col : { cols: 12  } , required:true },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات' ,col : { cols: 12 } },
    { model: 'IsHourly' , component : 'checkbox' , label : 'ماموریت ساعتی است؟', col: { cols: 12 }  },
    { model: 'ShowToEmployee' , component : 'checkbox' , label : 'به همکاران نمایش داده شود', col: { cols: 12 }  },
  ]
})


const filterSchema = []

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
    width: '200px',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

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
    return await useHttpGet('mission/get-workspace-mission',{ params })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.Code
  let body = {
    "WorkspaceCode": WID,
    "Code": id,
  }
  try{
    const res = await useHttpPost('mission/remove-mission',{ body })

    tableRef.value.restart()

    return true
  }catch(e){
    throw new Error(e)
  }
}
</script>


<route>
{
    meta: {
    title: "معرفی انواع ماموریت "
    }
}
</route>
