<template>
  <v-card-default
    :loading="loading"
    class="daily-report tw-mt-4 tw-min-h-[180px] !tw-p-0 tw-bg-transparent"
  >
    <div class="daily-report__tabs">
      <v-btn
        variant="text"
        color="secondary"
        icon="fa-solid fa-chevron-right"
        class="tw-text-xs"
        height="46"
        rounded="lg"
        :loading="loading"
        :disabled="loading"
        @click="prevDay"
      />
      <div class="daily-report__wrapper">
        <v-tabs
          v-model="active"
          center-active
          align-tabs="center"
          height="75px"
          selected-class=""
          :show-arrows="false"
          next-icon=""
          prev-icon=""
          :ripple="false"
        >
          <v-tab
            v-for="(day, key) in daysObject"
            :key="key"
            :value="key"
            rounded="30px"
            selected-class="daily-report__tab--active"
            height="64px"
            :ripple="false"
            class="daily-report__tab"
          >
            <div
              class="daily-report__tab-inner"
            >
              <div
                class="tw-w-full tw-border-[#DEE4F7]"
                :class="{
                  'tw-border-l-2': key > active,
                  'tw-border-r-2': key < active
                }"
              >
                <h1 class="daily-report__tab-date">
                  {{ $moment(key).format('ddd jDD jMMMM') }}
                </h1>
                <div class="tw-flex tw-items-center tw-justify-center">
                  <span class="daily-report__tab-hour">
                    {{ toHHmm(day.data.TotalWorkTime) }}
                  </span>
                  <span
                    class="tw-w-[6px] tw-h-[6px] tw-rounded-full tw-mr-1"
                    :class="day.bg"
                  />
                </div>
              </div>
            </div>
          </v-tab>
        </v-tabs>
      </div>
      <v-btn
        variant="text"
        color="secondary"
        icon="fa-solid fa-chevron-left"
        height="46"
        rounded="lg"
        class="tw-text-xs"
        :loading="loading"
        :disabled="loading"
        @click="nextDay"
      />
    </div>
    <v-window
      v-model="active"
      class="daily-report__content window-tab"
    >
      <v-window-item
        v-for="(day, key) in daysObject"
        :key="key"
        :value="key"
        class="daily-report__content-inner"
        transition="fade-transition"
        reverse-transition="fade-transition"
      >
        <div v-if="day.hasIo">
          <div
            v-for="(item, i) in day.data.list"
            :key="i"
            class="daily-report__info-item"
          >
            <template v-if="item.type === 'inputOutput'">
              <span
                class="tw-ml-4 tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-sm"
                :class="item.children.length > 1 ? 'tw-bg-[#1ABC9C]' : 'tw-bg-[#F68B1F]'"
              />
              <div class="tw-ml-8">
                <span class="daily-report__info-item-label">ورود:</span>
                <span class="daily-report__info-item-val">{{ $moment(item.children[0].Time).format('HH:mm') }}</span>
              </div>
              <div>
                <span class="daily-report__info-item-label">خروج:</span>
                <span class="daily-report__info-item-val">{{ item.children.length > 1 ? $moment(item.children[1].Time).format('HH:mm') : '--:--' }}</span>
              </div>
            </template>
            <template v-if="item.type === 'absent'">
              <span class="tw-ml-4 tw-inline-block tw-w-1.5 tw-h-1.5 tw-bg-[#0080FF] tw-rounded-sm" />
              <div class="tw-ml-8">
                <span class="daily-report__info-item-label">شروع:</span>
                <span class="daily-report__info-item-val">{{ toHHmm(item.StartTime) }}</span>
              </div>
              <div class="tw-ml-8">
                <span class="daily-report__info-item-label">پایان:</span>
                <span class="daily-report__info-item-val">{{ toHHmm(item.EndTime) }}</span>
              </div>
              <div>
                <span class="daily-report__info-item-label">مرخصی:</span>
                <span class="daily-report__info-item-val">مرخصی ساعتی</span>
              </div>
            </template>
            <template v-if="item.type === 'mission'">
              <span class="tw-ml-4 tw-inline-block tw-w-1.5 tw-h-1.5 tw-bg-[#4C49DA] tw-rounded-sm" />
              <div class="tw-ml-8">
                <span class="daily-report__info-item-label">شروع:</span>
                <span class="daily-report__info-item-val">{{ toHHmm(item.StartTime) }}</span>
              </div>
              <div class="tw-ml-8">
                <span class="daily-report__info-item-label">پایان:</span>
                <span class="daily-report__info-item-val">{{ toHHmm(item.EndTime) }}</span>
              </div>
              <div>
                <span class="daily-report__info-item-label">ماموریت:</span>
                <span class="daily-report__info-item-val">ماموریت ساعتی</span>
              </div>
            </template>
          </div>
        </div>
        <div
          v-else-if="day.type === 'absent'"
          class="tw-text-center tw-text-base"
        >
          <span
            :class="day.color"
            v-text="absentStatusText"
          />
        </div>
        <div
          v-else-if="day.type === 'mission'"
          class="tw-text-center tw-text-base"
        >
          <span
            :class="day.color"
            v-text="missionStatusText"
          />
        </div>
        <div
          v-else-if="day.type === 'holiday'"
          class="tw-text-center tw-text-base"
        >
          <span
            :class="day.color"
            v-text="day.text"
          />
        </div>
        <div
          v-else
          class="tw-text-center tw-min-h-[25px] tw-text-base tw-text-gray-400"
        >
          <span v-show="!loading">یرای این روز تردد ثبت نشده</span>
        </div>
      </v-window-item>
    </v-window>
    <v-overlay
      v-if="!isFirstActive || !isLastActive"
      :model-value="loading"
      contained
      scrim="white"
      content-class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center"
      class="tw-rounded-3xl"
    />
  </v-card-default>
