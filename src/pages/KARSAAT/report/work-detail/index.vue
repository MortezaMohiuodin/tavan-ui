<template>
  <user-select
    v-model="employeeCode"
    style="width:350px"
  />
  <input-output-comp
    v-if="showIo"
    :employee-code="employeeCode"
  />
</template>

<script setup>
const employeeCode = ref(null)
const showIo = ref(false)

watch(employeeCode,val=>{
  if(val && showIo.value){
    showIo.value = false
    setTimeout(()=>{
      showIo.value = true
    },1000)
  }else if(val){
    showIo.value = true
  }else{
    showIo.value = false
  }
})
</script>

<route>
{
meta: {
title: "شرح کارکرد",
depthLevelType : 1
}
}
</route>
