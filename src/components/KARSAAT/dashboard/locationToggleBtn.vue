<template>
  <v-btn-toggle
    v-model="value"
    class="vBtnToggleCustom tw-overflow-visible"
    rounded="xl"
    variant="plain"
  >
    <span
      class="glider"
      :data-selected="value"
    />
    <v-btn
      prepend-icon="custom:home"
      :ripple="false"
      size="x-large"
      class="tw-text-xl"
    >
      خونه ام
    </v-btn>
    <v-btn
      prepend-icon="custom:building"
      :ripple="false"
      size="x-large"
      class="tw-text-xl"
    >
      شرکتم
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : Number , default : null },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss">
.vBtnToggleCustom{
  padding: 8px;
  background-color: #FFF2D4;
  height: 70px!important;
  border-radius: 40px!important;

  .glider{
    position: absolute;
    width: 140px;
    height: 54px;
    transition: transform 200ms cubic-bezier(0.1, 0.7, 0.6, 0.9);
    display: inline-block;
    background-color: white;
    opacity: 1;
    border-radius: 45px;
    box-shadow: 0px 0px 20px 0px #F68B1F80;
    &[data-selected="0"]{
      transform: translateX(0);
      width: 140px!important;
    }
    &[data-selected="1"]{
      transform: translateX(-100%);
      width: 132px!important;
    }
  }
  .v-btn{
    border-radius: 40px!important;
    opacity: 1;
    &__overlay{
      opacity: 0;
    }
    &__prepend{
      svg{
        position : relative;
        top: -4px;
        font-size: 30px;
      }
    }
    &--active{
      background-color: transparent!important;
      font-weight: bold;
    }
    &:hover{
      .v-btn__overlay{
        background-color: white;
      }
    }
  }
}
</style>
