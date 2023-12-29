<template>
  <v-card
    class="vStatisticCard tw-p-7"
    rounded="xl"
    elevation="0"
    :style="{'--circle-color':color}"
  >
    <v-icon
      :icon="icon"
      size="40"
    />
    <div class="tw-text-2xl tw-font-bold tw-mt-3">
      {{ value }}
    </div>
    <div class="tw-text-lg tw-text-neutral-400">
      {{ label }}
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps(['icon' , 'value' , 'label','color'])

</script>

<style scoped lang="scss">
.vStatisticCard{
  --circle-color : #bbb;
  position: relative;
  overflow: hidden;
  &::after{
    content: "";
    width: 120px;
    height: 120px;
    position: absolute;
    background-color: var(--circle-color);
    border-radius: 50%;
    left: -36px;
    top: -36px;
  }
  &::before{
    content: "";
    width: 25px;
    height: 25px;
    position: absolute;
    background-color: var(--circle-color);
    border-radius: 50%;
    left: 70px;
    top: 70px;
  }
}
</style>
