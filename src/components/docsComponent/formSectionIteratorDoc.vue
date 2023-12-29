<template>
  <VCard
    title="Form Section Iterator"
    :rtl="false"
  >
    <VCardText>
      A component for managing forms with multiple repetitive rows.
      It is depending on VSelectExtend for rendering fields.
      <h1>Props && Events</h1>
      <Prism language="javascript">
        {{ propsEmits }}
      </Prism>
      <h1>Basic Usage</h1>
      <Prism>
        {{ basic }}
      </Prism>
      <div v-if="basicModel.length">
        {{basicModel}}
      </div>
      <section>
        <VLocaleProvider
          rtl
        >
          <form-section-iterator
            v-model="basicModel"
            :schema="basicSchema"
          />
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import FormSectionIterator from '@/components/uiKit/FormSectionIterator.vue'

let propsEmits = `// props
defineProps({
      'modelValue' : { type : [Array] , default : ()=>([]) , required: true },
      'schema' : { type : [Array] , default : ()=>([]) },
      'addTitle' : { type : String, default :'افزودن' },
})
// emits
defineEmits(['update:modelValue'])
`
const basicModel = ref([])
const basicSchema = [
  {model: 'name' , component : 'input' , title: 'نام'},
  {model: 'gender' , component : 'select' , title: 'جنسیت' , items: [{key:0,value:'مرد'},{key:1,value:'زن'}]},
  {model: 'date' , component:'datepicker' , title: 'تاریخ'}
]
let basic =  `<form-section-iterator
  v-model="basicModel"
  :schema="basicSchema"
/>`

</script>
