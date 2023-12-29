<template>
  <div>
    <form-page-header title="حذف دسته جمعی شیفت پیش فرض" />
    <employees-selector
      v-model="EmployeesCodes"
      style="height: 500px"
      with-card
      class="tw-mb-3"
      :loading="loading"
    />
    <v-form-extend
      ref="formRef"
      v-model="form"
      :schema="schema"
      :loading="loading"
      @on-submit="submit(form)"
      @on-cancel="$router.back()"
    />
  </div>
</template>
    
<script setup>
import shiftSelect from '@/components/common/shiftSelect.vue'
    
const route = useRoute()
const { WID } = useAppStore()
const formRef = ref()
const EmployeesCodes = ref([])
const loading = ref(false)
const form = ref({})
    
const action = computed(()=>route.params.action)
    
const schema = computed(()=>{
  
  let shiftKey
  
  return [
    { model:  'ShiftDefaultId' , component : shiftSelect , title : 'شیفت مورد نظر'  , required: true , col:{ cols:12 } },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , required: true ,col:{ cols:12 , lg:6 } },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ' , required: true ,col:{ cols:12 , lg:6 } },
  ]
})
    
const submit = async (payload = {})=>{
 
  let body = {
    "WorkspaceId": WID,
    "EmployeesIds": EmployeesCodes.value,
    ...payload,
  }
    
  loading.value = true
  try{
    const res = await useHttpPost('shift/revoke-default-shift',{ body })
    
    loading.value = false
    
    form.value = {}
    
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
</script>
    