<template>
  <v-text-field
    :id="uuid"
    v-model="value"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { type: [String,Number] , default : null },
  uuid: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props,'modelValue',emit)
</script>
