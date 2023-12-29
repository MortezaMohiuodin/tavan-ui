<template>
  <v-btn-add-item
    class="tw-hidden sm:tw-inline-flex"
    v-bind="$attrs"
  />
  <v-btn
    class="tw-fixed tw-bottom-3 tw-right-3 tw-opacity-60 tw-z-10 sm:tw-hidden"
    color="secondary"
    size="large"
    rounded="circle"
    icon="fas fa-plus"
    v-bind="$attrs"
  />
</template>

