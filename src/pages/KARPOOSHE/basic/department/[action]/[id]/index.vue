<template>
  <div>
    <div>
      <form-page-header />
      <v-card-default>
        <v-row justify="center">
          <v-col
            cols="12"
            md="6"
          >
            <v-form-extend
              v-model="form"
              :schema="schema"
              :loading="loading"
              :with-card="false"
              @on-submit="submit(form)"
              @on-cancel="$router.back()"
            />
          </v-col>
        </v-row>
      </v-card-default>
    </div>
  </div>
</template>

<script setup>
const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({})
const initialValue = ref({})
const loading = ref(false)
import DepartmentSelect from '@/components/common/departmentSelect.vue'
import userSelect from '@/components/common/userSelect.vue'

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان' ,col : { cols: 12 } , required:true  },
    { model:'ParentCode', component : DepartmentSelect, title : 'دپارتمان والد' ,col : { cols: 12 }  },
    { model:'DepartmentBoosCode', component : userSelect, title : 'سرپرست' ,col : { cols: 12 }  },
    // { model:'SubLevelCount', component : 'input', title : 'محدودیت دسترسی به تعداد زیرشاخه' ,col : { cols: 12 }  },
    { model:'Description', component : 'textarea', title : 'توضیح' ,col : { cols: 12 }  },
  ]
})

const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "DepartmentCode" : id.value,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost(`/department/get-one-department`,{ body })

    loading.value = false

    return {
      ...res.Data,
    }
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{
  let url = isEdit.value ? '/department/edit-department' : '/department/add-new-department'
  let body = {
    "WorkspaceCode": WID,
    ...(isEdit.value && { "DepartmentCode" : id.value }),
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/basic/department')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async ()=>{
  let data
  if(isEdit.value && id.value){
    data = await getItem()
    form.value = data
    initialValue.value = data
  }
})
</script>

<route>
{
meta: {
title: "تعریف دپارتمان جدید"
}
}
</route>
