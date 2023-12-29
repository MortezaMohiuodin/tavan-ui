<template>
  <VCard
    title="Table Filter Section"
    :rtl="false"
  >
    <VCardText>
      A component for displaying table filters in an easy way
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
          <table-page-filter
            :filters="basicSchema"
            @submit="(val)=>onSubmit(val)"
          />
        </VLocaleProvider>
      </section>
      <h1>Using v-model</h1>
      <p>To change default value for filters</p>
      <Prism>
        {{ vmodel }}
      </Prism>
      <div>
        {{model}}
      </div>
      <section>
        <VLocaleProvider
          rtl
        >
          <table-page-filter
            v-model="model"
            :filters="basicSchema"
            @submit="(val)=>onSubmit(val)"
          />
        </VLocaleProvider>
      </section>

    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import tablePageFilter from '@/components/organisms/tablePage/tablePageFilter.vue'

const store = useAppStore()
store.isTableFilterVisible = true

let propsEmits = `// props
defineProps({
  'modelValue': { type : [Object] , default :null , required:false },
  'loading' : { type : Boolean , default : false },

  // elements can be string for built-in filters and object for custom ones
  'filters' : { type : Array , default : ()=>([]) , required: true },
})
// emits
defineEmits(['submit','update:modelValue'])
`
const model = ref({
  Gender : 0,
  DepartmentCode : 2094
})
const basicSchema = ref([
  'user',
  'department',
  {key: 'Gender' , component : 'select' , label: 'جنسیت' , items: [{key:0,value:'مرد'},{key:1,value:'زن'}]},
])
let basic =  `<table-page-filter
  :filters="basicSchema"
  @submit="onSubmit"
/>`

let vmodel =  `<table-page-filter
  v-model="model"
  :filters="basicSchema"
  @submit="onSubmit"
/>`

const onSubmit = (val)=>{
  alert(val)
}

</script>
