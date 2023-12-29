<template>
  <form-page-header />
  <v-form-extend
    v-model="form"
    :schema="formSchema"
    :loading="loading"
    @on-submit="submit(form)"
    @on-cancel="$router.back()"
  />
</template>

<script setup>
import EmployeesSelector from '@/components/uiKit/employeesSelector.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const DEFAULT_FORM = {
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().subtract(1,'days').format('YYYY/MM/DD'),
  "EmployeeCodes" :[],
}

const form = ref(DEFAULT_FORM)

const initialValue = ref({})
const loading = ref(false)

const isEdit = computed(() => {
  return route.params.action === 'edit'
})

const id = computed(() => {
  return route.params?.id
})

const formSchema = [
  { model: 'FromDate', component: 'datepicker', title: 'از تاریخ', col: { cols: 12, lg: 6 }, required: true },
  { model: 'ToDate', component: 'datepicker', title: 'تا تاریخ', col: { cols: 12, lg: 6 }, required: true },
  { model: 'EmployeeCodes', component: EmployeesSelector, title: 'انتخاب همکاران', col: { cols: 12 } , style : { height: '500px' } },
]

const submit = async (payload = {}) => {
  let url = 'absent/set-automatic'
  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
  }

  loading.value = true
  try {
    const res = await useHttpPost(url, { body })

    loading.value = false
    resetForm()

    return res
  } catch (e) {
    loading.value = false
    throw new Error(e)
  }
}

function resetForm(){
  form.value = {
    ...form.value,
    EmployeeCodes : [],
  }
}
</script>

<route>
{
meta: {
title: "ثبت عدم حضور پیش فرض"
}
}
</route>
