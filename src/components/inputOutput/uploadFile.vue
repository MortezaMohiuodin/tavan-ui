<template>
  <div class="upload-file">
    <div
      class="tw-w-full tw-h-[150px] tw-relative tw-bg-[#F9FAFB] tw-rounded-3xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer"
      @click="showModal = true"
    >
      <div
        v-if="!hasFile"
        class="tw-flex tw-flex-col tw-items-center tw-justify-center"
      >
        <v-icon
          icon="custom:addFile"
          class="tw-mb-1"
        />
        <span class="tw-text-[#212121] tw-text-sm tw-font-medium tw-mb-0.5">بارگزاری اسناد مربوطه</span>
        <span class="tw-text-[#A9A9CF] tw-text-sm tw-font-medium">{{ `حداکثر حجم فایل: ${limit} مگابایت` }}</span>
      </div>
      <div
        v-else
        class="tw-flex tw-flex-col tw-items-center tw-justify-center"
      >
        <span
          class="tw-font-sans tw-mb-1 tw-break-words tw-text-center"
          v-text="data.name"
        />
        <span
          class="tw-text-[#A9A9CF] tw-text-xs tw-font-medium"
          v-text="data.size"
        />
      </div>
      <v-icon
        v-if="hasFile"
        icon="custom:error"
        class="tw-absolute tw-top-[11px] tw-left-[11px] tw-fill-[#A9A9CF] tw-cursor-pointer"
        @click.stop="reset"
      />
    </div>
    <file-changer
      v-model:show="showModal"
      :value="file"
      @change="changeFile"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

import FileChanger from "@/components/inputOutput/FileChanger.vue"

const props = defineProps({
  value: { type: [File, String, Object, Array], default: null },
  limit: { type: [Number, String], default: '5' },
})

let emit = defineEmits(['update'])

let showModal = ref(false)

let data = ref({
  src: null,
  name: null,
  size: null,
  type: null,
})

let file = ref(null)

const hasFile = computed(() => {
  return !!data.value.src
})

watch(() => props.value, val => {
  if (val) {
    file.value = val
  }
}, { immediate: true })

function changeFile(file, name, size, type) {
  emit('update', file, type)
  data.value.src = file
  data.value.name = name
  data.value.size = size
  data.value.type = type
}

function reset() {
  data.value.src = null
  data.value.name = null
  data.value.size = null
  file.value = null
  emit('update', data.value.src, data.value.type)
}
</script>
