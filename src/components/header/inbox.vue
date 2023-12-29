<template>
  <div>
    <v-menu
      :close-on-content-click="false"
      width="280"
      height="350"
      content-class="messageMenu"
    >
      <template #activator="{props}">
        <v-badge
          :model-value="!!newMessages.length"
          :content="newMessages.length"
        >
          <v-btn
            variant="flat"
            color="secondary-100"
            icon="custom:envelop"
            height="46"
            class="tw-w-fit tw-px-0"
            style="border-radius: 15px !important;"
            v-bind="props"
          />
        </v-badge>
      </template>
      <template v-if="!selectedMessage">
        <div class="tw-flex  tw-justify-between tw-items-center tw-px-3 tw-pt-1 tw-pb-1">
          <span class="tw-text-sm">پیام ها ({{ messages.length }})</span>
          <v-btn-refresh
            v-tooltip="'بارگیری مجدد'"
            size="small"
            class="tw-relative -tw-left-2"
            :class="[{'tw-animate-spin':messageLoading }]"
            @click="getUserMessages(true)"
          />
        </div>
        <v-divider
          style="border-width: 1px;border-color:#998d8d;flex: 1 1 auto;"
          indent
        />

        <v-list
          v-if="messages.length"
          class="messageList"
          divider
        >
          <v-list-item
            v-for="message in messages"
            :key="message.MessagesCode"
            :value="message"
            class="tw-cursor-pointer tw-relative"
            height="60"

            @click="onClick(message)"
          >
            <template #prepend>
              <v-icon
                :icon="message.Status ? 'mdi:mdi-email-outline':'mdi:mdi-email-open-outline'"
              />
            </template>
            <div>
              <p class="tw-text-sm tw-w-[150px] tw-truncate tw-font-YEKAN-BAKH-MEDIUM">
                {{ message.Title }}
              </p>
              <p class="tw-text-sm tw-w-[150px] tw-truncate tw-pr-1 tw-font-YEKAN-BAKH-LIGHT tw-text-slate-600">
                {{ message.Description }}
              </p>
            </div>

            <span class="tw-text-xs tw-text-gray-600  tw-absolute tw-top-0 tw-left-0">
              {{ $moment(message.CreateDate).format('HH:mm') }}
            </span>
            <span class="tw-text-xs tw-text-gray-800  tw-absolute tw-bottom-0 tw-left-0">
              {{ $moment(message.CreateDate).format('jYYYY-jMM-jDD') }}

            </span>
          </v-list-item>
        </v-list>
        <div
          v-else
          class="tw-text-center tw-pt-4 tw-text-sm tw-text-gray-400"
        >
          پیامی برای نمایش نیست
        </div>
      </template>
      <template v-else>
        <div class="tw-flex tw-justify-between tw-items-center tw-px-3 tw-pt-1 tw-pb-1">
          <span
            class="tw-text-sm"
          >
            {{
              selectedMessage?.Title
            }}</span>
          <v-btn
            v-tooltip="'بازگشت به لیست'"
            variant="text"
            size="small"
            class="tw-relative -tw-left-2"
            icon="mdi:mdi-arrow-left"
            @click="selectedMessage = null"
          />
        </div>
        <v-divider
          style="border-width: 1px;border-color:#998d8d;flex: 1 1 auto;"
          indent
        />
        <div class="tw-p-4 tw-text-sm">
          {{ selectedMessage.Description }}
        </div>
      </template>
    </v-menu>
  </div>
</template>

<script setup>
const store = useAppStore()
const selectedMessage = ref(null)

const messages = ref(store.messages || [])
const messageLoading = ref(false)

const getUserMessages = async (reload = false)=>{
  messageLoading.value = true
  try {
    const res = await useHttpGet('message/get-all-message')


    messages.value = res.Data || []
    messageLoading.value = false
    if(reload){
      useSnackbar('لیست پیام ها آپدیت شد','success')
    }
  }catch (err) {
    messageLoading.value = false
    console.log(err)
  }
}


const changeMessageStatus = async (payload = {})=>{
  let body = {
    MessageCode : payload.MessagesCode,
    MessageStatus : 0,
  }
  try{
    await useHttpPost('message/change-message-status',{ body })

    await getUserMessages()

  }catch(e){
    console.log(e)
  }
}

const onClick = async message=>{
  selectedMessage.value = message
  if(message.Status === 1){
    await changeMessageStatus(message)
  }
}

const newMessages = computed(()=>{
  return messages.value.filter(val=>val.Status)
})
</script>

<style lang="scss">
.messageList{
  padding-top: 0;
  border-radius: 0!important;
  .v-list-item{
    padding-right: 13px!important;
    padding-left: 13px!important;
  }
  .v-list-item__spacer{
    width: 7px!important;
  }
}
.messageMenu {
  padding: 0!important;
  overflow: hidden;
}
</style>