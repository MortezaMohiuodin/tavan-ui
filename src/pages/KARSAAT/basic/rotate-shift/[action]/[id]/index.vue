<template>
  <div>
    <form-page-header />
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
import FormSectionIterator from '@/components/uiKit/formSectionIterator.vue'
import ShiftSelect from '@/components/common/shiftSelect.vue'
import departmentSelect from '@/components/common/departmentSelect.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  IsPublic: true,
  RotateShiftList : [],
})

const loading = ref(false)

const rotateShiftSchema = computed(()=>{
  return [
    { model:'FromDay', component : 'input', title : 'شروع دوره - از روز' , col:{ cols:12,md:6,lg:2 },disabled:false },
    { model:'ToDay', component : 'input', title : 'پایان دوره - تا روز',col:{ cols:12,md:6,lg:2 },disabled:false },
    { model:'IsShiftRest', component : 'checkbox',  label : 'در این دوره استراحت کند' ,col:{ cols:12,md:6,lg:2 },disabled:false },
    { model:'ShiftCode', component : ShiftSelect, title : 'شیفت مورد نظر' ,col:{ cols:12,md:6,lg:2 } , condition: val=>!val.IsShiftRest,disabled:false   },
    { model:'DifferentInHoliday', component : 'checkbox',  label : 'در روز تعطیل شیفت جایگزین تنظیم شود' ,col:{ cols:12,md:6,lg:3 } , condition: val=>!val.IsShiftRest,disabled:false  },
    { model:'HolidayShiftCode', component : ShiftSelect, title : 'شیفت جایگزین' ,col:{ cols:12,md:6,lg:3 } , condition: val=>!val.IsShiftRest && val.DifferentInHoliday,disabled:false   },
  ]
})

const schema = computed(()=>{
  return [
    { model:'Title', component : 'input', title : 'عنوان شیفت دوره ای' , col:{ cols:12,md:6,lg:2 } , required: true },
    { model:'DayCount', component : 'input', title : 'طول دوره (روز)',col:{ cols:12,md:6,lg:2 } , required:true },
    { model:'MinTime', component : 'datepicker',type:'time', title : 'حداقل نوبت کاری' , initialValue : '00:00' ,col:{ cols:12,md:6,lg:2 } },
    { model:'MaxTime', component : 'datepicker',type:'time', title : 'حداکثر نوبت کاری' , initialValue : '08:00' ,col:{ cols:12,md:6,lg:2 } },
    { model:'RotateWorkType', component : 'select', title : 'تعیین نوع دوره',items:$enums.rotateWorkType,col:{ cols:12,md:6,lg:4 } },
    { model:'IsPublic', component : 'checkbox', label : 'شیفت عمومی باشد',col:{ cols:12 } },
    { model:'DepartmentIds', component : departmentSelect, title : 'انتخاب دپارتمان',col:{ cols:12 ,lg: 3 } ,multiple: true, visible : val=>!val.IsPublic  },
    { model: 'RotateShiftList' , component : FormSectionIterator , schema : rotateShiftSchema.value ,col:{ cols:12  } },
  ]
})

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const submit = async (payload = {})=>{
  let url = isEdit.value ? 'shift/edit-rotate-shift': 'shift/add-new-rotate-shift'
  let id = 0
  let body = {
    "WorkspaceCode": store.WID,
    "RotateWorkType" : payload.RotateWorkType,
    "Title" : payload.Title,
    "DayCount" : payload.DayCount,
    "IsPublic" : payload.IsPublic,
    "MaxTime" : payload.MaxTime,
    "MinTime" : payload.MinTime,
    "DepartmentIds" : payload.DepartmentIds || [],
    "RotateShiftCode" : payload.Code,
    "RotateShiftList" : payload.RotateShiftList.map(val=>{
      id = id + 1

      return {
        DifferentInHoliday : !!val.DifferentInHoliday,
        FromDay : val.FromDay,
        ToDay : val.ToDay,
        ShiftCode : val.ShiftCode,
        IsShiftRest : !!val.IsShiftRest,
        id :id,
        HolidayShiftCode : val.HolidayShiftCode || '',
      }
    }),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/basic/rotate-shift')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}



onMounted(async ()=>{
  if(isEdit.value && id.value){
    if(store.lastItem){
      form.value = {
        ...store.lastItem,
        "ShiftDurationTitle" : store.lastItem.Title,
        "RotateShiftList" : store.lastItem.ShiftList.map(val=>{
          return {
            ...val,
            "Code" : val.ShiftId,
            "ShiftCode" : val.ShiftId,
            "HolidayShiftCode" : val.HolidayShiftId,
          }
        }),
      }
    }
  }
})
</script>

<route>
{
meta: {
title: "شیفت دوره ای"
}
}
</route>
