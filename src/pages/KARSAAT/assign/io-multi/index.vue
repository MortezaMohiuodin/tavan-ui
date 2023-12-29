<template>
  <div>
    <form-page-header :back-btn="false" />
    <employees-selector
      v-if="!isEdit"

      v-model="EmployeeCodes"
      style="height: 500px"
      with-card
      class="tw-mb-3"
      :loading="loading"
    />
    <v-form-extend
      v-model="form"
      :schema="schema"
      :loading="loading"
      @on-submit="submit(form)"
      @on-cancel="$router.back()"
    />
  </div>
</template>

<script setup>
import WeekDaySelect from '@/components/common/weekDaySelect.vue'

const { WID } = useAppStore()

const form = ref({})
const EmployeeCodes = ref([])
const initialValue = ref({})
const loading = ref(false)

const schema = computed(()=>{
  return [
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , items: $enums.absentType, required :true },
    { model: 'ToDate', component : 'datepicker' , title: 'تا تاریخ', required :true   },
    { model: 'StartTime', component : 'datepicker' , title: 'زمان شروع', type : 'time', initialValue : '08:00'  , required :true  },
    { model: 'EndTime', component : 'datepicker' , title: 'زمان پایان', type:'time', initialValue : '18:00', required :true   },
    { model:'Days', component : WeekDaySelect, title : 'روزهای هفته' ,col : { cols: 12 } ,required:true } ,
  ]
})



const submit = async (payload = {})=>{
  let url = "InputOutput/add-all-inputoutput-by-admin"
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCodes" : EmployeeCodes.value,
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false

    reset()

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

function reset(){
  form.value = {}
  EmployeeCodes.value = []
  initialValue.value = {}
  loading.value = false
}
</script>

<route>
{
meta: {
title: "اختصاص ورود و خروج"
}
}
</route>
