<template>
  <div>
    <table-page-header :show-add-item-link="false" />
    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
    >
      <template #[`item.action`]="{item}">
        <v-menu location="right">
          <template #activator="{ props }">
            <v-btn-table-history
              :disabled="!item.raw.EnterExitList?.length"
              v-bind="props"
            />
          </template>
          <v-table>
            <thead>
              <tr>
                <th class="text-center">
                  ردیف
                </th>
                <th class="text-center">
                  ورود
                </th>
                <th class="text-center">
                  خروج
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row,index) in item.raw.EnterExitList"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ row.Enter }}</td>
                <td>{{ row.Exit }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-menu>
        <v-btn-table
          class="tw-mr-1"
          icon="mdi:mdi-link"
          disabled
          color="k_white-800"
        />
      </template>
    </table-page-data>
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const filterSchema = [
  'fromDate',
  'toDate',
  'user',
  'department',
  'quitWork',
  'userStatus',
]

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
})

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    key: 'Fullname',
    align: 'start',
    type : 'withAvatar',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitWorkDate',
    type : 'date',
  },
  {
    title: 'تاریخ',
    key: 'Date',
  },
  {
    title: 'ورود اول',
    key: 'FirstIn',
  },
  {
    title: 'خروج اول',
    key: 'FirstOut',
  },
  {
    title: 'ورود دوم',
    key: 'SecondIn',
  },
  {
    title: 'خروج دوم',
    key: 'SecondOut',
  },
  {
    title: 'ورود سوم',
    key: 'ThirdIn',
  },
  {
    title: 'خروج سوم',
    key: 'ThirdOut',
  },
  {

    align: 'center',
    key: 'action',
  },
  {
    key:'mobile',
    heading : val=>val.Fullname,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body ={
    "WorkspaceCode": WID,
    "EmployeesCode": null,
    "Page": 1,
    "DepartmentCode": null,
    ...filters.value,
    ...payload,
  }

  try{
    const res = await useHttpPost('InputOutput/get-employee-io',{ body })

    res.Data = res.Data.map(val=>{
      let EnterExitList = val.EnterExitList.filter(val=>val.Enter && val.Exit)

      return {
        ...val,
        'Fullname':`${val.Name} ${val.Family}`,
        'Id':val.EmployeeId,
        'FirstIn' : val.EnterExitList[0] && val.EnterExitList[0]?.Enter,
        'FirstOut' : val.EnterExitList[0] && val.EnterExitList[0]?.Exit,
        'SecondIn' : val.EnterExitList[1] && val.EnterExitList[1]?.Enter,
        'SecondOut' :val.EnterExitList[1] &&  val.EnterExitList[1]?.Exit,
        'ThirdIn' :val.EnterExitList[2] &&  val.EnterExitList[2]?.Enter,
        'ThirdOut' :val.EnterExitList[2] &&  val.EnterExitList[2]?.Exit,
        'EnterExitList' : EnterExitList,
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }

}
</script>


<route>
{
meta: {
title: "ترددهای اخیر همکاران",
depthLevelType : 1
}
}
</route>

