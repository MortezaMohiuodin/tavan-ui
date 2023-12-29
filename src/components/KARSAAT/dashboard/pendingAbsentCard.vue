<template>
  <v-card-extend
    title="وضعیت مرخصی ها"
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
      class="tw-flex tw-flex-col tw-flex-1 tw-overflow-y-auto tw-mt-3 tw-pl-3"
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
          <template
            #default="{item}"
          >
            <v-list-item
              class="tw-bg-[#F5F7FC] tw-p-1 tw-px-3 tw-rounded-3xl tw-mb-3"
            >
              <div class="tw-flex tw-justify-between tw-items-center">
                <div class="tw-text-neutral-400 tw-font-YEKAN-BAKH-MEDIUM tw-text-sm">
                  {{ item.Name }} {{ item.Family }}
                </div>
                <div class="tw-text-neutral-800 tw-font-YEKAN-BAKH-MEDIUM tw-opacity-100 tw-text-sm tw-text-left">
                  <p class="tw-text-sm">
                    {{ item.IsHourly ? 'ساعتی' : 'روزانه' }} {{ item.IsHourly ? `(${item.EndTime}- ${item.StartTime})` : `(${item.DayCount} روز)` }}
                  </p>
                  <span class="tw-caption tw-text-sm">
                    {{ $moment(item.Date).format('dddd jDD jMMMM') }}
                  </span>
                </div>
              </div>
              <template #append>
                <v-menu-confirm
                  :loading="statusLoading"
                  :color="$getEnum($enums.absentStatus , 'key' , item.AbsentStatus , 'color')"
                >
                  <template #activator="{props}">
                    <v-btn
                      class="inherit tw-relative -tw-left-[12px]"
                      icon="custom:edit"
                      style="fill:white"
                      size="40"
                      v-bind="props"
                    />
                  </template>
                  <template #action>
                    <div class="tw-flex tw-gap-2">
                      <v-btn
                        size="small"
                        elevation="0"
                        :variant="item.AbsentStatus === 0 ? 'elevated':'tonal'"
                        :loading="parseInt(statusLoading) == parseInt(item.AbsentStatus)"
                        color="info"
                        @click="onStatusEdit(item , 0)"
                      >
                        منتظر پاسخ
                      </v-btn>
                      <v-btn
                        size="small"
                        :variant="item.AbsentStatus === 1 ? 'elevated':'tonal'"
                        elevation="0"
                        color="success"
                        :loading="parseInt(statusLoading) == parseInt(item.AbsentStatus)"
                        @click="onStatusEdit(item , 1)"
                      >
                        تایید شده
                      </v-btn>
                      <v-btn
                        size="small"
                        :variant="item.AbsentStatus === 2 ? 'elevated':'tonal'"
                        color="error"
                        elevation="0"
                        :loading="parseInt(statusLoading) == parseInt(item.AbsentStatus)"
                        @click="onStatusEdit(item , 2)"
                      >
                        رد شده
                      </v-btn>
                    </div>
                  </template>
                </v-menu-confirm>
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
</template>

<script setup>
import DepartmentSelect from '@/components/common/departmentSelect.vue'
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs'

const { WID } = useAppStore()
const loading = ref(false)
const currentMonth = $moment().format('jMM') && parseInt($moment().format('jMM')) - 1
const showFilters = ref(false)
const statusLoading = ref(null)

const items = ref([])
const listLoading = ref(false)
const totalRows = ref(null)
const firstRender = ref(false)
const isEnd = ref(false)
const page = ref(1)

const filters = ref({
  Department : null,
  MonthNumber : currentMonth ,
})

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

const reset = async val=>{
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

    const res = await useHttpPost('absent/get-employee-request-absent', { body })

    res.Data = res.Data.map(val=>{
      return {
        ...val,
        ...(val.IsHourly ?  {
          EndTime : val.EndTime && val.EndTime.split(':').slice(0,2).join(':'),
          StartTime : val.StartTime && val.StartTime.split(':').slice(0,2).join(':'),
        } : {}),
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

const onStatusEdit = async (val, status)=>{
  let body = {
    WorkspaceCode : WID,
    ...val,
    AbsentStatus : status,
  }
  statusLoading.value = status.toString()
  try{


    const res = await useHttpPost('absent/edit-employee-absent-by-admin',{ body })

    statusLoading.value = null
    await reset()
  }catch(e){
    statusLoading.value = null
    console.log(e)
  }
}

watch(filters.value,async val=>{
  await reset()
})
</script>
