<template>
  <v-row class="tw-mb-1">
    <v-col>
      <h3 class="page-heading tw-mt-3">
        {{ title ? title : $route.meta.title }}
      </h3>
    </v-col>
    <v-col
      class="tw-text-left"
    >
      <slot />
      <v-btn-back
        v-if="backBtn"
        text="بازگشت"
        @click="$router.back()"
      />
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  title : { type:String ,default :null , required:false },
  showBackLink : { type :Boolean , default : true },
  backBtn : { type :Boolean , default : true },
})

const store = useAppStore()
</script>
