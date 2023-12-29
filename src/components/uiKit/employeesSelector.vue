<template>
  <div
    ref="employeeSelectionBox"
    class="employeeSelectionBox"
    :class="[{'tw-bg-white': withCard}]"
  >
    <v-overlay
      v-model="loading"
      contained
      scrim="white"
      class="align-center justify-center !tw-z-[1]"
      location-strategy="static"
    >
      <div class="tw-text-center ">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32"
          :width="3"
        /> 
       
        <span class="tw-text-slate-400 tw-mt-2 tw-ms-2 tw-font-YEKAN-BAKH-MEDIUM">
          {{ loadingTitle }}
        </span>
      </div>
    </v-overlay>
    <!--
      employee selection tools is here including a department selector, select all functionality, search input field,
      and a list of all employees. The height and width of the element are determined by its parent, except when viewed on mobile screens.
    -->
    <div
      class="tools-employeeSelectionBox"
      :class="[{'tw-bg-white' : withCard}, {'!tw-pl-0' : !showSelectedList}]"
    >
      <div
        class="tw-flex"
      >
        <!--        select ALL the employees at once -->
        <div
          class="tw-w-fit tw-mt-2.5 "
        >
          <v-checkbox-btn
            v-model="selectAll"
            class="tw-block tw-ml-2"
            density="compact"
            @update:modelValue="selectAllEmployee"
          />
        </div>
        <!--        After selecting a department, the employee list will be filtered dynamically -->
        <v-select-department
          v-model="selectedDepartments"
          multiple
          placeholder="فیلتر بر اساس دپارتمان"
          class="tw-flex-grow"
        />
        <!--        This button's functionality is designed specifically for mobile screens. -->
        <!--         It acts as a toggle to show/hide the box that displays information about the selected employee. -->
        <v-btn
          v-if="smAndDown"
          class="tw-w-fit"
          variant="plain"
          rounded="sm"
          size="50"
          @click="pushList = !pushList"
        >
          <v-icon icon="fa fa-users" />
        </v-btn>
      </div>
      <v-divider
        :thickness="1"
        class="tw-mb-5 border-opacity-100 tw-border-k_white_400"
      />
      <v-text-field
        v-model="searchText"
        placeholder="جست و جو"
      />
      <div
        class="tw-max-h-[calc(100%-160px)] tw-overflow-auto"
      >
        <v-slide-y-transition
          group
        >
          <template
            v-for="(item) in filteredItems"
            :key="item.value"
          >
            <div
              class="tw-my-4 tw-rounded-full "
            >
              <div class="tw-flex tw-flex-row">
                <div
                  class="tw-inline-block v-selection-control__input  hover:tw-cursor-pointer"
                >
                  <span
                    v-if="item.check"
                    v-ripple
                    class="tw-inline-block"
                    @click="unSelectEmployee(item)"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="15"
                        height="15"
                        rx="4"
                        transform="matrix(-1 0 0 1 15 0)"
                        fill="#1ABC9C"
                      />
                      <path
                        d="M6.1996 9.63896L4.28033 7.71969C3.98744 7.4268 3.51256 7.4268 3.21967 7.71969C2.92678 8.01258 2.92678 8.48746 3.21967 8.78035L5.71967 11.2803C6.03152 11.5922 6.54383 11.569 6.82617 11.2302L11.8262 5.23016C12.0913 4.91195 12.0483 4.43903 11.7301 4.17385C11.4119 3.90868 10.939 3.95167 10.6738 4.26988L6.1996 9.63896Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span
                    v-else
                    v-ripple
                    class="tw-inline-block "
                    @click="selectEmployee(item)"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="-0.5"
                        y="0.5"
                        width="14"
                        height="14"
                        rx="3.5"
                        transform="matrix(-1 0 0 1 14 0)"
                        fill="white"
                        stroke="#DEE4F7"
                      />
                    </svg>
                  </span>
                </div>
                <div class="tw-inline-block tw-mr-2">
                  {{ item.title }}
                </div>
              </div>

              <div class="tw-text-gray-400">
                <span class="tw-ml-3">
                  <v-icon
                    icon="fa-solid fa-hashtag"
                    size="14"
                    class="tw-ml-1"
                  />
                  <span>{{ item.personalCode }}</span>
                </span>
                <span v-if="!!item.phone">
                  <v-icon
                    icon="mdi:mdi-cellphone-basic"
                    size="17"
                  />
                  {{ item.phone }}
                </span>
              </div>
            </div>
          </template>
        </v-slide-y-transition>
      </div>
    </div>

    <!-- displays all of the selected employees -->
    <div
      class="selectedEmployeeBox"
      :class="{
        'hide-selectedEmployee' : (!pushList && smAndDown),
        'show-selectedEmployee': (pushList && smAndDown)
      }"
      :style="{'min-width': smAndDown ? width + 20 +'px' : 260 +'px' } "
    >
      <div

        class="tw-flex"
      >
        <!-- This button clears the selected employee array. -->
        <v-btn
          class="tw-w-fit"
          variant="plain"
          rounded="sm"
          size="50"
          @click="removeSelectedEmployee"
        >
          <v-icon
            icon="fa fa-trash"
          />
        </v-btn>
        <h3 class="page-heading tw-mt-3 tw-text-center tw-flex-grow">
          لیست همکاران انتخاب شده
          ( {{ selectedElementsInfo.length }} )
        </h3>
        <!--        This button's functionality is designed specifically for mobile screens. -->
        <!--         It acts as a toggle to show/hide the box that displays information about the selected employee. -->
        <v-btn
          v-if="smAndDown"
          class="tw-w-fit"
          variant="plain"
          rounded="sm"
          size="50"
          @click="pushList = !pushList"
        >
          <v-icon icon="fa fa-arrow-left" />
        </v-btn>
      </div>

      <div
        class="tw-h-[calc(100%-30px)] tw-overflow-auto"
      >
        <div
          v-if="selectedElementsInfo.length === 0 "
          class="tw-mt-3 tw-text-[14px] tw-text-slate-300 tw-flex tw-flex-col tw-h-[calc(100%-30px)] tw-justify-around"
        >
          <div class="tw-w-full tw-text-center">
            کارمندی انتخاب نشده است
          </div>
        </div>
        <v-scroll-y-transition
          group
        >
          <template
            v-for="(item) in selectedElementsInfo"
            :key="item.value"
          >
            <div
              class="tw-my-4 tw-rounded-full "
            >
              <div class="tw-flex tw-flex-row">
                <div
                  class="tw-inline-block v-selection-control__input  hover:tw-cursor-pointer"
                >
                  <span
                    v-if="item.check"
                    v-ripple
                    class="tw-inline-block"
                    @click="unSelectEmployee(item)"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="15"
                        height="15"
                        rx="4"
                        transform="matrix(-1 0 0 1 15 0)"
                        fill="#1ABC9C"
                      />
                      <path
                        d="M6.1996 9.63896L4.28033 7.71969C3.98744 7.4268 3.51256 7.4268 3.21967 7.71969C2.92678 8.01258 2.92678 8.48746 3.21967 8.78035L5.71967 11.2803C6.03152 11.5922 6.54383 11.569 6.82617 11.2302L11.8262 5.23016C12.0913 4.91195 12.0483 4.43903 11.7301 4.17385C11.4119 3.90868 10.939 3.95167 10.6738 4.26988L6.1996 9.63896Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span
                    v-else
                    v-ripple
                    class="tw-inline-block "
                    @click="selectEmployee(item)"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="-0.5"
                        y="0.5"
                        width="14"
                        height="14"
                        rx="3.5"
                        transform="matrix(-1 0 0 1 14 0)"
                        fill="white"
                        stroke="#DEE4F7"
                      />
                    </svg>
                  </span>
                </div>
                <div class="tw-inline-block tw-mr-2">
                  {{ item.title }}
                </div>
              </div>
              <div class="tw-text-gray-400">
                <span class="tw-ml-3">
                  <v-icon
                    icon="fa-solid fa-hashtag"
                    size="14"
                    class="tw-ml-1"
                  />
                  <span>{{ item.personalCode }}</span>
                </span>
                <span v-if="!!item.phone">
                  <v-icon
                    icon="mdi:mdi-cellphone-basic"
                    size="17"
                  />
                  {{ item.phone }}
                </span>
              </div>
            </div>
          </template>
        </v-scroll-y-transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import VSelectDepartment from '@/components/uiKit/vSelectDepartment.vue'
