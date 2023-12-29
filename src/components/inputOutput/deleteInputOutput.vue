<template>
  <v-dialog-extend
    v-model="isVisible"
    width="400px"
    color="error"
    scroll-strategy="none"
  >
    <div class="tw-flex tw-h-full tw-flex-col md:tw-mx-10">
      <p class="md:tw-mt-5 tw-mb-1 tw-text-center tw-text-xl tw-font-bold">
        حذف تردد
      </p>
      <div class="tw-flex tw-justify-center tw-items-center">
        <v-icon
          icon="custom:calendar2"
          size="17"
          class="tw-ml-1"
        />
        <span
          class="tw-text-sm tw-font-medium"
          v-text="formattedDate"
        />
      </div>
      <div class="tw-flex tw-items-center tw-justify-between tw-my-7 tw-px-12">
        <span class="tw-text-[#6F6F9D] tw-text-base">ساعت تردد</span>
        <span
          class="tw-text-2xl"
          v-text="$moment(data?.Time).format('HH:mm')"
        />
      </div>
      <div class="tw-flex tw-justify-between tw-mb-4">
        <v-btn
          variant="outlined"
          size="large"
          class="tw-ml-[4px] tw-w-[150px]"
          rounded="xl"
          @click="isVisible = false"
        >
          انصراف
        </v-btn>
        <v-btn
          :loading="loading"
          color="error"
          variant="flat"
          size="large"
          class="tw-w-[150px]"
          rounded="xl"
          @click="submit"
        >
          تایید و ثبت
        </v-btn>
      </div>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch, computed } from "vue"

import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  data: { type: Object, default: null },
})

let emit = defineEmits(['update:show', 'update'])

const store = useAppStore()

let isVisible = ref(false)

let loading = ref(false)

const formattedDate = computed(() => {
  return $moment(props.data?.Time).format('ddd jD jMMMM jYYYY')
})

watch(
  () => props.show,
  show => {
    if (show) isVisible.value = show
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

async function submit() {
  try {
    loading.value = true

    await useHttpPost('/InputOutput/delete-input-output', {
      body: {
        WorkspaceCode: store.WID,
        InputOutputCode: props.data.Id,
      },
    })
    emit('update')
    loading.value = false
    isVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
