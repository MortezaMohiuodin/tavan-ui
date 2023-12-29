<template>
  <v-card-extend
    title="وضعیت ترددهای ناقص"
    height="410"
    :loading="loading"
  >
    <div
      v-if="showFilters"
      class="tw-flex tw-gap-2"
    >
      <department-select
        v-model="filters.Department"
        return-object
        style="max-width:200px;"
        label="دپارتمان"
      />
      <v-select-extend
        v-model="filters.MonthNumber"
        :items="$enums.months"
        style="max-width:200px"
        :clearable="false"
        label="ماه"
      />
    </div>
    <div
      v-if="items?.length"
      class="tw-flex tw-flex-col tw-overflow-y-auto tw-flex-1 tw-mt-3 tw-pl-3"
    >
      <div
        v-if="items && items.length"
      >
        <infinite-scroll-list
          :items="items"
          :show-load-more="showLoadMore"
          :loading="listLoading"
          :total-rows="totalRows" 
          @on-load="onLoad"
        >
          <template #default="{item}">
            <v-list-item
              class="tw-bg-[#F5F7FC] tw-p-1 tw-px-3 tw-rounded-3xl tw-mb-3"
            >
              <div class="tw-flex tw-justify-between tw-items-center">
                <div class="tw-text-neutral-400 tw-font-YEKAN-BAKH-MEDIUM tw-text-sm">
                  {{ item?.EmployeeInfo?.Name }} {{ item?.EmployeeInfo?.Family }}
                </div>
                <div class="tw-text-left tw-text-neutral-800 tw-font-YEKAN-BAKH-MEDIUM tw-opacity-100 tw-text-base ">
                  <p class="tw-text-sm">
                    {{ item.out }} - {{ item.in }}
                  </p>
                  <span class="tw-caption tw-text-sm">
                    {{ item.date }}
                  </span>
                </div>
              </div>
              <template #append>
                <v-btn
                  class="inherit tw-relative -tw-left-[12px]"
                  icon="custom:edit"
                  style="fill:white"
                  size="40"
                  @click="ioDialog = true;itemDialog = item"
                />
              </template>
            </v-list-item>
          </template>
        </infinite-scroll-list>
      </div>
    </div>
    <div v-else-if="loading">
      <v-skeleton-loader
        class="mx-auto"
        type="table-heading , table-heading, table-heading"
      />
    </div>

    <empty-card-content
      v-else
      class="tw-flex-1"
    />
    <div
      v-if="items?.length"
      class="tw-text-center tw-mt-auto"
    >
      <v-btn
        color="secondary"
        variant="text"
        size="large"
        @click="onLoad"
      >
        بارگزاری بیشتر
      </v-btn>
    </div>

    <template #action>
      <v-chip
        v-if="filters.Department?.DepartmentCode"
        rounded="xl"
        class="tw-me-1 tw-justify-center"
        closable
        variant="tonal"
        color="primary"
        close-icon="fa-solid fa-xmark"
        @click:close="filters.Department = null"
      >
        <span class="tw-max-w-[70px] tw-truncate">{{ filters.Department.Title }}</span>
      </v-chip>
      <v-chip
        v-if="filters.MonthNumber"
        class="!tw-px-5 tw-w-[50px] tw-justify-center"
        rounded="xl"
        variant="tonal"
        color="primary"
      >
        {{ $getEnum($enums.months , 'key' , filters.MonthNumber , 'value') }}
      </v-chip>
      <v-icon
        :size="25"
        class="tw-relative tw-top-[2px] tw-my-2 tw-mx-3"
        color="secondary"
        variant="text"
        icon="custom:filter"
        @click="showFilters = !showFilters"
      />

      <v-icon
        :size="25"
        icon="mdi:mdi-refresh"
        class="tw-ms-1 tw-my-2 "
        :class="{'tw-animate-spin' : loading}"
        color="secondary"
        variant="text"
        @click="reset"
      />
    </template>
  </v-card-extend>
  <v-dialog-extend
    v-model="ioDialog"
    :title="`ورود و خروج های ${$moment(itemDialog.Date).format('jDD jMMMM')}`"
    width="400"
    color="info"
  >
    <v-list>
      <v-list-item>
        <span class="tw-font-YEKAN-BAKH-BOLD">ساعت</span>
        <template #append>
          <span class="tw-font-YEKAN-BAKH-BOLD">عملیات</span>
        </template>
      </v-list-item>
      <v-list-item
        v-for="(io, index) in itemDialog?.List"
        :key="index"
      >
        <span class="tw-mr-2 tw-text-lg">{{ $moment(io.Time).format('HH:mm') }}</span>
        <template #append>
          <v-menu-confirm
            :loading="deleteLoading"
            color="error"
            prompt
            @on-confirm="deleteIo(io.Id)"
          >
            <template #activator="{props}">
              <v-btn-table-trash
                class="tw-ml-1"
                :size="35"
                variant="tonal"
                v-bind="props"
              />
            </template>
          </v-menu-confirm>
        </template>
      </v-list-item>
    </v-list>
    <v-list v-if="editMode">
      <v-list-item>
        <time-picker
          v-model="time"
        />
        <template #append>
          <v-btn-table
            :size="50"
            color="k_white-800"
            icon="mdi:mdi-plus-circle-outline"
            :loading="confirmLoading"
            class="tw-ml-2"
            @click="confirmAddIo(itemDialog)"
          />
          <v-btn-table
            color="k_white-800"
            :size="50"
            icon="fa fa-trash-can"
            @click="editMode = false;form={}"
          />
        </template>
      </v-list-item>
    </v-list>

    <v-btn-add-item
      class="inherit tw-mr-4"
      size="default"
      color="info"
      :disabled="editMode"
      @click="editMode = true"
    >
      اضافه کردن
    </v-btn-add-item>
    <v-divider class="tw-my-4" />
    <div class="tw-text-center">
      <v-btn-cancel
        @click="ioDialog = false"
      >
        بستن
      </v-btn-cancel>
    </div>
  </v-dialog-extend>
