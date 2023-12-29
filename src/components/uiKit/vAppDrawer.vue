<template>
  <v-dialog
    v-if="modelValue === null"
    content-class="left-drawer"
    :persistent="false"
    v-bind="$attrs"
    transition="v-slide-x-transition"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      width="100%"
      rounded="0"
      class="rounded-s-xl tw-p-4"
    >
      <slot />
      <v-overlay
        :model-value="isLoading"
        scrim="white"
        contained
        persistent
      />
    </v-card>
  </v-dialog>
  <v-dialog
    v-else
    v-model="value"
    content-class="left-drawer"
    :persistent="false"
    v-bind="$attrs"
    transition="v-slide-x-transition"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      width="100%"
      rounded="0"
      class="rounded-s-xl tw-p-4"
    >
      <slot />
      <v-overlay
        :model-value="isLoading"
        scrim="white"
        contained
        persistent
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue : { type : Boolean , default : null, required : false },
  loading : { type : Boolean , default : false , required : false },
})

const emit = defineEmits(['update:loading' , 'update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isLoading = computed({
  get() {
    return props.loading
  },
  set(value) {
    emit('update:loading', value)
  },
})
</script>

<style lang="scss">
.left-drawer{
  max-height: 100%!important;
  margin: 0!important;
  left: 0!important;
  width: 300px!important;
  height: 100%!important;
  display: flex!important;
  max-width: 30%!important;
  flex-direction: row!important;
  justify-content: flex-end!important;
}
</style>
