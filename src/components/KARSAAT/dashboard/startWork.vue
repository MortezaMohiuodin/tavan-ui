<template>
  <div>
    <v-hover>
      <template #default="{ isHovering, props }">
        <div
          class="tw-w-[255px] tw-h-[254px] tw-relative "
          v-bind="props"
        >
          <div
            class="tw-w-[254px] tw-h-[254px] tw-left-0 tw-top-0 tw-absolute tw-bg-primary-200 tw-rounded-full tw-border tw-border-primary-80"
            :class="{'tw-bg-primary-400':isHovering}"
          />
          <div
            class="tw-w-[175px] tw-h-[175px] tw-left-[39px] tw-top-[40px] tw-absolute tw-bg-primary-250 tw-rounded-full tw-border tw-border-primary-200 tw-shadow-[inset_0_0_9px] tw-shadow-primary-280"
            :class="{'tw-bg-primary-300':isHovering}"
          />
          <div
            class="tw-w-[115px] tw-h-[115px] tw-left-[69px] tw-top-[70px] tw-absolute tw-bg-primary-200 tw-rounded-full"
            :class="{'tw-bg-primary-500':isHovering}"
          />

          <div
            v-ripple
            class="tw-text-center tw-flex tw-flex-col tw-w-[105px] tw-h-[105px] tw-left-[74px] tw-top-[75px] tw-absolute tw-bg-primary tw-rounded-full tw-shadow  tw-cursor-pointer"
            :class="{'tw-bg-primary-550':isHovering}"
            @click="store.toggleTimer()"
          >
            <v-progress-circular
              v-if="store.loadingTimer"
              :size="50"
              color="white"
              indeterminate
              class="tw-m-auto"
            />
            <template v-else>
              <div
                class="tw-w-[81px] tw-h-[81px] tw-left-[-26px] tw-top-[-26px] tw-absolute tw-opacity-10 tw-bg-white tw-rounded-full"
              />
              <p
                class="tw-m-auto tw-text-white tw-font-bold"
              >
                <span v-if="store.timer.isRunning"> پایان کار</span>
                <span v-else>شروع کار</span>
              </p>
            </template>
          </div>
          <div class="tw-w-2 tw-h-2 tw-left-[36px] tw-top-[150px] tw-absolute tw-bg-red-400 tw-rounded-full tw-shadow tw-border tw-border-white" />
          <div class="tw-w-2 tw-h-2 tw-left-[182px] tw-top-[232px] tw-absolute tw-bg-orange-500 tw-rounded-full tw-shadow tw-border tw-border-white" />
          <div class="tw-w-2 tw-h-2 tw-left-[199px] tw-top-[165px] tw-absolute tw-bg-teal-500 tw-rounded-full tw-shadow" />
          <div class="tw-w-1 tw-h-1 tw-left-[15.66px] tw-top-[78px] tw-absolute tw-origin-top-left tw-rotate-[131.77deg] tw-bg-amber-400" />
          <div class="tw-w-1 tw-h-1 tw-left-[133px] tw-top-[56px] tw-absolute tw-origin-top-left tw-rotate-[179.87deg] tw-bg-red-400" />
          <div class="tw-w-1.5 tw-h-1.5 tw-left-[230.94px] tw-top-[113px] tw-absolute tw-origin-top-left tw-rotate-[170.79deg] tw-bg-stone-300" />
          <div class="tw-w-[7.92px] tw-h-[7.92px] tw-left-[21.82px] tw-top-[13px] tw-absolute tw-origin-top-left tw-rotate-[170.79deg] tw-bg-emerald-400" />
          <div class="tw-w-[9.29px] tw-h-[9.29px] tw-left-[160.52px] tw-top-[10.60px] tw-absolute tw-origin-top-left tw-rotate-[-163.74deg] tw-bg-amber-400" />
          <div class="tw-w-2 tw-h-2 tw-left-[40px] tw-top-[124px] tw-absolute tw-origin-top-left tw-rotate-[-131.41deg] tw-bg-emerald-800" />
        </div>
      </template>
    </v-hover>
  </div>
</template>

<script setup>
const store = useAppStore()
</script>

<style scoped>
div{
 @apply tw-transition-all tw-duration-300
}
</style>
