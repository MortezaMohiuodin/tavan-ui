<template>
  <v-select-extend
    v-model="value"
    name="teammate"
    url="department/get-department-teammate"
    method="post"
    :params="{ WorkspaceId :store.WID , EmployeeId:null }"
    :res-callback="data=> data.map(val=>({ 'key' : val.Id,'value' : `${val.Name} ${val.Family}` }))"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : null , required: true },
})

const emit = defineEmits(['update:modelValue'])
const store = useAppStore()
const value = useVModel(props,'modelValue',emit)
</script>
