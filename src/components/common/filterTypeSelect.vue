<template>
  <v-select-extend
    v-model="value"
    :items="$enums.filterType"
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
