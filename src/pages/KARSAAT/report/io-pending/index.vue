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
              :disabled="!item.raw.IoList?.length"
              v-bind="props"
            />
          </template>
          <v-table>
            <thead>
              <tr>
                <th class="text-center">
                  تاریخ
                </th>
                <th class="text-center">
                  ساعت
                </th>
                <th class="text-center">
                  وضعیت
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row,index) in item.raw.IoList.reverse()"
                :key="index"
              >
                <td>{{ $moment(row.Time).format('jYYYY-jMM-jDD') }}</td>
                <td>{{ $moment(row.Time).format('HH:mm') }}</td>
                <td>
                  <v-chip-table>
                    {{ (row.TemporaryStatus || row.TemporaryStatus === 0 ) && $getEnum($enums.unconfirmedIoStatus , 'key' , row.TemporaryStatus , 'value') }}
                  </v-chip-table>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-menu>
        <v-btn-table-confirm
          class="tw-mr-1"
          @click="handleConfirm(item.raw)"
        />
        <v-btn-table-trash
          class="tw-mr-1"
          @click="handleDelete(item.raw)"
        />
      </template>
    </table-page-data>
    <accept-dialog
      v-model="confirmDialog"
      :loading="confirmLoading"
      @on-confirm="submitConfirm"
    />
    <remove-dialog
      v-model="deleteDialog"
      :loading="deleteLoading"
      @on-confirm="submitDelete"
    />
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()
const confirmDialog = ref(false)
const confirmLoading = ref(false)
const deleteDialog = ref(false)
const deleteLoading = ref(false)

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
    title: 'ساعت',
    key: 'Time',
    type : 'time',
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date',
  },
  {
    title: 'وضعیت',
    key: 'TemporaryStatusLabel',
    type: 'chip',
  },
  {
    title: 'توضیحات',
    key: 'Description',
    type: 'ellipsis',
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
  let body = {
    "WorkspaceCode": WID,
    "Page": 1,
    "DepartmentCode": null,
    "QuitWorkStatus": null,
    ...filters.value,
    'EmployeeId' : filters.value.EmployeeCode,
    ...payload,
  }

  try{
    const res = await useHttpPost('InputOutput/get-employee-temporary-io',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        'Date' : val.Time,
        'TemporaryStatusLabel' :  (val.TemporaryStatus || val.TemporaryStatus === 0 ) && $getEnum($enums.unconfirmedIoStatus , 'key' , val.TemporaryStatus , 'value'),
        'Fullname':`${val.Name} ${val.Family}`,
        'Id':val.Code,
      }
    })

    return res
  }catch(e){
    throw new Error(e)
  }

}

const submitConfirm = async ()=>{
  const id = item.value.Id
  let body = {
    "WorkspaceCode": WID,
    "InputOutputCode": [id],
  }

  try{
    confirmLoading.value = true

    const res = await useHttpPost('InputOutput/confirm-employee-inputoutput',{ body })

    confirmLoading.value = false
    confirmDialog.value = false
    item.value = {}
    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }

}

const submitDelete = async ()=>{
  const id = item.value.Id
  let body = {
    "WorkspaceCode": WID,
    "InputOutputCode": [id],
  }

  try{
    deleteLoading.value = true

    const res = await useHttpPost('InputOutput/del-inputoutput-by-admin',{ body })

    deleteLoading.value = false
    deleteDialog.value = false
    item.value = {}
    tableRef.value.restart()

    return res
  }catch(e){
    throw new Error(e)
  }

}

function handleConfirm(val){
  item.value = val
  confirmDialog.value = true
}
function handleDelete(val){
  item.value = val
  deleteDialog.value = true
}
</script>


<route>
{
meta: {
title: "ترددهای تایید نشده",
depthLevelType : 1
}
}
</route>

