<template>
  <VCard
    title="vSelectExtend"
    :rtl="false"
  >
    <VCardText>
      A wrapper component for vuetify v-autocomplete.
      <h1>Props</h1>
      <Prism>
        {{ vSelectExtendProps }}
      </Prism>
      <h1>Events</h1>
      <Prism>
        {{ vSelectExtendEmits }}
      </Prism>
      <h1>Basic Usage</h1>
      <Prism>
        {{ vSelectExtendBasic }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          {{ basicExampleValue }}
          <v-row>
            <v-col cols="12" lg="4">
              <v-select-extend
                v-model="basicExampleValue"
                :items="[{key:'1',value:'one'},{key:'2',value:'two'}]"
              />
            </v-col>
          </v-row>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>
</template>
<script setup>
import Prism from 'vue-prism-component'
import weekDaySelect from '../common/weekDaySelect.vue';
import vFormExtend from '../uiKit/vFormExtend.vue';
import vSelectExtend from '../uiKit/vSelectExtend.vue'
const basicExampleValue = ref()

const loading = ref(false)

let vSelectExtendBasic = `
   <v-select-extend
    v-model="basicExampleValue"
    :items="[{key:'1',value:'one'},{key:'2',value:'two'}]"
  />
`
let vSelectExtendProps = `defineProps({
    modelValue : { type : [Number,Object,String,Array] , default : null },

    // static options
    items : { type: Array , default : null , required : false },

    // url address for requesting options
    url : { type : String , default : null , required: false },

    // method for url , used in case url is passed
    method : { type : String , default : 'get' , required: false },

    // payload for url request, used in case url is passed
    params : { type : Object , default: ()=>({}) , required : false },

    // respond callback for formatting options,used in case url is passed
    resCallback : { type : Function , default : null , required : false },

    // full request for options list , response should have Data parameter
    service : { type :Function ,default : null ,required:false },

    // list key in list store
    name : { type : String , default : uuidv4() },
})`
let vSelectExtendEmits = `defineEmits(['update:modelValue'])`
</script>
