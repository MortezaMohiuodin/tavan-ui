<template>
  <div
    class="day"
    :class="[height, classes.wrapper]"
  >
    <header
      class="day-header"
      :class="[classes.header, highlightedClass?.text]"
      @click="emit('toggle')"
    >
      <span
        class="day-header__title"
        v-text="formattedDate"
      />
      <day-action-select
        v-if="isMobile && day.data && day.isInMonth"
        v-model="action"
        :color="day?.hex"
        :day="day"
        variant="flat"
        class="tw-ml-2"
        @update-io-action="emit('updateAction', $event)"
        @update="update"
      >
        <v-icon
          icon="custom:dots"
          class="tw-fill-white"
        />
      </day-action-select>
      <div class="tw-flex tw-items-center tw-justify-center">
        <span
          class="tw-text-base tw-font-medium"
          v-text="highlightedValue"
        />
        <div class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-[9px] tw-h-[9px] tw-mr-2 tw-mb-1">
          <span
            v-if="highlightedClass.show"
            class="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-rounded-full tw-animate-ping"
            :class="[highlightedClass.bg]"
          />
          <span
            class="tw-relative tw-inline-flex tw-rounded-full tw-w-[5px] tw-h-[5px]"
            :class="highlightedClass?.bg"
          />
        </div>
      </div>
    </header>
    <div
      v-if="!day.isClose && day.data && day.isInMonth"
      class="day-body tw-flex-grow md:tw-p-0"
    >
      <day-action-select
        v-if="!isMobile"
        v-model="action"
        :day="day"
        @update-io-action="emit('updateAction', $event)"
        @update="update"
      />
      <div
        v-if="day.hasIo"
        class="tw-flex tw-flex-col tw-items-center tw-m-4 tw-mt-0 md:tw-m-0"
      >
        <template
          v-for="(item, index) in day.data.list"
          :key="index"
        >
          <component
            :is="cmp[item.type]"
            :day="day"
            :data="item"
            class="tw-mb-2"
            @update="update"
          />
        </template>
      </div>
      <div
        v-else-if="day.text"
        class="tw-text-center tw-p-4 tw-m-4 tw-mt-0 md:tw-m-0 md:tw-p-0 md:tw-mt-6 tw-rounded-2xl"
        :class="classes.body"
      >
        <div
          v-if="pendingStatusText"
          class="tw-text-sm tw-font-medium tw-py-1.5 tw-px-3 tw-text-center tw-rounded-2xl"
          :class="bgClass"
        >
          <span
            :class="day.color"
            v-text="pendingStatusText"
          />
        </div>
        <span
          v-else
          class="tw-text-sm"
          :class="day.color"
          v-text="day.text"
        />
      </div>
      <div
        v-else-if="isToday"
        class="tw-bg-[#FFEFE5] tw-h-[56px] tw-mx-4 tw-mb-4 tw-rounded-2xl tw-flex tw-items-center md:tw-justify-center tw-p-4 md:tw-p-0"
      >
        <div
          class="tw-w-[100px] tw-h-[30px] tw-rounded-3xl tw-bg-white tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
          @click="showAddForm = true"
        >
          <v-icon
            icon="fa-solid fa-plus"
            size="13"
            color="#F68B1F"
          />
          <span class="tw-text-[#F68B1F] tw-text-sm tw-font-medium tw-mr-1">ثبت تردد</span>
        </div>
      </div>
    </div>
    <add-edit-input-output
      v-model:show="showAddForm"
      :data="day"
      @update="update"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

import { $moment } from "@/plugins/moment"
import { useDisplay } from 'vuetify'

import inputOutput from "@/components/inputOutput/inputOutputItem.vue"
import absent from "@/components/inputOutput/absentItem.vue"
import mission from "@/components/inputOutput/missionItem.vue"

import DayActionSelect from "@/components/inputOutput/dayActionSelect.vue"
import AddEditInputOutput from "@/components/inputOutput/addEditInputOutput.vue"

