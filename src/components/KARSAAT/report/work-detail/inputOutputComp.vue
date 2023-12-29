<template>
  <div>
    <div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
      <div class="tw-flex tw-justify-between tw-items-center md:tw-order-2">
        <span class="tw-ml-4 tw-mb-4 tw-text-[#959499] tw-text-base">نمایش:</span>
        <div class="tw-w-[140px]">
          <v-select
            v-model="term"
            :items="terms"
            :clearable="false"
            item-title="title"
            item-value="key"
          />
        </div>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center mb-4 md:tw-order-1">
        <h4
          class="tw-text-xl tw-font-bold tw-ml-3 tw-hidden md:tw-block tw-w-full"
        >
          شرح کارکرد
        </h4>
        <div class="tw-w-full tw-flex tw-items-center tw-justify-between tw-mb-1">
          <v-btn
            icon="fa-solid fa-chevron-right"
            variant="text"
            color="secondary"
            size="x-small"
            @click="prevDate"
          />
          <div
            class="tw-text-lg tw-font-medium tw-w-28 tw-text-center"
            v-text="displayDate"
          />
          <v-btn
            icon="fa-solid fa-chevron-left"
            variant="text"
            color="secondary"
            size="x-small"
            @click="nextDate"
          />
        </div>
      </div>
    </div>
    <div
      v-for="(week, i) in weeks"
      :key="i"
      class="md:tw-bg-white tw-grid md:tw-grid-cols-7 tw-gap-1 tw-rounded-[30px] md:tw-p-2 tw-mb-6"
    >
      <day-week
        v-for="day in week"
        :key="day.formatted"
        :day="day"
        :highlighted="highlighted"
        @update-action="updateAction($event, day.formatted)"
        @update="reload"
        @toggle="toggle(i)"
      />
    </div>
    <div class="tw-flex tw-flex-wrap tw-mt-8">
      <div
        v-for="(item, i) in dayTypes"
        :key="i"
        class="tw-flex tw-items-center tw-ml-8 tw-mb-4"
      >
        <div
          class="tw-w-[8px] tw-h-[8px] tw-rounded-full tw-ml-1"
          :class="item.bg"
        />
        <span
          class="tw-text-sm"
          v-text="item.title"
        />
      </div>
    </div>
    <report-input-output
      :total-work="report"
      class="tw-mt-16"
      @highlighted="highlighted = $event"
    />
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        contained
        size="40"
      />
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

import { $moment } from "@/plugins/moment"

import { useDisplay } from "vuetify"

import { dayTypes } from "@/components/inputOutput/js/dayTypes"

import useDayInfo from "@/composables/useDayInfo"

import dayWeek from "@/components/inputOutput/dayWeek.vue"
import reportInputOutput from "@/components/inputOutput/reportInputOutput.vue"

const props = defineProps({
  employeeCode : { type : [Number,String] , default : null , required:true },
})

const store = useAppStore()

const { smAndDown } = useDisplay()

const date = ref($moment())

const term = ref('weekly')

let highlighted = ref(null)

const terms = ref([
  { id: 0, key: 'weekly', title: 'هفتگی' },
  { id: 1, key: 'monthly', title: 'ماهانه' },
])

const fromDate = ref(null)

const toDate = ref(null)

let showFilters = ref(true)


const displayDate = computed(() => {
  const date = {
    from: fromDate.value.format('jD'),
    to: toDate.value.format('jD'),
    month: toDate.value.format('jMMMM'),
  }

  return `${date.from} الی ${date.to} ${date.month}`
})

const isMobile = computed(() => {
  return smAndDown.value
})

const payload = computed(()=> ({ EmployeeCode : props.employeeCode }))
const { daysObject, report, loading, reload } = useDayInfo(fromDate, toDate , payload.value  )

const weeks = computed(() => {
  let list = $moment().getWeekArray(date.value).map(week => {
    return week.map(day => {
      let data = daysObject.value[day.formatted]

      return {
        ...day,
        ...data,
        date: $moment(day.formatted),
      }
    })
  })

  if (term.value === 'weekly')
    list = list.filter(item => item[0].formatted === fromDate.value.format('YYYY-MM-DD'))

  if (isMobile.value) list = list.filter(item => item[0].formatted === fromDate.value.format('YYYY-MM-DD'))

  return list
})

watch(date, () => {
  switch (term.value) {
  case 'weekly':
    fromDate.value = date.value.clone().startOf('week')
    toDate.value = date.value.clone().endOf('week')
    break
  case 'monthly':
    fromDate.value = date.value.startOf('jMonth')
    toDate.value = date.value.clone().endOf('jMonth')
    break
  }
}, { immediate: true })

function updateAction(action, date) {
  if (daysObject.value[date].hasIo) {
    daysObject.value[date].data.list.forEach(item => {
      if (item.type === 'inputOutput') item.action = action
    })
  }
}

function toggle(weekIndex) {
  if (isMobile.value) return
  weeks.value[weekIndex].forEach(day => {
    if (daysObject[day.formatted])
      daysObject[day.formatted].isClose = !daysObject[day.formatted].isClose
  })
}

function prevDate() {
  if (term.value === 'monthly')
    date.value = date.value.clone().subtract(1, 'jMonth')
  else date.value = date.value.clone().subtract(7, 'day')
}

function nextDate() {
  if (term.value === 'monthly')
    date.value = date.value.clone().add(1, 'jMonth')
  else date.value = date.value.clone().add(7, 'day')
}
</script>
