<template>
  <v-dialog-extend
    v-model="isVisible"
    width="400px"
    color="secondary"
    scroll-strategy="none"
  >
    <div class="tw-flex tw-h-full tw-flex-col md:tw-mx-10">
      <p
        class="md:tw-mt-5 tw-mb-1 tw-text-center tw-text-xl tw-font-bold">
        ثبت توضیحات
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
      <div class="tw-mt-6 tw-mb-12">
        <div class="tw-flex tw-justify-between tw-mb-1">
          <span class="tw-text-[#6F6F9D] tw-text-base">توضیحات</span>
          <div class="tw-text-[#6F6F9D] tw-text-base tw-font-bold">
            <span class="tw-ml-1">تردد</span>
            <span v-text="formattedTime" />
          </div>
        </div>
        <v-textarea
          v-model="form.Description"
          variant="outlined"
          hide-details="auto"
          rows="3"
          no-resize
          base-color="#E9ECF6"
          class="!tw-rounded-3xl"
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
          color="secondary"
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

let form = ref({})

const formattedDate = computed(() => {
  return $moment(props.data?.Time).format('ddd jD jMMMM jYYYY')
})

const formattedTime = computed(() => {
  return $moment(props.data?.Time).format('HH:mm')
})

watch(
  () => props.show,
  show => {
    if (show) {
      isVisible.value = show
      form.value = createForm(props.data)
    }
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

async function submit() {
  try {
    loading.value = true
    await useHttpPost('/InputOutput/edit-input-output', {
      body: form.value,
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

function createForm(data) {
  let form = {
    WorkspaceCode: store.WID,
    InputOutputCode: '',
    Description: '',
    Time: '',
  }

  if (data) {
    form.InputOutputCode = data.Id
    form.Description = data.Description
    form.Time = $moment(data.Time).format('YYYY-MM-DD HH:mm')
  }

  return form
}
</script>
