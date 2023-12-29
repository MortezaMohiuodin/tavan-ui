<template>
  <div class="historyTabs tw-flex tw-gap-2 tw-mt-5">
    <div
      v-for="historyTab in store.historyTabs"
      :key="historyTab.fullPath"
      class="showCloseOnHover tw-relative"
    >
      <v-btn
        :color="$route.fullPath === historyTab.fullPath ? 'info':'k_white-800'"
        :variant="$route.fullPath === historyTab.fullPath ? 'elevated':'tonal'"
        elevation="0"
        @click="$router.push(historyTab.fullPath)"
      >
        {{ historyTab.meta.title }}
        <template #prepend>
          <v-btn
            elevation="3"
            class="inherit tw-bg-white hover:tw-scale-125 tw-transition-transform tw-relative tw-right-[-12px] tw-top-[-2px]"
            icon="custom:error"
            rounded="circle"
            size="small"
            color="fill:black"
            @click.stop="removeFromHistory(historyTab.fullPath)"
          />
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const store = useAppStore()

const removeFromHistory = fullPath=>{
  store.historyTabs = store.historyTabs.filter(val=>val.fullPath !== fullPath)
}
</script>
