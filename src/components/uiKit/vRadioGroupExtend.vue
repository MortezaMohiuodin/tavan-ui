<template>
  <v-radio-group
    v-model="value"
    v-bind="$attrs"
  >
    <v-radio
      v-for="(option,index) in options"
      :key="index"
      v-bind="option"
    />
  </v-radio-group>
</template>

<script setup>
const props = defineProps({
  options : { type : Array ,default : ()=>([]) , required:true },
  modelValue : { type : [String,Number] ,default : ()=>(null) },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props,'modelValue',emit)
</script>
