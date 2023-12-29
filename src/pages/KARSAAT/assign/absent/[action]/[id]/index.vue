<template>
  <div>
    <form-page-header :title="isEdit ? `مرخصی ${form.Name} ${form.Family}` : 'ثبت مرخصی'" />
    <v-card-default>
      <v-form-extend
        v-model="form"
        :schema="schema"
        :with-card="false"
        :actions="false"
        :loading="loading"
      />

      <employees-selector
        v-if="!isEdit"
        v-model="employeeCode"
        style="height: 500px"
        class="tw-mb-3"
        :loading="loading"
      />
    </v-card-default>
    <div
      class="tw-mt-3 tw-text-center"
    >
      <v-btn-cancel
        class="tw-w-24 sm:tw-w-44"
        @click="$router.back()"
      >
        انصراف
      </v-btn-cancel>
      <v-btn-success
        class="tw-w-24 sm:tw-w-44"
        :loading="loading"
        @click="submit(form)"
      >
        ذخیره
      </v-btn-success>
    </div>
  </div>
</template>

<script setup>
import AbsentTypeSelect from '@/components/common/absentTypeSelect.vue'
import TeammateSelect from '@/components/common/teammateSelect.vue'


const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({})
const initialValue = ref({})
const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const absent = ref({})
const employeeCode =ref([])

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model: 'AbsentCode' , component : AbsentTypeSelect , title : 'انتخاب عدم حضور' , returnObject : true , required: true ,col:{ cols:12 , lg: 4 } },
    { model: 'Date', component : 'datepicker' , title: 'تاریخ' , col:{ cols:12 , lg: 4 }  },
    { model: 'StartTime', component : 'datepicker' ,type:'time',initialValue : '08:00', title: 'زمان شروع' , condition:val=>val?.AbsentCode?.IsHourly ,col:{ cols:12 , lg: 4 } },
    { model: 'EndTime', component : 'datepicker' , type:'time',title: 'زمان پایان', initialValue : '09:00' ,condition:val=>val?.AbsentCode?.IsHourly,col:{ cols:12 , lg: 4 } },
    { model: 'SubstituteId' , component : TeammateSelect , title : 'لیست همکاران کارمند'  , condition:val=> isEdit.value , col:{ cols:12 , lg: 4 } },
    { model: 'DayCount' , component : 'input' , title : 'مدت به روز'  , condition:val=>!val?.AbsentCode?.IsHourly , col:{ cols:12 , lg: 4 } },
    { model: 'AbsentStatus' , component : 'select' , title : 'وضعیت' , items : $enums.replyStatus  ,condition:val=> isEdit.value , col:{ cols:12 , lg: 4 } },
    { model: 'Description' , component : 'textarea' , title : 'توضیحات' ,col:{ cols:12 } ,condition:val=> !isEdit.value , col:{ cols:12 , lg: 4 } },
    { model: 'sendMessage' , component : 'checkbox' , label : 'به همکار اطلاع داده شود'  ,condition:val=> isEdit.value },
  ]
})

const submit = async (payload = {})=>{
  let url = isEdit.value ? 'absent/edit-employee-absent-by-admin' : 'absent/add-employee-absent-by-admin'
  let body = {
    "WorkspaceCode": WID,
    ...(!isEdit.value ? { "EmployeesCodes":employeeCode.value } : {}),
    ...payload,
    "AbsentCode" : payload?.AbsentCode?.AbsentCode,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/assign/absent')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}


const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "Code" : id.value,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost(`absent/get-employee-absent`,{ body })

    loading.value = false

    return {
      ...res.Data,
    }
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

async function getAbsent(payload={}){
  let body = {
    "WorkspaceCode": WID,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost(`absent/get-absent`,{ body })

    loading.value = false

    return {
      ...res.Data,
    }
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async ()=>{
  if(isEdit.value && id.value){
    form.value = await getItem()

    const absentCode = form.value.AbsentCode
    if(absentCode)
      absent.value = await getAbsent({ "Code":absentCode })
    form.value.AbsentCode = { ...absent.value , key: absent.value.AbsentCode , value : absent.value.Title }
  }
})
</script>

<route>
    {
      meta: {
        title: "مرخصی"
      }
    }
</route>
