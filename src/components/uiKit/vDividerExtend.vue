<template>
  <div class="tw-flex tw-flex-row tw-items-center tw-mt-3">
    <slot />
    <v-divider
      style="border-width: 1px;border-color:#998d8d;flex: 1 1 auto;"
      indent
      class="tw-ms-4"
      v-bind="$attrs"
    />
  </div>
</template>

