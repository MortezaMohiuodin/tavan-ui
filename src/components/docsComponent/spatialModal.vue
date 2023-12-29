<template>
  <VCard
    title="removeModal"
    :rtl="false"
  >
    <VCardText>
      <h1>basic usage</h1>
      <Prism>
        {{ basicModal }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <TrashModal
            class="tw-float-right"
          />
        </VLocaleProvider>
      </section>
      <h1>props</h1>
      <Prism language="javascript">
        {{ propsBasic }}
      </Prism>
      <h1>events</h1>
      <Prism language="javascript">
        {{ eventBasic }}
      </Prism>
      <h1>expose</h1>
      <Prism language="javascript">
        {{ exposeBasic }}
      </Prism>
      <h1>full usage</h1>
      <Prism>
        {{ fullUsage }}
      </Prism>
      <Prism language="javascript">
        {{ fullUsageScript }}
      </Prism>

      <section>
        <VLocaleProvider
          rtl
        >
          <TrashModal
            ref="trashDialog"
            title="حذف عنوان"
            message="این عنوان حذف شود"
            class="tw-float-right"
            @ok="removeItem"
          />
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>
</template>

<script setup>
import Prism from 'vue-prism-component'

let basicModal = '<TrashModal @ok="removeItem()"/>'
let propsBasic = ` defineProps({
  title: { type: String, default: 'حذف' },
  message: { type: String, default: 'این مورد حذف شود' },
})`
let eventBasic = 'defineEmits([\'ok\', \'cancel\'])'
let exposeBasic = `defineExpose({
  dialog,
  loading,
})`
let fullUsage = `
<TrashModal
            ref="trashDialog"
            title="حذف عنوان"
            message="این عنوان حذف شود"
            @ok="removeItem()"
            @cancel="cancelRemove('cancell')"
          />
`
let fullUsageScript = `let trashDialog = ref(false)
function removeItem() {
  trashDialog.value.loading = true
  setTimeout(()=>{
    trashDialog.value.dialog = false
    setTimeout(()=>{
      useSnackbar('عملیات با موفقیت انجام شد', 'success')
    }, 2000)
  }, 3000)
}`
let trashDialog = ref(false)
function removeItem() {
  trashDialog.value.loading = true
  setTimeout(()=>{
    trashDialog.value.dialog = false
    useSnackbar('عملیات با موفقیت انجام شد', 'success')
  }, 3000)
}
</script>