import { useAppStore } from '@/store/app'
import { useHttpPost } from '@/composables/useHttpPost'
import { useDisplay } from 'vuetify'
import * as constants from 'constants'

let props = defineProps(
  {
    modelValue:{ type:Array,default:()=>([]) },
    withCard : { type : Boolean ,default : true },
    showSelectedList : { type : Boolean , default : true },
    showDepartmentFilter : { type : Boolean , default : true },
  })
let emits = defineEmits(['update:modelValue'])
let loading = ref(true)
let selectedDepartments = shallowRef([])
let searchText = shallowRef('')
let selectAll = shallowRef(false)
let items = []
let filteredItems = ref([])
let selectedElementsInfo = ref([])
let pushList = shallowRef(false)
const employeeSelectionBox = shallowRef(null)
let loadingTitle = ref()
const { smAndDown } = useDisplay()
const { width, height } = useElementSize(employeeSelectionBox)
let selectedEmployees = useVModel(props , 'modelValue',emits)
const store = useAppStore()

loadingTitle.value = 'درحال دریافت همکاران'
watch(selectedElementsInfo,val=>{
  console.log(val)
  selectedEmployees.value = selectedElementsInfo.value.map(val=>val.value)
},{ deep:true })
useHttpPost('/employee/get-all',{ body :{ "Status":null,"WorkspaceCode":store.WID } }).then(res=>{
  items = res.Data.map(employee=>({
    title: `${employee.Name} ${employee.Family}`,
    phone:employee.Mobile,
    personalCode: employee.EmployeesCode,
    department:employee.Department.map(dep => dep.Title),
    departmentCode:employee.Department.map(dep=>dep.Code),
    value: employee.EmployeesCode,
    check: false,
  }))
  filteredItems.value = [...items]
  loading.value = false
})

