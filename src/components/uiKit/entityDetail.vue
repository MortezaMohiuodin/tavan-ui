<template>
  <div class="tw-grid tw-grid-cols-2  tw-p-2 tw-gap-2">
    <div
      v-for="(element,index) in schema"
      :key="index"
      class="tw-flex tw-text-center md:tw-text-right tw-mb-2"
    >
      <v-chip
        :size="size === 'large' ? 'large' : 'small'"
        color="primary"
        variant="elevated"
        class="rounded-s-xl tw-flex-1"
      >
        <span
          v-tooltip="element.title"
          class="tw-truncate !tw-text-inherit"
          :style="{width : size === 'large' ? '120px': '70px'}"
          :class="{'tw-text-base' : size === 'large' , '!tw-text-sm' : size === 'small'}"
        >
          {{ element.title }}
        </span>
      </v-chip>
      <v-chip
        :size="size === 'large' ? 'large' : 'small'"
        color="primary"
        variant="tonal"
        class="rounded-e-xl tw-flex-1 tw-truncate"
      >
        <span
          v-tooltip="element.title"
          class="tw-truncate tw-text-center !tw-text-inherit"
          :style="{width : size === 'large' ? '120px': '70px'}"
          :class="{'tw-text-base' : size === 'large' , '!tw-text-sm' : size === 'small'}"
        >
          {{ item[element.key] || '-' }}
        </span>
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  item : { type: [Object] , default : ()=>({}) , required:true },
  schema : { type :[Array] , default: ()=>([]) , required:false },
  size : { type : [String] , default : 'large' },
})

const { smAndDown } = useDisplay()
</script>
