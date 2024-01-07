<template>
  <div class="tw-relative">
    <img
      :src="logo"
      :width="smAndDown ? 30 : 100"
      :height="smAndDown ? 30 : 100"
    >
    <!--
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
    -->
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import logo from '@/assets/images/logo.png'

const { smAndDown } =useDisplay()
</script>
