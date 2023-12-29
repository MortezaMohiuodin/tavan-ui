<template>
  <v-btn
    variant="text"
    height="46"
    class="tw-w-fit tw-pr-0"
    style="border-radius: 15px !important;"
    @click="showUserDrawer =!showUserDrawer"
  >
    <div
      v-bind="props"
      class="tw-flex"
    >
      <div>
        <v-avatar
          size="45px"
          class="tw-ml-2"
          style="border-radius: 15px !important;"
          color="secondary-100"
        >
          <v-img
            v-if="userInfo?.Pic"
            alt="Avatar"
            :src="userInfo?.Pic"
          />
          <v-icon
            v-else
            color="primary"
            icon="fas fa-user-tie"
            size="25"
          />
        </v-avatar>
      </div>
      <div class="tw-flex tw-flex-col tw-justify-center">
        <div class="tw-text-sm tw-font-bold tw-text-neutral-800">
          {{ userInfo?.Name }} {{ userInfo?.Family }}
        </div>
        <div class="tw-text-right tw-text-xs tw-font-normal tw-text-neutral-400">
          سمت کاربر
        </div>
      </div>
      <div class="tw-mr-3 tw-flex tw-flex-col tw-justify-center">
        <v-icon
          icon="fa-solid fa-chevron-down"
          color="secondary"
          size="sm"
        />
      </div>
    </div>
  </v-btn>
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

const { userInfo,logout } = useAppStore()
const showUserDrawer = ref(false)
const show = ref(false)
const route = useRoute()

const handleProfile = ()=>{
  if(route.fullPath.includes('profile/edit')) return
  showUserDrawer.value = true
}
</script>
