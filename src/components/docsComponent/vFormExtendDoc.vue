<template>
    <VCard
      title="vFormExtend"
      :rtl="false"
    >
      <VCardText>
        A wrapper component for vuetify vForm. We can define form model via schema prop.
        Field component can be default (if component value is string like 'input') or an imported component. Default values can be passed via v-model in initial render.
        <h1>Props</h1>
        <Prism>
         {{ vFormExtendProps }}
        </Prism>
        <h1>Events</h1>
        <Prism>
          {{ vFormExtendEmits }}
        </Prism>
        <h1>Basic Usage</h1>
        <Prism>
          {{ vFormExtendBasic }}
        </Prism>
        <section>
          <VLocaleProvider
            rtl
          >
          {{ basicExampleValue }}
            <v-form-extend
                v-model="basicExampleValue"
                :schema="basicExampleSchema"
            />
          </VLocaleProvider>
        </section>
        <h1>Forms with repeating fields</h1>
        <Prism>
          {{ vFormExtendFull }}
        </Prism>
        <section>
          <VLocaleProvider
            rtl
          >
            {{ fullExampleValue }}
            <v-form-extend
              v-model="fullExampleValue"
              :loading="loading"
              :with-card="true"
              width="500"
              :actions="true"
              title="عنوان فرم"
              desc="توضیحات"
              @on-submit="onSubmit"
              :schema="fullExampleSchema"
            />
          </VLocaleProvider>
        </section>
        <h1>Forms with default values</h1>
        <Prism language="javascript">
          {{ vFormExtendDefault }}
        </Prism>
        <section>
          <VLocaleProvider
            rtl
          >
            {{ defaultExampleValue }}
            <v-form-extend
              v-model="defaultExampleValue"
              width="500"
              :actions="false"
              title="فرم ویرایش"
              :schema="defaultExampleSchema"
            />
          </VLocaleProvider>
        </section>
      </VCardText>
    </VCard>
  </template>
  <script setup>
  import Prism from 'vue-prism-component'
  import weekDaySelect from '../common/weekDaySelect.vue';
  import vFormExtend from '../uiKit/vFormExtend.vue';
  import FormSectionIterator from '@/components/uiKit/formSectionIterator.vue'
  const basicExampleValue = ref({rangeSlider:[0,100]})
  const fullExampleValue = ref({
    rowList : []
  })
  const defaultExampleValue = ref({
    name : 'morteza',
    gender : 0,
    rowList : [
      {studentName: 'morteza' , gender : 0 , isMarried:false,isWorking:true,date:'1993-10-12'},
      {studentName: 'heidar' , gender : 1 , isMarried:true,isWorking:false,date:'2000-10-12'}
    ]
  })
  const basicExampleSchema = [
    {model: 'name' , component:'input' ,title:'نام' },
    {model: 'gender' , component:'select' ,title:'جنسیت' , items : [{key:0 , value: 'مرد'} , {key:1 , value : 'زن'}]},
    {model: 'desc' , component: 'textarea' ,title:'توضیحات' },
    {model: 'isMilitary' , component:'radio-group' ,title:'وضعیت سربازی' , options : [{value:0 , label: 'در حال گذراندن'} , {value:1 , label : 'معاف'} , {value : 2, label : 'پایان خدمت'}],col:{cols:12,lg: 3}},
    {model: 'weekDays' , component: weekDaySelect ,title:'انتخاب روز هفته' ,col:{cols:12,lg: 3}},
    {model: 'isMarried' , component:'checkbox' ,label:'متاهل هستم' ,col:{cols:12,lg: 3}},
    {model: 'isWorking' , component:'switch' ,label:'در حال کار' },
    {model: 'date' , component:'datepicker' ,label:'تاریخ' },
    {model: 'time' , component:'datepicker' ,label:'زمان' , type : 'time'},
    {model: 'rangeSlider' , component:'range-slider' ,title:'بازه' },
    {model: 'slider' , component:'slider' ,title:'دما' ,},
  ]
  const rowListSchema = [
    {model: 'studentName' , component:'input' ,title:'نام دانش آموز' , required:true},
    {model: 'gender' , component:'select' ,title:'جنسیت دانش آموز' , items : [{key:0 , value: 'مرد'} , {key:1 , value : 'زن'}]},
    {model: 'isMarried' , component:'checkbox' ,label:'متاهل هستم' ,col:{cols:12,lg: 3}},
    {model: 'isWorking' , component:'switch' ,label:'در حال کار' },
    {model: 'date' , component:'datepicker' ,label:'تاریخ' },
  ]
  const fullExampleSchema = [
    {model: 'name' , component:'input' ,title:'نام دبیر' , required: true},
    { model : 'rowList' , component : FormSectionIterator , schema : rowListSchema , title : 'ردیف' , col: {cols:12}},
  ]
  const defaultExampleSchema = [
    {model: 'name' , component:'input' ,title:'نام دبیر' , required: true},
    {model: 'gender' , component:'select' ,title:'جنسیت دانش آموز' , items : [{key:0 , value: 'مرد'} , {key:1 , value : 'زن'}]},
    { model : 'rowList' , component : FormSectionIterator , schema : rowListSchema , title : 'ردیف' , col: {cols:12}},
  ]
  const loading = ref(false)

  let vFormExtendBasic = `
  <v-form-extend
    v-model="basicExampleValue"
    :schema="basicExampleSchema"
   />

   import weekDaySelect from '../common/weekDaySelect.vue';

   // default values
   const basicExampleValue = ref({rangeSlider:[0,100]})
   const basicExampleSchema = [
    // input
    {model: 'name' , component:'input' ,title:'نام' , },
    // select
    {model: 'gender' , component:'select' ,title:'جنسیت' , items : [{key:0 , value: 'مرد'} , {key:1 , value : 'زن'}]},
    // textarea
    {model: 'desc' , component: 'textarea' ,title:'توضیحات' },
    // radio group
    {model: 'isMilitary' , component:'radio-group' ,title:'وضعیت سربازی' , options : [{value:0 , label: 'در حال گذراندن'} , {value:1 , label : 'معاف'} , {value : 2, label : 'پایان خدمت'}] , col:{lg: 4} },
    // custom component
    {model: 'weekDays' , component: weekDaySelect ,title:'انتخاب روز هفته' , col:{cols:4} },
    // checkbox
    {model: 'isMarried' , component:'checkbox' ,label:'متاهل هستم' ,col:{cols:4}},
    // switch
    {model: 'isWorking' , component:'switch' ,label:'در حال کار' },
    // datepicker
    {model: 'date' , component:'datepicker' ,label:'تاریخ' },
    // timepicker
    {model: 'time' , component:'datepicker' ,label:'زمان' , type : 'time'},
    // range slider
    {model: 'rangeSlider' , component:'range-slider' ,title:'بازه' },
    // single slider
    {model: 'slider' , component:'slider' ,title:'دما' ,},
  ]
  `
  let vFormExtendProps = `defineProps({
      // form model
      modelValue : { type: Object, default : ()=>({}) },
      // An Object defining form fields
      schema : { type : Array , default : ()=>([]),required: true },
      // Wrapper be a card or div
      withCard : { type : Boolean , default : true },
      // Form width
      width : { type : [String,Number] , default : null },
      loading : { type : Boolean , default : false,required:false },
      // Show Actions buttons for form
      actions : { type : Boolean , default : true,required:false },
      confirmBtnProp : { type : Object , default : ()=>{},required:false },
      title : { type: String , default : null },
      desc : { type: String , default : null },
      // Whether validate form or not
      validation: { type : Boolean , default : true,required:false },
   })`
  let vFormExtendEmits = `defineEmits(['onSubmit','update:modelValue','onCancel'])`
  let vFormExtendFull = `
   <v-form-extend
      v-model="fullExampleValue"
      :loading="loading"
      :with-card="true"
      width="500"
      :actions="true"
      title="عنوان فرم"
      desc=توضیحات"
      :schema="fullExampleSchema"
    />
  `

  let vFormExtendDefault = `
   <v-form-extend
      v-model="fullExampleDefault"
      width="500"
      :actions="false"
      title="فرم ویرایش"
      :schema="fullExampleSchema"
    />
    const defaultExampleValue = ref({
      name : 'morteza',
      gender : 0,
      rowList : [
          {studentName: 'morteza' , gender : 0 , isMarried:false,isWorking:true,date:'1993-10-12'},
          {studentName: 'heidar' , gender : 1 , isMarried:true,isWorking:false,date:'2000-10-12'}
      ]
  })
  `
const onSubmit = (val)=>{
  loading.value = true
    setTimeout(()=>{
      loading.value = false
    },2000)
}
  </script>
