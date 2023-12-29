<template>
  <v-expand-transition>
    <div
      v-show="isVisible"
      class="tw-bg-white tw-p-4 tw-border tw-border-[#E9ECF6] tw-rounded-3xl tw-mb-6"
    >
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-5">
        <h4 class="tw-text-base tw-font-bold">
          نمایش بر اساس:
        </h4>
        <v-btn
          icon="custom:close"
          variant="text"
          size="x-small"
          @click="isVisible = false"
        />
      </div>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
        <div>
          <v-btn
            rounded="xl"
            size="large"
            :variant="rangeSelected ? 'outlined' : 'flat'"
            :color="rangeSelected ? '#E6E6E6' : '#FFF2D4'"
            class="tw-px-6"
            @click="rangeSelected = false"
          >
            <v-icon
              icon="custom:year"
              class="tw-ml-3"
              :class="rangeSelected ? 'tw-fill-[#C9C9C9]' : 'tw-fill-primary'"
            />
            <span
              class="tw-text-[15px]"
              :class="rangeSelected ? 'tw-text-[#212121] tw-font-normal' :'tw-text-primary tw-font-bold'"
            >سال</span>
          </v-btn>
          <div class="tw-flex tw-items-center tw-mt-6">
            <div class="tw-flex-grow tw-ml-3">
              <span
                class="tw-text-sm"
                :class="rangeSelected ? 'tw-text-[#D3D3D3]' : 'tw-text-[#6F6F9D]'"
              >سال</span>
              <date-picker
                v-model="yearByMonth"
                :options="{
                  type: 'year',
                  simple: true,
                  'display-format': 'jYYYY'
                }"
                variant="filled"
                :disabled="rangeSelected"
                class="filled-input"
              />
            </div>
            <div class="tw-flex-grow tw-ml-2">
              <span
                class="tw-text-sm"
                :class="rangeSelected ? 'tw-text-[#D3D3D3]' : 'tw-text-[#6F6F9D]'"
              >ماه</span>
              <date-picker
                v-model="yearByMonth"
                :options="{
                  type: 'month',
                  simple: true,
                  'display-format': 'jMMMM'
                }"
                :disabled="rangeSelected"
                class="filled-input"
              />
            </div>
            <v-btn
              width="38"
              height="38"
              size="small"
              icon="fas fa-search"
              rounded="tw-rounded-circle"
              :disabled="rangeSelected"
              @click="applyFilter"
            />
          </div>
        </div>
        <div>
          <v-btn
            rounded="xl"
            size="large"
            :variant="rangeSelected ? 'flat' : 'outlined'"
            :color="rangeSelected ? '#FFF2D4' : '#E6E6E6'"
            class="tw-px-6"
            @click="rangeSelected = true"
          >
            <v-icon
              icon="custom:weekCalendar"
              class="tw-ml-3"
              :class="rangeSelected ? 'tw-fill-primary' : 'tw-fill-[#C9C9C9]'"
            />
            <span
              class="tw-text-[13px]"
              :class="rangeSelected ? 'tw-text-primary tw-font-bold' :'tw-text-[#212121] tw-font-normal'"
            >دلخواه</span>
          </v-btn>
          <div class="tw-flex tw-items-center tw-mt-6">
            <div class="tw-flex-grow tw-ml-3">
              <span
                class="tw-text-sm"
                :class="rangeSelected ? 'tw-text-[#6F6F9D]' : 'tw-text-[#D3D3D3]'"
              >از تاریخ</span>
              <date-picker
                v-model="from"
                variant="filled"
                :disabled="!rangeSelected"
                class="filled-input"
              />
            </div>
            <div class="tw-flex-grow tw-ml-2">
              <span
                class="tw-text-sm"
                :class="rangeSelected ? 'tw-text-[#6F6F9D]' : 'tw-text-[#D3D3D3]'"
              >تا تاریخ</span>
              <date-picker
                v-model="to"
                :disabled="!rangeSelected"
                class="filled-input"
              />
            </div>
            <v-btn
              width="38"
              height="38"
              size="small"
              icon="fas fa-search"
              rounded="tw-rounded-circle"
              :disabled="!rangeSelected"
              @click="applyFilter"
            />
          </div>
        </div>
      </div>
      <div>
        <v-checkbox
          v-model="showArchived"
          label="نمایش تردد های حذف شده"
        />
      </div>
    </div>
  </v-expand-transition>
</template>

<script setup>
import { ref, watch } from 'vue'

import DatePicker from "@/components/inputOutput/datePicker.vue"
import { $moment } from "@/plugins/moment"

let props = defineProps({
  show: { type: Boolean, default: false },
})

let emit = defineEmits(['update:show', 'updateFilter', 'updateArchivedStatus'])

const date = ref($moment())

let isVisible = ref(false)

let rangeSelected = ref(false)

let showArchived = ref(false)

let yearByMonth = ref(null)
let from = ref(null)
let to = ref(null)

watch(
  () => props.show,
  show => {
    isVisible.value = show
  }, { immediate: true },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

watch(showArchived, val => {
  emit('updateArchivedStatus', val)
})

function applyFilter() {
  let fromDate = ''
  let toDate = ''
  if (rangeSelected.value) {
    fromDate = $moment(from.value)
    toDate = $moment(to.value)
    emit('updateFilter', fromDate, toDate)
  } else {
    if (!yearByMonth.value) return
    fromDate = $moment(yearByMonth.value).startOf('jMonth')
    toDate = $moment(yearByMonth.value).clone().endOf('jMonth')
    emit('updateFilter', fromDate, toDate)
  }
}
</script>

<style lang="scss">
.filled-input {
  .v-field__input{
    @apply tw-px-[20px] tw-py-[5px] #{!important};
  }
  .v-field--variant-filled {
    @apply tw-bg-[#F5F7FC] tw-border-0
  }
  .v-field--variant-filled .v-field__overlay {
    @apply tw-bg-[#F5F7FC] tw-opacity-100
  }
}
</style>
