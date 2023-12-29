<template>
  <div class="tw-flex tw-items-center">
    <div
      class="tw-bg-[#F5F7FC] tw-flex"
      :class="classes.box"
    >
      <div class="tw-h-full tw-flex tw-flex-col tw-justify-center">
        <v-icon
          icon="custom:chevronUp"
          size="18"
          class="tw-p-1 tw-cursor-pointer tw-m-px"
          @click="increment('m')"
        />
        <v-icon
          icon="custom:chevronDown"
          size="18"
          class="tw-p-1 tw-cursor-pointer tw-m-px"
          @click="decrement('m')"
        />
      </div>
      <input
        v-model="minute"
        :class="classes.input"
        dir="ltr"
      >
    </div>
    <span class="tw-mx-2">:</span>
    <div
      class="tw-bg-[#F5F7FC] tw-flex"
      :class="classes.box"
    >
      <div class="tw-h-full tw-flex tw-flex-col tw-justify-center">
        <v-icon
          icon="custom:chevronUp"
          size="18"
          class="tw-p-1 tw-cursor-pointer tw-m-px"
          @click="increment('h')"
        />
        <v-icon
          icon="custom:chevronDown"
          size="18"
          class="tw-p-1 tw-cursor-pointer tw-m-px"
          @click="decrement('h')"
        />
      </div>
      <input
        v-model="hour"
        :class="classes.input"
        dir="ltr"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"

import { $moment } from "@/plugins/moment"

const props = defineProps({
  modelValue: { type: String, default: '' },
  size: { type: String, default: 'md' },
  format: { type: String, default: 'HH:mm:ss' },
})

const emit = defineEmits(['update:modelValue'])

const time = ref('')

const hour = computed({
  get() {
    return $moment(time.value).format('HH')
  },
  set(val) {
    time.value = time.value.clone().set({ h: val })
  },
})

const minute = computed({
  get() {
    return $moment(time.value).format('mm')
  },
  set(val) {
    time.value = time.value.clone().set({ m: val })
  },
})

const classes = computed(() => {
  return {
    'sm': {
      box: 'tw-bg-white md:tw-bg-[#F5F7FC] tw-w-[65px] tw-h-[50px] tw-rounded-3xl tw-flex tw-px-1',
      input: 'tw-w-full focus-visible:tw-outline-0 tw-pl-2 tw-pr-1 tw-text-xl',
    },
    'md': {
      box: 'tw-bg-white md:tw-bg-[#F5F7FC] tw-w-[85px] tw-h-[55px] tw-rounded-3xl tw-flex tw-px-2',
      input: 'tw-w-full focus-visible:tw-outline-0 tw-pl-3 tw-pr-2 tw-text-2xl',
    },
  }[props.size]
})

watch(() => props.modelValue, val => {
  if (!val) time.value = $moment()
  else {
    let date = val.includes('T') ? val.split('T')[1] : val.includes(' ') ? val.split(' ')[1] : val
    const [ hour, minute, second ] = date.split(':')

    time.value = $moment().set({ h: hour, m: minute, s: second })
  }
}, {
  immediate: true,
})

watch(time, val => {
  if (val) emit('update:modelValue', val.format(props.format))
},
{ immediate: true },
)

function increment(type) {
  time.value = $moment(time.value).clone().add(1, type)

}

function decrement(type) {
  time.value = $moment(time.value).clone().subtract(1, type)
}
</script>
