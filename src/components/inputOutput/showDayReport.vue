<template>
  <v-dialog-extend
    v-model="isVisible"
    :persistent="false"
    color="secondary"
    scroll-strategy="none"
    width="400px"
  >
    <div class="tw-max-w-[425px] tw-mx-auto tw-flex tw-h-full tw-flex-col md:tw-mx-6">
      <p class="md:tw-mt-5 tw-mb-2 tw-text-center tw-text-xl tw-font-bold">
        جزئیات تردد
      </p>
      <div class="tw-flex tw-justify-center tw-items-center tw-mb-0.5">
        <v-icon
          icon="custom:calendar2"
          size="17"
          class="tw-ml-2"
        />
        <span
          class="tw-text-sm tw-font-medium tw-text-[#212121]"
          v-text="formattedDate"
        />
      </div>
      <p
        class="tw-text-sm tw-font-medium tw-text-[#212121] tw-text-center tw-mb-4"
        v-text="shiftText"
      />
      <div class="input-output-items tw-mb-2">
        <div
          v-for="(item, i) in inputOutputItems"
          :key="i"
          class="tw-grid tw-grid-cols-2 tw-gap-x-2 tw-gap-y-1.5"
        >
          <div
            v-for="io in item"
            :key="io.Id"
            class="box-info tw-mb-2"
          >
            <span class="label">
              <v-icon
                :icon="io.icon"
                size="10"
                class="tw-ml-1"
              />
              <span v-text="io.text" />
            </span>
            <span
              class="value"
              v-text="io.time"
            />
          </div>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-x-2 tw-gap-y-1.5 tw-mb-2">
        <div class="report-item">
          <span class="report-item__title">کل کارکرد</span>
          <div class="report-item__time-box">
            <span
              class="report-item__time"
              v-text="toHHmm(data.data.TotalWorkTime)"
            />
          </div>
        </div>
        <div class="report-item">
          <span
            class="report-item__title"
            v-text="reportItems.WorkTime.title"
          />
          <div class="report-item__time-box">
            <span
              class="report-item__time"
              v-text="reportItems.WorkTime.time"
            />
          </div>
        </div>
        <div class="report-item">
          <span
            class="report-item__title"
            v-text="reportItems.Overtime.title"
          />
          <div class="report-item__time-box">
            <span
              class="report-item__time"
              v-text="reportItems.Overtime.time"
            />
          </div>
        </div>
        <div class="report-item">
          <span
            class="report-item__title"
            v-text="reportItems.DelayTime.title"
          />
          <div class="report-item__time-box">
            <span
              class="report-item__time"
              v-text="reportItems.DelayTime.time"
            />
          </div>
        </div>
      </div>
      <div class="tw-mt-2">
        <v-btn
          variant="text"
          color="secondary"
          class="tw-mb-1"
          @click="showAllReport = !showAllReport"
        >
          <span class="tw-ml-1">مشاهده همه پارامترها</span>
          <v-icon
            icon="custom:chevron_down_light"
            size="12"
          />
        </v-btn>
        <div
          v-if="showAllReport"
          class="tw-grid tw-grid-cols-2 tw-gap-x-2 tw-gap-y-1.5 tw-mb-4"
        >
          <div
            v-for="report in reportItems"
            :key="report.key"
            class="report-item"
          >
            <span
              class="report-item__title"
              v-text="report.title"
            />
            <div class="report-item__time-box">
              <span
                class="report-item__time"
                v-text="report.time"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="props.data.data.Description"
        class="tw-flex tw-border-t tw-border-[#E9ECF6] tw-py-4"
      >
        <v-icon
          icon="custom:infoCircle"
          class="tw-ml-1 tw-stroke-secondary"
        />
        <p
          class="tw-text-sm tw-text-[#212121]"
          v-text="props.data.data.Description"
        />
      </div>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch, computed } from "vue"

import { workReport } from "@/components/inputOutput/js/workReport"

import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  data: { type: Object, default: null },
})

let emit = defineEmits(['update:show', 'update'])

const store = useAppStore()

let isVisible = ref(false)

let loading = ref(false)

let showAllReport = ref(false)

const formattedDate = computed(() => {
  return props.data.date.format('ddd jD jMMMM jYYYY')
})

const shiftText = computed(() => {
  const shiftTime = $moment.duration().add(props.data.data.ShiftWorkTime, "m").format('HH:mm')

  return `محاسبه با ${props.data.data.ShiftTitle}`
})

const inputOutputItems = computed(() => {
  return props.data.data.list.filter(item => item.type === 'inputOutput').map(io => {
    return io.children.map((item, index) => {
      let isFirst = index === 0

      return {
        ...item,
        icon: isFirst ? 'custom:arrowDown' : 'custom:arrowUp',
        text: isFirst ? 'ورود' : 'خروج',
        time: $moment(item.Time).format('HH:mm'),
      }
    })
  })
})

const reportItems = computed(() => {
  let report = {}
  workReport.filter(item => item.isDayInfo).forEach(item => {
    report[item.key] = {
      title: item.title,
      time: $moment.duration().add(props.data.data[item.key], "m").format('HH:mm'),
    }
  })

  return report
})

watch(
  () => props.show,
  show => {
    if (show) {
      isVisible.value = show
    }
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

function toHHmm(data = '00:00:00') {
  let time = data.split(':')
  time.pop()

  return time.join(':')
}
</script>

<style scoped lang="scss">
.box-info {
  @apply tw-h-[40px] tw-flex tw-items-center tw-justify-between tw-rounded-3xl tw-bg-white md:tw-bg-[#DFF9F6] tw-px-4;
  .label {
    @apply tw-text-xs tw-font-medium tw-text-[#5BBAA6];
  }
  .value {
    @apply tw-text-base tw-font-bold tw-text-[#5BBAA6];
  }
}
.report-item {
  @apply tw-w-full tw-h-[40px] tw-bg-white md:tw-bg-[#F5F7FC] tw-pl-[5px] tw-pr-2 tw-flex tw-items-center tw-justify-between tw-rounded-3xl;
  &__title {
    @apply tw-text-sm tw-text-[#959499] tw-font-medium tw-ml-1;
  }
  &__time-box {
    @apply tw-w-[60px] tw-h-[30px] tw-bg-secondary-100 md:tw-bg-white tw-flex tw-items-center tw-justify-center tw-rounded-3xl;
  }
  &__time {
    @apply tw-text-[#212121] tw-text-base tw-font-bold;
  }
}
</style>
