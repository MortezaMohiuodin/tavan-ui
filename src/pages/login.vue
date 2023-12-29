<template>
  <div>
    test fgsdgdsg
  </div>
</template>
  
<script setup>
import { ofetch } from "ofetch"
  
async function login(){
  return ofetch("login",{ query: { email: 'mortezamohiuodin@gmail.com',password:'123456' } })
}
onMounted(async () => {
  const data = await login()
  
  console.log(data)
})
</script>
  
  <route>
    {
    meta: {
    layout: "blank"
    }
    }
    </route>