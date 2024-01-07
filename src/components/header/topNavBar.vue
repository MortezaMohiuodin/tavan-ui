<template>
  <div
    class="tw-flex tw-w-full tw-justify-end"
  >
    <div class="tw-ml-auto">
      <user-name-date />
    </div>
    <div>
      <v-menu
        :close-on-content-click="false"
        width="200"
      >
        <template #activator="{props}">
          <v-btn
            variant="flat"
            icon="custom:user"
            height="46"
            class="tw-w-fit tw-px-0"
            style="border-radius: 15px !important;"
            v-bind="props"
          />
        </template>
        <v-list>
          <v-list-item @click="store.logout()">
            خروج
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

let token = ref(useLocalStorage('token', ''))
const { smAndDown } = useDisplay()
const store = useAppStore()
</script>