</template>

<script setup>
import DepartmentSelect from '@/components/common/departmentSelect.vue'
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs'

const { WID } = useAppStore()
const loading = ref(false)
const currentMonth = $moment().format('jMM') && parseInt($moment().format('jMM')) - 1
const showFilters = ref(false)
const item = ref({})
const ioDialog  = ref(false)
const deleteLoading = ref(false)
const time = ref()
const editMode = ref(false)
const confirmLoading = ref(false)
const deleteMode = ref(false)
const itemDialog = ref({})


const items = ref([])
const listLoading = ref(false)
const totalRows = ref(null)
const firstRender = ref(false)
const isEnd = ref(false)
const page = ref(1)

const getData = async (val={})=>{
  if(isEnd.value) return
  listLoading.value = true
  
  try{
    let response
    let payload
    payload = { Page:page.value  }
    payload = {} 
    response = await service(payload)
    totalRows.value = response.TotalRow
    items.value.push(...response.Data)
    listLoading.value = false
    if(!firstRender.value) firstRender.value =true
    if(response.Data.length === 0) isEnd.value = true
  }catch(e){
    listLoading.value = false
  }
}

async function reset(val){
  items.value = []
  page.value = 1
  isEnd.value = false
  firstRender.value = false
  await getData()
}


onMounted(async()=>{
  await getData()
})

const showLoadMore = ()=>{
  return firstRender.value && !isEnd.value
}

const onLoad = async()=>{
  page.value++
  await getData()
}


const filters = ref({
  Department : null,
  MonthNumber : currentMonth ,
})

async function service(payload={}){
  let MonthNumber = filters.value?.MonthNumber ?  filters.value?.MonthNumber + 1 : null
  let body = {
    WorkspaceCode : WID,
    DepartmentCode : filters.value.Department?.DepartmentCode,
    MonthNumber,
    ...payload,
  }

  try{
    loading.value = true

    const res = await useHttpPost('InputOutput/v2/get-all-io-with-error', { body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        date : $moment(val.MiladiDate).format('dddd jDD jMMMM'),
        in : val.List && val.List[0] && val.List[0].Time && $moment(val.List[0].Time).format('HH:mm') || 'ثبت نشده',
        out : val.List && val.List[1] && val.List[1].Time && $moment(val.List[1].Time).format('HH:mm') || 'ثبت نشده',
      }
    })

    setTimeout(()=>{
      loading.value = false
    },500)
    
    return res
  }catch(e){
    setTimeout(()=>{
      loading.value = false
    },500)
    console.log(e)
  }
}

const deleteIo = async id=>{
  let InputOutputCode = [id]
  let body = {
    WorkspaceCode : WID,
    InputOutputCode,
  }

  deleteLoading.value = true
  try{
    const res = useHttpPost('InputOutput/del-inputoutput-by-admin',{ body })

    ioDialog.value = false
    await reset()
    deleteLoading.value = false
  }catch(e){
    deleteLoading.value = false
    console.log(e)
  }
}

const confirmAddIo = async io=>{
  let date = $moment(io.MiladiDate).format('YYYY-MM-DD')

  let body = {
    WorkspaceCode : WID,
    WorkspaceEmployeeCode : io.EmployeeCode,
    Time : $moment(`${date}T${time.value}`),
  }

  confirmLoading.value = true
  try{
    const res = await useHttpPost('InputOutput/add-inputoutput-by-admin',{ body })

    time.value = null
    editMode.value = false
    confirmLoading.value = false
    await reset()
    ioDialog.value = false
  }catch(e){
    confirmLoading.value = false
    console.log(e)
  }
}

watch(filters.value,val=>{
  reset()
})
</script>
