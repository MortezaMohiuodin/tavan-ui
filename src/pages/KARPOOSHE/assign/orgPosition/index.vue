<template>
  <div>
    <table-page-header @on-add="val=>$router.push('/KARPOOSHE/assign/orgPosition/add/new')" />
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      @on-edit="showEditModal"
    />
    <v-dialog-extend
      v-model="addModal"
      title="تخصیص پست سازمانی"
      color="success"
      :loading="loadingDialog"
    >
      <v-form-extend
        v-model="form"
        :schema="schema"
        :with-card="false"
        :loading="loadingDialog"
        @on-submit="editRole"
        @on-cancel="addModal=false"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
import { getAllWorkSpaceEmployee as service } from '@/services'

const filterSchema = ['user',
  'department',
  'orgPosition',
  'userStatus']

const tableRef = ref(null)

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    width: '100',
  },
  {
    title: 'نام و نام خانوادگی',
    align : 'start',
    key: 'FullName',
    width: '240px',
    type:'withAvatar',
  },
  {
    title: 'موبایل',
    key: 'Mobile',
    width: '180px',
    type:'number',
  },
  {
    title: 'پست سازمانی',
    key: 'OrgPositionTitle',
    type: 'chip',
  },
  {

    key: 'action',
    align: 'center',
    actions:['edit'],
  },
  {
    key:'mobile',
    heading : val=>val.FullName,
  },
]

// edit modal code
import positionSelect from '@/components/common/positionSelect.vue'
import VFormExtend from '@/components/uiKit/vFormExtend.vue'

const form = ref({ OrgPositionCode:null })
const { WID } = useAppStore()
let employeeCode = ref(null)
let loadingDialog = ref(false)
const addModal = ref(false)

const showEditModal = row =>{
  addModal.value = true
  form.value.OrgPositionCode = row.OrgPositionCode
  employeeCode.value = [row.EmployeesCode]
}

const editRole =async () =>{
  loadingDialog.value = true
  try {
    await useHttpPost('/org-position/set-employee-org-position',{ body:{ ...form.value,EmployeeCodes: employeeCode.value,WorkspaceCode:WID } })
    addModal.value = false
    tableRef.value.restart()
  }catch (error){
    console.log(error)
  }finally {
    loadingDialog.value = false
  }
}

const schema = computed(()=>{
  return [
    { model: 'OrgPositionCode' , component : positionSelect , title : 'انتخاب پست', col:{ cols:12 }  },
  ]
})
</script>

<route>
  {
    meta: {
      title: "اختصاص پست سازمانی"
    }
 }
</route>
