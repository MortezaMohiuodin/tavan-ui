<template>
  <div>
    <table-page-header />
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      :on-delete="onDelete"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
    />
  </div>
</template>

<script setup>
import { getWorkspaceDepartments as service } from "@/services"

const tableRef = ref()
const { WID } = useAppStore()
const filterSchema = ['department','user']

const tableSchema = [
  {
    title: '#',
    key: 'DepartmentCode',
    width: '100px',
  },
  {
    title: 'نام دپارتمان',
    align : 'start',
    key: 'Title',
    type: 'bold',
    width: '180px',
  },
  {
    title: 'دپارتمان والد',
    key: 'ParentTitle',
    type: 'caption',
  },
  {
    title: 'سرپرست دپارتمان',
    key: 'DepartmentBoosName',
    type: 'chip',
  },
  {
    title: 'توضیحات',
    key: 'Description',
    width: 'auto',
    type: 'ellipsis',
  },
  {

    key: 'action',
    align: 'center',
    actions:['edit','delete'],
  },
  {
    key:'mobile',
    heading : val=>val.Title,
  },
]

const onDelete = async val=>{
  const id = val.Id

  let body = {
    "WorkspaceCode": WID,
    "DepartmentCode": id,
  }
  try{
    const res = await useHttpPost('department/delete-department',{ body })

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
        title: "لیست دپارتمان ها"
      }
    }
  </route>
