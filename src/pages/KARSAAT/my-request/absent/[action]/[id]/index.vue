<template>
  <div>
    <form-page-header />
    <v-form-extend
      v-model="form"
      :schema="schema"
      inner-width="700px"
      :loading="loading"
      @on-submit="submit(form)"
      @on-cancel="$router.back()"
    />
  </div>
</template>

<script setup>
import absentTypeSelect from '@/components/common/absentTypeSelect.vue'
import teammateSelect from '@/components/common/teammateSelect.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  type : 0,
})

const initialValue = ref({})
const loading = ref(false)


const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model: 'Absent' , component : absentTypeSelect , title : 'انتخاب عدم حضور' , col : { cols:12 } , returnObject : true , required: true },
    { model: 'Date', component : 'datepicker' , title: 'تاریخ' ,col : { cols:12 } , required:true },
    { model: 'type' , component : 'radio-group' , title : 'نوع' , options: [{ value: 0 , label : 'تا تاریخ' },{ value:1 , label : 'مدت به روز' }], col : { cols:12 } , condition:val=>!val?.Absent?.IsHourly },
    { model: 'EndDate', component : 'datepicker' , title: 'تا تاریخ', col : { cols: 12,md: 6 } , condition:val=>!val?.Absent?.IsHourly ,disabled : form.value.type === 1 },
    { model: 'DayCount' , component : 'input' , title : 'مدت به روز' , col : { cols:12 , md : 6 } , condition:val=>!val?.Absent?.IsHourly , disabled : form.value.type === 0 },
    { model: 'StartTime', component : 'datepicker' ,type:'time', title: 'زمان شروع', col : { cols: 12,md: 6 } , condition:val=>val?.Absent?.IsHourly },
    { model: 'EndTime', component : 'datepicker' , type:'time',title: 'زمان پایان', col : { cols: 12,md: 6 } ,condition:val=>val?.Absent?.IsHourly },
    { model: 'SubstituteId' , component : teammateSelect , title : 'لیست همکاران کارمند' ,  col: { cols: 12  } },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات' ,  col: { cols: 12  } ,condition:val=> !isEdit.value },
  ]
})



const submit = async (payload = {})=>{
  let url = isEdit.value ? 'absent/edit-absent-by-employee' : 'absent/add-absent-by-employee'

  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
    "AbsentCode" : payload?.Absent?.AbsentCode,
    ...(isEdit.value && { "EmployeeAbsentCode" : id.value }),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/my-request/absent')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async ()=>{
  if(isEdit.value && id.value){
    if(!store.lastItem) router.push('/KARSAAT/my-request/absent')
    form.value = {
      ...store.lastItem,
      'Absent' : {
        AbsentCode : store.lastItem?.AbsentCode,
        AbsentType : store.lastItem?.AbsentType,
        Title : store.lastItem?.AbsentTitle,
        IsHourly : store.lastItem.IsHourly,
        AbsentStatus : store.lastItem.AbsentStatus,
        'key' : store.lastItem.Code,
        'value' : store.lastItem.AbsentTitle,
      },
    }
    if(!store?.lastItem?.IsHourly){
      if(store?.lastItem?.EndDate)
        form.value.type = 0
      else if(store.lastItem.DayCount)
        form.value.type = 1
    }
  }
})
watch(()=>form.value.Absent,val=>{
  if(val?.IsHourly){
    form.value.StartTime = null
    form.value.EndTime = null
  }else{
    if(!val.DayCount && !val.EndDate) form.value.type = 0
    form.value.DayCount = null
    form.value.EndDate = null
  }
})
watch(()=>form.value.type,val=>{
  if(val === 0){
    form.value.DayCount = null
  }else{
    form.value.EndDate = null
  }
})
</script>

<route>
    {
      meta: {
        title: "ثبت  مرخصی"
      }
    }
</route>
