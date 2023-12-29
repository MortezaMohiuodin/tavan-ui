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
import provinceSelect from '@/components/common/provinceSelect.vue'
import citySelect from '@/components/common/citySelect.vue'

const props = defineProps({
  'modelValue' : { type : Object , default : ()=>({}),required: true },
  'loading' : { type : Boolean, default:false },
})

const emit = defineEmits(['next','prev'])
const formRef = ref()

const schema = computed(()=>{
  return [
    { model:'StateId', component : provinceSelect, title : 'استان'  },
    { model: 'CityId' , component : citySelect , title : 'شهرستان'  , stateId: value.value['StateId'] },
    { model: 'Street' , component : 'input' , title : 'خیابان' },
    { model: 'Alley' , component : 'input' , title : 'کوچه' },
    { model: 'Plaque' , component : 'input' , title : 'پلاک' },
    { model: 'Unit' , component : 'input' , title : 'واحد' },
  ]
})

const value = useVModel(props, 'modelValue' ,emit)


const submit = ()=>{
  let payload = value.value
  emit('next' , payload)
}
</script>
