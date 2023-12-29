<template>
  <div class="vDataTableServerMobile">
    <infinite-scroll-list
      :items="items"
      :loading="loading"
      :total-rows="totalRows"
      :show-load-more="showLoadMore"
      @on-load="onLoad"
    >
      <template
        #default="{item}"
      >
        <slot
          name="mobile"
          v-bind="{item}"
        >
          <table-card-mobile
            :key="item.Id"
            :heading="mobileSchema?.heading && mobileSchema?.heading(item)"
            :sub-heading="mobileSchema?.subHeading && mobileSchema?.subHeading(item)"
            :more="mobileSchema?.more && mobileSchema?.more(item)"
          >
            <template #actions>
              <slot
                name="action"
                v-bind="{raw:item}"
              />
              <v-btn-table-mobile
                icon="fa-regular fa-eye"
                @click="emit('onView', item)"
              />
              <template
                v-for="(action,index) in actionSchema?.actions"
                :key="index"
              >
                <v-btn-table-mobile
                  v-if="(typeof action === 'string' && action === 'delete')"
                  icon="fa-regular fa-trash-can"
                />
                <v-btn-table-mobile
                  v-if="(typeof action === 'string' && action === 'edit')"
                  icon="fa fa-pen"
                  @click="emit('onEdit', item)"
                />
                <v-btn-table-mobile
                  v-if="(typeof action === 'object' && action.icon)"
                  v-bind="action"
                  :disabled="!!action.disabledCondition?action.disabledCondition(item):false"
                  @click="action.emit(item)"
                />
              </template>
            </template>
          </table-card-mobile>
        </slot>
      </template>
    </infinite-scroll-list>
  </div>
</template>

<script setup>
const props = defineProps({
  columns : { type:Array , default : ()=>([]),required:true },
  service : { type :Function ,default : null ,required:true },
})

const emit = defineEmits(['onView' ,'onEdit','onDelete'])

const items = ref([])
const loading = ref(false)
const totalRows = ref(null)
const firstRender = ref(false)
const isEnd = ref(false)
const page = ref(1)
const filters = ref({})



const mobileSchema = computed(()=>{
  return props.columns.find(val=>val.key === 'mobile')
})

const actionSchema = computed(()=>{
  return props.columns.find(val=>val.key === 'action')
})

const getData = async (val={})=>{
  if(isEnd.value) return
  loading.value = true
  try{
    let response
    if(typeof props.service !== 'function') return
    response = await props.service({ Page:page.value ,...filters.value, ...val } )
    totalRows.value = response.TotalRow
    items.value.push(...response.Data)
    loading.value = false
    if(!firstRender.value) firstRender.value =true
    if(response.Data.length === 0) isEnd.value = true
  }catch(e){
    loading.value = false
  }
}

const reset = val=>{
  filters.value = {}
  items.value = []
  page.value = 1
  isEnd.value = false
  firstRender.value = false
  if(val)
    filters.value = val
  getData(val)
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

defineExpose({ reset ,loading })
</script>
