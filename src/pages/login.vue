
<template>
  <div class="loginContainer">
    <div class="logoContainer">
      <img
        src="@/assets/images/logo.png"
        class="tw-h-full tw-w-full tw-object-cover tw-hidden"
      >
    </div>
    <div class="fieldContainer">
      <div class="fieldWrapper">
        <div class="loginTitle">
          ورود به پنل
        </div>
        <div class="loginSubtitle">
          ایمیل و رمز عبور را وارد نمایید
        </div>
        <div>
          <v-form @submit.prevent="login">
            <v-c-text-field
              v-model="email"
              variant="solo-filled"
              clearable
              class="LoginTextField mb-4"
              color="#8CB6A4"
              autocomplete="new-password"
            >
              <template #label>
                <v-icon
                  icon="mdi:mdi-email"
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
              :append-inner-icon="showPassword ? 'mdi:mdi-eye-off-outline' : 'custom:eye'"
              :type="showPassword ? 'text' : 'password'"
              label="رمز عبور"
              variant="solo-filled"
              clearable
              class="LoginTextField"
              color="#8CB6A4"
              @click:append-inner="showPassword = !showPassword"
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
import { ofetch } from 'ofetch'
import { isTokenValid } from '@/helper/validations'

const router = useRouter()
const token = ref(useLocalStorage('token'))

let showPassword = ref(false)
let password = ref(null)
let email = ref(null)
let loading = ref(false)
let store = useAppStore()

async function login() {
  try {
    loading.value = true

    const body = {
      email: email.value,
      password: password.value,
    }

    const response = await useHttpPost('/login', {
      body,
    })

    if(isTokenValid(response.token)){
      token.value = response.token
      await store.initStore()
      router.push('/dashboard')
    }
   
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
.loginContainer {
  @apply tw-grid tw-h-full tw-grid-cols-1 md:tw-grid-cols-2
}

.logoContainer {
  @apply lg:tw-mr-[35%] tw-h-full tw-w-full tw-p-[35px] tw-hidden md:tw-block
}

.fieldContainer {
  @apply tw-flex tw-h-full tw-w-full tw-flex-col tw-justify-center tw-bg-primary md:tw-rounded-tr-[60px]
}

.fieldWrapper {
  @apply tw-w-[300px] tw-m-auto md:tw-mr-[60px]
}

.loginTitle {
  @apply tw-text-right tw-text-white tw-text-[25px] tw-font-bold
}

.loginSubtitle {
  @apply tw-text-right tw-text-white tw-text-base tw-font-normal tw-mb-[25px]
}

//customize style for input text-field  variant filled
.LoginTextField {
  .v-messages__message {
    font-size: 15px;
    font-weight: 600;
  }

  .v-input__control {
    -webkit-appearance: none;
    @apply tw-h-[70px] tw-text-[#F9FAFB];
  }

  .v-field--variant-solo,
  .v-field--variant-solo-filled {
    box-shadow: none;
  }

  .v-label.v-field-label {
    top: 25px;
    color: white;
    font-size: 16px;
  }

  .v-field.v-field--appended.v-field--variant-solo-filled.v-theme--myCustomLightTheme {
    @apply tw-rounded-[20px] tw-bg-primary-300
  }

  .v-field__append-inner {
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
