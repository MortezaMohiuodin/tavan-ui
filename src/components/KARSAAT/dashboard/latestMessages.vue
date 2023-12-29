<template>
  <v-card-extend>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4 tw-mt-3">
      <span class="tw-text-lg tw-font-medium">آخرین پیام ها</span>
      <span class="tw-text-secondary tw-text-sm tw-font-medium tw-cursor-pointer">مشاهده همه</span>
    </div>
    <ul>
      <li
        v-for="(message, index) in messages"
        :key="message.Id"
        class="tw-bg-[#FFF7E5] tw-min-h-[86px] tw-mb-3 tw-rounded-3xl tw-flex tw-items-center tw-border-r-[8px] tw-border-primary tw-p-4"
      >
        <div class="tw-flex tw-flex-grow">
          <v-icon
            icon="custom:envelop"
            class="tw-ml-3"
          />
          <p
            class="tw-text-base tw-font-bold"
            v-text="message.Title"
          />
        </div>
        <v-btn
          variant="outlined"
          class="tw-ml-2"
          @click="showItem(message)"
        >
          مشاهده
        </v-btn>
        <v-btn
          icon="custom:close"
          variant="text"
          size="x-small"
          class="tw-fill-[#959499]"
          @click="deleteItem(index)"
        />
      </li>
    </ul>
    <p
      v-if="!messages.length"
      class="tw-text-sm tw-text-center tw-py-3 tw-text-gray-400"
    >
      هنوز پیامی ندارید
    </p>
    <show-message
      v-model:show="showModal"
      :message="selectedItem"
    />
  </v-card-extend>
</template>

<script setup>
import { ref } from "vue"

import ShowMessage from "@/components/KARSAAT/dashboard/showMessage.vue"

const { WID } = useAppStore()

let loading = ref(false)

let messages = ref([])

let selectedItem = ref('')

let showModal = ref(false)

async function getData() {
  try {
    loading.value = true

    const { Data: response } = await useHttpPost('notice/my-notice', {
      body: {
        WorkspaceId: WID,
        Status: 2,
      },
    })

    messages.value = response.splice(0, 3)

    loading.value = false
  } catch (e) {
    loading.value = true
  }
}

function deleteItem(messageIndex) {
  messages.value.splice(messageIndex, 1)
}

function showItem(message) {
  selectedItem.value = message.Description
  showModal.value = true
}

getData()
</script>
