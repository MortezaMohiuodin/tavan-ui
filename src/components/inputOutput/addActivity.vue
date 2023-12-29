<template>
  <v-dialog-extend
    v-model="isVisible"
    color="secondary"
    width="400px"
    class="add-activity"
  >
    <div class="tw-max-w-[425px] tw-mx-auto tw-h-full add-input-output tw-flex tw-flex-col md:tw-mx-8">
      <p class="md:tw-mt-5 tw-mb-1 tw-text-center tw-text-xl tw-font-bold">
        ثبت تردد
      </p>
      <div class="tw-flex tw-justify-center tw-items-center tw-mb-2.5">
        <v-icon
          icon="custom:calendar2"
          size="17"
          class="tw-ml-1"
        />
        <span
          class="tw-text-base tw-font-medium"
          v-text="formattedDate"
        />
      </div>
      <v-tabs
        v-model="tab"
        align-tabs="center"
        :bg-color="smAndDown ? '#ffffff' : '#F5F7FC'"
        height="50"
        class="tw-mb-4"
      >
        <v-tab
          v-for="item in tabs"
          :key="item.key"
          :value="item.key"
          height="40"
          hide-slider
          :disabled="item.disabled"
        >
          <span v-text="item.title" />
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item
          v-for="item in tabs"
          :key="item.key"
          :value="item.key"
        >
          <component
            :is="cmp[item.key]"
            v-if="!item.disabled"
            :date="date"
            @cancel="isVisible = false"
            @ok="update"
          />
          <p v-else>
            شما دسترسی ندارید
          </p>
        </v-window-item>
      </v-window>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import { ref, watch, computed } from "vue"

import { useDisplay } from "vuetify"

import VDialogExtend from "@/components/uiKit/vDialogExtend.vue"
import inputOutput from "@/components/inputOutput/inputOutputForm.vue"
import mission from "@/components/inputOutput/missionForm.vue"
import absent from "@/components/inputOutput/absentForm.vue"

let props = defineProps({
  show: { type: Boolean, default: false },
  isMine: { type: Boolean, default: true },
  data: { type: Object, default: null },
})

let emit = defineEmits(['update:show', 'update'])

const { smAndDown } = useDisplay()

const store = useAppStore()

let loading = ref(false)

let isVisible = ref(false)

let tab = ref(null)

const tabs = ref([
  { key: 'inputOutput', title: 'تردد',disabled: ((props.isMine && !store.permits.includes('CanAddTemporaryTracking')) ||  (!props.isMine && !store.permits.includes('TimeTrackManager'))) },
  { key: 'absent', title: 'مرخصی',disabled:  !(store.permits.includes('SetAbsent') || props.isMine) },
  { key: 'mission', title: 'ماموریت' , disabled: !(store.permits.includes('SetAbsent') || props.isMine) },
])

const cmp = {
  inputOutput,
  mission,
  absent,
}

const date = computed(() => {
  return $moment(props.data.date).format('YYYY-MM-DDTHH:mm:ss')
})

const formattedDate = computed(() => {

  return props.data?.date.format('ddd jD jMMMM jYYYY')
})

watch(
  () => props.show,
  show => {
    isVisible.value = show
  },
)

watch(isVisible, val => {
  if (props.show !== val) emit('update:show', val)
})

function update() {
  emit('update')
  isVisible.value = false
}
</script>

<style lang="scss">
.add-activity {
  .active-tab {
    @apply tw-bg-white tw-text-sm tw-font-medium tw-text-[#212121] #{!important};
  }
  .v-slide-group {
    @apply tw-rounded-3xl;
    &__content {
      @apply tw-items-center tw-text-[#959499] #{!important};
      .v-tab--selected {
        @apply tw-font-medium tw-text-[#212121] tw-bg-secondary-100 md:tw-bg-white #{!important};
      }
    }
  }
}
</style>
