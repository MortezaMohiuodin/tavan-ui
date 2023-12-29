<template>
  <VCard
    title="FormElements"
    :rtl="false"
  >
    <VCardText>
      <h1>text-field</h1>
      <Prism>
        {{ textFieldCode }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VForm autocomplete="off">
            <label
              for="x"
              class="fieldLabel"
            >نام</label>
            <VTextField
              id="x"
              placeholder="نام..."
              hint="نام خود را وارد کنید"
              class="float-right tw-w-80"
            />
          </VForm>
        </VLocaleProvider>
      </section>
      <h1>selection box</h1>
      <Prism>
        {{ VselectCode }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VForm autocomplete="off">
            <label
              for="x"
              class="fieldLabel"
            >نام</label>
            <VSelect
              :items="['سلام', 'کارپوشه', 'کارمپ', 'یبیب', 'یبی', 'یبب']"
              class="float-right tw-w-80"
            />
          </VForm>
        </VLocaleProvider>
      </section>
      <h1>combo box</h1>
      <Prism>
        {{ VselectCode }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VForm autocomplete="off">
            <label
              for="x"
              class="fieldLabel"
            >نام</label>
            <VMultiSelect
              :items="['سلام', 'کارپوشه', 'کارمپ', 'یبیب', 'یبی', 'یبب']"
              class="float-right tw-w-80"
            />
          </VForm>
        </VLocaleProvider>
      </section>
      <h1>textField with price </h1>
      <Prism>
        {{ priceTextField }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VForm autocomplete="off">
            <label
              for="x"
              class="fieldLabel"
            >نام</label>
            <PriceTextField
              class="float-right tw-w-80"
            />
          </VForm>
        </VLocaleProvider>
      </section>
      <h1>checkbox</h1>
      <p>The checkbox field consists of two icons: a true checkbox icon and a false checkbox icon.</p>
      <section>
        <VLocaleProvider rtl>
          <VCheckboxPrimary>
            <template #label>
              <span class="tw-text-black">مرا بخاطر بسپار</span>
            </template>
          </VCheckboxPrimary>
        </VLocaleProvider>
      </section>
      <Prism>
        {{ `<VCheckboxPrimary>
        <template #label>
          <span class="tw-text-black">مرا بخاطر بسپار</span>
        </template>
      </VCheckboxPrimary>` }}
      </Prism>
      <h1>multi selection for employess </h1>
      <p> Enable multi-selection functionality to allow for convenient assignment of multiple employees at once.</p>
      <p>The height and width of the element are determined by its parent, except when viewed on mobile screens</p>
      <Prism>
        {{ `<employees-selector v-model="selectedEmployee"></employees-selector>` }}
      </Prism>
      <div class="tw-bg-slate-200">
        <div class="tw-h-[600px] " dir="rtl">
          <v-locale-provider rtl>
            <employees-selector v-model="employeeSelector" ></employees-selector>
          </v-locale-provider>
        </div>
      </div>

    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'

let textFieldCode = `
<VForm autocomplete="off">
<label for="field" class="fieldLabel">نام</label>
<VTextField id="field">نام....</VTextField>

</VForm>`
let VselectCode = "<VSelect :items='[...]'>"
let priceTextField = `<price-text-field
              v-model="fieldValue"
              v-model:unit="unitValue"
></price-text-field>`
let employeeSelector = ref([])
</script>
