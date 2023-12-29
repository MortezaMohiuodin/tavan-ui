<template>
  <v-select-extend
    v-model="value"
    name="orgPosition"
    url="org-position/get-workspace-org-position"
    method="get"
    :params="{ WorkspaceCode : store.WID }"
    :res-callback="data=> data.map(val=>({ 'key' : val?.OrgPositionCode , 'value' : val?.Title }))"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { type : [Object,String,Array,null] , default : null , required: true },
})

const emit = defineEmits(['update:modelValue'])
const store = useAppStore()
const value = useVModel(props,'modelValue',emit)
</script>
