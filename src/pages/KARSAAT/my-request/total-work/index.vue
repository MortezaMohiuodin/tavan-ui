<template>
  <div>
    <div>
      <h3 class="page-heading tw-mt-3">
        {{ $route.meta.title }}
      </h3>
      <v-row class="tw-mt-1">
        <v-col
          cols="12"
          lg="6"
          class="tw-h-full"
        >
          <v-card-default
            class="tw-flex tw-flex-col tw-justify-between !tw-h-[243px]"
            :class="{'tw-bg-gray-100': form.DateType === 0}"
            @click="form.DateType = 0"
          >
            <v-checkbox
              :model-value="form.DateType"
              :value="0"
              :label="`نمایش ${$moment().format('jMMMM')} سال ${$moment().format('jYYYY')} `"
            />
            <br>
            <div class="tw-text-center tw-flex tw-gap-2 tw-justify-center">
              <v-btn-success @click="service({untilToday:true,FromDate: $moment().startOf('jmonth').format('YYYY/MM/DD'),ToDate: $moment().endOf('jmonth').format('YYYY/MM/DD')})">
                تا امروز
              </v-btn-success>
              <v-btn-success
                variant="tonal"
                @click="service({untilToday:false,FromDate: $moment().startOf('jmonth').format('YYYY/MM/DD'),ToDate: $moment().endOf('jmonth').format('YYYY/MM/DD')})"
              >
                تا پایان دوره
              </v-btn-success>
            </div>
          </v-card-default>
        </v-col>
        <v-col
          cols="12"
          lg="6"
        >
          <v-card-default
            :class="{'tw-bg-gray-100': form.DateType === 1}"
            @click="form.DateType = 1"
          >
            <v-checkbox
              :model-value="form.DateType"
              :value="1"
              label="نمایش بر بازه تاریخ دلخواه "
            />
            <br>
            <v-row>
              <v-col
                cols="12"
                :lg="6"
              >
                <persian-datepicker
                  v-model="form.FromDate"
                  label="از تاریخ"
                />
              </v-col>
              <v-col
                cols="12"
                :lg="6"
              >
                <persian-datepicker
                  v-model="form.ToDate"
                  label="تا تاریخ"
                />
              </v-col>
              <v-col
                cols="12"
                class="tw-text-center tw-flex tw-gap-2 tw-justify-center"
              >
                <v-btn-info @click="service({untilToday:true})">
                  تا امروز
                </v-btn-info>
                <v-btn-info
                  variant="tonal"
                  @click="service({untilToday:false})"
                >
                  تا پایان دوره
                </v-btn-info>
              </v-col>
            </v-row>
          </v-card-default>
        </v-col>
      </v-row>
      <v-card-default
        v-if="io?.length"
        class="tw-mt-5"
        transiton="fade"
      >
        <v-row>
          <v-col>
            <div class="tw-flex tw-items-center tw-gap-2">
              <v-icon
                icon="fa fa-calendar"
                class="tw-relative -tw-top-1"
              />
              <span>کارکرد دوره</span> : <span class="tw-font-bold">{{ $moment().format('jMMMM jYYYY') }}</span>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn-success
              variant="outlined"
              @click="getTotalWorkExcel"
            >
              گزارش کارکرد
            </v-btn-success>
            <v-btn-success
              variant="tonal"
              @click="getIoExcel"
            >
              گزارش تردد
            </v-btn-success>
          </v-col>
        </v-row>
        <month-days-grid :io="io" />
      </v-card-default>

      <v-slide-y-transition>
        <v-card-default
          v-if="totalWork"
          class="tw-mt-6"
        >
          <div class="tw-grid tw-grid-cols-4 tw-gap-4">
            <v-card-default
              v-for="(item,index) in items"
              :key="index"
              class="report-item"
              :class="{'!tw-bg-gray-100':selectedItem === index}"
              elevation="1"
              @click="selectedItem = index"
            >
              <v-icon
                :icon="item.icon"
                :width="26"
                class="tw-mb-2"
              />
              <b class="tw-text-lg tw-font-bold tw-mb-1">{{ item.heading }}</b>
              <span
                class="tw-text-xs tw-font-normal tw-text-[#959499]"
              >{{ item.subHeading }} </span>
              <div class="tw-w-[58px] tw-h-[58px] tw-rounded-full tw-bg-[#FFF2D4] tw-absolute -tw-top-3.5 -tw-left-3.5" />
              <div class="tw-w-[14px] tw-h-[14px] tw-rounded-full tw-bg-[#FFF2D4] tw-absolute tw-top-10 tw-left-10" />
            </v-card-default>
          </div>
        </v-card-default>
      </v-slide-y-transition>
      <v-overlay
        :model-value="loading"
        contained
        persistent
        scrim="white"
      />
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const selectedItem = ref(0)

const form = ref({
  "DateType" : 0,
  "FromDate": $moment().startOf('jmonth').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jmonth').format('YYYY/MM/DD'),
  "untilToday":false,
})

const items = ref([
  { key:'TotalWorkTime',heading:'استاندارد دوره' , icon: 'fa fa-calendar' },
  { key:'NetWorkingDay',heading:'روزهای کارکرد' , icon: 'custom:calendar' },
  { key:'WorkTime',heading:'ساعت کارکرد' , icon: 'custom:calendar' },
  { key:'Overtime',heading:'اضافه کاری' , icon: 'fa fa-history' },
  { key:'OvertimeHoliday',heading:'تعطیل کاری و جمعه کاری' , icon: 'fa fa-history' },
  { key:'NightWork',heading: 'شب کاری' , icon: 'fa fa-history' },
  { key:'ShortageTime',heading: 'کسری کار' , icon: 'fa fa-history' },
  { key:'VacationAmount',heading: 'مرخصی' , icon: 'fa fa-history' },
  { key:'OverTimeMax',heading: 'سقف اضافه کاری' , icon: 'fa fa-history' },
  { key:'HolidayAndFriday',heading: 'تعطیلی کاری' , icon: 'fa fa-history' },
])

const { WID } = useAppStore()
const io = ref(null)
const totalWork = ref(null)

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    ...form.value,
    ...payload,
  }
  try{
    loading.value =true

    const res =  await useHttpPost('InputOutputCalcu/calcu-employee-time-and-total-work',{ body  })

    io.value = res.Data.IO
    totalWork.value = res.Data.TotalWork

    loading.value =false

    return res
  }catch(e){
    loading.value =false
    throw new Error(e)
  }

}

const getTotalWorkExcel = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    "FromDate":form.value.FromDate,
    "ToDate":form.value.ToDate,
  }
  try{
    loading.value =true

    const res =  await useHttpExcel('inputoutputcalcu/calcu-employee-timework-excel-dotin',{ params  })

    loading.value =false

    return res
  }catch(e){
    loading.value =false
    throw new Error(e)
  }

}

const getIoExcel = async (payload = {})=>{
  let params = {
    "WorkspaceCode": WID,
    "FromDate":form.value.FromDate,
    "ToDate":form.value.ToDate,
  }
  try{
    loading.value =true

    const res =  await useHttpGet('inputoutput/get-employee-io-excel-dotin',{ params  })

    loading.value =false

    return res
  }catch(e){
    loading.value =false
    throw new Error(e)
  }

}
</script>

<style>
.report-item {
  @apply tw-bg-white tw-flex tw-flex-col tw-pr-4 tw-py-4 tw-rounded-3xl tw-relative tw-overflow-hidden;
}
</style>

<route>
{
meta: {
title: "آرشیو ساعت کاری"
}
}
</route>

