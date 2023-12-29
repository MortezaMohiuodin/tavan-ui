<template>
  <v-card-dashboard
    title="مرخصی ها"
  >
    <v-card-text>
      <v-list-item-pill-large
        v-for="(item,index) in items"
        :key="index"
        :title="item.title"
        :subtitle="item.time"
        height="60"
        class="tw-text-2xl"
      >
        <template #append>
          <v-icon
            :icon="`custom:${item.icon}`"
            size="28"
            class="tw-relative -tw-top-1"
          />
        </template>
      </v-list-item-pill-large>
    </v-card-text>
    <v-card-actions>
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            color="k_black"
            class="tw-border-[#E9ECF6] tw-w-fit tw-font-light !tw-px-3"
            variant="outlined"
            v-bind="props"
            height="40"
          >
            ماه جاری
            <v-icon
              class="tw-mr-2 tw-mb-1"
              icon="fa-solid fa-chevron-down"
              color="secondary"
              size="15"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="tw-cursor-pointer">
            <p>فروردین</p>
          </v-list-item>
          <v-list-item class="tw-cursor-pointer">
            <p>اردیبهشت</p>
          </v-list-item>
          <v-list-item class="tw-cursor-pointer">
            <p>خرداد</p>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card-dashboard>
</template>

<script setup>
const items = [
  { title: 'مرخصی های استفاده شده', time: '8:20' , icon: 'calendarCheck' },
  { title: 'مرخصی های باقی مانده', time: '8:20', icon : 'calendar' },
]
</script>
