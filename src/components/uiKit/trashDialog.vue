<template>
  <v-dialog-extend
    v-model="value"
    title="حذف"
    :loading="loading"
    color="error"
    cancel-btn-text="انصراف"
    confirm-btn-text="حذف"
    @on-confirm="emit('onConfirm')"
    @on-cancel="value = false"
  >
    <div class="tw-px-5 tw-my-6">
      این مورد حذف شود؟
    </div>
  </v-dialog-extend>
</template>

<script setup>
const props = defineProps({
  modelValue : { type : Boolean , default :false },
  loading : { type : Boolean , default :false },
})

const emit = defineEmit(['update:modelValue','onConfirm'])
const value = useVModel(props,'modelValue',emit)
</script>
