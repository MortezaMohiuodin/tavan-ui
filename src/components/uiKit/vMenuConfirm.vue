<template>
  <v-menu
    v-if="modelValue === null"
    v-model="show"
    v-bind="$attrs"
    :close-on-content-click="false"
    content-class="!tw-p-0 !tw-overflow-hidden"
  >
    <template #activator="scope">
      <slot
        name="activator"
        v-bind="scope"
      />
    </template>
    <div
      class="topLine tw-p-3 tw-w-full tw-border-t-[8px]"
      :class="[`tw-border-t-${color}`]"
    >
      <h5
        class="tw-text-sm tw-text-center"
      >
        <v-icon
          size="20"
          icon="fa fa-exclamation-circle"
          :color="color"
          v-bind="titleIcon"
        />
        <slot name="title">
          {{ title }}
        </slot>
      </h5>
      <div
        v-if="message || $slots['message']"
        class="tw-text-sm tw-my-2 tw-text-center"
      >
        <slot name="message">
          <p class="tw-font-YEKAN-BAKH-LIGHT">
            {{ message }}
          </p>
        </slot>
      </div>
      <div
        v-if="actions"
        class=" tw-gap-2 tw-flex tw-justify-center"
      >
        <slot
          name="action"
        >
          <v-btn
            size="small"
            variant="tonal"
            elevation="0"
            :color="color"
            @click="onCancel"
          >
            {{ onCancelText }}
          </v-btn>
          <v-btn
            size="small"
            :variant="prompt ? 'elevated': 'tonal'"
            :loading="loading"
            elevation="0"
            :color="color"
            @click="onConfirm"
          >
            {{ onConfirmText }}
          </v-btn>
        </slot>
      </div>
    </div>
  </v-menu>
  <v-menu
    v-else
    v-model="value"
    v-bind="$attrs"
    :close-on-content-click="false"
    content-class="!tw-p-0 !tw-overflow-hidden"
  >
    <template #activator="scope">
      <slot
        name="activator"
        v-bind="scope"
      />
    </template>
    <div
      class="topLine tw-p-3 tw-w-full tw-border-t-[8px]"
      :class="[`tw-border-t-${color}`]"
    >
      <h5
        v-if="title || $slots['title']"
        class="tw-text-sm tw-text-center"
      >
        <v-icon
          size="20"
          icon="fa fa-exclamation-circle"
          :color="color"
        />
      </h5>
      <div
        v-if="message || $slots['message']"
        class="tw-text-sm tw-my-2 tw-text-center"
      >
        <slot name="message">
          <p class="tw-font-YEKAN-BAKH-LIGHT tw-pr-2">
            {{ message }}
          </p>
        </slot>
      </div>
      <div
        v-if="actions"
        class="tw-flex tw-justify-end tw-gap-2"
      >
        <slot
          name="action"
        >
          <v-btn
            size="small"
            variant="tonal"
            elevation="0"
            :color="color"
            @click="onCancel"
          >
            {{ onCancelText }}
          </v-btn>
          <v-btn
            size="small"
            :variant="prompt ? 'elevated': 'tonal'"
            :loading="loading"
            elevation="0"
            :color="color"
            @click="emit('onConfirm')"
          >
            {{ onConfirmText }}
          </v-btn>
        </slot>
      </div>
    </div>
  </v-menu>
</template>

<script setup>
const props = defineProps({
  modelValue : { type : Boolean , default : null },
  title : { type : String , default : '' },
  message : { type : String , default : 'آیا از انجام این عملیات مطمئن هستید؟' },
  onCancelText : { type : String , default : 'انصراف' },
  onConfirmText: { type : String , default : 'تایید' },
  color : { type : String , default : 'info' },
  loading : { type : Boolean , default : false },
  actions : { type : Boolean , default : true },
  icon : { type : [Object , String] , default : null },
  prompt : { type : Boolean , default : false },
})

const emit = defineEmits(['onConfirm','onCancel'])
const show = ref(false)
const value = useVModel(props,'modelValue',emit)

const onCancel = ()=>{
  show.value = false
  value.value = false
  emit('onCancel')
}

const onConfirm = ()=>{
  show.value = false
  value.value = false
  emit('onConfirm')
}


const titleIcon = computed(()=>{
  if(!props.icon) return {}
  if(typeof props.icon === 'string'){
    return { icon: props.icon }
  }else if(typeof props.icon === 'object'){
    return { ...props.icon }
  }
})

watch(()=>props.loading,(newVal,oldVal)=>{
  if(!newVal && oldVal) {
    show.value = false
    value.value = false
  }
})
</script>
