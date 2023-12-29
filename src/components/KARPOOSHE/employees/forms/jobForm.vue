<template>
  <v-form-extend
    ref="formRef"
    v-model="value"
    :loading="loading"
    :schema="schema"
    :actions="false"
    @on-submit="submit"
  />
  <v-row
    class="tw-mt-4"
    align="center"
  />
</template>

<script setup>
import vSelectJobsServer from '@/components/uiKit/vSelectJobsServer.vue'

const props = defineProps({
  'modelValue' : { type : Object , default : ()=>({}),required: true },
  'loading' : { type : Boolean, default:false },
  'last' : { type : Boolean, default : false },
  'disabled' : { type : Boolean, default : false },
})


const emit = defineEmits(['next','prev'])
const formRef = ref()
const value = useVModel(props, 'modelValue' ,emit)


const schema = computed(()=>{
  return [
    {
      model: 'InsuranceJob',
      component: vSelectJobsServer,
      title: 'شغل',
      col: {
        cols: 12,
        lg: 6,
      },
      selectedJobBefore: {
        Title:value.value.JobDescription,
        JobCodeInTamin: value.value.JobCodeInTamin,
      },
      disabled: props.disabled,
    },
  ]
})

const submit = ()=>{
  let payload = value.value
  emit('next' , {
    "InsuranceJobCode" : payload.InsuranceJob?.InsuranceJobCode,
    "JobDescription" : payload.InsuranceJob?.JobDescription,
    "JobCodeInTamin" : payload.InsuranceJob?.JobCodeInTamin,
  })
}
</script>