</template>

<script setup>
import { ref } from "vue"
import { $moment } from "@/plugins/moment"
import { useDisplay } from 'vuetify'
import useDayInfo from "@/composables/useDayInfo"
import { $enums } from "@/plugins/enums"

const { mobile } = useDisplay()

const date = ref($moment())

const fromDate = ref(null)

const toDate = ref(null)

let active = ref($moment().format('YYYY-MM-DD'))

const { daysObject, loading } = useDayInfo(fromDate, toDate, ref(null))

const isFirstActive = computed(() => {
  const day = Object.keys(daysObject.value)[0]

  return $moment(day).isSame(active.value)
})

const isLastActive = computed(() => {
  const day = Object.keys(daysObject.value).at(-1)

  return $moment(day).isSame(active.value)
})

const absentStatusText = computed(() => {
  let status = $getEnum($enums.absentStatus, 'key', daysObject.value[active.value]?.absent?.AbsentStatus, 'title')

  return {
    inProgress: 'مرخصی درانتظار تایید مدیر',
    accepted: 'مرخصی روزانه',
    rejected: 'مرخصی رد شده',
  }[status]
})

const missionStatusText = computed(() => {
  let status = $getEnum($enums.missionStatus, 'key', daysObject.value[active.value]?.mission?.Status, 'title')

  return {
    inProgress: 'ماموریت درانتظار تایید مدیر',
    accepted: 'ماموریت روزانه',
    rejected: 'ماموریت رد شده',
  }[status]
})

watch(date, () => {
  fromDate.value = date.value.clone().subtract(5, 'day')
  toDate.value = date.value.clone().add(5, 'day')
}, { immediate: true })

function prevDay() {
  if (isFirstActive.value) {
    fromDate.value = $moment(active.value).clone().subtract(5, 'day')
    active.value = $moment(active.value).clone().subtract(1, 'day').format('YYYY-MM-DD')
  }
  else
    active.value = $moment(active.value).clone().subtract(1, 'day').format('YYYY-MM-DD')
}
function nextDay() {
  if (isLastActive.value) {
    toDate.value = $moment(active.value).clone().add(5, 'day')
    active.value = $moment(active.value).clone().add(1, 'day').format('YYYY-MM-DD')
  }
  else
    active.value = $moment(active.value).clone().add(1, 'day').format('YYYY-MM-DD')
}

function toHHmm(data = '00:00:00') {
  let time = data.split(':')
  time.pop()

  return time.join(':')
}
</script>

<style lang="scss">
.daily-report {
  @apply tw-relative;
  &__tabs {
    @apply tw-flex tw-items-center;
  }
  &__wrapper {
    @apply tw-w-full tw-grow tw-overflow-hidden;
  }
  &__tab {
    @apply tw-p-0 tw-rounded-t-[30px];
  }
  &__tab--active {
    .daily-report__tab-inner {
      box-shadow: 0 0 20px -2px #d5d0d0ab;
      clip-path: inset(-20px -10px 0px -20px);
      pointer-events: none;
      @apply tw-bg-white tw-border-b-0;
    }
    .daily-report__tab-date {
      @apply tw-text-[#212121];
    }
    .daily-report__tab-hour {
      @apply tw-text-[#212121];
    }
  }
  &__tab-inner {
    @apply tw-w-32 tw-h-[64px] tw-rounded-tl-[30px] tw-rounded-tr-[30px] tw-flex tw-items-center;
  }
  &__tab-date {
    @apply tw-text-sm tw-text-[#959499] tw-text-center;
  }
  &__tab-hour {
    @apply tw-text-base tw-font-medium tw-text-[#959499] tw-w-auto tw-text-center tw-mt-1;
  }
  .v-slide-group__content {
    @apply tw-items-end;
  }

  &__content {
    @apply tw-shadow-[0_0_13px_-3px_#d5d0d0ab] tw-rounded-3xl ;
  }
  &__content-inner {
    @apply tw-py-10 tw-px-5 tw-bg-white tw-rounded-3xl;
  }
  &__info-item {
    @apply tw-flex tw-items-center tw-text-sm tw-mb-4 last:tw-mb-0;
  }
  &__info-item-label {
    @apply tw-text-[#959499] tw-ml-1;
  }
  &__info-item-val {
    @apply tw-text-[#212121];
  }
}
</style>
