<template>
  <v-select-extend
    v-model="value"
    name="role"
    url="role/get-workspace-role"
    method="get"
    :params="{ WorkspaceCode : store.WID }"
    :res-callback="data=> data.map(val=>({ 'key' : val?.Code , 'value' : val?.Title }))"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { type : [Object,String,Array,Number,null] , default : null , required: true },
})

const emit = defineEmits(['update:modelValue'])
const store = useAppStore()
const value = useVModel(props,'modelValue',emit)
</script>
