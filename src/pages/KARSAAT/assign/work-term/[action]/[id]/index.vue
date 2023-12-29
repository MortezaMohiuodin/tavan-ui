<template>
  <div>
    <form-page-header />
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
  <v-overlay
    :model-value="showProgressDialog"
    persistent
    content-class="tw-h-full tw-w-full tw-flex tw-justify-center tw-items-center"
  >
    <v-card-default
      width="400"
    >
      <h4 class="tw-font-YEKAN-BAKH-MEDIUM tw-text-lg tw-text-center">
        در حال پردازش اطلاعات
      </h4>
      <h5 class="tw-font-YEKAN-BAKH-LIGHT tw-text-center tw-text-base tw-text-red-500 tw-mt-2">
        لطفا پنجره مرورگر را نبندید
      </h5>
      <v-progress-linear
        reverse
        color="success"
        height="20"
        rounded="xl"
        :model-value="progress"
        class="tw-mt-5"
      >
        <span :class="[{'tw-text-white-500': progress > 47 ,'tw-text-slate-800' : progress <= 47}]">{{ Math.ceil(progress) }}%</span>
      </v-progress-linear>
    </v-card-default>
  </v-overlay>
</template>

<script setup>
import EmployeesSelector from '@/components/uiKit/employeesSelector.vue'
import { useDisplay } from 'vuetify'

const { lgAndDown } = useDisplay()
const { WID } = useAppStore()
const router = useRouter()
const route = useRoute()
const showProgressDialog = ref(false)

const form = ref({
  intervalCalc : 0,
})



const limit = 150
const calcRes = ref([])
const loading = ref(false)
const Employees = ref([])
const id = computed(()=>route.params.id)
const calcLoading = ref(false)

const progress = computed(()=>{ 
  let all = Math.ceil(Employees.value.length / limit)
  let done = calcRes.value.length 
  if(done === 0) return 0
  let result = done / all
  
  return Math.floor(result * 100)
})

const schema = computed(()=>{
  return [
    { model: 'Title' , component : 'input' , title : 'عنوان'  , required: true },
    { model: 'intervalCalc' , component : 'radio-group' , options: [{ value: 0 , label : 'محاسبه در بازه یک ماه' },{ value:1 , label : 'محاسبه در بازه دلخواه' }] },
    { model: 'SelectedMonths', component : 'select' , title: 'انتخاب ماه',items : $enums.months  , condition: val => val.intervalCalc === 0 },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' ,condition: val => val.intervalCalc === 1  },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ',condition: val => val.intervalCalc === 1 },
    { model:'CalculateDayType', component : 'select', items : $enums.monthType,title : 'مبنای محاسبه محدودیت اضافه کاری و تعطیل کاری و جمعه کاری' ,condition: val => val.intervalCalc === 1  , col: { cols:12 , lg : 4 } },
  ]
})


const calculateWorkTerm = async id=>{
  if(!Employees.value.length) return
  let url = 'worktermcalcu/add'
  
  const count = Employees.value.length
  const reqCount = Math.ceil(count / limit)

  calcLoading.value = true
  showProgressDialog.value = true

  const array = []
  for(let i = 1; i <= reqCount ; i++){
    let start = (i - 1) * limit
    let end = ((i - 1) * limit + limit) < count ? ((i - 1) * limit + limit) : count 
    let innerArray = Employees.value.slice(start , end)
    array.push(innerArray)
  }
  for(let i = 0;i < array.length ; i++){
    let body = {
      "WorkspaceId": WID,
      WorkspaceEmployeeIds : array[i],
      "Id" : id,
    }
    async function doAsync(body){
      return await useHttpPost(url,{ body })
    }
    const res = await doAsync(body)

    calcRes.value.push(res)
    if(i >= array.length - 1){
      calcLoading.value = false
      showProgressDialog.value =false
      router.push(`/KARSAAT/assign/work-term/detail/${id}`)
    }
  }

}

const addWorkTerm = async (payload = {})=>{
  if(!Employees.value.length) return
  let fromDate = null
  let toDate = null
  if(payload.intervalCalc || payload.intervalCalc === 0){
    let m = $moment()
    let jyear = m.jYear()
    let month = parseInt(payload.SelectedMonths) + 1
    fromDate  = $moment(`${jyear}/${month}/25`,'jYYYY/jM/jD').startOf('jmonth').format('YYYY/MM/DD')
    toDate = $moment(`${jyear}/${month}/25`,'jYYYY/jM/jD').endOf('jmonth').format('YYYY/MM/DD')
  }else{
    fromDate = payload.FromDate
    ToDate = payload.ToDate
  }

  let url = 'workterm/add'
  let body = {
    "WorkspaceId": WID,
    "FromDate" : fromDate,
    "ToDate" : toDate,
    ...payload,
    "CalculateDayType" : payload.intervalCalc,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

async function submit(value){
  try{
    calcRes.value = []

    const res = await addWorkTerm(value)
    const id = res.Data?.Id.toString()

    await calculateWorkTerm(id)
  }catch(e){
    console.log(e)
  }

}
</script>

<route>
{
meta: {
title: "دوره های کارکرد"
}
}
</route>
