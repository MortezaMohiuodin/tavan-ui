<template>
  <v-bottom-sheet
    v-if="modelValue === null"
    v-bind="$attrs"
    :persistent="false"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      rounded="none"
      class="tw-bg-secondary-100 !tw-rounded-t-3xl tw-p-7"
      min-height="200"
    >
      <v-btn
        v-if="showClose"
        icon="fas fa-times"
        variant="tonal"
        size="30"
        rounded="lg"
        color="primary"
        :ripple="false"
        class="tw-absolute tw-indent-0 tw-top-2px tw-top-2.5 tw-right-2.5"
        @click="value = false"
      />
      <h3
        v-if="title"
        class="tw-text-xl tw-font-bold tw-text-center"
      >
        {{ title }}
      </h3>
      <slot />
      <v-overlay
        :model-value="isLoading"
        scrim="white"
        contained
        persistent
      />
    </v-card>
  </v-bottom-sheet>
  <v-bottom-sheet
    v-else
    v-model="value"
    v-bind="$attrs"
    :persistent="false"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <v-card
      rounded="none"
      class="tw-bg-secondary-100 !tw-rounded-t-3xl tw-p-7"
      min-height="200"
    >
      <v-btn
        v-if="showClose"
        icon="fas fa-times"
        variant="tonal"
        size="30"
        rounded="lg"
        color="primary"
        :ripple="false"
        class="tw-absolute tw-indent-0 tw-top-2px tw-top-2.5 tw-right-2.5"
        @click="value = false"
      />
      <h3
        v-if="title"
        class="tw-text-xl tw-font-bold tw-text-center"
      >
        {{ title }}
      </h3>
      <slot />
      <v-overlay
        :model-value="isLoading"
        scrim="white"
        contained
        persistent
      />
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'

const props = defineProps({
  modelValue : { type : Boolean ,default : null, required : false },
  title : { type : String ,default : '' , required : false },
  showClose : { type : Boolean , default : true , required:false },
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

// This component will show content of most basic bottom sheet
</script>
