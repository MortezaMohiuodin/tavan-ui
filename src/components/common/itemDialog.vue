<template>
  <v-dialog-extend
    v-model="value"
    :loading="loading"
    desktop-mode="drawer"
    append="body"
  >
    <item-detail :item="item" />
  </v-dialog-extend>
</template>

<script setup>
const props = defineProps({
  'modelValue':{ type : Boolean , default :false , required:true },
  'loading':{ type : Boolean , default :false , required:false },
  'item' : { type : Object  , default : ()=>({}) , required: true },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props,'modelValue',emit)
</script>
