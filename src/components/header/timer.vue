<template>
  <div
    class="tw-h-[46px] tw-w-32 tw-rounded-2xl tw-flex tw-flex-col tw-transition-all"
    :class="store.timer.isRunning ? 'tw-bg-primary-200':' tw-bg-secondary-100'"
  >
    <div class="tw-text-lg tw-font-bold tw-text-primary tw-m-auto tw-flex ">
      <v-btn
        v-if="permits.includes('AddAutoTracking') "
        variant="flat"
        color="primary"
        icon="fas fa-play"
        height="30"
        class="tw-ml-2 tw-px-0"
        size="30"
        :loading="store.loadingTimer"
        @click="toggleTimer"
      >
        <template #default>
          <v-icon
            :icon="store.timer.isRunning ?'fas fa-pause' :'fas fa-play'"
            size="15"
          />
        </template>
      </v-btn>
      <div
        class="tw-h-[28px] tw-m-auto"
      >
        <template
          v-for="unit in ['seconds','minutes','hours']"
          :key="unit"
        >
          <div
            dir="ltr"
            class="unit"
          >
            <v-scroll-y-transition>
              <span
                :key="store.timer[unit] % 10"
                class="tw-absolute tw-block tw-w-full"
              >{{ store.timer[unit] % 10 }}</span>
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
    <v-dialog-extend
      v-model="showConfirmDialog"
      title="تایید ورود"
      color="info"
      :loading="loading"
      cancel-btn-text="انصراف"
      confirm-btn-text="تایید"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
    >
      <div class="tw-mt-10 tw-mb-10">
        {{ dialogText }}
      </div>
    </v-dialog-extend>
  </div>
</template>

<script setup>
const { WID,activePlugins,permits } = useAppStore()
const store = useAppStore()
const showConfirmDialog = ref(false)
const loading = ref(false)
let dialogText = ref('')

const toggleTimer = async ()=>{
  const status = await store.toggleTimer()

  /**
   Checks if the user has already set an hourly off for the current day.
   If a previous hourly off has been set, the user is prevented from starting the work timer.
   The user is shown a confirmation popup, informing them that they have previously set an hourly off. */
  if(status!==true){
    showConfirmDialog.value = true
    dialogText.value = status.data.Modal
  }
}

const onConfirm =async ()=>{
  loading.value = true
  try{
    await store.toggleTimer(true)
    loading.value = false
    showConfirmDialog.value = false
  }catch (e){loading.value = false}
}

const onCancel = ()=>{
  showConfirmDialog.value = false
}
</script>

<style scoped>
.unit{
  @apply tw-relative tw-inline-block tw-h-[20px] tw-w-[10px] tw-overflow-hidden tw-text-center
}
.scroll-y-transition-enter-active {
  transition: all 1s ease !important;
}
.scroll-y-transition-enter-from {
  opacity: 1 !important;
}

.scroll-y-transition-leave-active {
  transition: all 1s ease !important;
}
.scroll-y-transition-leave-to {
  opacity: 1 !important;
}
</style>
