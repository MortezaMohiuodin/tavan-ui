<template>
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
    :on-delete="onDelete"
  >
    <template #[`item.EmojiType`]="{item}">
      <v-avatar
        :size="30"
        :image="getEmoji(item.raw.EmojiType)"
      />
    </template>
    <template #[`item.action`]="{item}">
      <v-btn-table
        v-tooltip="'توضیحات'"
        :disabled="!item.raw.Description"
        icon="mdi:mdi-emoticon-outline"
        @click="singleItem = item.raw; showDescDialog = true"
      />
    </template>
  </table-page-data>
  <v-dialog-extend
    v-model="showDescDialog"
    width="400"
    color="primary"
    title="توضیحات"
  >
    <v-divider class="tw-mt-2" />
    <div class="tw-text-slate-600 tw-font-YEKAN-BAKH-MEDIUM tw-mt-4 tw-min-h-[80px]">
      {{ singleItem.Description }}
    </div>
  </v-dialog-extend>
</template>

<script setup>
import pokerFace from '@/assets/images/pokerFace.png'
import sadFace from '@/assets/images/sadFace.png'
import smileyFace from '@/assets/images/smileyFace.png'
import happyFace from '@/assets/images/happyFace.png'
import angryFace from '@/assets/images/angryFace.png'

const emojis = ref([angryFace,sadFace,pokerFace,smileyFace,happyFace])

const getEmoji = emojiType=>{
  return emojis.value.find((val,index)=> index === emojiType)
}

const tableRef = ref()
const { WID } = useAppStore()
const deleteLoading = ref(false)
const showDescDialog = ref(false)

const filters = ref({
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),

})

const singleItem = ref({})

const onDelete = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "Id" : payload.Id,
  }

  deleteLoading.value = true
  try{
    let url = 'MoodCondition/remove'
    const res = await useHttpPost(url,{ body })

    tableRef.value.restart()

    return res
  }catch(e){
    deleteLoading.value = false
    console.log(e)
  }finally {
    deleteLoading.value = false
  }
}

const filterSchema = [
  'fromDate',
  'toDate',
  { key : 'EmojiType' , component : 'select' , items: $enums.moodConditon, label : 'وضعیت' },
  { key : 'Description' , type : 'input', label : 'توضیحات' },
  'userStatus',
  'department',
  'user',
]

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام و نام خانوادگی',
    key: 'FullName',
    type : 'withAvatar',
    align: 'start',
  },
  {
    title: 'وضعیت',
    key: 'EmojiType',
  },
  {
    title: 'توضیحات',
    key: 'Description',
    type : 'ellipsis',
    width: '200px',
  },
  {
    title: 'تاریخ',
    key: 'CreateAt',
    type : 'datetime',
  },
  {
    key: 'action',
    align: 'center',
    actions:['delete'],
  },
  {
    key:'mobile',
    heading : val=>val.EmojiType,
  },
]

const service = async (payload = {})=>{
  let body = {
    "WorkspaceId": WID,
    "WorkspaceEmployeeId":payload.EmployeeCode,
    "DepartmentId": payload.DepartmentCode,
    Page:payload.Page,
    "EmojiType": payload.EmojiType,
    FromDate:payload.FromDate,
    ToDate:payload.ToDate,
    Description: payload.Description,
  }
  try{
    const res =  await useHttpPost('/MoodCondition/get-list',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        FullName : `${val.Name} ${val.Family}`,
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
title: "ارزیابی وضعیت کارمند"
}
}
</route>
