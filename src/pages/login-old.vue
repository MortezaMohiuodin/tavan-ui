
<template>
  <div class="loginContainer">
    <div class="logoContainer">
      <img
        src="@/assets/images/dotin.png"
        class="tw-h-full tw-w-full tw-object-cover"
      >
    </div>
    <div class="fieldContainer">
      <div class="fieldWrapper">
        <div class="loginTitle">
          ورود به داتین
        </div>
        <div class="loginSubtitle">
          نام کاربری و رمزعبور را وارد کنید.
        </div>
        <div>
          <v-form @submit.prevent="login">
            <v-c-text-field
              v-model="userName"
              variant="solo-filled"
              clearable
              class="LoginTextField mb-4"
              color="#8CB6A4"
              autocomplete="new-password"
              :rules="[x=>!!redirectToSSO || 'نام کاربری را وارد کنید']"
            >
              <template #label>
                <v-icon
                  icon="mdi:mdi-account"
                  size="18"
                  class="tw-mb-[4px]"
                  color="#8CB6A4"
                />
                <span
                  color="#8CB6A4"
                  class="tw-mr-[3px] tw-text-[13px]"
                >نام کاربری</span>
              </template>
            </v-c-text-field>
            <v-c-text-field
              v-model="password"
              autocomplete="new-password"
              :append-inner-icon="showPassword ? 'mdi:mdi-eye-off-outline' : 'custom:eye' "
              :type="showPassword ? 'text' : 'password'"
              label="رمز عبور"
              variant="solo-filled"
              clearable
              class="LoginTextField"
              color="#8CB6A4"
              :rules="[x=>!!redirectToSSO || 'پسورد را وارد کنید']"
              @click:append-inner="showPassword=!showPassword"
            >
              <template #label>
                <v-icon
                  icon="mdi:mdi-lock-outline"
                  size="18"
                  class="tw-mb-4px"
                  color="#8CB6A4"
                />
                <span
                  color="#8CB6A4"
                  class="tw-mr-[3px] tw-text-[13px] "
                >رمز عبور</span>
              </template>
            </v-c-text-field>
            <v-btn-warning
              color="orange"
              class="tw-mr-0 tw-mt-8 tw-w-full"
              :loading="loading"
              type="submit"
            >
              ورود
            </v-btn-warning>
            <v-btn-warning
              color="orange"
              class="tw-mr-0 tw-mt-8 tw-w-full"
              @click="redirectToSSO"
            >
              ورود با داتین
            </v-btn-warning>
          </v-form>
          <!--          <VCheckboxPrimary> -->
          <!--            <template #label> -->
          <!--              <span class="tw-text-white">مرا بخاطر بسپار</span> -->
          <!--            </template> -->
          <!--          </VCheckboxPrimary> -->
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
const router = useRouter()
const route = useRoute()
let showPassword = ref(false)
let password = ref(null)
let userName = ref(null)
let loading = ref(false)
let store = useAppStore()
async function login() {
  try {
    loading.value = true
  
    const response = await useHttpPost('/login', {
      body: {
        UserPlatform: '0',
        Password: password.value,
        Username: userName.value,
      },
    })
  
    const { Data } = response
  
    store.token = 'Bearer ' + Data.Key
    await store.initStore()
  
    router.push('/')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
async function autoLogin(){
  store.token = 'Bearer ' + route.query.t
  try{
    await store.initStore()
    router.push('/')
  }catch (err){
    router.push('/login')
  }
}
if(route.query.hasOwnProperty('t')){
  store.isAppReady = false
  autoLogin()
}
  
const redirectToSSO = ()=>{
  window.location = window.origin + "/api/user/sso"
}
</script>
  
  <style lang="scss">
  .loginContainer{
   @apply tw-grid tw-h-full tw-grid-cols-1 md:tw-grid-cols-2
  }
  .logoContainer{
    @apply lg:tw-mr-[35%] tw-h-full tw-w-full tw-p-[35px] tw-hidden md:tw-block
  }
  .fieldContainer{
    @apply tw-flex tw-h-full tw-w-full tw-flex-col tw-justify-center tw-bg-primary md:tw-rounded-tr-[60px]
  }
  .fieldWrapper{
    @apply tw-w-[300px] tw-m-auto  md:tw-mr-[60px]
  }
  .loginTitle{
    @apply tw-text-right tw-text-white tw-text-[25px] tw-font-bold
  }
  .loginSubtitle{
    @apply tw-text-right tw-text-white tw-text-base tw-font-normal tw-mb-[25px]
  }
  //customize style for input text-field  variant filled
  .LoginTextField{
    .v-messages__message{
      font-size: 15px;
      font-weight: 600;
    }
    .v-input__control{
      -webkit-appearance: none;
      @apply tw-h-[70px] tw-text-[#F9FAFB];
    }
    .v-field--variant-solo, .v-field--variant-solo-filled{
      box-shadow: none;
    }
    .v-label.v-field-label{
      top: 25px;
      color: white;
      font-size: 16px;
    }
    .v-field.v-field--appended.v-field--variant-solo-filled.v-theme--myCustomLightTheme {
      @apply tw-rounded-[20px] tw-bg-primary-300
    }
    .v-field__append-inner{
      color: white;
    }
    .v-theme--myCustomLightTheme {
      color: white;
    }
  }
  </style>
  
  <route>
  {
  meta: {
  layout: "blank"
  }
  }
  </route>
  