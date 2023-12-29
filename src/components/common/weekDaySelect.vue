<template>
  <v-card-default class="weekDays">
    <template #title />
    <div class="tw-grid tw-grid-cols-3">
      <v-checkbox
        v-for="weekDay in $enums.weekDays"
        :key="weekDay.key"
        v-model="value"
        class="tw-w-[100px]"
        :label="weekDay.value"
        :value="weekDay.key"
      />
    </div>
  </v-card-default>
</template>

<script setup>
const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : ()=>([]) , required: true },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props,'modelValue',emit)
</script>

<style lang="scss">
.weekDays .v-card-item{
  display: none;
}
</style>
