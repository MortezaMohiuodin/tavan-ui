<template>
  <v-form-extend
    ref="formRef"
    v-model="value"
    :loading="loading"
    :schema="schema"
    :actions="false"
    @on-submit="submit"
  />
</template>

<script setup>
const props = defineProps({
  'modelValue' : { type : Object , default : ()=>({}),required: true },
  'loading' : { type : Boolean, default:false },
})

const emit = defineEmits(['next','prev'])
const formRef = ref()

const schema = computed(()=>{
  return [
    { model:'InsuranceType', component : 'select', title : 'نوع بیمه' , items: $enums.insuranceType  },
    { model: 'InsuranceName' , component : 'input' , title : 'نام بیمه' },
    { model: 'InsuranceNumber' , component : 'input' , title : 'شماره بیمه' },
    { model: 'StartDate' , component : 'datepicker' , title : 'تاریخ شروع به کار' },
    { model: 'EndDate' , component : 'datepicker' , title : 'تاریخ ترک کار' },
    { model: 'IssuancePlace' , component : 'input' , title : 'محل صدور شناسنامه' },
    { model: 'IssuanceDate' , component : 'datepicker' , title : 'تاریخ صدور شناسنامه' },
  ] 
})

const value = useVModel(props, 'modelValue' ,emit)

const submit = ()=>{
  let payload = value.value
  emit('next' , payload)
}
</script>
