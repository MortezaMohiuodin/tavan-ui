<template>
  <v-select-extend
    v-model="value"
    name="daily-shift"
    url="shift/get-workspace-shift"
    method="post"
    :params="{ WorkspaceCode :store.WID , Status:null }"
    :res-callback="data=> data.map(val=>({ 'key' : val.ShiftCode,'value' : val.ShiftTitle }))"
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
