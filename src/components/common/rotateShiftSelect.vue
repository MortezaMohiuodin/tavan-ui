<template>
  <v-select-extend
    v-model="value"
    name="rotate-shift"
    url="shift/get-rotate-shift"
    method="get"
    :params="{ WorkspaceCode :store.WID }"
    :res-callback="data=> data.map(val=>({ 'key' : val.Code,'value' : val.Title,'DayCount':val.DayCount}))"
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
