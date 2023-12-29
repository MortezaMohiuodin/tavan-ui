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
import roleSelect from '@/components/common/roleSelect.vue'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({  })
const loading = ref(false)
const employeeCode =ref([])

const schema = computed(()=>{
  return [
    { model:'RoleCode', component : roleSelect, title : 'انتخاب دسترسی' , required:true  },
  ]
})

const submit = async (payload = {})=>{
  if(employeeCode.value.length === 0) {
    useSnackbar('کارمندی انتخاب نشده است' , 'error')

    return false
  }
  let url = '/role/assign-role-employee'
  let body = {
    "WorkspaceCode": WID,
    ...payload,
    EmployeeCode:employeeCode.value,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/assign/role')

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