const props = defineProps({
  day: { type: Object, default: () => {} },
  highlighted: { type: String, default: null },
})

const emit = defineEmits(['updateAction', 'update', 'toggle'])

const { smAndDown } = useDisplay()

const cmp = {
  inputOutput,
  absent,
  mission,
}

let action = ref('')

let showAddForm = ref(false)

const formattedDate = computed(() => {
  return $moment(props.day?.date).format('ddd jD jMMMM')
})

const isMobile = computed(() => {
  return smAndDown.value
})

const isToday = computed(() => {
  return $moment().isDateToday(props.day.formatted)
})

const isPendingAbsent = computed(() => {
  if (props.day.type !== 'absent') return false
  const absent = props.day.data.AbsentList[0]
  const absentStatus = $getEnum($enums.absentStatus, 'key', absent.AbsentStatus, 'title')

  return absentStatus === 'inProgress'
})

const isPendingMission = computed(() => {
  if (props.day.type !== 'mission') return false
  const mission = props.day.data.MissionList[0]
  const missionStatus = $getEnum($enums.missionStatus, 'key', mission.Status, 'title')

  return missionStatus === 'inProgress'
})

const pendingStatusText = computed(() => {
  const type = isPendingAbsent.value ? 'مرخصی' : isPendingMission.value ? 'ماموریت' : ''
  if (!type) return

  return `${type} درانتظار تایید مدیر`
})

const highlightedValue = computed(() => {
  let t = props.highlighted ? props.highlighted : 'TotalWorkTime'

  return props.day.data ? toHHmm(props.day?.data[t]) : '00:00'
})

const highlightedClass = computed(() => {
  const isHighlighted = highlightedValue.value && highlightedValue.value !== '00:00'

  return {
    show: props.highlighted && isHighlighted,
    text: props.highlighted ? isHighlighted ? 'tw-font-bold' : 'tw-text-[#A4A4A4]' : '',
    bg: props.highlighted ? isHighlighted ? props.day?.bg ?? 'tw-bg-blue-400' : 'tw-bg-[#A4A4A4]' : props.day?.bg,
  }
})

const height = computed(() => {
  return !isMobile.value && !props.day?.isClose && props.day.isInMonth ? 'tw-min-h-[320px] tw-h-full tw-overflow-hidden' : ''
})

const bgClass = computed(() => {
  return props.day.isInMonth ?
    isToday.value && props.day.data && !props.day.absent && !props.day.mission && !props.day.hasIo ?
      '!tw-bg-[#FFEFE5]' :
      props.day.bgLight :
    '!tw-bg-gray-100 tw-opacity-60'
})

const classes = computed(() => {
  return {
    wrapper: !isMobile.value && !props.day?.isClose && !props.day?.hasIo && !pendingStatusText.value ? bgClass.value : '',
    header: props.day.isInMonth ? !isMobile.value && props.day?.isClose ? bgClass.value : '' : bgClass.value,
    body: isMobile.value && !props.day?.isClose && !props.day?.hasIo ? bgClass.value : '',
  }
})

function update() {
  emit('update')
}

function toHHmm(data = '00:00:00') {
  let time = data.split(':')
  time.pop()

  return time.join(':')
}
</script>

<style lang="scss">
.day {
  @apply tw-flex tw-flex-col tw-rounded-2xl md:tw-rounded-3xl tw-bg-white tw-shadow-[0_4px_15px_0_rgba(57,78,109,0.05)] md:tw-shadow-none tw-mb-4 md:tw-mb-0;
}
.day-header {
  @apply tw-flex md:tw-flex-col tw-items-center tw-justify-center tw-rounded-[30px] md:tw-h-[55px] tw-p-4 md:tw-p-1 tw-cursor-pointer;
  &__title {
    @apply tw-text-sm md:tw-text-xs lg:tw-text-sm tw-font-bold md:tw-font-normal tw-ml-auto md:tw-ml-0 tw-text-center tw-line-clamp-1;
  }
}
</style>
