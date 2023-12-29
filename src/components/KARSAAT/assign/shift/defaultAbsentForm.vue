<template>
  <div>
    <v-divider-extend>
      عدم حضور پیش فرض
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
        :max="1"
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
const form = ref([])
const id =  computed(()=>route.params.id)
const item= ref({})
const items = ref([])

const schema = computed(()=>{
  return [
    { model:  'AbsentCode' , component : 'select' , name: 'absentTypeGeneral' ,items: items.value , itemValue : 'AbsentCode',itemTitle:'Title' ,loading : loading.value , title : 'تعیین عدم حضور'  , col:{ cols: 12 , lg:3 } },
  ]
})


const onSubmit = async (payload = {})=>{
  let url = 'employee/set-absent-default'
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode" : id.value,
    ...payload,
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
  let url = 'employee/remove-absent-default'
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode" : id.value,
  }

  try{
    const res = await useHttpPost(url,{ body })

    emit('onUpdate')
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}



const getOptions =async ()=>{
  let url = 'absent/get-workspace-absent'
  let params = {
    "WorkspaceCode" :  WID,
  }

  loading.value = true
  try{
    const res = await useHttpGet(url,{ params })

    items.value = res.Data
    loading.value = false

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}


getOptions()
</script>
