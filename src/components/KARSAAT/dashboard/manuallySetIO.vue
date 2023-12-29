<template>
  <div
    class="setIoWrapper"
  >
    <div class="startWorkWrapper">
      <start-work
        class="startWorkPosition"
      />
    </div>
    <div
      class="tw-m-auto tw-mt-3 sm:tw-mt-auto"
    >
      <template
        v-for="unit in ['seconds','minutes','hours']"
        :key="unit"
      >
        <div
          dir="ltr"
          class="unit "
        >
          <v-scroll-y-transition>
            <span
              :key="store.timer[unit] % 10"
              class="tw-absolute tw-block tw-w-full "
            >
              {{ store.timer[unit] % 10 }}
            </span>
          </v-scroll-y-transition>
        </div>
        <div
          dir="ltr"
          class="unit"
        >
          <v-scroll-y-transition>
            <span
              :key="parseInt((store.timer[unit] / 10).toString())"
              class="tw-absolute tw-block tw-w-full"
            >{{ parseInt((store.timer[unit] / 10).toString()) }}</span>
          </v-scroll-y-transition>
        </div>
        <span
          v-if="unit !== 'hours'"
          class="unit"
        >:</span>
      </template>
    </div>
  </div>
</template>

<script setup>
const store = useAppStore()
</script>

<style scoped>
.setIoWrapper{
  @apply tw-flex tw-h-full tw-w-full tw-overflow-hidden tw-bg-primary-50 tw-rounded-2xl tw-shadow;
  @apply tw-flex-col sm:tw-flex-row;
}
.startWorkWrapper {
  @apply sm:tw-h-full sm:tw-flex sm:tw-flex-col sm:tw-justify-center sm:tw-relative sm:tw-w-1/3 sm:tw-overflow-hidden
}
.startWorkPosition {
  @apply tw-w-fit tw-m-auto tw-mt-3;
  @apply sm:tw-mt-0 sm:tw-mr-[-50px];
}
.unit{
   @apply tw-relative tw-inline-block tw-h-[45px] tw-w-[30px] tw-overflow-hidden tw-text-center tw-text-5xl tw-font-bold tw-text-primary
 }
.scroll-y-transition-enter-active {
  transition: all 1s ease !important;
}
.scroll-y-transition-enter-from {
  opacity: 1 !important;
  top: -20px !important;
}
.scroll-y-transition-enter-to {
  opacity: 1 !important;
  top: 0px !important;
}

.scroll-y-transition-leave-active {
  transition: all 1s ease !important;
}
.scroll-y-transition-leave-to {
  opacity: 1 !important;
  top:30px !important;
}
.scroll-y-transition-leave-from {
  opacity: 1 !important;
  top:0px !important;
}
</style>
