<template>
  <table-page-header />

  <table-page-data
    ref="tableRef"
    :service="service"
    :table-schema="tableSchema"
  />
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
    title: 'نقض',
    key: 'role',
  },
  {
    title: 'احراز شده',
    key: 'verified',
  },
  {
    title: 'موبایل',
    key: 'phone',
  },
  {
    title: 'تاریخ ثبت',
    key: 'createdAt',
  },
  {
    key: 'action',
    align: 'center',
    actions: [],
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

    res['Data'] = res.docs
    res['TotalRow'] = res.totalDocs

    return res
  } catch (e) {
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
  