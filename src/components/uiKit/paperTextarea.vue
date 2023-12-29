<template>
  <div class="paper-textarea">
    <div class="paper-content">
      <textarea
        v-model="value"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : String , default : '' },
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

<style scoped>
.paper-textarea {
  border-radius: 30px;
  position: relative;
  width: 90%;
  max-width: 800px;
  min-width: 400px;
  height: 480px;
  margin: 0 auto;
  background: #F5F7FC;
  overflow: hidden;
}
.paper-textarea:before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: 0;
  width: auto;
  background: radial-gradient(#fff 6px, transparent 12px) repeat-x;
  background-size: 30px 30px;
  box-sizing: border-box;
  left: 35px;
  right: 35px;
}

.paper-content {
  position: absolute;
  top: 50px;
  bottom: 30px;
  left: 40px;
  background: linear-gradient(transparent, transparent 28px, #dce3e3 28px);
  background-size: 30px 30px;
  right: 40px;
}

.paper-content textarea {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  line-height: 30px;
  padding: 0 10px;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font-weight: bold;
  font-size: 16px;
  box-sizing: border-box;
  z-index: 1;
}
::-webkit-scrollbar {
  width: 8px!important;
}


/* Track */
::-webkit-scrollbar-track {
  @apply tw-shadow-md tw-shadow-primary-200
}

/* Handle */
::-webkit-scrollbar-thumb {
  @apply tw-bg-primary-500 tw-rounded-3xl
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  @apply tw-bg-primary-400
}
</style>
