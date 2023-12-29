<template>
  <VCard
    title="table"
  >
    <VCardText>
      <Prism>
        {{tableCode}}
      </Prism>
      <section>
        <v-locale-provider rtl>
          <KarsuTable />
        </v-locale-provider>
      </section>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'
let tableCode = `<VDataTableServer
        :headers="headers"
        :items="desserts"
        :loading="loading"
        loading-text="در حال بارگزاری"
        style="border-radius: 20px;"
        class="tw-border tw-border-[#E9ECF6] tw-p-[10px]"
      >
        <template #item.FromDate="{item}">
          {{ $moment(item.columns.FromDate).format('jYYYY/jM/jD') }}
        </template>
        <template #item.ToDate="{item}">
          ....
        </template>
</VDataTableServer>`
</script>
