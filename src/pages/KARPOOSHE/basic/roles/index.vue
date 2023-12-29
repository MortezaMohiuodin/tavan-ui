<template>
  <div>
    <table-page-header
      :show-filter-btn="false"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Code)"
    />
  </div>
</template>

<script setup>
import { getWorkspaceRoles as service } from '@/services'

const store = useAppStore()

const tableRef = ref(null)

const tableSchema = [
  {
    title: '#',
    align : 'start',
    key: 'Code',
    width: '70px',
  },
  {
    title: 'نام دسترسی',
    align : 'start',
    key: 'Title',
    width: '150px',
  },
  {
    title: 'دسترسی ها',
    align : 'start',
    type: 'chipGroup',
    typeProps : {
      elevation:"0",
      size: 'small',
      style:"border:1px solid #e3e1e1;",
      class:"tw-mx-1 tw-my-2 hover:tw-scale-125 hover:tw-z-10 tw-transition-transform hover:!tw-bg-success hover:!tw-text-white",
    },
    key: 'Permission',
  },
  {

    key: 'action',
    align: 'center',
    actions : ['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

const onDelete = async val=>{

  const id = val.Code
  let body = {
    "WorkspaceCode": store.WID,
    "RoleCode": id,
  }
  try{
    const res = await useHttpPost('role/remove-role',{ body })

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
      title: "مدیریت دسترسی ها"
    }
  }
</route>
