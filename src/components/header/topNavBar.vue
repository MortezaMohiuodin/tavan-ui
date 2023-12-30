<template>
  <div
    class="tw-flex tw-w-full tw-justify-end"
  >
    <div class="tw-ml-auto">
      <user-name-date />
    </div>
    <div class="tw-ml-4">
      placehodler
    </div>
    <div class="tw-ml-4">
      inbox
      <!-- <inbox /> -->
    </div>
    <div>
      user option
      <!-- <user-option /> -->
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
</script>
