<template>
  <div>
    <VCard title="time">
      <VCardText>
        <p>in script and template we can use $moment()</p>
        <Prism language="javascript">
          {{ `$moment().format()
` }}
          {{ `$moment().format('jYYYY/jM/jD')
` }}
          {{ `$moment().format('YYYY/M/D')
` }}
        </Prism>
        <section>
          <VLocaleProvider rtl>
            <p>{{ $moment().format() }}</p>
            <p>{{ $moment().format('jYYYY/jM/jD') }}</p>
            <p>{{ $moment().format('YYYY/M/D') }}</p>
          </VLocaleProvider>
        </section>
      </VCardText>
    </VCard>
    <VCard class="tw-mt-8" title="enums">
      <v-card-text>
        <p>enums is define in src/plugins/enums.js </p>
        <Prism language="javascript">
          {{ `sample: [
    { key: '0', value: 'Id' },
    { key: '1', value: 'Title' },
   ]`}}
        </Prism>
        <p>in script and template we can use $enums.sample to retrieve whole enum object</p>
        <section>
          <v-locale-provider rtl>
            <div class="tw-float-right">
              {{$enums.sortByArticles}}
            </div>
          </v-locale-provider>
        </section>
        <h1></h1>
        <p>In script and template, we have the ability to utilize $getEnums() function to retrieve a single property from a particular enum object.</p>
        <Prism language="javascript">
          {{`
$getEnum($enums.sample, 'key', '0', 'value')
`}}
        </Prism>
        <section>
          <p class="tw-float-right">Id</p>
        </section>
      </v-card-text>
    </VCard>
    <VCard title="Api request" class="tw-mt-8">
      <v-card-text >
        <p>To make an API request, you can utilize the Fetch API along with the "ofetch" helper library. This combination allows for seamless integration and simplifies usage by incorporating it into composable functions.</p>
        <h1>post</h1>
        <Prism language="javascript">
          {{`useHttpPost('/endpoint/sample', { body: { x: 1, y: 2 } }).then(x=>console.log(x)).catch(x=>console.log(x))`}}
        </Prism>
        <h1>get</h1>
        <Prism language="javascript">
          {{`useHttpGet('/login', { body: { x: 1, y: 2 } }).then(x=>console.log(x)).catch(x=>console.log(x))`}}
        </Prism>
      </v-card-text>
    </VCard>
    <VCard title="breakpoints"  class="tw-mt-8">
      <v-card-text>
        <p>To retrieve the currently active CSS breakpoints within your script, you can leverage the powerful "useDisplay()" function.</p>
        <Prism language="javascript">
          {{`import { useDisplay } from 'vuetify'
`}}
          {{ `const { name } = useDisplay()` }}
        </Prism>
        <p class="tw-float-right">
          modify the size of the browser window : {{ name }}
        </p>
        <h1>local language</h1>
        <p>The i18n translation files are stored within the "src/i18n" directory and can be accessed through the useI18n composer.</p>
        <h1>usage in script</h1>
        <Prism language="javascript">
          {{`const { t } = useI18n()
` }}
          {{`console.log(t('hello')) // output :  سلام
` }}
          {{`console.log(t('new')) // output :  جدید` }}

        </Prism>
        <h1>usage in template</h1>
        <Prism>
          {{`<p>{ { $t("hello") } }</p> // output:<p>سلام</p>`}}
        </Prism>
      </v-card-text>
    </VCard>
    <VCard title="tailwindcss"  class="tw-mt-8">
      <v-card-text>
        <p>Tailwind CSS is configured with the prefix "tw-" to effectively mitigate any conflicts that may arise when used alongside Vuetify.</p>
        <Prism>
          {{`<p class="tw-py-6 tw-px-3 tw-bg-red"></p>`}}
        </Prism>
      </v-card-text>
    </VCard>
  </div>
</template>

<script setup>
import Prism from 'vue-prism-component'
import { useDisplay } from 'vuetify'
const { name } = useDisplay()
</script>
