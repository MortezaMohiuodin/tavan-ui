<template>
  <VCard
    title="tablePageData"
    :rtl="false"
  >
    <VCardText>
      A wrapper component for vuetify v-data-table-server & mobile infinite-list-mobile. It automatically displays v-datatable-server in desktop view and infinite scroll list in mobile view.
      <h1>Props && emits</h1>
      <Prism language="javascript">
        {{ propsEmits }}
      </Prism>
      <h1>Full Features</h1>
      <Prism language="javascript">
        {{ basic }}
      </Prism>
      <section>
        <VLocaleProvider
          rtl
        >
          {{selected}}
          <table-page-data
            v-model="selected"
            :service="service"
            show-select
            :table-schema="tableSchema"
            @on-edit="onEdit"
            :on-delete="onDelete"
          >
            <template #[`item.QuitDate`]="{item}">
              <v-chip v-if="item.raw.QuitDate" variant="tonal" color="error" rounded="xl">
                {{item.raw.QuitDate && $moment(item.raw.QuitDate).format('jYYYY-jMM-jDD')}}
              </v-chip>
              <v-chip v-else variant="tonal" color="info" rounded="xl">
                شاغل
              </v-chip>
            </template>
          </table-page-data>
        </VLocaleProvider>
      </section>
    </VCardText>
  </VCard>

</template>
<script setup>
import Prism from 'vue-prism-component'
import tablePageData from '@/components/organisms/tablePage/tablePageData.vue'
import {userList} from '@/fakeData'
const tableSchema = [
  {
    title: '#',
    key: 'Id',
  },
  {
    title: 'نام',
    key: 'Name',
    type : 'withAvatar'
  },
  {
    title: 'شغل',
    key: 'Job',
    type : 'chip'
  },
  {
    title: 'دپارتمان ها',
    key: 'Departments',
    type : 'chipGroup'
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date'
  },
  {
    title: 'زمان',
    key: 'time',
    type : 'time',
    value : val=>val.Date
  },
  {
    title: 'آرشیو شده',
    key: 'IsArchive',
    type : 'boolean',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitDate',
  },
  {
    title: 'توضیحات',
    key: 'Desc',
    type : 'ellipsis'
  },
  {
    key: 'action',
    actions:['edit','delete' , {icon : 'custom:archive' , emit : val=>onArchive(val) , label:'ارشیو'} ],
  },
  {
    key:'mobile',
    heading : val=>val.Name,
    subHeading : val=>val.Date && $moment(val.Date).format('jYYYY-jMM-jDD'),
    more : val=>val.Job,
  },
]
const selected = ref([])
const service = async()=>{
  const res = {
    Data : userList,
    TotalRows : userList.length
  }
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(res)
    },2000)
  })

}

const onEdit = (val)=>{
  alert(val)
}
const onArchive = (val)=>{
  alert(val)
}
const onDelete = val=>{
  alert(val)
}
let propsEmits = `// props
defineProps({
 // Selected rows array
  modelValue : { type : Array, default :()=>([]), required:false },
  // A schema based on headers prop in v-datatable, Extra parameters are type ['date','datetime','time','withAvatar','boolean','chip','chipGroup','ellipsis'] , value [callback function for manipulating column values and width]
  // For 'action' key , "actions" can be passed as array containing string (for default actions like delete,edit,view) or an object props for custom v-btn action
  tableSchema : { type:Array , default : ()=>([]),required:true },
  // A function which returns promise containing items in {Data:items , TotalRow : TotalRows} format
  service : { type :[Function, Array ] ,default : null ,required:true },
  itemsPerPage : { type :Number ,default : 10  },
})

// emits
defineEmits(['update:modelValue','onView' ,'onEdit','onDelete'])

// exposes
defineExpose({ restart,isLoading })
`
let basic =  `<table-page-data
  v-model="selected"
  :service="service"
  show-select
  :table-schema="tableSchema"
  @on-edit="onEdit"
  :on-delete="onDelete"
>
  <template #[\`item.QuitDate\`]="{item}">
    <v-chip v-if="item.raw.QuitDate" variant="tonal" color="error" rounded="xl">
      {{item.raw.QuitDate && $moment(item.raw.QuitDate).format('jYYYY-jMM-jDD')}}
    </v-chip>
    <v-chip v-else variant="tonal" color="info" rounded="xl">
      شاغل
    </v-chip>
  </template>
</table-page-data>

const tableSchema = [
  {
    title: '#',
    key: 'Id',
  },
  {
    title: 'نام',
    key: 'Name',
    type : 'withAvatar'
  },
  {
    title: 'شغل',
    key: 'Job',
    type : 'chip'
  },
  {
    title: 'دپارتمان ها',
    key: 'Departments',
    type : 'chipGroup'
  },
  {
    title: 'تاریخ',
    key: 'Date',
    type : 'date'
  },
  {
    title: 'زمان',
    key: 'time',
    type : 'time',
    value : val=>val.Date
  },
  {
    title: 'آرشیو شده',
    key: 'IsArchive',
    type : 'boolean',
  },
  {
    title: 'تاریخ ترک کار',
    key: 'QuitDate',
  },
  {
    title: 'توضیحات',
    key: 'Desc',
    type : 'ellipsis'
  },
  {
    key: 'action',
    actions:[
      'edit',
      'delete' ,
      { icon : 'custom:archive' , emit : val=>onArchive(val) , label:'ارشیو' }
    ],
  },
  {
    key:'mobile',
    heading : val=>val.Name,
    subHeading : val=>val.Date && $moment(val.Date).format('jYYYY-jMM-jDD'),
    more : val=>val.Job,
  },
]

const service = async()=>{
  const res = {
    Data : userList,
    TotalRows : userList.length
  }
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(res)
    },2000)
  })

}

const onEdit = (val)=>{
  alert(val)
}
const onArchive = (val)=>{
  alert(val)
}
const onDelete = val=>{
  alert(val)
}

`
</script>
