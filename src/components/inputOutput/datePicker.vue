<template>
  <div>
    <slot>
      <v-text-field
        :id="`input-${key}`"
        v-bind="$attrs"
      />
    </slot>
    <persian-datepicker
      v-model="value"
      format="YYYY-MM-DD"
      display-format="jDD jMMMM jYYYY"
      v-bind="options"
      :custom-input="`#input-${key}`"
      class="persian-datepicker-custom"
    >
      <template #close-btn>
        <v-btn-close-window />
      </template>
      <template #header-year>
        <span class="tw-text-sm tw-relative tw-top-1">انتخاب سال</span>
      </template>
      <template #month-name="{ date }">
        {{ date.xFormat('jMMMM jYYYY') }}
      </template>
    </persian-datepicker>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import PersianDatepicker from 'vue3-persian-datetime-picker'

const props = defineProps({
  modelValue: { type: [String, Number, Object, Array], default: '' },
  options: { type: Object, default: null },
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

const key = computed(() => {
  return Math.floor(Math.random() * 1000) + 1
})
</script>

<style lang="scss">
.persian-datepicker-custom{
  .vpd-main{
    visibility: hidden;
    display: none;
  }
}
.vpd-wrapper{
  .vpd-next{
    svg{
      margin-right: auto!important;
    }
  }
}
.vpd-content{
  border-radius: 20px;
}
.vpd-header{
  border-radius: 20px 20px 0 0;
}
.vpd-controls{
  //height:50px;
}
.vpd-header{
  background-color: #F5F8FE!important;
  .vpd-year-label{
    color: black;
  }
  .vpd-date{
    display: none;
  }
}
.vpd-close-addon{
  border-radius: 50%;
}
</style>
