<template>
  <div>
    <label
      for="filter"
      class="fieldLabel"
    >وضعیت</label>
    <div class="tw-inline-grid tw-py-1 tw-px-4 tw-rounded-[40px] tw-bg-[#F5F7FC]">
      <v-switch
        id="filter-"
        v-model="value"
        class="!tw-inline-grid"
        inset
        size="small"
        color="#B4B4CC"
        density="compact"
        :false-value="0"
        :true-value="1"
        hide-details
      >
        <template #prepend>
          <span :class="[value? 'tw-text-k_black' : 'tw-text-[#B4B4CC]']">فعال</span>
        </template>
        <template #append>
          <span :class="[!value ? 'tw-text-k_black' : 'tw-text-[#B4B4CC]']">فعال</span>
        </template>
      </v-switch>
    </div>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue : { type : [Number,String] , default : null },
})

const emit = defineEmits(['update:modelValue'])


const value = useVModel(props , 'modelValue',emit)
</script>
