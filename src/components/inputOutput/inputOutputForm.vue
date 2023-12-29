<template>
  <div>
    <div class="tw-flex tw-items-center tw-justify-between tw-my-7">
      <span class="tw-text-[#6F6F9D] tw-text-base">ساعت تردد</span>
      <time-picker
        v-model="form.Time"
        format="HH:mm"
      />
    </div>
    <div class="tw-mb-16">
      <span class="tw-text-[#6F6F9D] tw-text-sm">توضیحات</span>
      <v-textarea
        v-model="form.Description"
        hide-details="auto"
        rows="5"
        no-resize
      />
    </div>
    <div class="tw-flex tw-justify-between tw-my-4">
      <v-btn
        variant="outlined"
        size="large"
        class="tw-ml-[4px] tw-w-[150px]"
        rounded="xl"
        @click="emit('cancel')"
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
    <confirm-conflict-input-output
      v-model:show="showConfirmConflict"
      :text="conflictText"
      @ok="confirmConflict"
      @cancel="emit('cancel')"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"

import TimePicker from "@/components/uiKit/TimePicker.vue"
import ConfirmConflictInputOutput from "@/components/inputOutput/confirmConflictInputOutput.vue"

const props = defineProps({
  date: { type: String, default: null },
})

const emit = defineEmits(['cancel', 'ok'])

const store = useAppStore()

let loading = ref(false)

let showConfirmConflict = ref(false)

let conflictText = ref('')

let form = ref({
  WorkspaceCode: store.WID,
  Time: '',
  Description: '',
  IO_Absent_Confirm: false,
})

async function submit() {
  let data = { ...form.value }
  data.Time = `${$moment(props.date).format('YYYY-MM-DD')} ${form.value.Time}`
  try {
    loading.value = true

    await useHttpPost('/InputOutput/add-input-output', {
      body: data,
    })

    emit('ok')
    loading.value = false
  } catch (err) {
    if (err.data?.Modal) {
      conflictText.value = err.data?.Modal
      showConfirmConflict.value = true
    }
  } finally {
    loading.value = false
  }
}

function confirmConflict() {
  form.value.IO_Absent_Confirm = true
  submit()
}
</script>
