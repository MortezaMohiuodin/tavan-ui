<template>
  <v-dialog-extend
    v-model="value"
    :loading="loading"
    color="info"
    @on-confirm="emit('onConfirm')"
    @on-cancel="status = null"
  >
    <div class="wrap-content">
      <div class="tw-grow-0">
        <div class="wrap-icon">
          <v-icon
            class="inherit"
            icon="fa fa-edit"
            color="info"
            size="56"
          />
        </div>
        <p class="wrap-Title">
          وضعیت
        </p>
        <v-radio-group-extend
          v-model="status"
          :options="[
            { label : 'منتظر پاسخ' , value : '0'},
            { label : 'تایید شده' , value : '1'},
            { label : 'رد شده' , value : '2'},
          ]"
        />
      </div>
      <div class="wrap-message-btn">
        <div class="wrap-btn">
          <v-btn-cancel @click="value = false">
            انصراف
          </v-btn-cancel>
          <v-btn-confirm
            :loading="loading"
            color="info"
            :disabled="status === null"
            @click="emit('onConfirm',status)"
          >
            تایید
          </v-btn-confirm>
        </div>
      </div>
    </div>
  </v-dialog-extend>
</template>
  
<script setup>
const props = defineProps({
  'modelValue':{ type : Boolean , default :false , required:true },
  'loading':{ type : Boolean , default :false , required:false },
  'items' : { type : [Array, Object , Number , String] , default : null },
})

const emit = defineEmits(['update:modelValue','onConfirm'])
const value = useVModel(props,'modelValue',emit)
const status = ref(null)

watch(value , val=>{
  if(!val) status.value = null
})
</script>
  
  <style>
  .wrap-dialog {
    @apply tw-h-full tw-overflow-hidden tw-rounded-[20px] tw-bg-white
  }
  .wrap-content{
    @apply tw-flex tw-h-full tw-flex-col
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
    @apply tw-mt-10 tw-grow-0 tw-justify-self-end tw-text-center
  }
  </style>
  