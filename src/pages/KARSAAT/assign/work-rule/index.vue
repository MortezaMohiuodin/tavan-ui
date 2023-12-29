<template>
  <div>
    <table-page-header add-item-text="تخصیص قانون کارکرد">
      <template #right>
        <v-btn-error
          color="secondary"
          variant="outlined"
          @click="$router.push($route.fullPath + '/remove/new')"
        >
          حذف فانون کارکرد
        </v-btn-error>
      </template>
    </table-page-header>
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
      @on-edit="onEdit"
    />
    <v-dialog-extend
      v-model="editDialog"
      :actions="false"
    >
      <v-form-extend
        v-model="editForm"
        :schema="editSchema"
        :loading="editLoading"
        @on-submit="submit(editForm)"
        @on-cancel="editDialog = false"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
import WorkspaceRuleSelect from '@/components/common/workspaceRuleSelect.vue'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const editDialog = ref(false)
const editLoading = ref(false)
const editForm = ref({})

const editSchema = [
  { model: 'WorkRuleId' , component :  WorkspaceRuleSelect, title : 'انتخاب قانون کارکرد' ,  col: { cols: 12  }  },
  { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' ,  col: { cols: 12, md: 6  }  },
  { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ' ,  col: { cols: 12, md: 6  }  },
]

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const filterSchema = ['user',
  'workspaceRules',
  'department',
  'fromDate',
  'toDate',
  'quitWork',
  'userStatus']

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    key: 'Fullname',
    type:'withAvatar',
    align: 'start',
    width: '200px',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitWorkDate',
    type : 'date',
  },
  {
    title: 'کد پرسنلی',
    key: 'WorkspaceEmployeeId',
  },
  {
    title: 'دپارتمان',
    key: 'Department',
    type : 'chipGroup',
  },
  {
    title: 'از تاریخ',
    key: 'FromDate',
    type : 'date',
  },
  {
    title: 'تا تاریخ',
    key: 'ToDate',
    type : 'date',
  },
  {
    title: 'قانون کارکرد',
    key: 'RuleType',
    type:'chip',
  },
  {

    align: 'center',
    key: 'action',
    width: '200px',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId":WID,
    "EmployeeId":null,
    "DepartmentId":null,
    "WorkspaceRuleId":null,
    "FromDate":"2023/03/21",
    "ToDate":"2024/03/19",
    "Page":1,
    "QuitWorkStatus":null,
    ...filters.value,
    ...payload,
  }
  try{
    const res = await useHttpPost('employeerules/get-list',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        Fullname : `${val.Name} ${val.Family}`,
      }
    })

    return res
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
    const res = await useHttpPost('employeerules/delete',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

function onEdit(val){
  editForm.value = val
  editDialog.value = true
}

const submit = async (payload = {})=>{
  let url = 'employeerules/edit'
  let body = {
    "WorkspaceId": WID,
    ...payload,
  }

  editLoading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    editForm.value = {}
    editDialog.value = false
    editLoading.value = false

    return res
  }catch(e){
    editLoading.value = false
    throw new Error(e)
  }
}
</script>


  <route>
  {
      meta: {
      title: "لیست قوانین همکاران"
      }
  }
  </route>
