<template>
  <div>
    <table-page-header :show-add-item-link="false">
      <template #right>
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              color="secondary"
              prepend-icon="mdi:mdi-pencil"
              rounded="xl"
              size="large"
              variant="outlined"
              elevation="0"
              v-bind="props"
            >
              تخصیص شیفت دسته جمعی
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="$route.fullPath + '/multi-assign/default'">
              شیفت پیش فرض
            </v-list-item>
            <v-list-item :to="$route.fullPath + '/multi-assign/weekly'">
              شیفت هفتگی
            </v-list-item>
            <v-list-item :to="$route.fullPath + '/multi-assign/rotate'">
              شیفت دوره ای
            </v-list-item>
            <v-list-item :to="$route.fullPath + '/multi-assign/specific'">
              شیفت اختصاصی
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              class="tw-mr-2 inherit"
              color="secondary"
              prepend-icon="fa-regular fa-trash-can"
              rounded="xl"
              size="large"
              variant="outlined"
              elevation="0"
              v-bind="props"
            >
              حذف شیفت دسته جمعی
            </v-btn>
          </template>
          <v-list>
            <v-list-item :to="$route.fullPath + '/multi-remove/default'">
              شیفت پیش فرض
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </table-page-header>
    <table-page-filter
      :filters="filterSchema"
      :loading="tableRef?.isLoading"
      @submit="(newFilters)=>tableRef.restart(newFilters)"
    />
    <table-page-data
      ref="tableRef"
      :service="service"
      :table-schema="tableSchema"
      @on-edit="val=>$router.push($route.fullPath + '/edit/' + val.Id)"
    />
  </div>
</template>

<script setup>
const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const { WID } = useAppStore()

const filterSchema = ['user',
  'department',
  'userStatus']

const tableSchema = [
  {
    title: '#',
    key: 'Id',
    align: 'start',
    width: '80px',
  },
  {
    title: 'نام کارمند',
    key: 'Fullname',
    align: 'start',
    type: 'withAvatar',
    value :val=> `${val.Name} ${val.Family}`,
  },
  {
    title: 'َشیفت پیش فرض',
    key: 'DefaultShift',
    type:'boolean',
  },
  {
    title: 'شیفت هفتگی',
    key: 'WeeklyShift',
    type : 'boolean',
  },
  {
    title: 'شیفت دوره ای',
    key: 'RotatingShift',
    type : 'boolean',
  },
  {
    title: 'شیفت اختصاصی',
    key: 'SpecialShift',
    type : 'boolean',
  },
  {

    align: 'center',
    key: 'action',
    actions : ['edit'],
  },
  {
    key: 'mobile',
    id: "Id",
    heading : val=> `${val.Name} ${val.Family}`,
    subHeading : val=>val.Name,
  },
]


const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode":WID,
    "Page":1,
    "FromDate":"",
    "StartDate":"",
    "EndDate":"",
    "WorkspaceEmployeeCode":null,
    "DefaultShiftCode":null,
    "DepartmentCode":null,
    "EmployeeCode":null,
    ...payload,
  }
  try{
    const res = await useHttpPost('shift/get-workspace-assignment-shift',{ body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        Id : val.EmployeeCode,
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
            title: "تخصیص شیفت به همکار"
            }
        }
        </route>
