<template>
  <div>
    <form-page-header />
    <v-form-extend
      v-model="form"
      :schema="schema"
      :loading="loading"
      inner-width="700px"
      @on-submit="submit(form)"
      @on-cancel="$router.back()"
    />
  </div>
</template>

<script setup>
import missionSelect from '@/components/common/missionSelect.vue'

const store = useAppStore()
const router = useRouter()
const loading = ref(false)
const route = useRoute()

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params.id
})

const form = ref({})


const schema = computed(()=>{
  return [
    { model: 'MissionCode' , component : missionSelect , title : 'نام ماموریت' , col: { cols: 12  } , returnObject:true },
    { model: 'Date' , component : 'datepicker' , title:'تاریخ' ,  col: { cols: 12 , md: 6  } , required:true , col:{ cols:12 , md : form.value?.MissionCode?.IsHourly ? 12 : 6 } },
    { model: 'DayCount' , component : 'input' , title: 'مدت به روز' ,col: { cols: 12 , md: 6  } , condition:val=>!val?.MissionCode?.IsHourly,required : !form.value?.MissionCode?.IsHourly },
    { model:'StartTime', component : 'datepicker', type: 'time' ,title : 'زمان شروع' ,col : { cols: 12 , md:6 }  ,condition:val=>val?.MissionCode?.IsHourly,required : form.value?.MissionCode?.IsHourly },
    { model:'EndTime', component : 'datepicker', type: 'time' ,title : 'زمان پایان' ,col : { cols: 12 , md:6 } ,condition:val=>val?.MissionCode?.IsHourly ,required : !form.value?.MissionCode?.IsHourly },
    { model: 'Description', component : 'textarea' , title :  'توضیحات' , col: { cols: 12   } },
  ]
})


const submit = async (payload = {})=>{
  const id = payload?.MissionCode?.MissionCode
  let url = isEdit.value ? 'mission/employee-mission-edit-request' : 'mission/employee-mission-request'
  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
    "MissionCode" : id,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/my-request/mission')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async () => {
  if(isEdit.value){
    if(id.value && store.lastItem){
      form.value = {
        ...store.lastItem,
        'MissionCode' : {
          'key' : store.lastItem.MissionCode,
          'value' : store.lastItem.MissionTitle,
          'MissionCode' : store.lastItem.MissionCode,
          'MissionTitle' : store.lastItem.MissionTitle,
          IsHourly : store.lastItem.IsHourly,
        },
      }
    }else{
      router.push('/KARSAAT/my-request/mission')
    }

  }
})
</script>

  <route>
  {
  meta: {
  title: "ثبت ماموریت"
  }
  }
  </route>
