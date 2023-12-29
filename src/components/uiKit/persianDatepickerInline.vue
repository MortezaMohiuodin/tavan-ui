<template>
  <div class="persian-datepicker-inline">
    <v-card-default width="250">
      <div class="tw-text-center">
        {{ monthName }}
        {{ year }}
      </div>
      <div class="tw-grid tw-grid-cols-7 tw-gap-3">
        <div
          v-for="weekDay in $enums.weekDaysShort"
          :key="weekDay.value"
          class="tw-inline-grid tw-text-center tw-text-sm tw-caption tw-w-[25px] tw-rounded-full tw-h-[25px]  tw-items-center tw-justify-center"
        >
          {{ weekDay.value }}
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-7 tw-gap-3 tw-mt-3">
        <div
          v-for="(day,index) in days"
          :key="index"
          class="tw-text-base tw-cursor-pointer tw-inline-grid tw-text-center tw-shadow tw-text-black tw-w-[25px] tw-rounded-full tw-h-[25px]  tw-items-center tw-justify-center"
          :class="{'tw-bg-info-100' : selected.includes(index)}"
          @click="toggle(index)"
        >
          {{ day }}
        </div>
      </div>
    </v-card-default>
  </div>
</template>

<script setup>
import PersianDatepickerTest from 'vue3-persian-datetime-picker'

const props = defineProps({
  modelValue : { type: Array, default : ()=>([]) , required : true },
  days : { type : Array , default : ()=>([]) },
  month: { type : Number ,default: 0 },
  year : { type : Number ,default : 1402 },
})

const emit = defineEmits(['update:modelValue'])

const monthName = computed(()=>{
  return $getEnum($enums.months, 'key' , props.month , 'value')
})

const days = ref($moment.jDaysInMonth(props.year, props.month) )
const selected = useVModel(props,'modelValue',emit)

const toggle = val=>{
  if(selected.value.includes(val)){
    selected.value = selected.value.filter(value=>value !== val)
  }else{
    selected.value.push(val)
  }
}
</script>

<style lang="scss">

</style>