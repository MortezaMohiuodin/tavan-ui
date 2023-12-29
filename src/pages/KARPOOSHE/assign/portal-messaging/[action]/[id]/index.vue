<template>
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
            @on-submit="submit(form)"
            @on-cancel="$router.back()"
          />
        </v-col>
      </v-row>
    </v-card-default>
  </div>
</template>

<script setup>
import departmentSelect from '@/components/common/departmentSelect.vue'
import FormPageHeader from '@/components/organisms/formPage/formPageHeader.vue'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  NoticeDepartmentList:[],
  StartDate : null,
  EndDate : null,
})

const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model:'NoticeDepartmentList', component : departmentSelect,multiple : true, required:true ,title : 'انتخاب دپارتمان' , col : { cols:12 }    },
    { model:'Title', component : 'input', title : 'عنوان' , required:true , col: { cols:12 } },
    { model:'StartDate' , component : 'datepicker'  ,title: 'زمان شروع' , col : { cols:12 , lg: 6 } , required: true },
    { model:'EndDate' , component : 'datepicker' , title: 'زمان پایان' , col : { cols:12 , lg: 6 }  , required: true },
    { model:'ShowInInbox' , component : 'checkbox' , label: 'نمایش در صندوق' , col : { cols:12 , lg: 6 } },
    { model:'ShowInDashboard' , component : 'checkbox' , label: 'نمایش در داشبورد' , col : { cols:12 , lg: 6 } },
    { model:'ShowInLogin' , component : 'checkbox' , label: 'نمایش  عمومی در صفحه لاگین' , col : { cols:12 , lg: 6 } },
    { model:'ShowPushNotif' , component : 'checkbox' , label: 'نمایش با نوتیف ویندوز' , col : { cols:12 , lg: 6 } },
    { model : 'Description' , component : 'textarea' , title : 'متن' , col : { cols:12 } },
  ]
})

const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    ...(isEdit.value && { "Id" : id.value }),
    ...payload,
  }
  try{

    return await useHttpPost('notice/get',{ body  })
  }catch(e){
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{
  let url = isEdit.value ? 'notice/edit':'notice/add'
  let body = {
    "WorkspaceId": WID,
    ...(isEdit.value && { "Id" : id.value }),
    ...payload,
    "NoticeDepartmentList" : form.value.NoticeDepartmentList,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/assign/portal-messaging')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async ()=>{
  let res
  if(isEdit.value && id.value){
    res = await getItem()
    form.value =res.Data
    form.value.NoticeDepartmentList= res.Data.DepartmentList.map(val=> val.DepartmentId)
  }
})
</script>

<route>
{
meta: {
title: "ایجاد اعلان"
}
}
</route>
