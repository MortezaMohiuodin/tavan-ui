<template>
  <keep-alive>
    <v-expand-transition>
      <component
        :is="smAndDown ? VDialogExtend : 'v-card-default'"
        v-show="showFilter"
        v-model="showFilter"
        v-bind="compProps"
        :title="smAndDown ? 'فیلترها' : null"
      >
        <v-form
          autocomplete="off"
          @submit.prevent="applyFilter"
        >
          <div class="tw-flex tw-flex-col md:tw-flex-row md:tw-flex-wrap tw-gap-2">
            <div
              v-for="(filter, index) in filterArray"
              v-bind="columnProps"
              :key="index"
              style="min-width:250px"
            >
              <template v-if="typeof filter === 'string' && filter === 'department'">
                <label
                  for="filter-departmentCode"
                  class="fieldLabel"
                >انتخاب دپارتمان</label>
                <v-select-extend
                  id="filter-departmentCode"
                  v-model="value.DepartmentCode"
                  name="department"
                  url="department/get-workspace-department"
                  method="get"
                  :params="{ WorkspaceCode : store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val?.DepartmentCode , 'value' : val?.Title }))"
                />
              </template>
              <template v-if="typeof filter === 'string' && filter === 'quitWork'">
                <label
                  for="filter-quitWork"
                  class="fieldLabel"
                >تاریخ ترک کار</label>
                <v-select-extend
                  id="filter-quitWork"
                  v-model="value.QuitWorkStatus"
                  name="quitWork"
                  :items="$enums.quitWork"
                  multiple
                />
              </template>
              <template v-if="typeof filter === 'string' && filter === 'absentStatus'">
                <label
                  for="filter-absentStatus"
                  class="fieldLabel"
                >وضعیت</label>
                <v-select-extend
                  id="filter-absentStatus"
                  v-model="value.AbsentStatus"
                  :items="$enums.replyStatus"
                  multiple
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'user'">
                <label
                  for="filter-employee"
                  class="fieldLabel"
                >انتخاب کاربر</label>
                <v-select-extend
                  id="filter-employee"
                  v-model="value.EmployeeCode"
                  name="user"
                  url="employee/get-all"
                  method="post"
                  :params="{ WorkspaceCode :store.WID ,Status: null,DepthLevelType: DepthLevelType }"
                  :res-callback="data=> data.map(val=>({ 'key' : val.EmployeesCode,'value' : `${val.Name} ${val.Family}` }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'manager'">
                <label
                  for="filter-manager"
                  class="fieldLabel"
                >انتخاب مدیر</label>
                <v-select-extend
                  id="filter-manager"
                  v-model="value.BossId"
                  url="employee/get-all"
                  method="post"
                  :params="{ WorkspaceCode :store.WID ,Status: null,DepthLevelType: null }"
                  :res-callback="data=> data.map(val=>({ 'key' : val.EmployeesCode,'value' : `${val.Name} ${val.Family}` }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'workspaceRules'">
                <label
                  for="filter-workspace-rules"
                  class="fieldLabel"
                >انتخاب قانون کارکرد</label>
                <v-select-extend
                  id="filter-workspace-rules"
                  v-model="value.WorkspaceRuleId"
                  url="workspacerules/get-list"
                  method="post"
                  :params="{ WorkspaceId :store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val.Id,'value' : val.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'year'">
                <label
                  for="filter-year"
                  class="fieldLabel"
                >سال</label>
                <v-select-extend
                  id="filter-year"
                  v-model="value.Year"
                  :items="getYears()"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'role'">
                <label
                  for="filter-roles"
                  class="fieldLabel"
                >دسترسی</label>
                <v-select-extend
                  id="filter-roles"
                  v-model="value.RoleCode"
                  url="role/get-workspace-role"
                  method="get"
                  :params="{ WorkspaceCode :store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val.Code,'value' : val.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'shift'">
                <label
                  for="filter-shift-type"
                  class="fieldLabel"
                >نوع شیفت</label>
                <v-select-extend
                  id="filter-shift-type"
                  v-model="value.ShiftCode"
                  url="shift/get-workspace-shift"
                  method="post"
                  :params="{ WorkspaceCode :store.WID , Status:null }"
                  :res-callback="data=> data.map(val=>({ 'key' : val.ShiftCode,'value' : val.ShiftTitle }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'orgPosition'">
                <label
                  for="filter-roles"
                  class="fieldLabel"
                >پست سازمانی</label>
                <v-select-extend
                  id="filter-org-positions"
                  v-model="value.OrgPositionCode"
                  url="org-position/get-workspace-org-position"
                  method="get"
                  :params="{ WorkspaceCode : store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val?.OrgPositionCode , 'value' : val?.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'absentOutcomeType'">
                <label
                  for="filter-absentOutcomeType"
                  class="fieldLabel"
                >نوع مانده مرخصی</label>
                <v-select-extend
                  id="filter-absentOutcomeType"
                  v-model="value.AbsentOutcomeTypeId"
                  url="absentOutcomeType/getall"
                  method="get"
                  :params="{ WorkspaceId : store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val?.Id , 'value' : val?.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'calendar'">
                <label
                  for="filter-calendar"
                  class="fieldLabel"
                >نوع تقویم</label>
                <v-select-extend
                  id="filter-calendar"
                  v-model="value.WorkspaceCalendarId"
                  url="workspacecalender/get-list"
                  method="post"
                  :params="{ WorkspaceId : store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val?.Id , 'value' : val?.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'absentType'">
                <label
                  for="filter-absenceType"
                  class="fieldLabel"
                >نوع عدم حضور</label>
                <v-select-extend
                  id="filter-absentType"
                  v-model="value.AbsentCode"
                  url="absent/get-workspace-absent"
                  method="get"
                  :params="{ WorkspaceCode : store.WID }"
                  :res-callback="data=> data.map(val=>({ 'key' : val?.AbsentCode , 'value' : val?.Title }))"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'fromDate'">
                <label
                  for="filter-fromDate"
                  class="fieldLabel"
                >از تاریخ</label>
                <persian-datepicker
                  id="filter-fromDate"
                  v-model="value.FromDate"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'isDelete'">
                <label
                  for="filter-IsDelete"
                  class="fieldLabel tw-invisible"
                >.</label>
                <v-checkbox
                  v-if="store.permits.includes('LogManager')"
                  v-model="value.IsDelete"
                  label="حذف شده"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'isArchive'">
                <label
                  for="filter-isArchive"
                  class="fieldLabel tw-invisible"
                >.</label>
                <v-checkbox
                  v-model="value.IsArchive"
                  label="آرشیو شده"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'toDate'">
                <label
                  for="filter-toDate"
                  class="fieldLabel"
                >تا تاریخ</label>
                <persian-datepicker
                  id="filter-toDate"
                  v-model="value.ToDate"
                />
              </template>
              <template v-else-if="typeof filter === 'object' && filter?.type === 'checkbox'">
                <v-checkbox
                  v-model="value[filter.key]"
                  :label="filter.label"
                  v-bind="filter"
                />
              </template>
              <template v-else-if="typeof filter === 'object' && !!filter?.items">
                <label
                  :for="`filter-${filter.key}`"
                  class="fieldLabel"
                >{{ filter.label }}</label>
                <v-select-extend
                  :id="`filter-${filter.key}`"
                  v-model="value[filter.key]"
                  :items="filter.items"
                  v-bind="filter.props"
                />
              </template>
              <template v-else-if="typeof filter === 'object' && typeof filter.component !== 'undefined'">
                <label
                  :for="`filter-${filter.key}`"
                  class="fieldLabel"
                >{{ filter.label }}</label>
                <component
                  :is="filter.component"
                  :id="`filter-${filter.key}`"
                  v-model="value[filter.key]"
                  v-bind="filter.props"
                />
              </template>
              <template v-else-if="typeof filter === 'object' && filter.type === 'input'">
                <label
                  :for="`filter-${filter.key}`"
                  class="fieldLabel"
                >{{ filter.label }}</label>
                <v-text-field
                  :id="`filter-${filter.key}`"
                  v-model="value[filter.key]"
                />
              </template>
              <template v-else-if="typeof filter === 'string' && filter === 'userStatus' && store.showDeactiveUser && canDeactivateUser">
                <label
                  for="filter-Status"
                  class="fieldLabel"
                >نمایش کاربران</label>
                <v-select-extend
                  id="filter-UserActivationStatus"
                  v-model="value.UserActivationStatus"
                  :items="[{key: null , value : 'همه'},...$enums.userStatus]"
                />
              </template>
            </div>
          </div>
          <div class="tw-text-center tw-mt-3">
            <v-btn
              color="primary"
              variant="tonal"
              :loading="loading"
              class="tw-mx-[4px]"
              size="large"
              append-icon="fas fa-search"
              rounded="xl"
              text="جستجو"
              type="submit"
            >
              جستجو
            </v-btn>
          </div>

          <!--
            <v-row>
            <v-col
            v-for="(filter, index) in filterArray"
            v-bind="columnProps"
            :key="index"
            />
            </v-row>
          -->
        </v-form>
      </component>
    </v-expand-transition>
  </keep-alive>
