<template>
  <div>
    <table-page-header
      add-modal
      @on-add="openDialog"
    >
      <template #right>
        <v-btn
          color="secondary"
          size="large"
          elevation="0"
          variant="outlined"
          @click="$router.push($route.fullPath + '/absent-outcome-type')"
        >
          انواع مانده مرخصی
        </v-btn>
      </template>
    </table-page-header>
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
        :schema="isEdit ? editSchema :addSchema"
        :actions="false"
      >
        <template #[`before.min`]>
          <v-col cols="12">
            <span> مقدار</span>
          </v-col>
        </template>
      </v-form-extend>
    </v-dialog-extend>
  </div>
</template>

<script setup>
import userSelect from '@/components/common/userSelect.vue'
import absentOutcomeSelect from '@/components/common/absentOutcomeSelect.vue'
import { secondToHms } from '@/helper/utility'

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

const addSchema = computed(()=>{
  return [
    { model:'EmployeeId', component : userSelect, title : 'کاربر' ,col : { cols: 12  } , required:true },
    { model: 'Type' , component : 'select' , title : 'نوع' , items: $enums.absentOutcomeType ,col : { cols: 12 },required:true },
    { model: 'AbsentOutcomeTypeId' , component : absentOutcomeSelect , title : 'عنوان مرخصی', col: { cols: 12 } ,required:true },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات', col: { cols: 12  }  },
    { model: 'Minute' , component : 'input' , title : 'دقیقه', col: { cols: 6  },required:true  },
    { model: 'Hour' , component : 'input' , title : 'ساعت', col: { cols: 6 },required:true  } ,
  ]
})

const editSchema = computed(()=>{
  return [
    { model: 'Type' , component : 'select' , title : 'نوع' , items: $enums.absentOutcomeType ,col : { cols: 12 },required:true },
    { model: 'AbsentOutcomeTypeId' , component : absentOutcomeSelect , title : 'عنوان مرخصی', col: { cols: 12 },required:true  },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات', col: { cols: 12  }  },
    { model: 'Minute' , component : 'input' , title : 'دقیقه', col: { cols: 6  },required:true  },
    { model: 'Hour' , component : 'input' , title : 'ساعت', col: { cols: 6 },required:true  } ,
  ]
})

const onCancel = ()=>{
  dialog.value = false
  form.value = {}
  item.value = {}
  isEdit.value = false
}


const filterSchema = [
  'quitWork',
  'department',
  'user',
  'year',
  { key:'Type',type:'select',items:$enums.absentOutcomeType,label:'انتخاب نوع' },
  'absentOutcomeType',
  'userStatus',
]

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
    title: 'دپارتمان',
    key: 'Departement',
    type : 'chipGroup',
    value: val=>val.Department.map(v=>v.Title),
  },
  {
    title: 'سال',
    key: 'Year',
  },
  {
    title: 'مدت',
    key: 'Amount',
    value : val=> val.Amount && secondToHms(val.Amount),
  },
  {
    title: 'نوع',
    key: 'Type',
    type:'chip',
  },
  {
    title: 'نوع مانده مرخصی',
    key: 'AbsentOutcomeTypeTitle',
    type : 'chip',
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
    "EmployeeId":null,
    "Page":1,
    "DepartmentId":null,
    "Year":null,
    "QuitWorkStatus":null,
    "AbsentOutcomeTypeId":null,
    "ClearCache":false,
    ...payload,
  }
  try{
    const res = await useHttpPost('employeeabsentoutcome/getlist',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        Fullname : `${val?.Employee.Name} ${val?.Employee.Family}`,
        QuitWorkDate : val?.Employee?.QuitWorkDate,
        Pic : val?.Employee?.Pic,
        Department : val?.Employee?.Department,
        Type : { key: val.Type,value : $getEnum($enums.absentOutcomeType,'key',val.Type,'value') },
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }

}

const onEdit = val=>{
  isEdit.value = true
  let res = {
    Id : val.Id,
    Employee : val.Employee,
    Type : val.Type.key,
    "Year": val.Year,
    "Amount": val.Amount,
    "AbsentOutcomeTypeTitle": val.AbsentOutcomeTypeTitle,
    "AbsentOutcomeTypeId": val.AbsentOutcomeTypeId,
    "Description": val.Description,
    "Hour": Math.floor(val.Amount/60),
    "Minute": val.Amount%60,
  }
  item.value = res
  form.value = res
  dialog.value = true
}

const onDelete = async val=>{
  console.log('test')

  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "Id": id,
  }
  try{
    const res = await useHttpPost('employeeabsentoutcome/remove',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{

  const id = payload?.Id
  let url = isEdit.value ?  'employeeabsentoutcome/update' : 'employeeabsentoutcome/add'
  let Amount = parseInt(payload.Hour) * 60 + parseInt(payload.Minute)

  let body = {
    "WorkspaceId": WID,
    ...(isEdit.value ? { 'Id' : id } : {}),
    ...payload,
    Amount,
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
      title: "مانده مرخصی",
      depthLevelType : 0
    }
}
</route>