const unSelectEmployee = val=>{
  val.check = false
  items.forEach(item=>{
    if(item.value === val.value){
      item.check = false
    }
  })
  selectedElementsInfo.value.splice(selectedElementsInfo.value.findIndex(ep=>ep.value === val.value),1)
  if(filteredItems.value.findIndex(item=>item.check===false)>=0)
    selectAll.value=false
  else selectAll.value=true
}

const selectEmployee =val=>{
  val.check = true
  items.forEach(item=>{
    if(item.value === val.value) item.check = true
  })
  selectedElementsInfo.value.push(val)
  changeSelectAllValue()
}

const selectAllEmployee= ()=>{
  loading.value=true
  if(selectAll.value){
    loadingTitle.value = ' اضافه کردن همکاران فیلترشده به لیست'
  }else loadingTitle.value = 'حذفه همکاران فیلترشده از لیست'
  setTimeout(()=>{
    filteredItems.value.forEach((item,index) => {
      item.check = selectAll.value
      let findIndex = selectedElementsInfo.value.findIndex(selectedEP=>selectedEP.value === item.value)
      if(findIndex>=0 && !selectAll.value){
        selectedElementsInfo.value.splice(findIndex,1)
      }else if(findIndex<0 && selectAll.value){
        selectedElementsInfo.value.push(item)
      }
      if(index === filteredItems.value.length-1) loading.value = false
    })

    changeSelectAllValue()
  },
  100)

}

const changeSelectAllValue = ()=>{
  if(filteredItems.value.findIndex(item=>item.check===false)>=0)
    selectAll.value=false
  else selectAll.value=true
}

const removeSelectedEmployee = ()=>{
  filteredItems.value.forEach(item=>item.check=false)
  items.forEach(item=>item.check=false)
  selectedElementsInfo.value=[]
  changeSelectAllValue()

}
// filter employee by department

watch(selectedDepartments, val => {
  filteredItems.value = filterBaseDepartment()
  changeSelectAllValue()
})
function filterBaseDepartment(){
  return  selectedDepartments.value.length ? items.filter(item => {
    return getCommonElements(item.departmentCode, [...selectedDepartments.value]).length !== 0
  }) : items
}
function getCommonElements(array1, array2) {
  return array1.filter(item => array2.includes(item))
}
// filter employee by search
watch(searchText,val=>filterItems(val))
function filterItems(searchString) {
  filteredItems.value = filterBaseDepartment().filter(item => {
    const searchValue = searchString.toString().toLowerCase()

    const itemValues = [
      item.title?item.title.toString():null,
      item.phone?item.phone.toString():null,
      item.personalCode?item.personalCode.toString():null,
      item.department?item.department.toString():null,
      item.value?item.value.toString():null,
    ]

    return itemValues.some(value =>{
      if(value !== null)
        return  value.includes(searchValue)
      else return false
    })
  })
}
</script>

<style lang="scss" scoped>
.employeeSelectionBox{
  @apply tw-rounded-[20px] tw-p-4 tw-w-full tw-min-w-fit tw-h-[500px] md:tw-h-full tw-flex tw-relative tw-overflow-hidden;
}
.tools-employeeSelectionBox{
  @apply tw-flex-grow tw-min-h-full md:tw-pl-6 tw-relative
}
.selectedEmployeeBox{
  @apply md:tw-h-full md:tw-max-h-full md:tw-pr-6 md:tw-border-r md:tw-border-slate-400 tw-bg-white
  md:tw-relative md:tw-left-0 sm:tw-z-0
  tw-absolute tw-transition-all tw-duration-500 tw-ease-in-out
}
.show-selectedEmployee{
  @apply tw-left-0 tw-h-[500px] tw-top-[0px]
}
.hide-selectedEmployee{
  @apply tw-left-[-1000px] tw-top-[0px] tw-h-[500px]
}

// checkbox
.containerCheckbox {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

/* Hide the browser's default checkbox */
.containerCheckbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;

  border-radius: 15px;
}

/* On mouse-over, add a grey background color */
.containerCheckbox:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.containerCheckbox input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.containerCheckbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.containerCheckbox .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
