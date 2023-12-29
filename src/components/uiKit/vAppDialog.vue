<template>
  <component
    :is="component"
    v-model="value"
    v-model:loading="isLoading"
    v-bind="$attrs"
  >
    <template #activator="allProps">
      <slot
        name="activator"
        v-bind="allProps"
      />
    </template>
    <slot />
  </component>
</template>

<script setup>
import { useDisplay } from 'vuetify'

import vAppBottomSheet from "@/components/uiKit/vAppBottomSheet.vue"
import vAppDrawer from "@/components/uiKit/vAppDrawer.vue"
import vAppModal from "@/components/uiKit/vAppModal.vue"

const props = defineProps({
  modelValue : { type : Boolean , default : null,  required : false },
  loading : { type : Boolean , default : false , required:  false },
  desktopMode : { type : String , default : 'modal' , required : false },
})

const emit = defineEmits(['update:loading' , 'update:modelValue'])

const { mobile } = useDisplay()

const component = computed(()=>{
  if(mobile.value) return vAppBottomSheet
  else if(props.desktopMode === 'drawer') return vAppDrawer
  else return vAppModal
})

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

// This component will show user modal , drawer or bottom sheet based on user device
</script>
