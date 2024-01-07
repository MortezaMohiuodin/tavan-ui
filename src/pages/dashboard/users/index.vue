<template>
  <table-page-header :show-filter-btn="false" />

  <table-page-data
    ref="tableRef"
    :service="service"
    :table-schema="tableSchema"
    :on-delete="onDelete"
    @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.id)"
  >
    <template #[`item.role`]="{item}">
      <v-chip
        rounded
        variant="tonal"
        color="info"
      >
        {{ $getEnum($enums.role,'key',item.role,'value') }} 
      </v-chip>
    </template>
  </table-page-data>
</template>
  
<script setup>
const tableRef = ref()

const tableSchema = [
  {
    title: 'نام',
    key: 'name',
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'نقش',
    key: 'role',
  },
  {
    title: 'احراز شده',
    key: 'verified',
    type : 'boolean',
  },
  {
    title: 'موبایل',
    key: 'phone',
  },
  {
    title: 'تاریخ ثبت',
    key: 'createdAt',
    type: 'date',
  },
  {
    key: 'action',
    align: 'center',
    actions: ['edit','delete'],
  },
]


const service = async (payload = {}) => {
  try {
    const params = {
      // filter: null,
      // fields: ['name', 'email'],
      page: 1,
      limit: 10,
      // sort: 'name',
      // order: -1,
    }

    const res = await useHttpGet('/users', { params })

    res['Data'] = res.docs.map(val=>({ ...val,id : val._id }))
    res['TotalRow'] = res.totalDocs

    return res
  } catch (e) {
    throw new Error(e)
  }
}

const onDelete = async val=>{
  const id = val.id

  try{
    const res = await useHttpGet(`users/${id}`,{ method:'DELETE' })

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
          title: "لیست کاربران"
        }
      }
    </route>
  