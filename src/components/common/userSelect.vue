<template>
  <v-select-extend
    v-model="value"
    name="user"
    url="employee/get-all"
    method="post"
    :params="{ WorkspaceCode :store.WID ,Status: null,DepthLevelType: DepthLevelType }"
    :res-callback="data=> data.map(val=>({ 'key' : val.EmployeesCode,'value' : `${val.Name} ${val.Family}` }))"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : null , required: true },
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()

const DepthLevelType = computed(()=>{
  let result = route.meta?.depthLevelType
  if(result === 0)
    return result
  
  return result || null
})

const store = useAppStore()
const value = useVModel(props,'modelValue',emit)
</script>
