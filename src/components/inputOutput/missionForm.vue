<template>
  <div class="tw-mt-4">
    <v-select
      v-model="form.MissionCode"
      :items="missionTypes"
      item-title="Title"
      item-value="Code"
      placeholder="نوع ماموریت"
    />
    <div
      v-if="isDailyMission"
      class="tw-mb-4"
    >
      <span class="tw-text-[#6F6F9D] tw-text-sm">مدت به روز</span>
      <v-text-field
        v-model="form.DayCount"
        hide-details="auto"
      />
    </div>
    <div
      v-else
      class="tw-grid tw-grid-cols-2 tw-gap-x-7 tw-mb-4"
    >
      <div>
        <span class="tw-text-[13px] tw-text-[#6F6F9D] tw-mb-1">ساعت شروع</span>
        <time-picker
          v-model="form.StartTime"
          size="sm"
        />
      </div>
      <div>
        <span class="tw-text-[13px] tw-text-[#6F6F9D] tw-mb-1">ساعت پایان</span>
        <time-picker
          v-model="form.EndTime"
          size="sm"
        />
      </div>
    </div>
    <div class="tw-mb-8">
      <span class="tw-text-[#6F6F9D] tw-text-sm">توضیحات</span>
      <v-textarea
        v-model="form.Description"
        hide-details="auto"
        rows="4"
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
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

import { useGlobalDataStore } from "@/store/globalData"
import { useAppStore } from "@/store/app"

import TimePicker from "@/components/uiKit/TimePicker.vue"

const props = defineProps({
  date: { type: String, default: null },
  data: { type: Object, default: null },
})

const emit = defineEmits(['cancel', 'ok'])

const store = useAppStore()

const globalDataStore = useGlobalDataStore()

let loading = ref(false)

let form = ref({})

const date = computed(() => {
  return $moment(props.date)
    .set({
      h: '00',
      m: '00',
      s: '00',
    })
    .format('YYYY-MM-DDTHH:mm:ss')
})

const editing = computed(() => {
  return !!props.data
})

const missionTypes = computed({
  get() {
    return globalDataStore.missionTypes
  },
  set(val) {
    globalDataStore.updateData('missionTypes', val)
  },
})

const isDailyMission = computed(() => {
  let missionType = missionTypes.value.find(item => item.Code === form.value.MissionCode)
  if (missionType) return !missionType.IsHourly

  return true
})

watch(editing, val => {
  if (val) form.value = createForm(props.data)
  else form.value = createForm()
}, { immediate: true })

async function submit() {
  try {
    loading.value = true
    let url = editing.value ? '/mission/employee-mission-edit-request' : '/mission/employee-mission-request'
    await useHttpPost(url, {
      body: form.value,
    })

    emit('ok')
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function getMissionTypes() {
  if (missionTypes.value.length) return
  try {
    loading.value = true

    const { Data: response } = await useHttpGet('/mission/get-workspace-mission', {
      params: {
        WorkspaceCode: store.WID,
      },
    })

    missionTypes.value = response
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function createForm(data) {
  let form = {
    WorkspaceCode: store.WID,
    MissionCode: null,
    Date: date.value,
    Code: '',
    DayCount: '',
    StartTime: '',
    EndTime: '',
    Description: '',
  }
  if (data) {
    form.Code = data.Id
    form.MissionCode = data.MissionCode
    form.DayCount = data.DayCount
    form.EndTime = data.EndTime
    form.StartTime = data.StartTime
    form.Description = data.Description
  }

  return form
}

getMissionTypes()
</script>
