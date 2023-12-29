<template>
  <v-dialog-extend
    v-model="isVisible"
    color="secondary"
    width="450px"
  >
    <div class="tw-p-3">
      <p v-text="message" />
      <div class="tw-flex tw-justify-center tw-mt-8">
        <v-btn
          variant="outlined"
          @click="isVisible = false"
        >
          متوجه شدم
        </v-btn>
      </div>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch } from "vue"

import { useDisplay } from "vuetify"

import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
})

let emit = defineEmits(['update:show'])

const { smAndDown } = useDisplay()

const store = useAppStore()

let loading = ref(false)

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
</script>
