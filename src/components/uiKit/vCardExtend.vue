<template>
  <v-card
    rounded="xl"
    elevation="0"
    class="tw-flex tw-flex-col tw-py-2 tw-px-6"
  >
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex-1">
        <slot name="title">
          <h4
            v-if="title"
            class="tw-text-lg tw-font-YEKAN-BAKH-BOLD"
          >
            {{ title }}
          </h4>
        </slot>
      </div>
      <div>
        <slot name="action" />
      </div>
    </div>
    <slot />


    <v-overlay
      :model-value="loading"
      contained
      scrim="white"
    />
  </v-card>
</template>

<script setup>
const props = defineProps({
  title : { type : String, default : null },
  loading : { type : Boolean , default :false },
  empty : { type : Boolean , default : false },
})
</script>
