<template>
  <div
    ref="input-output"
    class="tw-flex tw-flex-col"
  >
    <div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-mt-6 tw-mb-3">
      <div
        v-if="!isMine && smAndDown"
        class="tw-mb-4"
      >
        <v-select-user
          v-model="employeeCode"
          :clearable="false"
          placeholder="انتخاب کاربر"
          depth-level-type="io"
          hide-details
        />
      </div>
      <div class="tw-flex tw-justify-between tw-items-center md:tw-order-2 tw-mb-4 md:tw-mb-0">
        <v-select-user
          v-if="!isMine && !smAndDown"
          v-model="employeeCode"
          :clearable="false"
          placeholder="انتخاب کاربر"
          depth-level-type="io"
          hide-details
          class="tw-w-fit tw-ml-2"
        />
        <v-btn-filter
          class="tw-ml-4"
          @click="showFilters = !showFilters"
        />
        <span class="tw-ml-4 tw-text-[#959499] tw-text-base">نمایش:</span>
        <div class="tw-w-[140px]">
          <v-select
            v-model="term"
            :items="terms"
            :clearable="false"
            hide-details
            item-title="title"
            item-value="key"
          />
        </div>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center md:tw-order-1">
        <h4
          class="tw-w-full tw-text-xl tw-font-bold tw-ml-3 tw-hidden md:tw-block"
        >
          تردد ها
        </h4>
        <div
          v-if="!showFilters"
          class="tw-w-full tw-flex tw-items-center tw-justify-between tw-mb-1"
        >
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
    <input-output-filter
      v-model:show="showFilters"
      @update-filter="updateFilter"
      @update-archived-status="updateArchivedStatus"
    />
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
    <div class="tw-flex tw-flex-wrap">
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
      class="tw-order-first md:tw-order-last tw-my-4"
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
import InputOutputFilter from "@/components/inputOutput/inputOutputFilter.vue"
import VSelectUser from "@/components/uiKit/vSelectUser.vue"

const props = defineProps({
  isMine: { type: Boolean, default: false },
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

const showArchived = ref(false)

let showFilters = ref(false)

let hasFilter = ref(false)

let employeeCode = ref(null)

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

const { daysObject, report, loading, reload, reset } = useDayInfo(fromDate, toDate, employeeCode, showArchived, props.isMine)

const weeks = computed(() => {
  return $moment().getWeekArray(fromDate.value, toDate.value).map(week => {
    return week.map(day => {
      let data = daysObject.value[day.formatted]

      return {
        ...day,
        ...data,
        isInMonth: toDate.value.diff(fromDate.value, 'days') <= 30 ? true : !!data,
        date: $moment(day.formatted),
      }
    })
  })
})

watch(term, val => {
  date.value = $moment()
  switch (val) {
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

watch(() => store.updatingIO, val => {
  if (val && !loading.value) reload()
})

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
    if (daysObject.value[day.formatted])
      daysObject.value[day.formatted].isClose = !daysObject.value[day.formatted].isClose
  })
}

function prevDate() {
  if (term.value === 'monthly')
    date.value = date.value.clone().subtract(1, 'jMonth')
  else {
    fromDate.value = fromDate.value.clone().subtract(7, 'day')
    toDate.value = fromDate.value.clone().endOf('week')
  }
}

function nextDate() {
  if (term.value === 'monthly') {
    date.value = date.value.clone().add(1, 'jMonth')
  } else {
    fromDate.value = toDate.value.clone().add(1, 'day')
    toDate.value = fromDate.value.clone().endOf('week')
  }
}

function updateFilter(from, to) {
  hasFilter.value = true
  fromDate.value = from
  toDate.value = to
}

function updateArchivedStatus(status) {
  showArchived.value = status
}

onBeforeUnmount(() => {
  reset()
})
</script>

<route>
{
meta: {
title: "تردد ها",
depthLevelType : 1
}
}
</route>

