<template>
  <v-dialog-extend
    v-model="isVisible"
    color="secondary"
    width="400px"
  >
    <div class="tw-max-w-[425px] tw-mx-auto tw-h-full tw-flex tw-flex-col md:tw-mx-10">
      <p
        class="md:tw-mt-5 tw-mb-1 tw-text-center tw-text-xl tw-font-bold"
        v-text="title"
      />
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
      <div class="tw-flex tw-items-center tw-justify-between tw-my-7">
        <span class="tw-text-[#6F6F9D] tw-text-base">ساعت تردد</span>
        <time-picker
          v-model="form.Time"
          format="HH:mm"
        />
      </div>
      <div class="tw-mb-10">
        <span class="tw-text-[#6F6F9D] tw-text-sm">توضیحات</span>
        <v-textarea
          v-model="form.Description"
          variant="outlined"
          hide-details="auto"
          rows="2"
          no-resize
          rounded="20px"
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

import TimePicker from "@/components/uiKit/TimePicker.vue"
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

const editing = computed(() => {
  return props.data?.Id
})

const title = computed(() => {
  return editing.value ? 'ویرایش تردد' : 'ثبت تردد'
})

const formattedDate = computed(() => {
  let date = props.data?.Time || props.data?.date

  return $moment(date).format('ddd jD jMMMM jYYYY')
})

watch(
  () => props.show,
  show => {
    if (show) {
      isVisible.value = show
      if (editing.value) form.value = createForm(props.data)
      else form.value = createForm()
    }
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

async function submit() {
  let data = { ...form.value }
  let date = $moment(props.data?.date || props.data?.Time).format('YYYY-MM-DD')
  data.Time = `${date} ${form.value.Time}`
  try {
    loading.value = true
    let url = editing.value ? '/InputOutput/edit-input-output' : '/InputOutput/add-input-output'

    await useHttpPost(url, {
      body: data,
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
    CalcuForYesterday: '',
    Time: '',
    Description: '',
    ProjectId: '',
    IO_Absent_Confirm: false,
  }

  if (data) {
    form.InputOutputCode = data.Id
    form.CalcuForYesterday = data.CalcuForYesterday
    form.Time = data.Time
    form.Description = data.Description
    form.ProjectId = data.ProjectId
  }

  return form
}
</script>
