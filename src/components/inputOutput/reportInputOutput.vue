<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
      <h4 class="tw-text-lg tw-font-bold">
        گزارش عملکرد
      </h4>
      <div
        class="tw-hidden md:tw-block tw-cursor-pointer"
        @click="showAll = !showAll"
      >
        <span class="tw-text-base tw-font-medium tw-pl-3">همه گزارش ها</span>
        <v-icon
          icon="custom:chevron_down_light"
          size="12"
        />
      </div>
    </div>
    <div
      class="tw-relative tw-transition-all tw-ease-in-out tw-duration-300"
      :class="showAll ? 'tw-h-full' : 'tw-h-[500px] md:tw-h-[250px] tw-overflow-hidden'"
    >
      <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-3 sm:tw-gap-5 tw-pb-[38px] md:pb-0">
        <div
          v-for="(item, index) in reportItems"
          :key="index"
          class="group report-item"
          :class="{ 'report-item--selected': selectedItem === item.key }"
          @click="toggleItem(item)"
        >
          <v-icon
            :icon="item.icon"
            class="tw-mb-2"
          />
          <b
            class="report-item__data"
            v-text="item.time"
          />
          <span
            class="title"
            v-text="item.title"
          />
          <div class="report-item__circle-b" />
          <div class="report-item__circle-s" />
        </div>
      </div>
      <div
        v-if="smAndDown"
        class="tw-w-full tw-absolute tw-bottom-0 tw-right-0 tw-left-0 tw-flex tw-items-end tw-justify-center"
        :class="showAll ? 'tw-h-auto' : 'tw-h-full tw-bg-gradient-to-t tw-from-[#F5F7FC] tw-via-white tw-via-15% tw-to-transparent'"
      >
        <div
          class="tw-flex tw-items-center tw-p-2 tw-cursor-pointer"
          @click="showAll = !showAll"
        >
          <span class="tw-text-secondary tw-text-sm tw-ml-1">{{ showAll ? 'بستن' : 'مشاهده همه ترددها' }}</span>
          <v-icon
            :icon="showAll ? 'custom:chevronUp' : 'custom:chevronDown'"
            size="12"
            class="tw-fill-secondary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

import { workReport } from "@/components/inputOutput/js/workReport"
import { useDisplay } from "vuetify"

const props = defineProps({
  totalWork: { type: Object, default: null },
})

const emit = defineEmits(['highlighted'])

const { smAndDown } = useDisplay()

let report = ref(workReport)

let showAll = ref(false)

let selectedItem = ref(null)

const reportItems = computed(() => {
  let report = props.totalWork || {}

  return workReport.map(item => {
    let time = report[item.key]
      ? $moment.duration().add(report[item.key], "m").format('H:mm')
      : '00:00'

    return {
      ...item,
      time: item.isClock ? time : report[item.key] || '0',
    }
  })
})

function toggleItem(item) {
  if (!item.isHighlightable ||item.time === '00:00') return
  if (selectedItem.value && selectedItem.value === item.key) selectedItem.value = null
  else selectedItem.value = item.key
  emit('highlighted', selectedItem.value)
}
</script>

<style scoped lang="scss">
.report-item {
  @apply tw-bg-white tw-flex tw-flex-col tw-pr-4 tw-py-4 tw-rounded-3xl tw-relative tw-overflow-hidden tw-cursor-pointer;

  &__data {
    @apply tw-text-lg tw-font-bold tw-mb-1;
  }
  .title {
    @apply tw-text-sm tw-font-normal tw-text-[#959499] group-hover:tw-text-primary;
  }
  &__circle-b {
    @apply tw-w-[58px] tw-h-[58px] tw-bg-secondary-100 tw-rounded-full tw-absolute -tw-top-3.5 -tw-left-3.5 group-hover:tw-bg-gradient-to-b tw-from-[#005D34] tw-to-[#8FCCB1];
  }
  &__circle-s {
    @apply tw-w-[14px] tw-h-[14px] tw-bg-secondary-100 tw-rounded-full tw-absolute tw-top-10 tw-left-10;
  }

  &--selected {
    .report-item__data {
      @apply tw-text-primary;
    }
    .report-item__circle-b {
      @apply tw-bg-gradient-to-b tw-from-[#005D34] tw-to-[#8FCCB1];
    }
    .report-item__circle-s {
      @apply tw-bg-gradient-to-b tw-from-[#005D34] tw-to-[#8FCCB1];
    }
  }
}
</style>
