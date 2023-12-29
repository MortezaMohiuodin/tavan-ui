<template>
  <div class="tw-inline">
    <v-dialog
      v-model="dialog"
      width="460px"
      height="300px"
      scroll-strategy="none"
      @update:model-value="close($e)"
    >
      <template #activator="{ props }">
        <v-b-table
          v-bind="props"
          color="error"
          size="30"
        >
          <v-icon
            icon="custom:trash"
            size="15"
          />
        </v-b-table>
      </template>
      <div class="wrap-dialog">
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="error"
          class="mb-0"
          height="8"
        />
        <div
          v-else
          class="topLine"
        />
        <div class="wrap-content">
          <div class="tw-grow-0">
            <div class="wrap-icon">
              <v-icon
                icon="custom:error"
                size="56"
              />
            </div>
            <p class="wrap-Title">
              {{ useProps.title }}
            </p>
          </div>
          <div class="wrap-message-btn">
            <div class="wrap-message">
              {{ useProps.message }}
            </div>
            <div class="wrap-btn">
              <v-btn-cancel @click="cancel">
                انصراف
              </v-btn-cancel>
              <v-btn-error
                :loading="loading"
                @click="ok"
              >
                تایید
              </v-btn-error>
            </div>
          </div>
        </div>
        <v-overlay
          v-model="loading"
          contained
          persistent
          scrim="white"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
let useProps = defineProps({
  title: { type: String, default: 'حذف' },
  message: { type: String, default: 'این مورد حذف شود' },
})
let emit = defineEmits(['ok', 'cancel'])
let dialog = ref(false)
let loading = ref(false)
defineExpose({
  dialog,
  loading,
})
function ok() {
  emit('ok')
}
function cancel() {
  dialog.value = false
  emit('cancel')
}
function close(val) {
  if (!val) loading.value = false
}
</script>

<style scoped>
.wrap-dialog {
  @apply tw-h-full tw-overflow-hidden tw-rounded-[20px] tw-bg-white
}
.wrap-content{
  @apply tw-flex tw-h-full tw-flex-col
}
.wrap-icon{
  @apply tw-mb-[30px] tw-mt-[48px] tw-text-center
}
.wrap-Title{
  @apply tw-mb-[9px] tw-text-center tw-text-[20px] tw-font-[700]
}
.wrap-message-btn{
  @apply tw-flex tw-grow tw-flex-col
}
.wrap-message {
  @apply tw-grow tw-text-center tw-text-[16px] tw-font-[400]
}
.wrap-btn {
  @apply tw-mb-[36px] tw-grow-0 tw-justify-self-end tw-text-center
}
.topLine{
  @apply tw-w-full tw-border-t-[8px] tw-border-t-error
}
</style>
