<template>
  <v-text-field
    v-model="value"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { type: [String,Number] , default : null },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props,'modelValue',emit)
</script>
