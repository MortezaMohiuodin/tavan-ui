<template>
  <div>
    <div v-if="store.isAppReady">
      <v-locale-provider
        :rtl="layoutIsRtl"
        :class="{isRtl: layoutIsRtl}"
        :dir="layoutIsRtl?'rtl':'ltr'"
      >
        <router-view v-slot="{ Component }">
          <v-scale-transition>
            <component :is="Component" />
          </v-scale-transition>
        </router-view>
        <snackbar />
      </v-locale-provider>
    </div>
    <v-overlay
      v-else
      scrim="white"
      :model-value="!store.isAppReady"
      class="align-center justify-center"
      contained
    >
      <div class="tw-text-center">
        <dotin-loading />
      </div>
    </v-overlay>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store/app'

const store = useAppStore()
let layoutIsRtl = ref(true)
</script>
