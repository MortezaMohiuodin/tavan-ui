<template>
  <VCard
    title="Persian Datepicker"
    :rtl="false"
  >
    <VCardText>
      A wrapper component for vue3-persian-datetime-picker and vuetify textfield.
      <h1>Props && Events</h1>
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
          <div class="tw-w-[350px]">
            <persian-datepicker v-model="basicModel"/>
          </div>
        </VLocaleProvider>
      </section>
      <h1>Time Picker</h1>
      <Prism>
        {{ timePicker }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          <div class="tw-w-[350px]">
            <persian-datepicker v-model="timeModel" type="time"/>
          </div>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import persianDatepicker from '@/components/uiKit/persianDatepicker.vue'

let propsEmits = `// props
defineProps({
    modelValue : { type : [String,Number,Array] , default : null , required : true },
    type : { type : String , default : 'date' , required : false },
    rules : { type : Array , default : ()=>([]) , required : false },
    displayFormat :  { type : String , default : null , required : false },
    format :  { type : String , default : null , required : false },
})
// emits
defineEmits(['update:modelValue'])
`
const basicModel = ref(null)
let basic =  `<persian-datepicker v-model="basicModel"/>`

const timeModel = ref(null)
let timePicker = `<persian-datepicker v-model="basicModel" type="time"/>`
</script>
