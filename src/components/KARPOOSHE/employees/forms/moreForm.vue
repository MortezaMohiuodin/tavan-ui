<template>
  <v-card-default>
    <label class="fieldLabel tw-pb-2">
      تعیین عمق سطوح دسترسی به همکاران
    </label>
    <form-section-iterator
      v-model="DepthLevelsList"
      :schema="schema"
      class="!tw-p-5"
      :loading="loading"
      submit
      :disabled="props.disabled"
      @on-remove="removeDepthLevel"
      @on-submit="onSubmit"
    />
  </v-card-default>
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : [Array,Object] , default : null,required: true },
  'loading' : { type : Boolean, default:false },
  'disabled' : { type : [Boolean,Array], default:false },
})

const emit = defineEmits(['next','prev'])
const { WID, workspace } = useAppStore()
const loading = ref(false)
const DepthLevelsList = ref([])
const canSave = ref(false)
const initialValue = ref(null)

const schema = [
  { model:'DepthLevelType', component : 'select', title : 'نوع دسترسی' , items: $enums.depthLevel , required: true },
  { model:'Depth', component : 'input', title : 'عمق دسترسی' ,required: true },
]

if(typeof props.disabled === 'object'){
  schema.forEach(s => {
    if(props.disabled.includes(s.model)) s.disabled=true
  })
}
else{
  schema.forEach(s => {
    s.disabled=props.disabled
  })
}
const value = useVModel(props, 'modelValue' ,emit)

const submit = ()=>{
  let payload = value.value
  emit('next' , payload)
}

const getDepthLevel = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "EmployeeId": value.value.EmployeeCode || workspace.UserEmployeeCode ,
    ...payload,
  }
  try{
    loading.value =true

    const res = await useHttpPost('DepthLevel/get',{ body  })

    loading.value = false

    return res
  }catch(e){
    throw new Error(e)
  }
}

watch(DepthLevelsList,val=>{

  if(!initialValue.value) return
  if(JSON.stringify(val) !== JSON.stringify(initialValue.value)){
    canSave.value = true
  }
},{ deep:true })

const init =  async()=>{
  const res = await getDepthLevel()
  let clone = JSON.parse(JSON.stringify(res.Data))
  initialValue.value = clone || []
  DepthLevelsList.value = res.Data
}

const removeDepthLevel = async id=>{
  let body = {
    "WorkspaceId": WID,
    "Id" : id,
  }
  try{
    return await useHttpPost('DepthLevel/remove',{ body  })
  }catch(e){
    throw new Error(e)
  }
}

const onSubmit = async ()=>{
  let body = {
    "WorkspaceId": WID,
    "EmployeeId" : value.value.EmployeeCode,
    "DepthLevelsList" : DepthLevelsList.value,
  }
  try{
    loading.value = true

    const res = await useHttpPost('DepthLevel/add',{ body  })

    loading.value =false

    const response = await getDepthLevel()

    initialValue.value = response.Data || []
    DepthLevelsList.value = response.Data

    return res
  }catch(e){
    throw new Error(e)
  }
}

onMounted(()=>{
  init()
})
</script>
