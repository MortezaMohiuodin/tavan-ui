<template>
  <div>
    <form-page-header />
    <employees-selector
      v-if="!isEdit"
      v-model="Employees"
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
import EmployeesSelector from '@/components/uiKit/employeesSelector.vue'
import missionSelect from '@/components/common/missionSelect.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params.id
})

const form = ref({})
const Employees = ref([])

const schema = computed(()=>{
  let fields = [
    { model: 'MissionCode' , component : missionSelect , title : 'نام ماموریت' , returnObject:true },
    { model: 'Date' , component : 'datepicker' , title:'تاریخ' , required:true },
    { model: 'DayCount' , component : 'input' , title: 'مدت به روز'  , condition:val=>!val?.MissionCode?.IsHourly,required : !form.value?.MissionCode?.IsHourly },
    { model:'StartTime', component : 'datepicker', type: 'time' ,title : 'زمان شروع', initialValue : '08:00'  ,condition:val=>val?.MissionCode?.IsHourly,required : form.value?.MissionCode?.IsHourly },
    { model:'EndTime', component : 'datepicker', type: 'time' ,title : 'زمان پایان' , initialValue : '09:00' ,condition:val=>val?.MissionCode?.IsHourly ,required : !form.value?.MissionCode?.IsHourly },
    { model: 'Description', component : 'textarea' , title :  'توضیحات' , col: { cols: 12   } },
    { model:'SendMsg', component : 'checkbox',label : 'به کارمند اطلاع داده شود'   },
  ]
  if(isEdit.value){
    fields.push({ model: 'Status' , component : 'select' , title : 'وضعیت ماموریت' , col:{ cols:12 } , items: $enums.replyStatus })
  }

  return fields
})


const submit = async (payload = {})=>{
  const missionCode = payload?.MissionCode?.Code
  if(!isEdit.value && !Employees.value.length) return
  let url = isEdit.value ?  'mission/edit-employee-mission' :  'mission/set-employee-mission'
  let body = {
    "WorkspaceCode": store.WID,
    ...(!isEdit.value ? { 'EmployeeCodes' :Employees.value } : { "EmployeeCode" : payload.EmployeeCode } ),
    ...payload,
    "MissionCode" : missionCode ,
    ...(isEdit.value ? { 'Code' :id.value } : {} ),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/assign/mission')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

watch(()=>form.value.MissionCode , val=>{
  if(val && !val.IsHourly){
    form.value.StartTime = null
    form.value.EndTime = null
  }
}, { immediate : true })

onMounted(async()=>{
  if(id.value && isEdit.value){
    if(store.lastItem){

      form.value = {
        "Date" : store.lastItem.Date,
        "DayCount" : store.lastItem.DayCount,
        "StartTime" : store.lastItem.StartTime,
        "EndTime" : store.lastItem.EndTime,
        "Description" : store.lastItem.Description,
        "SendMsg" : store.lastItem.SendMsg,
        "Status" : store.lastItem.MissionStatus,
        "EmployeeCode" : store.lastItem.EmployeeCode,
        'MissionCode' : {
          'key' : store.lastItem.MissionCode,
          'value' : store.lastItem.MissionTitle,
          'Code' : store.lastItem.MissionCode,
          'MissionTitle' : store.lastItem.MissionTitle,
          IsHourly : store.lastItem.IsHourly,
        },
      }
    }else{
      router.push('/KARSAAT/assign/mission')

    }

  }

})
</script>

  <route>
  {
  meta: {
  title: "اختصاص ماموریت"
  }
  }
  </route>
