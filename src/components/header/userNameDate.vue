<template>
  <h1 class="tw-text-md tw-font-black tw-text-neutral-800">
    {{ userInfo?.Name }}  {{ userInfo?.Family }}
  </h1>
  <div class="tw-mt-1">
    <v-icon
      icon="far fa-calendar-alt"
      size="20"
      color="primary"
      class="tw-ml-1"
    />
    <span class="tw-text-sm tw-font-medium tw-text-neutral-800">{{ $moment().format('dddd D jMMMM jYYYY  ') }}</span>
  </div>
</template>

<script setup>
const { userInfo } = useAppStore()

</script>
