<template>
  <div>
    <form-page-header />
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-form-extend
          v-model="form"
          :schema="schema"
          style="height: 500px"
          :loading="loading"
          @on-submit="submit(form)"
          @on-cancel="$router.back()"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <employees-selector
          v-model="EmployeeIds"
          style="height: 500px"
          with-card
          class="tw-mb-3"
          :loading="loading"
        />
      </v-col>
    </v-row>
  </div>
</template>
  
<script setup>
import calendarSelect from '@/components/common/calendarSelect.vue'
  
const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({ 
  workspaceCalendarId: null,
  FromDate: null,
  ToDate : null,
  EmployeeIds: [],
})

const loading = ref(false)
const EmployeeIds =ref([])
  
const schema = computed(()=>{
  return [
    { model:'workspaceCalendarId', component : calendarSelect, title : 'انتخاب تقویم سازمانی' , required:true , col:{ cols:12 } },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , col:{ cols:12 , lg:6 }, required:true },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ' , col:{ cols:12 , lg:6 } , required:true },
  ]
})
  
const submit = async (payload = {})=>{
  if(EmployeeIds.value.length === 0) {
    useSnackbar('کارمندی انتخاب نشده است' , 'error')
  
    return false
  }
  let url = 'employeecalender/add'
  let body = {
    "WorkspaceId": WID,
    ...payload,
    EmployeeIds:EmployeeIds.value,
  }
  
  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })
  
    loading.value = false
    router.push('/KARSAAL/assign-calendar')
  
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
</script>
  
  <route>
  {
  meta: {
  title: "اختصاص تقویم سازمانی"
  }
  }
  </route>
  