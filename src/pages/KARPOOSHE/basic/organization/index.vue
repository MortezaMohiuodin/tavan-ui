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
      v-model="addModal"
    >
      <template #mobile="{item}">
        <table-card-mobile
          :key="item.OrgPositionCode"
          :heading="item.Title"
          :sub-heading="item.OrgPositionCode"
        >
          <template #actions>
            <v-btn-table-mobile
              color="k_white-800"
              icon="custom:edit"
            />
            <v-btn-table-mobile
              class="tw-mx-3"
              color="error"
              icon="custom:trash"
            />
          </template>
        </table-card-mobile>
      </template>
      <template #[`item.action`]="{item}">
        <v-btn-table-trash />
        <v-btn-table-edit />
      </template>
    </v-dialog-extend>
    <v-dialog-extend
      v-model="dialog"
      width="450"
      title="معرفی پست های سازمانی"
      :loading="formLoading"
    >
      <v-form-extend
        v-model="form"
        :schema="formSchema"
        :loading="formLoading"
        :with-card="false"
        :confirm-btn-prop="{class:'tw-text-center'}"
        @on-cancel="onClose"
        @on-submit="submit(form)"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
// common code in table and modal
const { WID } = useAppStore()

// code special for table
const tableRef = ref(null)
const addModal = ref(false)

const tableSchema = [
  {
    title: '#',
    key: 'OrgPositionCode',
    width: '100px',
  },
  {
    title: 'نام پست سازمانی',
    align : 'start',
    key: 'Title',
    width: '200px',
  },
  {
    title: 'توضیحات',
    key: 'Description',
    type:'ellipsis',
  },
  {

    align: 'center',
    key: 'action',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

const onDelete = async val=>{
  const id = val.OrgPositionCode
  let body = {
    "WorkspaceCode": WID,
    "OrgPositionCode": id,
  }
  try{
    const res = await useHttpPost('org-position/delete-org-position',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const service = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    ...payload,
  }
  try{
    return await useHttpGet('org-position/get-workspace-org-position',{ params  })
  }catch(e){
    throw new Error(e)
  }
}

// code special for dialog
const dialog = ref(false)
const formLoading = ref(false)
const form = ref({ Title:'',Description:'' })
const isEdit = ref(false)

const openDialog = ()=>{
  dialog.value = true
}

const openEditDialog = (val={})=>{
  isEdit.value = true
  form.value = {
    ...form.value,
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
    body.OrgPositionCode = payload.OrgPositionCode
  }
  formLoading.value = true
  try{
    let url = isEdit.value ? `/org-position/edit-org-position` : `/org-position/add-new-org-position`
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
  form.value = { Title:'',Description:'' }
  dialog.value = false
  isEdit.value =false
}

const formSchema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان پست سازمانی' ,col : { cols: 12  } , required:true },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات' ,col : { cols: 12 } },
  ]
})
</script>

      <route>
        {
          meta: {
            title: "معرفی پست های سازمانی"
          }
        }
      </route>
