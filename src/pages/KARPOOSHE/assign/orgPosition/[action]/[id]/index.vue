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
import positionSelect from '@/components/common/positionSelect.vue'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({  })
const loading = ref(false)
const employeeCode =ref([])

const schema = computed(()=>{
  return [
    { model:'OrgPositionCode', component : positionSelect, title : 'انتخاب پست سازمانی' , required:true  },
  ]
})

const submit = async (payload = {})=>{
  if(employeeCode.value.length === 0) {
    useSnackbar('کارمندی انتخاب نشده است' , 'error')

    return false
  }
  let url = '/org-position/set-employee-org-position'
  let body = {
    "WorkspaceCode": WID,
    ...payload,
    EmployeeCodes:employeeCode.value,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/assign/orgPosition')

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
title: "تخصیص پست سازمانی به همکاران"
}
}
</route>