</template>

<script setup>
import VDialogExtend from '@/components/uiKit/vDialogExtend.vue'
import { useDisplay } from 'vuetify'
import UserSelect from '@/components/common/userSelect.vue'

const props = defineProps({
  'modelValue': { type : [Object] , default :null , required:false },
  'loading' : { type : Boolean , default : false },
  'eager' : { type : Boolean , default : false },
  // elements can be string for built-in filters and object for custom ones
  'filters' : { type : Array , default : ()=>([]) , required: true },
})

const emit = defineEmits(['submit','update:modelValue'])
const route = useRoute()
const columnProps = {  lg:"3", md:"6" ,cols:"12" }
const store = useAppStore()
const { smAndDown } = useDisplay()
const innerModel = ref({})
const canDeactivateUser = ref(true)

const showFilter = computed({
  get(){
    return store.isTableFilterVisible
  },
  set(val){
    store.isTableFilterVisible = val
  },
})

const DepthLevelType = computed(()=>{
  let result = route.meta?.depthLevelType
  if(result === 0)
    return result

  return result || null
})

const value = computed({
  get(){
    if(props.modelValue) return props.modelValue
    else return innerModel.value
  },
  set(val){
    innerModel.value = val
    emit('update:modelValue',val)
  },
})

value.value = { ...value.value, ...store.tableFilter }
store.isTableFilterVisible = store.tableFilter !== {}

const compProps = computed(()=>{
  return !smAndDown.value ? !showFilter.value ? { class :'tw-hidden' }: { class : 'tw-mb-4' } : {}
})

const applyFilter = async()=>{
  if(smAndDown.value) showFilter.value = false
 
  // Retain filter values upon clicking the 'Back' button, discard when navigating to another page through the sidebar menu
  store.tableFilter = value.value
  emit('submit' , value.value)
}

const filterArray = computed(()=>{
  return  props.filters
})

const getYears = ()=>{
  let currentYear = $moment().format('jYYYY')
  currentYear = parseInt(currentYear)
  let array = []
  for(let i = 0 ; i < 11 ; i++){
    array.push(currentYear - i)
  }

  return array
}


const showUserTypeOptions = computed(()=>{

  return !route.fullPath.includes('portal-messaging')
})


watch(smAndDown , val=>{
  if(val){
    showFilter.value = false
  }
})
</script>

<style>
.expand-transition-enter-active {
  transition: all 0.7s cubic-bezier(0, 0.8, 0.8, 1.0) !important;
}
.expand-transition-enter-from {
  opacity: 0 !important;
}
</style>
