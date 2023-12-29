<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div style="width: 300px">
        {{ zzz.count }}
        {{ zzz.addOrEven }}
        <input

          v-model="zzz.count"

          type="number"
        >
        <v-btn @click="zzz.increase()">
          +
        </v-btn>
        <v-btn @click="zzz.decrease()">
          -
        </v-btn>
        <v-form
          autocomplete="off"
          @submit.prevent
        >
          <label
            for="x"
            class="fieldLabel"
          >نام</label>
          <v-select
            :items="['سلام', 'کارپوشه', 'کارمپ', 'یبیب', 'یبی', 'یبب']"
          />
          <v-multi-select
            :items="['سلام', 'کارپوشه', 'کارمپ', 'یبیب', 'یبی', 'یبب']"
          />
          <v-text-field
            id="x"
            v-model="firstName"
            placeholder="نام..."
            hint="نام خود را وارد کنید"
          />
          <price-text-field
            v-model="fieldValue"
            v-model:unit="unitValue"
          />
        </v-form>
      </div>
      <v-img
        height="300"
        src="@/assets/logo.svg"
      />
      <karsu-table />
      <div class="text-body-2 font-weight-light mb-n1">
        Welcome to
      </div>

      <h1 class="text-h2 font-weight-bold tw-text-primary-500">
        Vuetify
      </h1>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            href="https://vuetifyjs.com/components/all/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-account-star"
              size="large"
            />
            Components
          </v-btn>
        </v-col>
        <v-col
          ref="target"
          cols="auto"
        >
          <router-link to="/a/1">
            Get Started
          </router-link>
          <router-link to="/">
            home
          </router-link>
        </v-col>
        <v-col cols="auto">
          <v-btn
            href="https://community.vuetifyjs.com/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-account-group"
              size="large"
              start
            />
            Community
          </v-btn>
          <br>
          <v-icon
            icon="custom:warning"
            size="x-small"
            color="success"
          /> //Custom SVG Icon
          <h1
            class="x"
            @click="y"
          />
          {{ $t('fgdsfdsf') }}
          <p class="xs:tw-text-green-700 sm:tw-text-red-900 md:tw-text-yellow-700">
            {{ $t("hello") }}
          </p>
          <p>{{ $moment().format('jYYYY/jMM/jDD') }}</p>
          <p>{{ $enums.imageSize }}</p>
          <p>{{ $getEnum($enums.imageSize,'key','Medium','value') }}</p>
          {{ $i18n.locale }}
          {{ name }}
          <modal
            ref="trashDialog"
            title="حذف عنوان"
            message="این عنوان حذف شود"
            @ok="x('ok')"
            @cancel="x('cancell')"
          />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
const zzz = useAppStore()

zzz.count = 111111

// zzz.$patch(state => {
//   state.count = 9632
// })

const { t } = useI18n()
let loading = ref(false)
let show = ref(false)
let firstName = ref(null)
let trashDialog = ref({})
let fieldValue = ref('')
let unitValue = ref(1)

function x(x) {
  trashDialog.value.loading = true
  setTimeout(()=>{
    trashDialog.value.dialog = false
    setTimeout(()=>{
      useSnackbar('عملیات با موفقیت انجام شد', 'success')
    }, 2000)
  }, 3000)
}
let ob = {
  x: 1,
  y: 2,
  z: 'dddd',
}
console.log(ob, $enums)
import { useDisplay } from 'vuetify'

const { name } = useDisplay()

//
</script>
