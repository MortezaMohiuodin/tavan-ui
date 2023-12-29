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
import { minuteToHms , hmToMinute } from '@/helper/utility'

const { WID } = useAppStore()
const route = useRoute()
const router = useRouter()
const form = ref({})
const initialValue = ref({})
const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const schema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان' ,col : { cols: 12 } ,width:'300px' , required:true  },
    { model:'VacationYearlyTimeMax', component : 'datepicker' , type : 'time', checkboxGuard : 'تعیین حق مرخصی اتحقاقی سالیانه', label : 'دقیقه' ,col : { cols: 12 } ,width:'300px' },
    { model:'OverTimeMax', component : 'datepicker',type: 'time'  ,label : 'دقیقه',checkboxGuard : 'حداکثر اضافه کاری در دوره' ,col : { cols: 12 } ,width:'300px'  },
    { model:'HolidayWorkTimeMax', component : 'datepicker', type: 'time',label : 'دقیقه' , checkboxGuard: 'حداکثر تعطیلی کاری در دوره' ,col : { cols: 12 } ,width:'300px'  },
    { model:'FridayTimeMax', component : 'datepicker',type: 'time' ,label : 'دقیقه',checkboxGuard: 'حداکثر جمعه کاری در دوره' ,col : { cols: 12 } ,width:'300px'   },
    { model:'PossibleForgetIO', component : 'input', label : 'روز',checkboxGuard:'محدودیت مهلت زمان ثبت تردد فراموش شده' ,col : { cols: 12 } ,width:'300px' },
    { model:'PossibleConfirmForgetIO', component : 'input', label : 'روز' ,checkboxGuard : 'محدودیت مهلت زمان تایید تردد فراموش شده توسط مدیر',col : { cols: 12 } ,width:'300px'    },
    { model: 'ForgottenIOCheckbox' , component : 'checkbox' , label : 'سقف تعداد تعدد فراموش شده' ,col : { cols: 12 } },
    { model: 'ForgottenIOMax' , component : 'input' , label : 'تعداد' ,col : { cols: 12 },width:'300px' ,condition:val=> val.ForgottenIOCheckbox },
    { model: 'ForgottenIOMaxDay' , component : 'input' , label : 'روز' ,col : { cols: 12 } ,width:'300px',condition:val=> val.ForgottenIOCheckbox },
    { model: 'LackDelayByOverTime' , component : 'checkbox' , label : 'همپوشانی اضافه کاری و کسری کار' ,col : { cols: 12 } },
    { model: 'IsCalcuOvettimeMonthly' , component : 'checkbox' , label : 'اضافه کاری و کسری کار به صورت دوره ای محاسبه شود' ,col : { cols: 12 } },
  ]
})

watch(form,val=>{
  if(!val['ForgottenIOCheckbox']){
    form.value['ForgottenIOMax'] = null
    form.value['ForgottenIOMaxDay'] = null
  }
},{ deep:true })

const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "WorkspaceRuleId" : id.value,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost(`workspacerules/get-single`,{ body })

    loading.value = false

    return {
      ...res.Data,
      'ForgottenIOCheckbox' : !!res.Data?.ForgottenIOMax || !!res.Data?.ForgottenIOMaxDay,
    }
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{
  let url = isEdit.value ? 'workspacerules/edit' : 'workspacerules/add'
  let body = {
    "WorkspaceId": WID,
    ...(isEdit.value && { "WorkspaceRuleId" : id.value }),
    ...payload,
    ...(payload.VacationYearlyTimeMax ? { "VacationYearlyTimeMax": hmToMinute(payload.VacationYearlyTimeMax) } : {}),
    ...(payload.OverTimeMax ? { "OverTimeMax": hmToMinute(payload.OverTimeMax) } : {}),
    ...(payload.HolidayWorkTimeMax ? { "HolidayWorkTimeMax": hmToMinute(payload.HolidayWorkTimeMax) } : {}),
    ...(payload.FridayTimeMax ? { "FridayTimeMax": hmToMinute(payload.FridayTimeMax) } : {}),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/basic/workspace-rules')

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
    form.value = {
      ...data,
      ...(data.VacationYearlyTimeMax ? { "VacationYearlyTimeMax": minuteToHms(data.VacationYearlyTimeMax) } : {}),
      ...(data.OverTimeMax ? { "OverTimeMax": minuteToHms(data.OverTimeMax) } : {}),
      ...(data.HolidayWorkTimeMax ? { "HolidayWorkTimeMax": minuteToHms(data.HolidayWorkTimeMax) } : {}),
      ...(data.FridayTimeMax ? { "FridayTimeMax": minuteToHms(data.FridayTimeMax) } : {}),
    }
    initialValue.value = data
  }
})
</script>

<route>
    {
      meta: {
        title: "تعریف قوانین کارکرد"
      }
    }
</route>
