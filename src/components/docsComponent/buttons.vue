<template>
  <VCard
    title="buttons"
    :rtl="false"
  >
    <VCardText>
      <h1>success</h1>
      <Prism>
        {{ btnSuccess }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBtnSuccess class="tw-float-right">
            ذخیره
          </VBtnSuccess>
        </VLocaleProvider>
      </section>
      <h1>info</h1>
      <Prism>
        {{ btnInfo }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBtnInfo class="tw-float-right">
            ذخیره
          </VBtnInfo>
        </VLocaleProvider>
      </section>
       <h1>warning</h1>
      <Prism>
        {{ btnWarning }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBtnWarning class="tw-float-right">
            ذخیره
          </VBtnWarning>
        </VLocaleProvider>
      </section>
       <h1>cancel</h1>
      <Prism>
        {{ BtnCancel }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBtnCancel class="tw-float-right">
            ذخیره
          </VBtnCancel>
        </VLocaleProvider>
      </section>
 <h1>error</h1>
      <Prism>
        {{ Btnerror }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBtnError class="tw-float-right">
            ذخیره
          </VBtnError>
        </VLocaleProvider>
      </section>
<h1>tableBtn</h1>
      <Prism>
        {{ tableBtn }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <VBTable
            color="success"
            class="tw-float-right"
          >
            <VIcon
              icon="fa fa-pen"
              size="15"
            />
          </VBTable>
           <VBTable
            color="error"
            class="tw-float-right"

           >
            <VIcon
              icon="fa fa-trash"
              size="15"
            />
          </VBTable>
 <VBTable
            color="warning"
            class="tw-float-right"

 >
            <VIcon
              icon="fa fa-warning"
              size="15"
            />
          </VBTable>
 <VBTable
            color="info"
            class="tw-float-right"

 >
            <VIcon
              icon="fa fa-info"
              size="15"
            />
          </VBTable>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'

let btnSuccess = '<VBtnSuccess>'
let btnInfo = '<VBtnInfo>'
let btnWarning = '<VBtnWarning>'
let BtnCancel = '<VBtnCancel>'
let Btnerror = '<VBtnError>'
let tableBtn = `
<VBTable color="success"><VIcon icon="fa fa-pen" size="15"/></VBTable>
<VBTable color="error"><VIcon icon="fa fa-pen" size="15"/></VBTable>
<VBTable color="warning"><VIcon icon="fa fa-pen" size="15"/></VBTable>
<VBTable color="info"><VIcon icon="fa fa-pen" size="15"/></VBTable>
`
</script>
