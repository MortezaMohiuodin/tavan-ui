<template>
  <v-card-default>
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-ms-2">
        <h4
          class="tw-text-lg tw-font-YEKAN-BAKH-MEDIUM"
        >
          امروز حالت چطوره؟
        </h4>
        <v-btn
          v-if="selectedEmoji || selectedEmoji === 0"
          class="tw-mt-2"
          elevation="0"
          @click="onClick"
        >
          تایید و ثبت
        </v-btn>
      </div>
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
    </div>
  </v-card-default>
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
    <p class="tw-text-sm tw-text-center tw-mt-4">
      اگر دوست داشتی با هم صحبت کنیم، برامون بنویس
    </p>
    <div class="tw-flex tw-justify-center tw-my-2">
      <v-avatar
        :image="emojiAvatar"
      />
    </div>
    <div class="tw-h-40 tw-my-5 tw-mb-8 tw-overflow-y-auto tw-overflow-x-hidden paperScroll">
      <paper-textarea v-model="description" />
    </div>
  </v-dialog-basic>
</template>

<script setup>
import pokerFace from '@/assets/images/pokerFace.png'
import sadFace from '@/assets/images/sadFace.png'
import smileyFace from '@/assets/images/smileyFace.png'
import happyFace from '@/assets/images/happyFace.png'
import angryFace from '@/assets/images/angryFace.png'

const store = useAppStore()
const selectedEmoji = ref(null)
const loading = ref(false)
const emojis = ref([angryFace,sadFace,pokerFace,smileyFace,happyFace])
const description = ref(null)
const dialog = ref(false)

const emojiAvatar = computed(()=>{
  return emojis.value.find((val,index)=> index === selectedEmoji.value)
})

watch(store.userMoodCondition,val=>{
  selectedEmoji.value = val?.EmojiType
},{ immediate : true })

const onClick = ()=>{
  if([0,1].includes(selectedEmoji.value)){
    dialog.value =true
  }else{
    addMoodCondition(selectedEmoji.value , '')
  }
}

const addMoodCondition = async (type , description = '')=>{
  let body = {
    WorkspaceId : store.WID,
    EmojiType : type,
    Description : description,
  }
  try{
    loading.value = true

    const res = await useHttpPost('MoodCondition/add',{ body })

    await store.getUserData()
  }catch(e){
    console.error(e)
  }finally {
    loading.value = false
    dialog.value =false
  }
}

const onConfirm = async val=>{
  await addMoodCondition(selectedEmoji.value , description.value)
}

watch(dialog,val=>{
  description.value = null
})
</script>
