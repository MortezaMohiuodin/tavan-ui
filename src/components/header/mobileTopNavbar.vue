<template>
  <div>
    <div class="tw-pt-[20px] tw-relative tw-box-content">
      <div class="tw-h-[140px] tw-w-full tw-rounded-b-[40px] tw-bg-secondary-100 tw-absolute tw-top-[-20px] tw-z-0" />
      <div class="tw-flex tw-justify-around tw-px-6">
        <div class="tw-ml-auto">
          <v-app-bar-nav-icon
            variant="text"
            size="x-large"
            density="compact"
            @click.stop="store.drawer = !store.drawer"
          />
        </div>
        <div>
          <v-icon
            icon="custom:dotinLogo"
            size="50"
          />
        </div>
        <div class="tw-mr-auto">
          <v-avatar
            size="45px"
            class="tw-ml-2"
            style="border-radius: 15px !important;"
            color="secondary-100"
            @click="showUserDrawer = !showUserDrawer"
          >
            <v-img
              v-if="store.userInfo?.Pic"
              alt="Avatar"
              :src="store.userInfo?.Pic"
            />
            <v-icon
              v-else
              color="primary"
              icon="fas fa-user-tie"
              size="25"
            />
          </v-avatar>
        </div>
      </div>
      <div class="tw-w-full tw-m-auto tw-text-center">
        <div class="tw-flex tw-justify-center tw-mt-5">
          <div class="iconContainer">
            <v-icon
              class="tw-m-auto"
              icon="custom:clock"
              size="30"
            />
          </div>
          <div class="iconContainer">
            <v-icon
              class="tw-m-auto"
              icon="custom:IO"
              size="30"
            />
          </div>
          <div class="iconContainer">
            <v-icon
              class="tw-m-auto"
              icon="custom:envelop"
              size="30"
            />
          </div>
          <div class="iconContainer">
            <v-icon
              class="tw-m-auto"
              icon="custom:logOut"
              size="30"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <v-dialog-extend
    v-model="showUserDrawer"
    desktop-mode="drawer"
    append="body"
    width="400"
    :persistant="false"
  >
    <user-sidebar-profile :item="userInfo" />
  </v-dialog-extend>
</template>

<script setup>
import UserSidebarProfile from '@/components/user/userSidebarProfile.vue'

const store = useAppStore()
const showUserDrawer = ref(false)
</script>

<style>
.iconContainer {
 @apply tw-flex tw-flex-col tw-w-14 tw-h-14 tw-bg-white tw-rounded-xl tw-mx-5 tw-z-10 tw-shadow-[0_0_25px] tw-shadow-secondary-200
}
</style>
