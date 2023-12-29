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
  'disabled' : { type : [Boolean,Array], default:false },
})

const emit = defineEmits(['next'])
const formRef = ref()

const schema = [
  { model:'Username', component : 'input', title : 'نام کاربری' , required: true },
  { model: 'PersonalCode' , component : 'input' , title : 'کد پرسنلی' },
  { model: 'Name' , component : 'input' , title : 'نام' },
  { model: 'Family' , component : 'input' , title : 'نام خانوادگی' },
  { model: 'FatherName' , component : 'input' , title : 'نام پدر' },
  { model: 'NationalCode' , component : 'input' , title : 'کد ملی یا کد فراگیر' },
  { model: 'BirthCertificate' , component : 'input' , title : 'شماره شناسنامه' },
  { model: 'Gender' , component : 'select' , title : 'جنسیت' , items: $enums.Gender },
  { model: 'BirthDay' , component : 'datepicker' , title : 'تاریخ تولد' },
  { model: 'DegreeOfEducation' , component : 'select' , title : 'مدرک تحصیلی' , items: $enums.DegreeOfEducation },
  { model: 'IsMarried' , component : 'select' , title : 'نوع تجرد' , items: $enums.IsMarried },
  { model: 'Religion' , component : 'input' , title : 'مذهب' },
  { model: 'ChildNumber' , component : 'input' , title : 'تعداد فرزند' },
  { model: 'NationalityType' , component : 'select' , title : 'نوع تابعیت' , items: $enums.NationalityType },
  { model: 'Country' , component : countrySelect , title : 'کشور'  },
  { model: 'Nationality' , component : 'input' , title : 'تبعه' },
  { model: 'EmergencyPhone' , component : 'input' , title : 'شماره اضطراری' },
]

if(typeof props.disabled === 'object'){

  schema.forEach(s => {
    if(props.disabled.includes(s.model)) s.disabled=true
  })
}
const value = useVModel(props, 'modelValue' ,emit)

const submit = ()=>{
  let payload = value.value
  emit('next' , payload)
}
</script>
