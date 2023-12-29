<template>
  <v-card-dashboard
    title="ترددهای تایید نشده"
  >
    <v-card-text>
      <v-list-item-pill
        v-for="(item,index) in items"
        :key="index"
        :title="item.date"
        :subtitle="`${item.in} - ${item.out}`"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn>مشاهده همه</v-btn>
    </v-card-actions>
  </v-card-dashboard>
</template>

<script setup>
const items = [
  { date: 'پنج‌شنبه 28 مهر', in: '8:20', out: '?' },
  { date: 'پنج‌شنبه 28 مهر', in: '8:20', out: '12:30' },
]
</script>
