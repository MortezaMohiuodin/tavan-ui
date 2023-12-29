<template>
  <div>
    <table-page-header :show-filter-btn="false" />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
    >
      <template #[`item.LackDelayByOverTime`]="{item}">
        <v-chip-table
          :color="item.raw.LackDelayByOverTime ? 'success':'error'"
          variant="tonal"
        >
          {{ item.raw.LackDelayByOverTime ? 'فعال':'غیر فعال' }}
        </v-chip-table>
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'عنوان',
    key: 'Title',
    align: 'start',
  },
  {
    title: 'حق مرخصی استحقاقی سالیانه',
    key: 'VacationYearlyTimeMax',
    value: val=>{
      if(!val.VacationYearlyTimeMax) return

      return `${Math.floor(val.VacationYearlyTimeMax / 60)}:${Math.floor(val.VacationYearlyTimeMax % 60)}`
    },
  },
  {
    title: 'حداکثر اضافه کاری',
    key: 'OverTimeMax',
    type: 'minute',
  },
  {
    title: 'حداکثر تعطیل کاری',
    key: 'HolidayWorkTimeMax',
    type: 'minute',
  },
  {
    title: 'حداکثر جمعه کاری',
    key: 'FridayTimeMax',
    type: 'minute',
  },
  {
    title: 'مهلت ثبت تردد فراموش شده',
    key: 'PossibleForgetIO',
    type : 'day',
  },
  {
    title: 'مهلت تایید تردد فراموش شده',
    key: 'PossibleConfirmForgetIO',
    type : 'day',
  },
  {
    title: 'همپوشانی اضافه کاری و کسری کار',
    key: 'LackDelayByOverTime',
  },
  {

    align: 'center',
    key: 'action',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "DepartmentCode":null,
    "EmployeeCode":null,
    "Page": 1,
    ...payload,
  }
  try{
    return await useHttpPost('workspacerules/get-list',{ body })
  }catch(e){
    throw new Error(e)
  }

}

const onDelete = async val=>{
  const id = val.Id
  let body = {
    "WorkspaceId": WID,
    "WorkspaceRuleId": id,
  }
  try{
    const res = await useHttpPost('workspacerules/delete',{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }
}
</script>


  <route>
  {
      meta: {
      title: "لیست قوانین کارکرد"
      }
  }
  </route>
