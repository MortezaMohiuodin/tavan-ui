<template>
  <v-card
    elevation="0"
    class="tw-flex tw-flex-col sm:tw-flex-row tw-py-5 tw-px-7 tw-h-full tw-w-full"
    rounded="xl"
  >
    <div class="tw-text-center sm:tw-text-right">
      <h4 class="tw-text-base tw-font-bold">
        کجایی؟ حالت چطوره؟
      </h4>
      <p class="tw-mt-1 tw-text-sm tw-font-medium">
        اگر دوست داشتی با هم صحبت کنیم،
      </p>
      <v-dialog-basic
        v-model="dialog"
        v-model:loading="loading"
        title="ثبت احوال"
        color="secondary"
        width="460px"
        confirm-btn-text="تایید و ثبت"
        cancel-btn-text="انصراف"
        scroll-strategy="none"
        @on-confirm="onConfirm"
      >
        <template #activator="{props}">
          <v-btn
            flat
            :ripple="false"
            variant="plain"
            size="x-large"
            color="secondary"
            class="tw-px-0 tw-font-medium hover:tw-bg-white -tw-mt-2 tw-opacity-100"
            append-icon="custom:arrowLeft"
            v-bind="props"
          >
            برامون بنویس
          </v-btn>
        </template>
        <p class="tw-text-sm tw-text-center tw-mt-4">
          اگر دوست داشتی با هم صحبت کنیم، برامون بنویس
        </p>
        <div class="tw-flex tw-justify-center tw-my-2">
          <v-btn-toggle
            v-model="selectedEmoji"
            class="vBtnToggleEmoji"
          >
            <v-btn
              v-for="(emoji,index) in emojis"
              :key="index"
              class="v-btn--icon"
              rounded="circle"
              color="secondary-100"
              width="70"
              height="70"
              :ripple="false"
            >
              <v-avatar
                :image="emoji"
              />
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="tw-h-40 tw-my-5 tw-mb-8 tw-overflow-y-auto tw-overflow-x-hidden paperScroll">
          <paper-textarea v-model="message" />
        </div>
      </v-dialog-basic>
    </div>
    <div class="tw-self-center tw-mr-auto">
      <location-toggle-btn v-model="selectedLocation" />
    </div>
  </v-card>
</template>

<script setup>
import pokerFace from '@/assets/images/pokerFace.png'
import sadFace from '@/assets/images/sadFace.png'
import smileyFace from '@/assets/images/smileyFace.png'
import happyFace from '@/assets/images/happyFace.png'
import angryFace from '@/assets/images/angryFace.png'
import locationToggleBtn from '@/components/KARSAAT/dashboard/locationToggleBtn.vue'

const dialog = ref(false)
const loading = ref(false)
const selectedEmoji = ref(null)
const message = ref('')
const emojis = ref([angryFace,sadFace,pokerFace,smileyFace,happyFace])
const selectedLocation = ref(null)

const onConfirm = ()=>{
  loading.value = true
  setTimeout(()=>{
    loading.value = false
  },3000)
}
</script>

