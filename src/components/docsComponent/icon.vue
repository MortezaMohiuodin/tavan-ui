<template>
<v-card title="Icon">
    <v-card-text>
      <p>To utilize SVG icons within this project, follow these steps for improved clarity and readability:</p>
      <v-list>
        <v-list-item>First, navigate to your project's source directory (src/assets/icon).</v-list-item>
        <v-list-item>Create a new Vue component specifically for the SVG icon you wish to include.</v-list-item>
        <v-list-item>Copy the SVG code into the template section of this newly created component.</v-list-item>
        <v-list-item>Next, open the file named customSvgs.ts.</v-list-item>
        <v-list-item>Add the previously created SVG component to the list of custom SVGs in customSvgs.ts.</v-list-item>
        <v-list-item>By following these steps, you'll be able to seamlessly incorporate SVG icons into your project.</v-list-item>
      </v-list>
      <p>All custom SVG icons will automatically be imported to the icon section of the document</p>
      <h1>usage</h1>
      <Prism>
        {{`<VIcon
        icon="custom:warning"
        size="large"
        color="success"/>`}}
      </Prism>
      <section>
        <VIcon
          icon="custom:warning"
          size="large"
          color="success"
          class="tw-float-right"
        />
      </section>
    </v-card-text>
  <v-card-text>
    <h1>All Custom Icons</h1>
    <div
      @click='copyToClipboard(icon)'
      v-for="icon in icons"
      class="tw-cursor-pointer tw-bg-[#f7bebe] tw-w-48 tw-inline-block tw-m-5 tw-border tw-p-5 tw-text-center">
      <p class="tw-mb-10">{{icon}}</p>
      <v-icon :icon="`custom:${icon}`" size="45">
      </v-icon>
    </div>

  </v-card-text>
</v-card>
</template>

<script setup>
import {customSvgNameToComponent} from "@/assets/icon/customSvgs"
const icons = Object.keys(customSvgNameToComponent)
const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })
watch('copied',(val)=>{
  useSnackbar( ' ایکون کپی شد' , 'success')
})
function copyToClipboard (icon) {
  copy(`custom:${icon}`)
  useSnackbar( ' ایکون کپی شد' , 'success')
}
</script>

<style scoped>

</style>
