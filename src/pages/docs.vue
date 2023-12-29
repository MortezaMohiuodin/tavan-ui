<template>
  <v-container class="tw-font-sans ">
    <v-responsive>
      <v-locale-provider
        :rtl="false"
        :class="{isRtl: false}"
      >
        <div class="docs">
          <v-sheet class="tw-mb-6">
            All the built-in components are available in the following forms.
            <v-list>
              <v-list-item>
                1-Vuetify components are being used by project with globally set props in the 'plugins/index.js' files, and the CSS has been customized in the 'assets/customVuetify.scss' file to align with our UI. These components are being labeled with
              </v-list-item>
              <v-list-item>
                2-Components are being cloned from Vuetify, inheriting all the related props available to each component. These components are being labeled with
              </v-list-item>
              <v-list-item>
                3-Some spatial components are being designed and coded from scratch.These components are being labeled with
              </v-list-item>
            </v-list>
          </v-sheet>
          <convention />
          <use-full-links class="tw-mt-8" />
          <buttons class="tw-mt-8" />
          <form-element class="tw-mt-8" />
          <spatial-modal class="tw-mt-8" />
          <snack-bars class="tw-mt-8" />
          <table-ui class="tw-mt-8" />
          <utility class="tw-mt-8" />
          <rtl class="tw-mt-8" />
          <experience class="tw-mt-8" />
          <sidebar-doc class="tw-mt-8" />
          <store class="tw-mt-8" />
          <icon class="tw-mt-8" />
          <v-dialog-extend-doc class="tw-mt-8" />
          <v-form-extend-doc class="tw-mt-8" />
          <v-select-extend-doc class="tw-mt-8" />
          <persian-datepicker-doc class="tw-mt-8" />
          <form-section-iterator-doc class="tw-mt-8" />
          <infinite-scroll-list-doc class="tw-mt-8" />
          <item-detail-doc class="tw-mt-8" />
          <table-page-header-doc class="tw-mt-8" />
          <table-page-filter-doc class="tw-mt-8" />
          <table-page-data-doc class="tw-mt-8" />
        </div>
      </v-locale-provider>
    </v-responsive>
  </v-container>
</template>

<script setup>
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Rtl from '@/components/docsComponent/rtl.vue'
import Convention from '@/components/docsComponent/convention.vue'
import Experience from '@/components/docsComponent/experience.vue'
</script>

<style lang="scss">
.docs{
  h1{
    @apply tw-text-2xl tw-mt-8
  }
  section{
    @apply tw-mt-4 tw-font-YEKAN-BAKH-REGULAR tw-py-6
  }
p{
    @apply tw-mt-4
  }
}
</style>

<route>
{
meta: {
layout: "blank",
doc: true
}
}
</route>
