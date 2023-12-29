<template>
  <div class="tw-w-full md:tw-max-w-[120px] tw-rounded-[15px] tw-flex tw-items-center md:tw-flex-col tw-bg-[#EBEBFF] tw-text-black tw-py-3 tw-px-4 md:tw-p-0">
    <div class="tw-h-7 md:tw-w-full tw-flex tw-items-center md:tw-px-3 md:tw-border-b tw-border-white tw-ml-3 md:tw-ml-0">
      <span class="tw-text-sm tw-font-medium tw-ml-1">ماموریت</span>
      <v-icon
        :icon="missionStatusIcon"
        size="13"
        class="tw-cursor-pointer tw-ml-auto"
      />
      <v-menu
        :width="130"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-icon
            icon="custom:dots"
            size="13"
            v-bind="props"
            class="tw-cursor-pointer tw-hidden md:tw-block"
          />
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in actions"
            :key="index"
            :value="item.key"
            :min-height="25"
            :height="25"
            @click="selectAction(item.key)"
          >
            <v-icon
              :icon="item.icon"
              size="13"
              class="tw-ml-2.5"
            />
            <span
              class="tw-text-sm tw-font-medium"
              v-text="item.title"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="tw-w-full tw-flex md:tw-flex-col md:tw-px-3 md:tw-py-1">
      <div class="tw-ml-4 md:tw-ml-0">
        <v-icon
          icon="custom:arrowDown"
          size="12"
          class="tw-ml-1 tw-stroke-[#4C49DA]"
        />
        <span class="tw-text-sm tw-font-medium tw-flex-grow">
          {{ toHHmm(data.StartTime) }}
        </span>
      </div>
      <div>
        <v-icon
          icon="custom:arrowUp"
          size="12"
          class="tw-ml-1 tw-stroke-[#4C49DA]"
        />
        <span class="tw-text-sm tw-font-medium tw-flex-grow">
          {{ toHHmm(data.EndTime) }}
        </span>
      </div>
    </div>
    <v-menu
      :width="130"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-icon
          icon="custom:dots"
          size="13"
          v-bind="props"
          class="tw-cursor-pointer md:tw-hidden tw-mr-auto"
        />
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in actions"
          :key="index"
          :value="item.key"
          :min-height="25"
          :height="25"
          @click="selectAction(item.key)"
        >
          <v-icon
            :icon="item.icon"
            size="13"
            class="tw-ml-2.5"
          />
          <span
            class="tw-text-sm tw-font-medium"
            v-text="item.title"
          />
        </v-list-item>
      </v-list>
    </v-menu>
    <edit-mission
      v-model:show="showEditForm"
      :data="data"
      @update="update"
    />
    <delete-mission
      v-model:show="showDeleteForm"
      :data="data"
      @update="update"
    />
  </div>
</template>

<script setup>
import DeleteMission from "@/components/inputOutput/deleteMission.vue"
import EditMission from "@/components/inputOutput/editMission.vue"

import { ref, computed, watch } from "vue"

import { $enums } from "@/plugins/enums"

const propItems = defineProps({
  data: { type: Object, default: null },
})

const emit = defineEmits(['update'])

let showEditForm = ref(false)

let showDeleteForm = ref(false)

const missionStatus = ref($getEnum($enums.missionStatus, 'key', propItems.data.Status))

const missionStatusIcon = computed(() => {
  return {
    pending: 'custom:exclamationMark',
    verified: 'custom:checkCircle',
    rejected: 'custom:exclamationMark',
  }[missionStatus.value.text]
})

const actions = [
  { key: 'edit', title: 'ویرایش', icon: 'custom:edit' },
  { key: 'remove', title: 'حذف', icon: 'custom:remove' },
]

function update() {
  emit('update')
}

function selectAction(action) {
  if (action === 'edit') showEditForm.value = true
  else showDeleteForm.value = true
}

function toHHmm(data) {
  let time = data.split(':')
  time.pop()

  return time.join(':')
}
</script>
