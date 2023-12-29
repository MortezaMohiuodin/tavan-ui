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
import departmentSelect from '@/components/common/departmentSelect.vue'
import shiftSelect from '@/components/common/shiftSelect.vue'
import weekDaySelect from '@/components/common/weekDaySelect.vue'
import FormSectionIterator from '@/components/uiKit/formSectionIterator.vue'

const router = useRouter()
const route =useRoute()

const store = useAppStore()

const form = ref({
  IsPublic : true,
  ShiftList: [],
  DepartmentIds : [],
})

const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const weekShiftSchema = computed(()=>{
  return [
    { model : 'ShiftCode' , component : shiftSelect , title: 'شیفت مورد نظر' ,col: { cols : 12 , lg : 6 } },
    { model : 'WeekDays' , component : weekDaySelect , title: 'روزهای هفته' ,col: { cols : 12, lg : 6 } },
    { model : 'DifferentInHoliday' , component : 'checkbox' , label: 'در روز تعطیل شیفت جاگزین تنظیم شود' ,col: { cols : 12 } },
    { model : 'HolidayShiftCode' , component : shiftSelect , title: 'شیفت جایگزین' ,col: { cols : 12 , lg : 6 } , condition : val=>val.DifferentInHoliday },
  ]
})


const schema = computed(()=>{
  return [
    { model : 'Title' , component : 'input' , title: 'عنوان شیفت هفتگی' ,col: { cols : 12 } , width:'320px' , required: true },
    { model : 'IsPublic' , component : 'checkbox' , label: 'شیفت عمومی می باشد' ,col: { cols : 12 } },
    { model : 'DepartmentIds' , component : departmentSelect , title: 'دپارتمان ها' ,col: { cols : 12 , lg : 3 } ,multiple:true, condition:val=>!val.IsPublic },
    { model: 'ShiftList' , component : FormSectionIterator , schema : weekShiftSchema.value ,col:{ cols:12  } },
  ]
})

const submit = async payload=>{
  let url = isEdit.value ? 'shift/edit-shift-weekly': 'shift/add-new-shift-weekly'
  let body = {
    "WorkspaceCode": store.WID,
    ...payload,
    ...(isEdit.value && { "ShiftGroupCode" : parseInt(id.value) }),
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARSAAT/basic/weekly-shift')

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

onMounted(async ()=>{
  if(isEdit.value && id.value){
    if(store.lastItem){
      form.value = store.lastItem
    }
  }
})
</script>

<route>
{
meta: {
title: "ثبت شیفت هفتگی"
}
}
</route>
