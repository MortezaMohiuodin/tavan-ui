<template>
  <div>
    <form-page-header :title="`اختصاص دسته جمعی شیفت ${title}`" />
    <v-row>
      <v-col
        cols="12"
      >
        <employees-selector
          v-model="EmployeesCodes"
          style="height: 500px"
          with-card
          class="tw-mb-3"
          :loading="loading"
        />
      </v-col>
      <v-col
        cols="12"
      >
        <v-form-extend
          ref="formRef"
          v-model="form"
          :schema="schema"
          :loading="loading"
          style="height: 500px"
          :actions="false"
          @on-submit="submit(form)"
          @on-cancel="$router.back()"
        >
          <template
            v-if="action==='rotate'"
            #ToDate
          >
            <label
              for="toDate"
              class="fieldLabel"
            >
              تا تاریخ
            </label>
            <persian-datepicker
              id="toDate"
              v-model="toDateForRotate"
              disabled
            />
          </template>
        </v-form-extend>
      </v-col>
    </v-row>
    <div class="tw-text-center tw-mt-4">
      <v-btn-cancel
        class="tw-w-24 sm:tw-w-44"
        @click="$router.back()"
      >
        انصراف
      </v-btn-cancel>
      <v-btn-success
        class="tw-w-24 sm:tw-w-44"
        :loading="loading"
        type="submit"
        @click="val=>formRef.onSubmit()"
      >
        ذخیره
      </v-btn-success>
    </div>
  </div>
</template>

<script setup>
import shiftSelect from '@/components/common/shiftSelect.vue'
import weekDaySelect from '@/components/common/weekDaySelect.vue'
import rotateShiftSelect from '@/components/common/rotateShiftSelect.vue'
import weeklyShiftSelect from '@/components/common/weeklyShiftSelect.vue'

const route = useRoute()
const router = useRouter()
const { WID } = useAppStore()
const formRef = ref()
const EmployeesCodes = ref([])
const loading = ref(false)
const form = ref({})
let toDateForRotate = ref(null)
const action = computed(()=>route.params.action)

const shiftSelectComponent = computed(()=>{
  let component
  switch(action.value) {
  case 'default':
    component = shiftSelect
    break
  case 'weekly' :
    component = weeklyShiftSelect
    break
  case 'rotate' :
    component = rotateShiftSelect
    break
  case 'specific' :
    component = shiftSelect
    break
  default:
    component = shiftSelect
  }

  return component
})

const title = computed(()=>{
  let title
  switch(action.value) {
  case 'default':
    title = 'پیش فرض'
    break
  case 'weekly' :
    title = 'هفتگی'
    break
  case 'rotate' :
    title = 'دوره ای'
    break
  case 'specific' :
    title = 'اختصاصی'
    break
  default:
    title = 'پیش فرض'
  }

  return title
})

const schema = computed(()=>{
  let shiftKey
  switch(action.value) {
  case 'default':
    shiftKey = 'ShiftDefaultCode'
    break
  case 'weekly' :
    shiftKey = 'ShiftWeeklyCode'
    break
  case 'rotate' :
    shiftKey = 'ShiftRotateCode'
    break
  case 'specific' :
    shiftKey = 'Code'
    break
  default:
    shiftKey = 'ShiftDefaultCode'
  }

  let array =   [
    { model:  shiftKey , component : shiftSelectComponent.value , title : 'شیفت مورد نظر'  , required: true , col:{ cols:12 },'return-object': action.value === 'rotate' },
    { model: 'FromDate' , component : 'datepicker' , title : 'از تاریخ' , required: true ,col:{ cols:12 , lg:6 } },
    { model: 'ToDate' , component : 'datepicker' , title : 'تا تاریخ' , required: true ,col:{ cols:12 , lg:6 } },
  ]
  if(route.params.action === 'rotate'){
    array.push({ model : 'Repeatable' , component : 'checkbox' , label : 'تکرار شود' })
  }
  if(route.params.action === 'specific'){
    array.push({ model : 'WeekDays' , component : weekDaySelect , title : 'انتخاب روز هفته' , required : true })
  }

  return array
})


const submit = async (payload = {})=>{
  let url
  let body = {
    "WorkspaceCode": WID,
    "EmployeesCodes": EmployeesCodes.value,
    ...payload,
  }
  switch(action.value) {
  case 'default':
    url = 'shift/assign-default-shift'
    break
  case 'weekly' :
    url = 'shift/assign-weekly-shift'
    break
  case 'rotate':
    url = 'shift/assign-rotate-shift'
    body.ToDate = toDateForRotate.value
    body.ShiftRotateCode=form.value.ShiftRotateCode.key
    break
  case 'specific':
    url = 'shift/assign-special-shift'
    break
  default:
    url = 'shift/assign-default-shift'
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false

    form.value = {}
    router.back()

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

if(action.value === 'rotate'){
  watch(()=>form,val=>{
    if(form.value.FromDate!==undefined){
      toDateForRotate.value = $moment(form.value.FromDate).add(form.value.ShiftRotateCode.DayCount,'days')
    }
  },{ deep:true })
}
</script>
