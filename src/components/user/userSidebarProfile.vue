<template>
  <div class="tw-h-full tw-p-2 tw-flex tw-flex-col tw-overflow-hidden">
    <div class="tw-grow-0 tw-flex tw-bg-[#F5F7FC] tw-rounded-3xl tw-py-8 tw-px-4 tw-mb-6">
      <v-avatar
        v-if="store.userInfo?.Pic"
        class="!tw-rounded-xl tw-me-3"
        rounded="initial"
        size="75"
        :image="store.userInfo?.Pic"
      />
      <v-avatar
        v-else
        class="!tw-rounded-xl tw-me-3"
        rounded="initial"
        size="50"
        :image="avatarPlaceholder"
      />
      <div>
        <h4 class="tw-text-lg tw-font-YEKAN-BAKH-HEAVY">
          {{ store.userInfo?.Name }} {{ store.userInfo?.Family }}
        </h4>
        <span class="tw-text-[#959499] tw-text-base tw-font-YEKAN-BAKH-Medium">
          کد پرسنلی
          :
          {{ store.userInfo?.OrgPositionCode || '-' }}
        </span>
      </div>
    </div>
    <div class="tw-overflow-scroll tw-grow-1 !tw-max-h-[calc(100%-280px)]">
      <div>
        <div class="tw-mb-4 tw-ms-6">
          <div class="tw-text-base tw-text-[#959499] tw-font-medium">
            شماره همراه
          </div>
          <div class="tw-text-base tw-text-K_black tw-font-YEKAN-BAKH-MEDIUM">
            {{ store.userInfo?.Mobile || '-' }}
          </div>
        </div>
        <div class="tw-mb-4 tw-ms-6">
          <div class="tw-text-base tw-text-[#959499] tw-font-medium">
            پست الکترونیک
          </div>
          <div class="tw-text-base tw-text-K_black tw-font-YEKAN-BAKH-MEDIUM">
            {{ store.userInfo?.Email || '-' }}
          </div>
        </div>
        <div class="tw-mb-4 tw-ms-6">
          <div class="tw-text-base tw-text-[#959499] tw-font-medium">
            جنسیت
          </div>
          <div class="tw-text-base tw-text-K_black tw-font-YEKAN-BAKH-MEDIUM">
            {{ store.userInfo?.Gender !== null ? $getEnum($enums.Gender , 'key' , store.userInfo.Gender,'value') : 'نامشخص' }}
          </div>
        </div>
        <div class="tw-mb-4 tw-ms-6">
          <div class="tw-text-base tw-text-[#959499] tw-font-medium">
            گروه شغلی
          </div>
        </div>
        <div class="tw-mb-4 tw-ms-6">
          <div class="tw-text-base tw-text-[#959499] tw-font-medium">
            تاریخ تولد
          </div>
          <div class="tw-text-base tw-text-K_black tw-font-YEKAN-BAKH-MEDIUM">
            {{ $moment(store.userInfo?.Birthday).format('jYYYY/jM/jD') }}
          </div>
        </div>
      </div>
    </div>
    <div class="tw-grow-0 tw-flex tw-flex-col tw-mt-8 tw-gap-4 tw-mt-auto">
      <v-btn
        :disabled="$route.fullPath.includes('profile')"
        class="tw-text-lg"
        variant="outlined"
        color="secondary"
        size="x-large"
        to="/profile/edit"
      >
        ویرایش اطلاعات
      </v-btn>
      <v-btn
        class="tw-text-lg"
        variant="elevated"
        color="primary"
        elevation="0"
        size="x-large"
        @click="store.logout"
      >
        خروج
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import avatarPlaceholder from "@/assets/images/profile/avatar-placeholder.png"

const store = useAppStore()
const loading = ref(false)
const  router  = useRouter()
const route = useRoute()
</script>
