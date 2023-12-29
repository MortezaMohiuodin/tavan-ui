<template>
  <div class="tw-mr-auto tw-w-fit">
    <v-pagination
      v-show="length > 1"
      :model-value="stepPagination"
      :length="length"
      size="35"
      variant="flat"
      :total-visible="5"
      class="tw-mt-[22px]"
      @update:model-value="(e)=>$emit('update:modelValue',e)"
    >
      <template #next="{onClick,disabled}">
        <div
          v-show="!disabled"
          class="container"
        >
          <div>
            <span
              class="label tw-ml-[8px] tw-mr-[17px]"
              :class="{'tw-pointer-events-none':disabled}"
              @click="onClick"
            >بعدی</span>
            <v-icon
              icon="custom:chevron_left_light"
              size="10"
              color="#6F6F9D"
              class="tw-inline"
              :class="{'tw-pointer-events-none':disabled}"
              @click="onClick"
            />
          </div>
        </div>
      </template>
      <template #prev="{onClick,disabled}">
        <div
          v-show="!disabled"
          class="container"
        >
          <div>
            <v-icon
              icon="custom:chevron_right_light"
              size="10"
              color="#6F6F9D"
              class="tw-inline tw-text-[#6F6F9D]"
              :class="{'tw-pointer-events-none':disabled}"
              @click="onClick"
            />
            <span
              class="label
             tw-ml-[17px] tw-mr-[8px]"
              :class="{'tw-pointer-events-none':disabled}"
              @click="onClick"
            >قبلی</span>
          </div>
        </div>
      </template>
    </v-pagination>
  </div>
</template>

<script setup>
let props = defineProps({
  modelValue: { type: Number, default: 1 },
  length: { type: Number, default: 1 },
})
let emits = defineEmits(['update:modelValue'])
const stepPagination = useVModel(props,'modelValue',emits)
const store = useAppStore()

//Initialize the stepPagination with the value of store.pageStepInPagination.
// This is essential for retaining the page value when the user navigates through the app
stepPagination.value = store.pageStepInPagination
watch(()=>props.modelValue,val=>{
  store.pageStepInPagination = val
})
</script>

<style>
.v-pagination .v-btn {
  @apply tw-text-[#6F6F9D] tw-rounded-[12px] tw-bg-white;
}
.v-pagination__item--is-active .v-btn{
  @apply tw-bg-secondary tw-text-white;
}
.v-pagination .v-btn[ellipsis=true] {
  @apply tw-bg-white tw-opacity-100;
}
.v-pagination .v-btn[ellipsis=true] .v-btn__overlay {
  @apply tw-opacity-0
}

.btnPaginationLabel{
  @apply tw-text-[14px] tw-font-[400] tw-text-[#6F6F9D]
}
.v-pagination__item{
  @apply tw-border tw-border-[#E9ECF6] tw-rounded-[12px]
}
.container {
  @apply tw-flex tw-h-full tw-w-full tw-flex-col tw-justify-around
}
.label {
  @apply btnPaginationLabel  hover:tw-cursor-pointer
}
</style>
