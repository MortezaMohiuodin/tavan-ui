<template>
  <div class="error-wrapper">
    <div class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue'

const props = defineProps(['error'])

onErrorCaptured((err,instance, info) => {
  console.log(err)
  error.value = err

  return false
})
s</script>

<style scoped lang="scss">
.error-wrapper{
  position: fixed;
  z-index: 10000000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000cf;
  height: 100vh;
  .error{
    color: red;
    font-size: 16px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
}
</style>
