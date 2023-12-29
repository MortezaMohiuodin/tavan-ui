<template>
  <div class="tw-grid tw-grid-cols-7 tw-gap-3 tw-w-[600px] tw-mx-auto tw-my-6">
    <template
      v-for="(day,index) in io"
      :key="index"
    >
      <v-menu
        transition="scale-transition"
        width="400px"
      >
        <template #activator="{ props }">
          <v-btn
            color="#fff"
            class="tw-text-lg !tw-w-[50px] !tw-h-[50px] !tw-p-0"
            style="min-width: initial"
            rounded="circle"
            v-bind="props"
          >
            {{ day.Date && $moment(day.Date).format('jD') }}
          </v-btn>
        </template>
        <div>
          <div class="tw-bg-blue-300 tw-text-white tw-rounded-2xl tw-p-2">
            {{ $getEnum($enums.weekDays,'key',$moment(day.Date).day(),'value') }} {{ $moment(day.Date).format('jDD jMMMM jYY') }}
          </div>
          <p class="tw-text-sm tw-text-center tw-my-3">
            محاسبه با {{ day.ShiftTitle }}
          </p>
          <divider color="#ddd" />
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <div
              v-for="(item,i) in $enums.res"
              :key="i"
            >
              <v-chip
                color="info"
                variant="elevated"
                class="!tw-rounded-es-xl tw-w-[100px]"
                :class="{'tw-opacity-50':day[item.key] === '00:00:00' || !day[item.key]}"
              >
                {{ item.value }}
              </v-chip>
              <v-chip
                color="info"
                variant="tonal"
                class="!tw-rounded-es-xl tw-w-[80px] tw-justify-center"
              >
                {{ day[item.key] }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-menu>
    </template>
  </div>
  <div class="tw-flex tw-gap-2 tw-justify-center tw-my-5">
    <v-chip
      v-for="status in $enums.ioReportStatus"
      :key="status.key"
      :text="status.value"
      :color="status.color"
      rounded="xl"
      variant="tonal"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  io : { type:Array ,default : ()=>([]) },
})
</script>
