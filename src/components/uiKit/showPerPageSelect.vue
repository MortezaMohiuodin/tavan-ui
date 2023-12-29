<template>
  <v-select
    v-model="value"
    variant="filled"
    :items="OPTIONS"
    :clearable="false"
    size="large"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue : { type : Number , default : null },
})

const emit = defineEmits(['update:modelValue'])

const OPTIONS = [10,15,20,50,100]

const value = useVModel(props , 'modelValue',emit)
</script>
