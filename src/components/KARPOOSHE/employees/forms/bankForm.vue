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
import countrySelect from '@/components/common/countrySelect.vue'

const props = defineProps({
  'modelValue' : { type : Object , default : ()=>({}),required: true },
  'loading' : { type : Boolean, default:false },
})

const emit = defineEmits(['next','prev'])
const formRef = ref()

const schema = [
  { model: 'Bank' , component : 'input' , title : 'اسم بانک' },
  { model: 'AccountHolder' , component : 'input' , title : 'صاحب حساب' },
  { model:'AccountNumber', component : 'input', title : 'شماره حساب'  },
  { model: 'CardNumber' , component : 'input' , title : 'شماره کارت' },
  { model: 'IBAN' , component : 'input' , title : 'شماره شبا' },
]

const value = useVModel(props, 'modelValue' ,emit)

const submit = ()=>{
  let payload = value.value
  emit('next' , payload)
}
</script>
