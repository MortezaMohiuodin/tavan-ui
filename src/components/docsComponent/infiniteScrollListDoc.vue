<template>
  <VCard
    title="Infinite Scroll List"
    :rtl="false"
  >
    <VCardText>
      An infinite scroll list component for showing list of items in mobile or other devices.
      <h1>Props && Exposes</h1>
      <Prism language="javascript">
        {{ propsEmits }}
      </Prism>
      <h1>Basic Usage</h1>
      <Prism>
        {{ basic }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <infinite-scroll-list
            :service="service"
          />
        </VLocaleProvider>
      </section>
      <h1>Using default slot</h1>
      <Prism>
        {{ withSlot }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <infinite-scroll-list
            :service="service"
          >
            <template #default="{item}">
              <v-list-item elevation="3" class="tw-mt-5 tw-bg-gray-100" rounded="xl">
                {{item.Title}}
              </v-list-item>
            </template>
          </infinite-scroll-list>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import infiniteScrollList from '@/components/uiKit/infiniteScrollList.vue'
const {WID} = useAppStore()
let propsEmits = `// props
defineProps({
    // Async function that returns list in format like {Data,TotalRow}
    service : { type:Function , default : null , required : true },
})
// exposes
defineExpose({ reset })
`

let basic =  `<infinite-scroll-list
  :service="service"
/>`

let withSlot = `<infinite-scroll-list
  :service="service"
>
  <template #default="{item}">
    <v-list-item elevation="3" class="tw-mt-5 tw-bg-gray-100" rounded="xl">
      {{item.Title}}
    </v-list-item>
  </template>
</infinite-scroll-list>`

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpPost('notice/getlist',{ body  })
  }catch(e){
    throw new Error(e)
  }
}
</script>
