<template>
  <v-select-extend
    v-model="value"
    url="mission/get-workspace-mission"
    method="get"
    :params="{ WorkspaceCode : store.WID }"
    :res-callback="data=> data.map(val=>({ 'key' : val?.Code , 'value' : val?.Title , ...(returnObject ? {...val} : {}) }))"
    v-bind="$attrs"
    :return-object="returnObject"
  />
</template>
  
<script setup>
const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : null , required: true },
  returnObject : { type : [Object,Boolean] , default : false },
})
  
const emit = defineEmits(['update:modelValue'])
  
const store = useAppStore()
  
const value = useVModel(props,'modelValue',emit)
</script>
  