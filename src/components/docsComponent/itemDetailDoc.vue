<template>
  <VCard
    title="Item Detail"
    :rtl="false"
  >
    <VCardText>
      A component for showing object properties based on value type in pretty way.
      <h1>Props</h1>
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
          <item-detail :item="item"/>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import itemDetail from '@/components/uiKit/itemDetail.vue'

let propsEmits = `// props
defineProps({
      // An object with arbitrary props containing at least an title and value props.
      item : { type: Object , default : ()=>({}) , required: true },

      // Reverse list order
      reverse : { type : Boolean , default : false , required: false },
      withCard : { type : Boolean , default : false , required: false },
})
`
const item = ref({
  name : {
    title : 'نام',
    value : 'مرتضی'
  },
  department : {
    title : 'دپارتمان',
    value : [{id: 1 , Title: 'فنی'},{id : 2 , Title: 'پشتیبانی'}]
  }
})
let basic =  `<item-detail :item="item"/>`

</script>
