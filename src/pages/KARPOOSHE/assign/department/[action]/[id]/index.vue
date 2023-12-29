<template>
  <div>
    <form-page-header />
    <employees-selector
      v-model="employeeCode"
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
import departmentSelect from '@/components/common/departmentSelect.vue'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({  })
const loading = ref(false)
const employeeCode =ref([])

const schema = computed(()=>{
  return [
    { model:'Department', component : departmentSelect, title : 'انتخاب دپارتمان' , required:true, multiple: true  },
  ]
})

const submit = async (payload = {})=>{
  if(employeeCode.value.length === 0) {
    useSnackbar('کارمندی انتخاب نشده است' , 'error')

    return false
  }
  let url = '/department/set-employee-department'
  let body = {
    "WorkspaceCode": WID,
    ...payload,
    EmployeeCodes:employeeCode.value,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/assign/department')

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
title: "تخصیص دپارتمان به چندین کارمند"
}
}
</route>
