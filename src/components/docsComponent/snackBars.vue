<template>
  <VCard
    title="SnackBar"
    :rtl="false"
  >
    <VCardText>
      <Prism language="javascript">
        {{ `useSnackbar('عملیات با موفقیت انجام شد', 'success')
` }}
        {{ `useSnackbar('پیام هشدار ', 'warning')
` }}
        {{ `useSnackbar('عملیات انجام نشد', 'error')
` }}
        {{ `useSnackbar('عملیات با موفقیت انجام شد', 'info')
` }}
      </Prism>
      <section>
        <VLocaleProvider rtl>
          <VBtnSuccess
            class="tw-float-right"
            @click="toast('success')"
          >
            نمایش توست
          </VBtnSuccess>
          <VBtnError
            class="tw-float-right"
            @click="toast('error')"
          >
            نمایش توست
          </VBtnError>
          <VBtnWarning
            class="tw-float-right"
            @click="toast('warning')"
          >
            نمایش توست
          </VBtnWarning>
          <VBtnInfo
            class="tw-float-right"
            @click="toast('info')"
          >
            نمایش توست
          </VBtnInfo>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'

function toast(x) {
  useSnackbar('متن پیام', x)
}
</script>
