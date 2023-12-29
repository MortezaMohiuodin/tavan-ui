<template>
  <VCard
    title="RTL"
  >
    <VCardText>
      <h1>Default</h1>
      <p> The default direction flow is set to right-to-left (RTL), which is configured in the html tag within the style.css and app.vue files.</p>
      <Prism language="css">
        {{ `   html {
        direction: rtl;
        ....
        }` }}
      </Prism>
      <Prism>
        {{ ` <VLocaleProvider
       :rtl="layoutIsRtl"
       :class="{isRtl: layoutIsRtl}"
       :dir="layoutIsRtl?'rtl':'ltr'"
     >
       <RouterView />
       <Snackbar />
     </VLocaleProvider>
       ` }}
      </Prism>
      <h1>change rtl in template</h1>
      <p>To change the right-to-left (RTL) direction in a template flow using "VLocaleProvider"</p>
      <Prism>
        {{`<template>
        <v-locale-provider rtl>
        </v-locale-provider>
</template>`}}
      </Prism>
      <h1> "rtl" modifier Tailwind CSS</h1>
      <p>customize the style class "rtl" with Tailwind CSS</p>
      <Prism>
        {{`<p class="rtl:tw-ml-[20px]"></p>`}}
      </Prism>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'
</script>

<style scoped>

</style>
