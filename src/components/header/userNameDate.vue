<template>
  <div class="tw-mt-1">
    <v-icon
      icon="custom:calendar"
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
