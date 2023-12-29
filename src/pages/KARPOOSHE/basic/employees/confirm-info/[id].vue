<template>
  <div>
    <table-page-data
      ref="tableRef"
      :service="rows"
      :table-schema="tableSchema"
      :items-per-page="100"
    >
      <template #[`item.action`]="{item}">
        <v-btn
          color="success"
          :variant="item.raw.status==='success'?'tonal':'outlined'"
          class="mx-3"
          @click="success(item.raw)"
        >
          تایید
        </v-btn>
        <v-btn
          color="warning"
          :variant="item.raw.status==='inProgress'?'tonal':'outlined'"
          class="mx-3"
          @click="inProgress(item.raw)"
        >
          بررسی
        </v-btn>
        <v-btn
          color="error"
          :variant="item.raw.status==='error'?'tonal':'outlined'"
          class="mx-3"
          @click="error(item.raw)"
        >
          رد
        </v-btn>
      </template>
    </table-page-data>

    <div class="tw-text-center tw-mt-10">
      <v-btn-cancel @click="$router.back()">
        انصراف
      </v-btn-cancel>
      <v-btn-success @click="finalApprove">
        تایید نهایی
      </v-btn-success>
    </div>
  </div>
</template>

<script setup>
let rows =ref([])

const tableSchema = [
  {
    title: 'عنوان',
    key: 'title',
    width: '100',
  },
  {
    title: 'مقدار قدیم',
    key: 'oldValue',
  },
  {
    title: 'مقدار جدید',
    key: 'newValue',
  },
  {
    key: 'action',
    align: 'center',
  },
]

const { WID  } = useAppStore()
const route = useRoute()
const loading = ref(false)
const router  = useRouter()

const getData = async ()=>{
  try {
    let editedInfo = await useHttpPost('/employee/get-comparison-info',{ body:{
      EmployeeCode: route.params.id,
      WorkspaceCode: WID ,
    } })
    editedInfo.Data.forEach(item => {
      rows.value.push({
        title:item.Label,
        key:item.Key,
        oldValue: item.OldValue,
        newValue: item.NewValue,
        status: 'inProgress',
      })
    })
  }catch (error){
    console.log(error)
  }
}

getData()





const success = val=>{
  val.status = 'success'
}

const inProgress = val =>{
  val.status = 'inProgress'
}

const error = val =>{
  val.status = 'error'
}

const itemValue=row=>{
  let value
  switch (row.status){
  case 'success':
    value = row.newValue
    break
  case 'inProgress':
    value = null
    break
  case 'error':
    value = row.oldValue
    break
  }

  return value
}

const finalApprove=()=>{
  let items = []
  rows.value.forEach(row => {
    if(itemValue(row)!==null)
      items.push({
        Key : row.key,
        Value : itemValue(row),
      })
  })
  loading.value = true
  try {
    useHttpPost('employee/confirm-employee-info',{
      body:{
        EmployeeCode: parseInt(route.params.id),
        Items:items,
        WorkspaceCode: WID,
      },
    })
    router.back()
  }catch (error){

  }finally {
    loading.value = false
  }

}
</script>
