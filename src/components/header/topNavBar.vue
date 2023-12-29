<template>
  <div
    class="tw-flex tw-w-full tw-justify-end"
  >
    <div class="tw-ml-auto">
      <user-name-date />
    </div>
    <div class="tw-ml-4">
      <timer />
    </div>
    <!--    <div class="tw-ml-4"> -->
    <!--      <projectSelector></projectSelector> -->
    <!--    </div> -->
    <div class="tw-ml-4">
      <inbox />
    </div>
    <div>
      <user-option />
    </div>
  </div>
<!--  <history-tabs />-->
</template>

<script setup>
import { useDisplay } from 'vuetify'
import Timer from "@/components/header/timer.vue"

const { smAndDown } = useDisplay()
</script>
