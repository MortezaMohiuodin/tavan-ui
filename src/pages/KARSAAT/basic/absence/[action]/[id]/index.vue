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
            width="500px"
            @on-submit="onSubmit"
            @on-cancel="$router.back()"
          />
        </v-col>
      </v-row>
    </v-card-default>
  </div>
</template>

<script setup>
import { hmToMinute, minuteToHms } from '@/helper/utility'

const form = ref({
  ShowToEmployee : false,
})

const loading = ref(false)
const router = useRouter()
const route =useRoute()
const store = useAppStore()

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان غیبت' ,col : { cols: 12 }  },
    { model: 'Type' , component : 'select' , title : 'نوع عدم حضور' , items: $enums.absentTypeAdd, col: { cols: 12  } },
    { model: 'Description', component : 'textarea' , title: 'توضیحات', col : { cols: 12 }   },
    // RequestTimeOutCheckbox fields
    { model: 'RequestTimeOutCheckbox', component : 'checkbox' , label: 'محدودیت زمان درخواست وجود دارد؟', col : { cols: 12 }     },
    { model: 'RequestTimeOutDay' , component : 'input' , title : 'روز' ,  col: { cols: 12, md: 6  },condition:val=>val.RequestTimeOutCheckbox },
    { model: 'RequestTimeOutHour' , component : 'datepicker' , title : 'ساعت' , initialValue : '12:00' ,type:'time',  col: { cols: 12, md: 6  } , condition:val=>val.RequestTimeOutCheckbox },

    { model: 'IsHourly', component : 'checkbox' , label: 'مرخصی ساعتی است؟', initialValue : '00:00' , col : { cols: 12 } , condition:val=>val.Type === 1  },

    // MaxTimeRequestInMonthCheck fields
    { model: 'MaxTimeRequestInMonthCheck', component : 'checkbox' , label: 'محدودیت مرخصی در ماه وجود دارد؟', col : { cols: 12 }  },
    { model: 'MaxTimeRequestInMonth' , component : 'datepicker' ,type:'time',initialValue : '12:00', col: { cols: 12, md: 6  } , condition : val=>val.MaxTimeRequestInMonthCheck },
    // checkboxes
    { model: 'CanRequestInHoliday', component : 'checkbox' , label: 'کارمند می تواند برای روز تعطیل مرخصی ثبت نماید؟', col : { cols: 12 }  },
    { model: 'ShowToEmployee', component : 'checkbox' , label: 'به همکاران نمایش داده شود؟', col : { cols: 12 }   },
  ]
})


const onSubmit = async payload=>{
  let url = isEdit.value ? 'absent/edit-absent': 'absent/add-new-absent'
  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
    'IsHourly' : !!payload.IsHourly,
    ...(isEdit.value && { "AbsentCode" : parseInt(id.value) }),
    ...(payload.RequestTimeOutCheckbox && { "RequestTimeOut" : hmToMinute(payload.RequestTimeOutHour) + (payload.RequestTimeOutDay * 24 * 60) }),
    ...(payload.MaxTimeRequestInMonthCheck && { "MaxTimeRequestInMonth" : hmToMinute(payload.MaxTimeRequestInMonth)  }),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/basic/absence')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceCode": store.WID,
    "Code" : id.value,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost('absent/get-absent',{ body })

    loading.value = false
    res.Data = {
      ...res.Data,
      ...(res.Data.MaxTimeRequestInMonth ? { MaxTimeRequestInMonth : minuteToHms(res.Data.MaxTimeRequestInMonth),MaxTimeRequestInMonthCheck : true } : {}),
      ...(res.Data.RequestTimeOut ? { RequestTimeOutDay : Math.floor(res.Data.RequestTimeOut / (24 * 60)) , RequestTimeOutHour : minuteToHms(res.Data.RequestTimeOut % (24 * 60)) , RequestTimeOutCheckbox:true  } : {}),
    }
    
    return res.Data
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

watch(()=>form.value.MaxTimeRequestInMonthCheck,val=>{
  if(!val)
    form.value.MaxTimeRequestInMonth = null
})

watch(()=>form.value.RequestTimeOutCheckbox,val=>{
  if(!val)
    form.value.MaxTimeRequestInMonth = null
})

onMounted(async ()=>{
  if(isEdit.value && id.value){
    form.value = await getItem()
  }
})
</script>

<route>
    {
      meta: {
        title: "تعریف عدم حضور"
      }
    }
</route>
