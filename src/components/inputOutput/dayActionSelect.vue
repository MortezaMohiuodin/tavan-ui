<template>
  <div class="tw-text-center">
    <v-menu
      v-model="visible"
      location="end"
      content-class="!tw-rounded-[10px] !tw-py-1"
      :width="140"
    >
      <template #activator="{ props }">
        <v-btn
          variant="text"
          size="x-small"
          v-bind="props"
          v-bind.attr="$attrs"
        >
          <slot>
            <v-icon icon="custom:dots" />
          </slot>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in actions"
          :key="index"
          :value="item.key"
          :min-height="25"
          :height="25"
          :disabled="item.disabled"
          @click="value = item.key"
        >
          <v-icon
            :icon="item.icon"
            size="13"
            class="tw-ml-2.5"
          />
          <span
            class="tw-text-sm tw-font-medium"
            v-text="item.title"
          />
        </v-list-item>
      </v-list>
    </v-menu>
    <add-activity
      v-model:show="showAddActivity"
      :data="day"
      @update="update"
    />
    <show-day-report
      v-model:show="showReport"
      :data="day"
    />
    <edit-mission
      v-model:show="showEditMission"
      :data="mission"
      @update="update"
    />
    <delete-mission
      v-model:show="showDeleteMission"
      :data="mission"
      @update="update"
    />
    <edit-absent
      v-model:show="showEditAbsent"
      :data="absent"
      @update="update"
    />
    <delete-absent
      v-model:show="showDeleteAbsent"
      :data="absent"
      @update="update"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import AddActivity from "@/components/inputOutput/addActivity.vue"
import EditAbsent from "@/components/inputOutput/editAbsent.vue"
import EditMission from "@/components/inputOutput/editMission.vue"
import DeleteAbsent from "@/components/inputOutput/deleteAbsent.vue"
import DeleteMission from "@/components/inputOutput/deleteMission.vue"
import ShowDayReport from "@/components/inputOutput/showDayReport.vue"

const propItems = defineProps({
  modelValue: { type: String, default: '' },
  day: { type: Object, default: null },
  isMine:{ type: Boolean,default:true },
})

const emit = defineEmits(['updateIoAction', 'update:modelValue', 'update'])

let visible = ref(false)
let showAddActivity = ref(false)
let showReport = ref(false)
let showEditAbsent = ref(false)
let showDeleteAbsent = ref(false)
let showEditMission = ref(false)
let showDeleteMission = ref(false)
const { WID,activePlugins,permits } = useAppStore()
const store = useAppStore()

const value = computed({
  get() {
    return propItems.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const absent = computed(() => {
  return propItems.day.absent || null
})

const mission = computed(() => {
  return propItems.day.mission || null
})

const actions = computed(() => {
  const items = [
    { key: 'edit', title: 'ویرایش', icon: 'custom:edit', hidden: ['holiday'], disabled:!permits.includes('CanEditTimeTracking') || !permits.includes('TimeTrackManager') },
    { key: 'remove', title: 'حذف', icon: 'custom:remove', hidden: ['holiday'],disabled: !permits.includes('CanDeleteTracking') },
    { key: 'description', title: 'توضیحات', icon: 'custom:description', hidden: ['holiday', 'absent', 'mission'] },
    { key: 'add', title: 'درج', icon: 'custom:add', hidden: ['absent', 'mission'], disabled: ((propItems.isMine && !store.permits.includes('CanAddTemporaryTracking')) ||  (!propItems.isMine && !store.permits.includes('TimeTrackManager')))  },
    { key: 'report', title: 'گزارش', icon: 'custom:report', hidden: [] },
    { key: 'history', title: 'تاریخچه', icon: 'custom:history', hidden: ['holiday', 'absent', 'mission'], disabled: !permits.includes('LogManager') },
  ]

  if (!propItems.day.type) return items.filter(item => !item.hidden.includes('holiday'))

  return items.filter(item => !item.hidden.includes(propItems.day.type))
})

watch(visible, val => {
  if (!val) value.value = ''
})

watch(value, val => {
  const dayType = propItems.day.type
  switch (val) {
  case 'edit':
    if (dayType === 'absent') showEditAbsent.value = true
    else if (dayType === 'mission') showEditMission.value = true
    else emit('updateIoAction', val)
    break
  case 'remove':
    if (dayType === 'absent') showDeleteAbsent.value = true
    else if (dayType === 'mission') showDeleteMission.value = true
    else emit('updateIoAction', val)
    break
  case 'add':
    showAddActivity.value = true
    break
  case 'report':
    showReport.value = true
    break
  case 'description':
    emit('updateIoAction', val)
    break
  case 'history':
    emit('updateIoAction', val)
    break
  }
})

function update() {
  emit('update')
}
</script>
