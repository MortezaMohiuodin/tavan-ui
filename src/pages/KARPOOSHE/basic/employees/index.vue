<template>
  <div>
    <table-page-header :show-add-item-link="permits.includes('UserManager')">
      <template #right>
        <v-btn-excel
          v-if="permits.includes('ShowKarposheReport')"
          :disabled="!activePlugins.includes('ExcelExport')"
          :loading="excelLoading"
          @click="getExcel"
        />
      </template>
    </table-page-header>
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
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
      @on-view="val=>activateViewItem(val)"
    >
      <template #[`item.Status`]="{item}">
        <div class="tw-grid tw-justify-center">
          <v-menu-confirm
            :loading="statusLoading"
            :message="`
            تغییر وضعیت
           ${item.raw.FullName}
             `"
            on-confirm-text="فعال"
            on-cancel-text="غیر فعال"
            @on-confirm="updateStatus(item.raw.EmployeesCode,0 )"
            @on-cancel="updateStatus(item.raw.EmployeesCode, 1)"
          >
            <template #activator="{props}">
              <v-btn
                :color="!item.raw.Status?'success':'gray'"
                variant="tonal"
                rounded="xl"
                v-bind="props"
              >
                {{ !item.raw.Status?
                  'فعال'
                  :
                  'غیر فعال'
                }}
              </v-btn>
            </template>
          </v-menu-confirm>
        </div>
      </template>
      <template #[`item.IsEdited`]="{item}">
        <v-btn
          v-if="item.raw.IsEdited"
          color="gray"
          variant="plain"
          size="small"
          icon="fa fa-edit"
          density="compact"
          :to="$route.fullPath + '/confirm-info/' + item.raw.Id"
        />
      </template>
      <template #[`item.action`]="{item}">
        <div
          v-if="smAndDown"
          class="tw-grid tw-justify-center"
        >
          <v-menu-confirm
            :loading="statusLoading"
            :message="`
            تغییر وضعیت
           ${item.raw.FullName}
             `"
            on-confirm-text="فعال"
            on-cancel-text="غیر فعال"
            @on-confirm="updateStatus(item.raw.EmployeesCode,0 )"
            @on-cancel="updateStatus(item.raw.EmployeesCode, 1)"
          >
            <template #activator="{props}">
              <v-btn
                :color="!item.raw.Status?'success':'gray'"
                variant="tonal"
                rounded="xl"
                v-bind="props"
              >
                {{ !item.raw.Status?
                  'فعال'
                  :
                  'غیر فعال'
                }}
              </v-btn>
            </template>
          </v-menu-confirm>
        </div>
        <v-btn-table-mobile
          v-if="item.raw.IsEdited && smAndDown"
          icon="fa fa-edit"
          class="tw-mr-2"
          :to="$route.fullPath + '/confirm-info/' + item.raw.Id"
        />
      </template>
    </table-page-data>
    <v-dialog-extend
      v-model="showViewItem"
      desktop-mode="drawer"
      append="body"
      :persistant="false"
    >
      <user-detail
        :item="item"
        :exit="false"
        :edit="false"
      />
    </v-dialog-extend>
    <remove-dialog
      v-model="trashModal"
      :loading="deleteLoading"
      @on-confirm="onDelete"
      @on-cancel="trashModal = false"
    />
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { WID,permits,activePlugins } = useAppStore()
const store = useAppStore()
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const statusLoading = ref(false)
const excelLoading = ref(false)
const trashModal = ref(false)
const deleteLoading = ref(false)
const { smAndDown } = useDisplay()
const  router  = useRouter()
const route = useRoute()
// code related to filter
const filters = ref({})

const filterSchema = [
  'quitWork',
  'department'
  ,'user',
  'manager',
  { key:'IsEdited', type : 'select' , items : $enums.isEdited , label : 'درخواست ها' },
  'userStatus',
]

//code related to table

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '30px',
  },
  {
    title: 'نام و نام خانوادگی',
    align: 'start',
    key: 'FullName',
    type:'withAvatar',
    width: '180px',
  },
  {
    title: 'تاریخ ورود',
    key: 'StartDate',
    type : 'date',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitWorkDate',
    type:'date',
  },
  {
    title: 'کد پرسنلی',
    key: 'OrgPositionCode',
  },
  {
    title: 'نام کاربری',
    key: 'Username',
  },
  {
    title: 'دپارتمان',
    key: 'Department',
    type : 'chipGroup',
    value : val=>(val.Department?.map(val=>val.Title)),
  },
  {
    title: 'مدیر',
    key: 'Boss',
    type : 'chipGroup',
    typeProps:{
      color: 'primary',
    },
    value : val=>(val.Department?.map(val=>val.BossName)),
  },
  {
    title: 'وضعیت',
    key: 'Status',
    width: '150px',
  },
  {
    title: 'درخواست تغییر',
    key: 'IsEdited',
  },
  {
    align: 'center',
    key: 'action',
    actions :
      [
        { icon:'fa-regular fa-trash-can',label:'حذف', color:'k_white-800', disabledCondition : item=>!item.Status, emit : val=>handleDeleteConfirm(val) },
        { icon:'fa fa-pen',label:`${permits.includes('UserManager')?'ویرایش':'دسترسی ندارید'}`, color:'k_white-800', disabledCondition : item=> !permits.includes('UserManager'), emit : val=>router.push(route.fullPath + '/edit/' + val.Id) },
        'view',
      ],
  },
  {
    key: 'mobile',
    heading: val=>(val.Name+' ' + val.Family) ,
    subHeading: val=>val.Id,
    more: val=>val.StartDate && $moment(val.StartDate).format('jYYYY/jM/jD'),
  },
]

const handleDeleteConfirm = val=>{
  item.value = val
  trashModal.value = true
}

const onDelete = async()=>{
  if(!item.value) return
  if(!item.value.Status) {
    useSnackbar('تنها کاربران غیرفعال قالبیت حذف دارند','error')

    return
  }
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode" : item.value.EmployeesCode,
    // Status 2 equals delete status
    "Status" :  2,
  }
  try{
    deleteLoading.value = true

    const res = await useHttpPost('employee/set-employee-status',{ body  })

    deleteLoading.value = false
    trashModal.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    deleteLoading.value = false
    throw new Error(e)
  }
}

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const updateStatus = async (id,status)=>{
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode" : id,
    "Status" :  status,
  }
  try{
    statusLoading.value = true

    const res = await useHttpPost('employee/set-employee-status',{ body  })

    statusLoading.value = false
    tableRef.value.restart()

    return res
  }catch(e){
    statusLoading.value = false
    throw new Error(e)
  }
}

//code related to excell btn
async function getExcel(){
  let params ={
    "WorkspaceCode": WID,
    ...filters.value,
  }
  excelLoading.value = true
  try {
    const res = await useHttpExcel('employee/get-all-workspace-employee-excel',{ params })

    excelLoading.value = false

    return res
  }catch(e){
    excelLoading.value = false
    throw new Error(e)
  }
}

const service = async val=>{
  let body = {
    "WorkspaceCode": WID,
    "Status": null,
    "EmployeeCode": null,
    "DepartmentCode": null,
    "IsEdited": 2,
    "QuitWorkStatus": null,
    "BossId": null,
    ...filters.value,
    ...val,
  }
  try{
    const res = await useHttpPost('employee/v2/get-all-workspace-employee',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        FullName : `${val.Name} ${val.Family}`,
        Id : val.EmployeesCode,
        Department : val.Department.map(v=>({ ...v,value: v.Title , key:v.Id })),
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
      title: "لیست همکاران"
    }
  }
</route>
