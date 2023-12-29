<template>
  <div>
    <v-select
      v-model="form.AbsentCode"
      :items="absentTypes"
      item-title="Title"
      item-value="AbsentCode"
      placeholder="نوع مرخصی"
    />
    <div
      v-if="isDailyAbsent"
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
    <upload-file
      v-if="isSickLeave"
      :value="file"
      class="tw-mb-4"
      @update="updateFile"
    />
    <div>
      <span class="tw-text-[#6F6F9D] tw-text-sm">لیست همکاران کارمند</span>
      <v-select
        v-model="form.SubstituteId"
        :items="substitute"
        :clearable="false"
        item-title="Title"
        item-value="AbsentCode"
        single-line
        hide-details
        class="tw-mb-4"
      />
    </div>
    <div class="tw-mb-6">
      <span class="tw-text-[#6F6F9D] tw-text-sm">توضیحات</span>
      <v-textarea
        v-model="form.Description"
        hide-details="auto"
        rows="2"
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
        @click="save"
      >
        تایید و ثبت
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"

import { useGlobalDataStore } from "@/store/globalData"
import { useAppStore } from "@/store/app"

import { $enums } from "@/plugins/enums"
import TimePicker from "@/components/uiKit/TimePicker.vue"
import uploadFile from './uploadFile.vue'

const props = defineProps({
  date: { type: String, default: null },
  data: { type: Object, default: null },
})

const emit = defineEmits(['cancel', 'ok'])

const store = useAppStore()

const globalDataStore = useGlobalDataStore()

let loading = ref(false)

let form = ref({})

let substitute = ref([])

let file = ref(null)
let fileType = ref(null)

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

const absentTypes = computed({
  get() {
    return globalDataStore.absentTypes
  },
  set(val) {
    globalDataStore.updateData('absentTypes', val)
  },
})

const substitutes = computed({
  get() {
    return globalDataStore.substitutes
  },
  set(val) {
    globalDataStore.updateData('substitutes', val)
  },
})

const absentType = computed(() => {
  return absentTypes.value.find(item => item.AbsentCode === form.value.AbsentCode)
})

const isDailyAbsent = computed(() => {
  if (absentType.value) return !absentType.value.IsHourly

  return true
})

let isSickLeave = computed(() => {
  let sickLeaveKey = $getEnum($enums.absentTypeAdd, 'key', absentType.value?.Type, 'key')

  return sickLeaveKey === 2
})

watch(editing, val => {
  if (val) form.value = createForm(props.data)
  else form.value = createForm()
}, { immediate: true })

function save() {
  if (isSickLeave.value) submitSickLeave()
  else submit()
}

async function submit() {
  try {
    let url = editing.value ? 'absent/edit-absent-by-employee' : '/absent/add-absent-by-employee'
    let data = form.value
    if (editing.value) form.value.EmployeeAbsentCode = props.data.Id
    loading.value = true
    await useHttpPost(url, {
      body: data,
    })

    emit('ok')
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function submitSickLeave() {
  if (!form.value.AbsentFile) return
  try {
    let url = editing.value ? 'absent/edit-absent-by-employee-withfile' : 'absent/add-absent-by-employee-withfile'
    let formData = new FormData()
    formData.set('AbsentFile', form.value.AbsentFile, `File.${fileType.value}`)
    Object.keys(form.value).forEach(key => {
      if (key !== 'AbsentFile') formData.set(key, form.value[key])
    })
    if (editing.value) formData.set('EmployeeAbsentCode', props.data.Id)
    loading.value = true
    await useHttpPost(url, {
      body: formData,
    })

    emit('ok')
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function getAbsentTypes() {
  if (absentTypes.value.length) return
  try {
    loading.value = true

    const { Data: response } = await useHttpGet('/absent/get-workspace-absent', {
      params: {
        WorkspaceCode: store.WID,
      },
    })

    absentTypes.value = response
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function getSubstitute() {
  if (substitute.value.length) return
  try {
    loading.value = true

    const { Data: response } = await useHttpPost('department/get-department-teammate', {
      body: {
        WorkspaceId: store.WID,
        EmployeeId: null,
      },
    })

    substitute.value = response
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function updateFile(file, type) {
  form.value.AbsentFile = file
  fileType.value = type
}

function createForm(data) {
  let form = {
    WorkspaceCode: store.WID,
    Date: date.value,
    AbsentCode: null,
    DayCount: '',
    EndDate: '',
    StartTime: '',
    EndTime: '',
    SubstituteId: '',
    AbsentFile: null,
    Description: '',
    IO_Absent_Confirm: false,
  }
  if (data) {
    form.AbsentCode = data.AbsentCode
    form.DayCount = data.DayCount
    form.EndDate = data.EndDate || ''
    form.StartTime = data.StartTime || ''
    form.EndTime = data.EndTime || ''
    form.SubstituteId = data.SubstituteId || ''
    form.Description = data.Description || ''
    file.value = `http://172.16.21.100/${data.FilePathAbsent}`
  }

  return form
}

getAbsentTypes()
getSubstitute()
</script>
