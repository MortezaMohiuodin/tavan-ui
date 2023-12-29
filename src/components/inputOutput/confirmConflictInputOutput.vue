<template>
  <v-dialog-extend
    v-model="isVisible"
    title="تداخل تردد با مرخصی"
    color="secondary"
    width="500"
  >
    <p
      class="tw-text-center tw-mt-4 tw-mx-4 tw-mb-8"
      v-text="text"
    />
    <div class="tw-flex tw-justify-center tw-my-4">
      <v-btn
        variant="outlined"
        size="large"
        class="tw-ml-[4px] tw-w-[150px]"
        rounded="xl"
        @click="cancel"
      >
        انصراف
      </v-btn>
      <v-btn
        color="secondary"
        variant="flat"
        size="large"
        class="tw-w-[150px]"
        rounded="xl"
        @click="emit('ok')"
      >
        تایید
      </v-btn>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch } from 'vue'
import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

let emit = defineEmits(['update:show', 'ok', 'cancel'])

let isVisible = ref(false)

watch(
  () => props.show,
  show => {
    isVisible.value = show
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

function ok() {
  isVisible.value = false
  emit('ok')
}

function cancel() {
  emit('cancel')
  isVisible.value = false
}
</script>
