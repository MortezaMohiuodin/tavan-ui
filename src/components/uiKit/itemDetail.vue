<template>
  <component :is="withCard ? 'v-card-default' : 'div'">
    <div class="tw-p-2">
      <div
        v-if="item.Fullname"
        class="tw-flex tw-bg-background tw-rounded-3xl tw-py-8 tw-px-4 tw-mb-6"
      >
        <v-avatar
          class="!tw-rounded-xl tw-me-3"
          size="50"
          rounded="xl"
          :image="item.Pic || avatarPlaceholder"
        />
        <div class="tw-flex tw-items-center">
          <h4 class="tw-text-xl tw-font-bold">
            {{ item.Fullname.value }}
          </h4>
          <span v-if="item.OrgPositionCode">کد پرسنلی {{ item.OrgPositionCode }}</span>
        </div>
      </div>
      <div
        class="tw-flex tw-flex-col"
        :class="{'tw-flex-col-reverse' : reverse}"
      >
        <div
          v-for="(value,key) in item"
          :key="key"
          class="tw-mb-4 tw-ms-6"
        >
          <template v-if="value.type === 'chipGroup' || Array.isArray(value.value)">
            <div class="tw-text-base tw-text-gray-350 tw-font-bold">
              {{ value.title }}
            </div>
            <v-chip
              v-for="(chipItem , i) in value.value"
              :key="i"
              class="tw-mx-1 tw-my-2"
              color="success"
              rounded="xl"
              variant="outlined"
            >
              {{ chipItem?.Title ? chipItem?.Title : chipItem.value ? chipItem.value : chipItem }}
            </v-chip>
          </template>
          <template v-else-if="!['Fullname','Error'].includes(key)">
            <div class="tw-text-base tw-text-gray-350 tw-font-bold">
              {{ value.title }}
            </div>
            <div class="tw-text-base tw-black tw-font-medium">
              {{ value.value || '-' }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup>
import avatarPlaceholder from "@/assets/images/profile/avatar-placeholder.png"

const props = defineProps({
  // An object with arbitrary props containing at least an title and value props.
  item : { type: Object , default : ()=>({}) , required: true },

  // Reverse list order
  reverse : { type : Boolean , default : false , required: false },
  withCard : { type : Boolean , default : false , required: false },
})
</script>
