<template>
  <div
    class="tablePageData"
  >
    <!--  desktop view  -->
    <v-data-table-server-extend
      v-if="!mobileSchema || !smAndDown"
      ref="datatableRef"
      v-model="selected"
      :columns="columns"
      :service="service"
      item-value="Id"
      v-bind="$attrs"
      :items-per-page="props.itemsPerPage"
      @on-edit="val=>emit('onEdit',val)"
      @on-delete="onDelete"
      @on-view="onView"
    >
      <template
        v-for="(_, slot) of slots"
        #[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
    </v-data-table-server-extend>

    <!-- mobile view -->
    <infinite-list-mobile
      v-else
      ref="infiniteListRef"
      :columns="tableSchema"
      :service="service"
      @on-edit="val=>emit('onEdit',val)"
      @on-delete="onDelete"
      @on-view="onView"
    >
      <template #action="item">
        <slot
          name="item.action"
          v-bind="{item : item}"
        />
      </template>
    </infinite-list-mobile>
  </div>

  <!--  table modals -->

  <!--  view row in modal -->
  <item-dialog
    v-if="smAndDown"
    v-model="viewModal"
    :item="item"
  />
  <!--  delete modal -->

  <remove-dialog
    v-model="trashModal"
    :loading="deleteLoading"
    @on-confirm="handleDeleteConfirm"
    @on-cancel="trashModal = false"
  />
</template>

<script setup>
import { useDisplay } from 'vuetify'

const props = defineProps({
  // Selected rows array
  modelValue : { type : Array, default :()=>([]), required:false },
  // A schema based on headers prop in v-datatable, Extra parameters are type ['date','datetime','time','withAvatar','boolean','chip','chipGroup','ellipsis'] , value [callback function for manipulating column values and width]
  // For 'action' key , "actions" can be passed as array containing string (for default actions like delete,edit,view) or an object props for custom v-btn action
  tableSchema : { type:Array , default : ()=>([]),required:true },
  // A function which returns promise containing items in {Data:items , TotalRow : TotalRows} format
  service : { type :[Function, Array ] ,default : null ,required:true },
  itemsPerPage : { type :Number ,default : 10  },
  onDelete : { type : Function , default : null },
})

const emit = defineEmits(['update:modelValue','onView' ,'onEdit','onDelete'])
const { smAndDown } = useDisplay()
const viewModal = ref(false)
const trashModal = ref(false)
const item = ref({})
const slots = useSlots()
const infiniteListRef = ref(null)
const datatableRef = ref(null)
const selected = useVModel(props,'modelValue',emit)
const deleteLoading = ref(false)
const actionSlot = slots && slots['item.action']
const route = useRoute()

const isLoading = computed(()=>{
  if(!smAndDown.value){
    if(!datatableRef.value) return false

    return datatableRef.value.loading
  }else{
    if(!infiniteListRef.value) return false

    return infiniteListRef.value.loading
  }
})

const component = computed(()=>{
  if(props.mode === 'auto'){
    if(!mobileSchema.value || !smAndDown.value){
      return 'table'
    }else{
      return 'list'
    }
  }else if(props.mode ==='table'){
    return 'table'
  }else if(props.mode === 'list'){
    return 'list'
  }else {
    return 'list'
  }
})

const handleView = val=>{
  viewModal.value = true
  let temp =  Object.entries(val).filter(v=>{
    return props.tableSchema.find(header=>header.key === v[0])
  })
  temp = temp.map(val=>{
    let i = props.tableSchema.find(header=>header.key === val[0])

    return [val[0], { value : val[1] , title: i.title , ...i }]
  })
  item.value = Object.fromEntries(temp)
}

function onView(val){
  if(!route.fullPath.includes('basic/employees'))
    handleView(val)
  emit('onView',val)
}

const onDelete = val=>{
  item.value = val
  trashModal.value = true
}

const handleDeleteConfirm = async ()=>{
  deleteLoading.value = true
  if(props.onDelete){
    try{
      const res = await props.onDelete(item.value)
      if(res){
        trashModal.value = false
        deleteLoading.value = false
      }
    }catch(e){
      deleteLoading.value = false
      console.log(e)
    }
  }
  emit('onDelete',item.value)
}

const columns = computed(()=>{
  let filteredSchema  = props.tableSchema.filter(y=>y.key !== 'mobile')

  return filteredSchema.map(val=>{
    let title = val.title || val.key === 'action' && 'عملیات'

    return {
      title ,
      sortable:false,
      removable:true,
      align : 'center',
      slotName : `item.${val.key}`,
      slotColumnName : `column.${val.key}`,
      ...(val.type === 'ellipsis' && !val.width ? { width: '200px' } : {}),
      ...(val.type === 'withAvatar' ? { align: 'right' } : {}),
      ...val,
    }
  })
})

const mobileSchema = props.tableSchema.find(val=>val.key === 'mobile')

const restart = val=>{
  smAndDown.value ? infiniteListRef.value.reset(val) : datatableRef.value.reset(val)
}

const page = computed(()=>{
  if(datatableRef.value)
    return datatableRef.value.page
  else return 1
})

defineExpose({ restart , isLoading , page })
</script>

<style lang="scss">
.tablePageData{
  position: relative;
  .v-data-table__tbody{
    .v-btn:not(:last-child){
      margin-left: 5px;
    }
  }
}
</style>
