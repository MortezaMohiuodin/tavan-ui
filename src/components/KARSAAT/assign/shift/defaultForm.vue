<template>
  <div>
    <v-divider-extend>
      تعیین شیفت پیش فرض
    </v-divider-extend>
    <div class="tw-mb-4" />
    <v-card-default>
      <form-section-iterator
        ref="formRef"
        v-model="value"
        :schema="schema"
        :loading="loading"
        row-action-mode
        :on-delete-row="onDelete"
        :on-submit-row="onSubmit"
      />
    </v-card-default>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue : { type : Array , default: ()=>([]) },
  loading : { type : Boolean , default : false },
})

const emit = defineEmits(['update:modelValue','onUpdate'])
const value = useVModel(props,'modelValue',emit)
const route = useRoute()
const { WID } = useAppStore()
const formRef = ref()
const loading = ref(false)
const shiftSelectLoading = ref(false)
const form = ref([])
const id =  computed(()=>route.params.id)
const item= ref({})
const shiftItems = ref([])


const schema = computed(()=>{
  return [
    { model:  'ShiftDefaultCode' , component : 'select' ,name: 'defaultShiftSelect', items: shiftItems.value , loading : shiftSelectLoading.value , title : 'شیفت مورد نظر'   , col:{ cols: 4 } },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' ,col:{ cols:12 , lg:4 } },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ'  ,col:{ cols:12 , lg: 4 } },
  ]
})

const onSubmit = async (payload = {})=>{
  const isEdit = !!payload.AssignCode
  let url = isEdit ? 'shift/edit-assign-default-shift':'shift/assign-default-shift'
  let EmployeesCodes = isEdit ? id.value : [id.value]
  let EmployeesCodesKey = isEdit ? 'EmployeesCode' : 'EmployeesCodes'
  let body = {
    "WorkspaceCode": WID,
    [EmployeesCodesKey] : EmployeesCodes,
    ...payload,
    "AssignmetCode" : payload.AssignCode,
  }

  try{
    const res = await useHttpPost(url,{ body })

    emit('onUpdate')
    form.value = []

    return res
  }catch(e){
    throw new Error(e)
  }
}

const onDelete = async val=>{
  let url = 'shift/remove-assign-default-shift'
  let body = {
    "WorkspaceCode": WID,
    "Codes" : [val.AssignCode],
  }

  try{
    const res = await useHttpPost(url,{ body })

    emit('onUpdate')
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}



const getShiftOptions =async ()=>{
  let url = 'shift/get-workspace-shift'
  let body = {
    "WorkspaceCode" :  WID,
  }

  shiftSelectLoading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    shiftItems.value = res.Data.map(val=>({ 'key' : val.ShiftCode,'value' : val.ShiftTitle }))
    shiftSelectLoading.value = false

    return res
  }catch(e){
    shiftSelectLoading.value = false
    throw new Error(e)
  }
}


getShiftOptions()
</script>
