<template>
  <form-page-header />
  <v-row>
    <v-col
      cols="12"
      lg="4"
    >
      <v-form-extend
        v-model="form"
        :schema="schema"
      />
    </v-col>
    <v-col
      cols="12"
      lg="8"
    >
      <div class="tw-grid tw-grid-cols-3 tw-gap-5">
        <persian-datepicker-inline
          v-for="month in months"
          :key="month"
          v-model="calendar[month]"
          :month="month"
          :year="1402"
          multiple
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { WID } = useAppStore()
const id = route.params.id
const isEdit = route.params.action === 'edit'
const loading = ref(false)
const months = [0,1,2,3,4,5,6,7,8,9,10,11]
const calendar = ref({})

const schema = [
  { model:'Title' , component : 'input' , required: true , title: 'عنوان', col:{ cols:12 } },

]

const form = ref({
  Days : [],
  Title : null,
  WorkspaceCalendarId : id,
  WorkspaceId : WID,
})

const submit = async payload=>{
  if(!form.value.Title) return
  let url = isEdit ? 'workspacecalender/edit' : 'workspacecalender/add'

  const body = {
    ...payload,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAL/calendars')
    
    return res
  }catch(e){
    loading.value = false

    console.log(e)
  }
}

onMounted( async ()=>{
  if(isEdit && id) {
    let body = {
      WorkspaceCalendarId : id,
      WorkspaceId : WID,
    }
    const res = await useHttpPost('workspacecalender/get-single' , { body })

    form.value = {
      Days : res.Data.CustomHoliday,
      Title : res.Data.Title,
      WorkspaceCalendarId : id,
      WorkspaceId : WID,
    }
  }
})
</script>

<route>
{
    meta: {
    title: "ساخت تقویم اختصاصی"
    }
}
</route>
    