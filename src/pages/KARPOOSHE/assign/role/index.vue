<template>
  <div>
    <table-page-header
      add-item-text="تخصیص مجوز به چندین همکار"
      add-modal
      @on-add="val=>$router.push('/KARPOOSHE/assign/role/add/new')"
    />
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
    >
      <template #[`item.RoleName`]="{item}">
        <v-chip-table
          v-if="item.raw.Owner"
          :text="item.raw.RoleName"
          variant="elevated"
        >
          <template #prepend>
            <v-icon
              icon="fa fa-star"
              size="17"
              class="tw-ml-2 tw-mb-1"
            />
          </template>
        </v-chip-table>
        <v-chip-table
          v-else
          :text="item.raw.RoleName"
          variant="tonal"
        />
      </template>
    </table-page-data>
    <v-dialog-extend
      v-model="addModal"
      title="تخصیص مجوز"
      color="success"
      :loading="loadingDialog"
    >
      <v-form-extend
        v-model="form"
        :schema="schema"
        :loading="loadingDialog"
        @on-submit="editRole"
        @on-cancel="addModal=false"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
//table section code
import { getAllWorkSpaceEmployee as service } from '@/services'

const filterSchema = ['user',
  'department',
  'role',
  'userStatus']

const tableRef = ref(null)

const tableSchema =  [
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
    type : 'number',
  },
  {
    title: 'دسترسی',
    key: 'RoleName',
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
import roleSelect from '@/components/common/roleSelect.vue'
import { useHttpPost } from '@/composables/useHttpPost'

const form = ref({ RoleCode:null })
const { WID } = useAppStore()
let employeeCode = ref(null)
let loadingDialog = ref(false)
const addModal = ref(false)

const showEditModal = row =>{
  addModal.value = true
  form.value.RoleCode = row.RoleId
  employeeCode.value = [row.EmployeesCode]
}

const editRole =async () =>{
  loadingDialog.value = true
  try {
    await useHttpPost('/role/assign-role-employee',{ body:{ ...form.value,EmployeeCode: employeeCode.value,WorkspaceCode:WID } })
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
    { model: 'RoleCode' , component : roleSelect , title : 'انتخاب دسترسی', col:{ cols:12 }  },
  ]
})
</script>

<route>
  {
    meta: {
      title: "اختصاص مجوز به همکاران"
    }
 }
</route>
