<template>
  <form-page-header :title="`تخصیص شیفت به ${employee.Name} ${employee.Family}`" />
  <default-form
    v-model="defaultShifts"
    :loading="loading"
    @on-update="getAssignedShifts"
  />
  <weekly-form
    v-model="weeklyShifts"
    class="tw-mt-7"
    :loading="loading"
    @on-update="getAssignedShifts"
  />
  <rotate-form
    v-model="rotatingShifts"
    class="tw-mt-7"
    :loading="loading"
    @on-update="getAssignedShifts"
  />
  <special-form
    v-model="specialShifts"
    class="tw-mt-7"
    :loading="loading"
    @on-update="getAssignedShifts"
  />
  <default-absent-form
    v-model="absentDefault"
    class="tw-mt-7"
    :loading="loading"
    @on-update="getAssignedShifts"
  />
  <v-divider-extend>
    ارسال اعلان
  </v-divider-extend>
  <v-btn
    class="tw-mt-3"
    color="primary"
    size="large"
    prepend-icon="mdi:mdi-alarm"
    elevation="0"
    :disabled="alertLoading"
    :loading="alertLoading"
    @click="sendShiftAlert"
  >
    ارسال اعلان تغییر شیفت
  </v-btn>
</template>

<script setup>
const route = useRoute()
const { WID } = useAppStore()
const loading = ref(false)
const form = ref([])
const id =  computed(()=>route.params.id)
const defaultShifts = ref([])
const rotatingShifts = ref([])
const weeklyShifts = ref([])
const specialShifts =ref([])
const absentDefault = ref({})
const alertLoading = ref(false)
const employees = ref([])

const getAssignedShifts = async()=>{
  let url = 'shift/get-employee-assignment-shift'
  let body = {
    "Code":id.value,
    "WorkspaceCode" :  WID,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    defaultShifts.value = res.Data.DefaultShift.map(val=>({ ...val, edit: false , ShiftDefaultCode : val.ShiftCode }))
    rotatingShifts.value = res.Data.RotatingShift.map(val=>({ ...val, edit: false ,ShiftRotateCode : val.RotatingShiftCode }))
    weeklyShifts.value = res.Data.WeeklyShift.map(val=>({ ...val, edit: false ,ShiftWeeklyCode : val.WeeklyShiftCode    }))
    specialShifts.value = res.Data.SpecialShift.map(val=>({ ...val, edit: false , ShiftDefaultCode :val.ShiftCode }))
    absentDefault.value = res.Data.AbsentCode ? [{ AbsentCode : res.Data.AbsentCode , edit: false , AssignCode: 123 }] : []
    loading.value = false

    form.value = res.Data.DefaultShift

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const employee = ref({})

const sendShiftAlert = async()=>{
  const body = {
    EmployeeId : id.value,
    WorkspaceId : WID,
  }

  try{
    alertLoading.value = true

    const res = useHttpPost('shift/alert',{ body })

    setTimeout(() => {
      alertLoading.value = false
    }, 1000)

  }catch(e){
    alertLoading.value = false
    console.log(e)
  }
}


onMounted(async ()=>{
  await getAssignedShifts()

  const res = await getEmployees()

  employees.value = res.Data
  employee.value =  employees.value.find(val=> val.EmployeesCode == id.value)
})

const getEmployees = async()=>{
  const body  = {
    workspaceCode :WID ,
    Status: null,
    DepthLevelType: null,
  }

  try{
    return await useHttpPost('employee/get-all',{ body })
  }catch(e){
    console.log(e)
  }
}
</script>
