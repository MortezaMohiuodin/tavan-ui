<template>
  <div>
    <form-page-header :title="isRemove ? 'حذف قوانین کارکرد' : 'اختصاص قوانین کارکرد'" />
    <employees-selector
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
import WorkspaceRuleSelect from '@/components/common/workspaceRuleSelect.vue'

const { WID } = useAppStore()
const router = useRouter()
const route = useRoute()

const isRemove = computed(()=>{
  return route.params.action === 'remove'
})

const form = ref({
  ...(isRemove.value ? {} :{ "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD') }),
  ...(isRemove.value ? {} :{ "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD') }),
})


const loading = ref(false)
const Employees = ref([])

const schema = computed(()=>{
  return [
    { model: 'WorkRuleId' , component :  WorkspaceRuleSelect, title : 'انتخاب قانون کارکرد' ,required:true },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' ,required:true  },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ'  ,required:true },
  ]
})


const submit = async (payload = {})=>{

  if(!Employees.value.length) {
    useSnackbar('کارمندی انتخاب نشده است','error')

    return
  }
  let url = isRemove.value ? 'employeerules/revoke' :'employeerules/add'
  let body = {
    "WorkspaceId": WID,
    "EmployeeIds": Employees.value,
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    if(isRemove.value){
      form.value = {}
      Employees.value = []
    }else{
      router.push('/KARSAAT/assign/work-rule')
    }

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
  title: "اختصاص قوانین کارکرد"
  }
  }
  </route>
