<template>
  <v-chip
    class="ma-2"
    color="indigo"
    text-color="white"
    prepend-icon="mdi:mdi-account-circle"
  >
    Mike
  </v-chip>
  <employees-selector v-model="selectedEmployees" />
</template>

<script setup>
let selectedEmployees = ref([])
</script>

<route>
</route>
