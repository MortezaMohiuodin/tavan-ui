<template>
  <div
    class="tw-w-full md:tw-max-w-[120px] tw-flex md:tw-flex-col tw-py-3 tw-px-4 md:tw-p-0 tw-rounded-[15px] tw-text-black"
    :class="data.inComplete ? day.bgLight : 'tw-bg-[#E1FBF7]'"
  >
    <div class="tw-h-7 tw-flex tw-items-center tw-ml-8 md:tw-ml-0 md:tw-px-4 md:tw-border-b md:tw-border-white">
      <span class="tw-text-sm tw-font-medium">تردد ها</span>
    </div>
    <div class="md:tw-px-3 md:tw-py-1 tw-flex md:tw-flex-col">
      <div
        v-for="(item, index) in data.children"
        :key="item.Id"
        class="tw-flex tw-items-center tw-py-0.5 tw-ml-4 md:tw-ml-0"
      >
        <v-icon
          :icon="index === 0 ? 'custom:arrowDown' : 'custom:arrowUp'"
          size="12"
          class="tw-ml-1"
        />
        <span class="tw-text-sm tw-font-medium tw-flex-grow tw-ml-2">
          {{ $moment(item.Time).format('HH:mm') }}
        </span>
        <v-menu
          v-if="!data.action && item.Description"
          :close-on-content-click="false"
          :open-on-hover="!smAndDown"
          location="top"
        >
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              icon="custom:infoCircle"
              size="16"
              class="tw-cursor-pointer tw-stroke-[#5BBAA6]"
            />
          </template>
          <div class="tw-px-2 tw-py-1 tw-text-sm">
            <span v-text="item.Description" />
          </div>
        </v-menu>
        <show-input-output-history
          v-else-if="data.action === 'history'"
          :data="item"
        />
        <v-btn
          v-else-if="data.action"
          variant="text"
          size="x-small"
          class="tw-p-0 tw-min-w-[15px]"
          @click.stop="handleAction(item)"
        >
          <v-icon
            :icon="`custom:${data.action}`"
            size="12"
          />
        </v-btn>
      </div>
      <div v-if="data.inComplete">
        <v-btn
          variant="text"
          color="secondary"
          size="small"
          class="tw-pr-1"
          :class="day.color"
          :disabled="((propItems.isMine && !store.permits.includes('CanAddTemporaryTracking')) || (!propItems.isMine && !store.permits.includes('TimeTrackManager')))"
          @click="addItem"
        >
          + ثبت تردد
        </v-btn>
      </div>
    </div>
    <add-edit-input-output
      v-model:show="showAddEditForm"
      :data="selectedItem"
      @update="emit('update')"
    />
    <delete-input-output
      v-model:show="showDeleteForm"
      :data="selectedItem"
      @update="emit('update')"
    />
    <add-description-form
      v-model:show="showAddDescription"
      :data="selectedItem"
      @update="emit('update')"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

import { useDisplay } from "vuetify"

import AddDescriptionForm from "@/components/inputOutput/addDescriptionForm.vue"
import AddEditInputOutput from "@/components/inputOutput/addEditInputOutput.vue"
import DeleteInputOutput from "@/components/inputOutput/deleteInputOutput.vue"
import showInputOutputHistory from "@/components/inputOutput/showInputOutputHistory.vue"

const propItems = defineProps({
  day: { type: Object, default: null },
  data: { type: Object, default: null },
  isMine:{ type:Boolean, default:true },
})

const emit = defineEmits(['update'])
const store = useAppStore()
const { smAndDown } = useDisplay()

let showAddEditForm = ref(false)

let showDeleteForm = ref(false)

let showAddDescription = ref(false)

let selectedItem = ref(null)

watch(showAddEditForm, val => {
  if (!val) selectedItem.value = null
})

function handleAction(data) {
  selectedItem.value = data
  switch (propItems.data.action) {
  case 'edit':
    showAddEditForm.value = true
    selectedItem.value = data
    break
  case 'remove':
    showDeleteForm.value = true
    selectedItem.value = data
    break
  case 'description':
    showAddDescription.value = true
    selectedItem.value = data
    break
  }
}

function addItem() {
  showAddEditForm.value = true
  selectedItem.value = propItems.data
}
</script>
