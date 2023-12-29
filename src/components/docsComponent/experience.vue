<template>
  <div>
    <v-card title="Fix Bugs Experience">
      <v-card-text>
        <h1>Tailwind CSS Auto-complete Not Working in WebStorm</h1>
        <p>If you're experiencing an issue with Tailwind CSS auto-complete not working in WebStorm, the problem may be due to your use of an ESM based config file. To resolve this issue, you can try removing the <VChip>"type": "module" </VChip> line from your package.json file and switch to using the old tailwind.config.js and postcss.config.js files instead:</p>
        <Prism language="javascript">
          {{`module.exports = {
  //Your configuration here
}`}}
        </Prism>
        <p>This should help to resolve the problem and restore full functionality to your Tailwind CSS auto-completion feature in WebStorm.</p>
      </v-card-text>
      <v-card-text>
        <h1> fix vuetify duplicate style </h1>
        <p> To customize Vuetify designs by overwriting Vuetify class, you need to follow these steps  or you’ll end up with duplicated styles.</p>
        <VList>
          <VListItem>1- Create a separate CSS file explicitly to write your custom CSS code.</VListItem>
          <VListItem>2- In your main.js file, import the custom CSS file.</VListItem>
          <VListItem>3- Make sure to import it at the end of the main.js file.</VListItem>
        </VList>
      </v-card-text>
      <v-card-text>
        <h1> fix WebStorm's warnings</h1>
        <p> To disable certain rules in WebStorm, first, open the program and press Ctrl + Alt + S to access the menu. Then, navigate to "Editor" and select "Inspections." In this section, you can locate the rules you want to deactivate and turn them off.  </p>
        <VList>
          <VListItem> html : unknown tag</VListItem>
          <VListItem> html : incorrect attribute value</VListItem>
          <VListItem> javascript: unresolved javascript references</VListItem>
        </VList>
      </v-card-text>

    </v-card>
  </div>

</template>

<script setup>
import Prism from 'vue-prism-component'
</script>

<style scoped>

</style>
