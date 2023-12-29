<template>
  <v-dialog
    v-model="value"
    width="auto"
    scroll-strategy="none"
    v-bind="$attrs"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>

    <div class="wrap-dialog">
      <v-progress-linear
        v-if="loading"
        indeterminate
        :color="color"
        class="mb-0"
        height="8"
      />
      <div
        v-else
        class="topLine"
        :class="[`tw-border-t-${color}`]"
      />
      <div class="wrap-content">
        <v-btn
          v-if="showClose"
          icon="fas fa-times"
          variant="text"
          size="large"
          color="#959499"
          :ripple="false"
          class="tw-absolute tw-indent-0 tw-top-1 tw-right-1"
          @click="value = false"
        />
        <div class="tw-grow-0">
          <h4 class="wrap-Title">
            <slot name="title">
              <template v-if="!!props.title">
                {{ title }}
              </template>
            </slot>
          </h4>
          <slot />
        </div>
        <div class="wrap-message-btn">
          <div class="wrap-btn">
            <slot
              name="actions"
            >
              <v-btn-cancel @click="onCancel">
                {{ cancelBtnText }}
              </v-btn-cancel>
              <v-btn
                :color="color"
                :loading="loading"
                class="tw-mx-[4px] tw-w-[180px]"
                size="large"
                rounded="xl"
                @click="onConfirm"
              >
                {{ confirmBtnText }}
              </v-btn>
            </slot>
          </div>
        </div>
      </div>
      <v-overlay
        :model-value="loading"
        contained
        persistent
        scrim="white"
        @update:model-value="(val)=>emit('update:loading',val)"
      />
    </div>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : Boolean , default : false , required : true },
  'loading' : { type : Boolean , default : false },
  'showClose' : { type:Boolean , default:true },
  'title' : { type:String , default: '' },
  'color' : { type : String , default : 'warning' , validator(value) {
    return ['success','warning','info','danger','secondary','primary'].includes(value)
  } },
  'cancelBtnText' : { type:String , default: '' },
  'confirmBtnText' : { type:String , default: '' },
})

const emit = defineEmits(['update:modelValue' , 'update:loading' , 'onConfirm' , 'onCancel'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})


const onCancel = ()=>{
  value.value = false
  emit('onCancel')
}

const onConfirm = ()=>{
  emit('onConfirm')
}
</script>

<style scoped>
.wrap-dialog {
  @apply tw-h-full tw-overflow-hidden tw-rounded-[20px] tw-bg-white
}
.wrap-content{
  @apply tw-flex tw-h-full tw-flex-col tw-p-7
}
.wrap-icon{
  @apply tw-mb-[30px] tw-mt-[48px] tw-text-center
}
.wrap-Title{
  @apply tw-mb-[9px] tw-text-center tw-text-[20px] tw-font-[700]
}
.wrap-message-btn{
  @apply tw-flex tw-grow tw-flex-col
}
.wrap-message {
  @apply tw-grow tw-text-center tw-text-[16px] tw-font-[400]
}
.wrap-btn {
  @apply tw-grow-0 tw-justify-self-end tw-text-center
}
.topLine{
  @apply tw-w-full tw-border-t-[8px]
}
</style>
