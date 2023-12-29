<template>
  <v-dialog-extend
    v-model="isVisible"
    width="400px"
    color="secondary"
    scroll-strategy="none"
  >
    <div class="tw-h-full tw-overflow-hidden tw-rounded-[20px]">
      <div class="tw-max-w-[425px] tw-mx-auto tw-flex tw-h-full tw-flex-col md:tw-mx-8">
        <p class="md:tw-mt-5 tw-mb-1 tw-text-center tw-text-xl tw-font-bold">
          ویرایش ماموریت
        </p>
        <div class="tw-flex tw-justify-center tw-items-center tw-mb-7">
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
        <mission-form
          :data="data"
          :date="data.Date"
          @cancel="isVisible = false"
          @ok="update"
        />
      </div>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch, computed } from "vue"

import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"
import MissionForm from "@/components/inputOutput/missionForm.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  data: { type: Object, default: null },
})

let emit = defineEmits(['update:show', 'update'])

let isVisible = ref(false)

let loading = ref(false)

const formattedDate = computed(() => {
  return $moment(props.data?.Date).format('ddd jD jMMMM jYYYY')
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

function update() {
  emit('update')
  isVisible.value = false
}
</script>
