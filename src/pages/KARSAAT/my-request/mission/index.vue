<template>
  <div>
    <table-page-header />

    <table-page-filter
      v-model="filters"
      :filters="filterSchema"
      :loading="loading"
      @submit="(newFilters)=>service(newFilters)"
    />
    <div>
      <v-timeline
        v-if="!!items.length"
        side="end"
        align="start"
        :loading="loading"
      >
        <v-timeline-item
          v-for="(item,index) in items"
          :key="index"
          dot-color="blue"
          size="small"
        >
          {{ item.MounthTitle }} -  {{ item.Year }}
          <v-card-default
            v-for="mission in item.EmployeesMissionList"
            :key="mission.Code"
            class="tw-my-2"
            :style="{minWidth: smAndDown ? 'initial' : '350px' }"
          >
            <v-row class="tw-justify-between">
              <v-col
                cols="auto"
              >
                <p>نوع ماموریت : {{ mission.MissionTitle }}</p>
                <p class="tw-caption">
                  {{ $moment(mission.Date).format('jYYYY-jMM-jDD') }}
                </p>
                <p class="tw-truncate tw-w-[200px] tw-min-h-[30px] tw-mt-2">
                  {{ mission.Description }}
                </p>
                <v-chip-table :color="$getEnum($enums.missionStatus , 'key',mission.MissionStatus , 'color')">
                  {{ $getEnum($enums.missionStatus , 'key',mission.MissionStatus , 'value') }}
                </v-chip-table>
              </v-col>
              <v-col
                cols="auto"
                class="tw-flex tw-flex-row sm:tw-flex-col"
                style="align-items: flex-end;gap: 10px"
              >
                <v-btn-table-edit @click="handleEdit(mission)" />
                <v-btn-table-trash @click="handleDelete(mission)" />
                <v-btn-table-view disabled />
              </v-col>
            </v-row>
          </v-card-default>
        </v-timeline-item>
      </v-timeline>
      <p v-else-if="!loading">
        موردی برای نمایش یافت نشد
      </p>
      <v-overlay
        scrim="white"
        :model-value="loading"
        contained
      />
    </div>
    <remove-dialog
      v-model="trashModal"
      @on-confirm="onDelete"
      @on-cancel="trashModal = false"
    />
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const item = ref({})
const showViewItem = ref(false)
const tableRef = ref()
const store = useAppStore()
const loading = ref(false)
const filterSchema = ['fromDate','toDate']
const items = ref([])
const router = useRouter()
const route = useRoute()
const { smAndDown } = useDisplay()

const filters = ref({
  "FromDate": $moment().startOf('jyear').format('YYYY/MM/DD'),
  "ToDate": $moment().endOf('jyear').format('YYYY/MM/DD'),
})

const trashModal = ref(false)

const tableSchema = [
  {
    title: '#',
    key: 'Code',
    align: 'start',
    width: '80px',
  },
  {
    title:'نوع ماموریت',
    key:'MissionTitle',
  },
  {
    title:'تاریخ',
    key:'Date',
    type:'date',
  },
  {
    title:'توضیحات',
    key:'Description',
    width:'100px',
    type:'ellipsis',
  },
  {

    align: 'center',
    key: 'action',
    actions:['edit','delete',{ icon:'fa fa-eye' }],
  },
  {
    key:'mobile',
    heading: val=>val.Title,
  },
]

const activateViewItem = val=>{
  showViewItem.value = true
  item.value = val
}

const service = async (payload = {})=>{
  let body = {
    "WorkspaceCode": store.WID,
    "Page": 1,
    ...payload,
  }
  try{
    loading.value= true

    const res = await useHttpPost('mission/get-my-mission',{ body })

    res.Data = res.Data.map(val=>{
      let moment = $moment(`${val.Year}/${val.MounthNumber}/01`, 'jYY/jMM/jDD')
      let timestamp = moment.unix()

      return {
        ...val,
        timestamp,
      }
    })
    loading.value = false
    items.value = res.Data

    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }

}

onMounted(()=>{
  service(filters.value)
})

const onDelete = async val=>{
  trashModal.value = false
  if(!item.value?.Code) return
  const id = item.value.Code
  let body = {
    "WorkspaceCode": store.WID,
    "Code": id,
  }
  try{
    const res = await useHttpPost('mission/employee-mission-remove-request',{ body })

    service(filters.value)

    return res
  }catch(e){
    throw new Error(e)
  }
}

const handleDelete = val=>{
  item.value = val
  trashModal.value = true
}

function handleEdit(val){
  store.lastItem =  val
  router.push(route.fullPath + '/edit/' + val.Code)
}
</script>

<route>
{
  meta: {
    title: "لیست ماموریت"
  }
}
</route>
