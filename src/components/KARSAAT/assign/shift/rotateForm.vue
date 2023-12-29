<template>
  <div>
    <v-divider-extend>
      شیفت دوره ای
    </v-divider-extend>
    <div class="tw-mb-4" />
    <v-card-default>
      <rotate-shift-form-iterator
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
import RotateShiftFormIterator from '@/components/KARSAAT/rotateShiftFormIterator.vue'

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
    { model:  'ShiftRotateCode' , component : 'select' , name: 'rotateShiftSelect' ,items: shiftItems.value , itemValue : 'Code',itemTitle:'Title' ,loading : shiftSelectLoading.value , title : 'شیفت دوره ای'  , required: true , col:{ cols: 4 } },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , required: true ,col:{ cols:12 , lg:3 } },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ'  ,col:{ cols:12 , lg: 3 } , disabled : true },
    { model: 'Repeatable' , component : 'checkbox' , label: 'تکرار شود' , col: { cols:12 , lg:2 } },
  ]
})


const onSubmit = async (payload = {})=>{
  const isEdit = !!payload.AssignCode
  let url = isEdit ? 'shift/edit-assign-rotate-shift':'shift/assign-rotate-shift'
  let EmployeesCodes = isEdit ? id.value : [id.value]
  let EmployeesCodesKey = isEdit ? 'EmployeesCode' : 'EmployeesCodes'
  let body = {
    "WorkspaceCode": WID,
    [EmployeesCodesKey] : EmployeesCodes,
    ...payload,
    "ShiftRotateCode":payload.ShiftRotateCode,
    "AssignmetCode" : payload.AssignCode,
    "AssignedCode" : payload.AssignCode,

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
  let url = 'shift/remove-assign-rotate-shift'
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
  let url = 'shift/get-rotate-shift'
  let params = {
    "WorkspaceCode" :  WID,
  }

  shiftSelectLoading.value = true
  try{
    const res = await useHttpGet(url,{ params })

    shiftItems.value = res.Data
    shiftSelectLoading.value = false

    return res
  }catch(e){
    shiftSelectLoading.value = false
    throw new Error(e)
  }
}


getShiftOptions()
</script>
