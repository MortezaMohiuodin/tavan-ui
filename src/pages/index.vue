<template>
  <v-row :gutter="30">
    <v-col
      lg="12"
      cols="12"
    >
      <v-row class="tw-h-full">
        <v-col
          cols="12"
          lg="6"
          class="tw-h-fit sm:tw-h-[150px]"
        >
          <manually-set-i-o />
        </v-col>
        <v-col
          cols="12"
          lg="6"
          class="tw-h-fit sm:tw-h-[150px]"
        >
          <employee-mode-card />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <latest-messages />
    </v-col>

    <v-col cols="12">
      <daily-tabs />
    </v-col>
    <v-col
      cols="12"
      lg="6"
    >
      <pending-i-o-card />
    </v-col>
    <v-col
      cols="12"
      lg="6"
    >
      <pending-absent-card />
    </v-col>
    <!--
      <v-col lg="4">
      <un-confirmed-in-outs-card />
      </v-col>
      <v-col lg="4">
      <vacations-list-card />
      </v-col>
    -->
    <v-col
      cols="12"
    >
      <coworkers-swiper-card />
    </v-col>
    <!--
      <v-col lg="4">
      <un-acceptable-delays-card />
      </v-col>
      <v-col lg="4">
      <un-acceptable-decreases />
      </v-col>
      <v-col lg="4">
      <temporary-in-outs />
      </v-col>
    -->
  </v-row>
</template>

<route>
{
    meta: {
    title: "داشبورد کارساعت"
    }
}
</route>
<script setup>
import LatestMessages from "@/components/KARSAAT/dashboard/latestMessages.vue";
</script>
