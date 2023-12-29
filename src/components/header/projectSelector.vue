<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        variant="flat"
        height="46"
        color="secondary-100"
        style="border-radius: 15px !important;"
      >
        نام پروژه
        <template #append>
          <v-icon
            icon="fa-solid fa-chevron-down"
            size="sm"
            color="secondary"
          />
        </template>
      </v-btn>
    </template>
    <v-list class="tw-w-60">
      <v-list-item>kdfjldf</v-list-item>
      <v-list-item>kdfjldf</v-list-item>
      <v-list-item>kdfjldf</v-list-item>
      <v-list-item>kdfjldf</v-list-item>
      <v-list-item>kdfjldf</v-list-item>
    </v-list>
  </v-menu>
</template>
