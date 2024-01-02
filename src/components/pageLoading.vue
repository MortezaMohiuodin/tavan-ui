<template>
  <div class="tw-relative">
    <v-icon
      v-if="!smAndDown"
      icon="custom:logo"
      size="100"
      class="tw-block"
    />
    <v-icon
      v-else
      class="tw-absolute tw-top-[1px] tw-right-[15px]"
      icon="custom:logo"
      size="30"
    />
  </div>
</template>
<script setup>
import {useDisplay} from 'vuetify'
const {smAndDown} =useDisplay()

</script>
