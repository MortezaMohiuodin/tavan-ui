<template>
  <v-app>
    <v-navigation-drawer
      v-model="store.drawer"
      width="280"
      class="tw-rounded-[60px] tw-bg-transparent"
    >
      <side-bar />
    </v-navigation-drawer>
    <v-app-bar
      :height="mobile?180:120"
      class="tw-bg-red-800"
    >
      <div class="tw-h-full tw-w-full">
        <div
          v-if="mobile"
        >
          <mobile-top-navbar />
        </div>
        <div
          v-else
          class="tw-container tw-mt-10"
        >
          <top-nav-bar />
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <router-view
        v-slot="{ Component, route }"
      >
        <v-scale-transition>
          <div
            :key="route.path"
            class="tw-container tw-pt-3 tw-pb-10"
          >
            <component
              :is="Component"
            />
          </div>
        </v-scale-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import MobileTopNavbar from '@/components/header/mobileTopNavbar.vue'

const { mobile } = useDisplay()
const store = useAppStore()
const router = useRoute()

watch(mobile, val=> store.drawer = !val)
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property:opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
