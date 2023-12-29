<template>
  <v-card-dashboard
    title="کسری های بخشیده نشده"
  >
    <v-card-text v-if="!isEmpty">
      <v-list-item-pill
        v-for="(item,index) in items"
        :key="index"
        height="70"
        class="!tw-px-0"
      >
        <v-list-item-title>
          <div class="tw-flex">
            <arrow-chip>{{ item.time }}</arrow-chip>
            <div>
              <span class="tw-font-semibold tw-text-black">{{ item.name }}</span>
              <br>
              <span class="tw-text-black">{{ item.date }}</span>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item-pill>
    </v-card-text>
    <v-card-text v-else>
      <empty-card-content />
    </v-card-text>
    <v-card-actions v-if="!isEmpty">
      <v-btn>مشاهده همه</v-btn>
    </v-card-actions>
  </v-card-dashboard>
</template>

<script setup>
import ArrowChip from "@/components/uiKit/arrowChip.vue"

const items = [
  { name: 'فاطمه فاطمه', date: 'پنج‌شنبه 28 مهر', time: '35 دقیقه' },
  { name: 'مریم مهرجو', date: 'پنج‌شنبه 28 مهر', time: '35 دقیقه' },
  { name: 'مریم مهرجو', date: 'پنج‌شنبه 28 مهر', time: '35 دقیقه' },
]

const isEmpty = ref(false)
</script>
