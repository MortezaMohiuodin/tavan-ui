<template>
  <v-autocomplete
    v-model="value"
    v-model:search="search"
    :items="list"
    :loading="loading"
    :no-data-text="noDataText"
    v-bind="$attrs"
    return-object
    item-value="InsuranceJobCode"
    item-title="Title"
    @keyup.enter="getOptions"
  >
    <template #selection="{ item }">
      <template v-if="!!item.raw.Title">
        <span class="tw-flex tw-justify-between tw-w-full">
          {{ item.raw.Title }}
          <span
            v-if="item.raw.JobCodeInTamin"
            class="text-grey align-self-center tw-mr-2"
          >
            (کد گروه شغلی : {{ item.raw.JobCodeInTamin }})
          </span>
        </span>
      </template>
      <template v-else>
        <span class="tw-flex tw-justify-between tw-w-full">
          {{ $attrs.selectedJobBefore.Title }}
          <span
            class="text-grey align-self-center tw-mr-2"
          >
            (کد گروه شغلی :
            {{ $attrs.selectedJobBefore.JobCodeInTamin }})
          </span>
        </span>
      </template>
    </template>
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="item?.raw?.Title"
      >
        <template #append>
          <span>{{ item?.raw?.JobCodeInTamin }}</span>
        </template>
      </v-list-item>
    </template>
    <template #prepend-inner>
      <v-btn
        size="x-small"
        variant="tonal"
        icon="fas fa-search"
        :disabled="!canSearch"
        @click="getOptions"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { useVModel ,useThrottle } from '@vueuse/core'
import { useLists } from '@/store/lists'


const props = defineProps({
  modelValue : { type : [Number,Object] , default : null },
})

const emit = defineEmits(['update:modelValue'])
const isSearch = ref(false)
const search = ref(null)
const list = ref([])

const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const canSearch = computed(()=>{
  return search.value?.length > 3
})

const { WID } = useAppStore()

const getOptions =async ()=>{
  if(!canSearch.value) return
  loading.value = true
  try{
    const response = await useHttpPost('insurance/get-insurance-job' , { body : { Title : search.value , WorkspaceCode:WID } })

    isSearch.value = true
    list.value = response.Data

    loading.value = false
  }catch(e){
    console.log(e)
  }finally {
    loading.value = false
  }
}

watch(search,val=>{
  if(canSearch.value){
    isSearch.value = false
  }
})

const noDataText = computed(()=>{
  if(loading.value){
    return 'در حال دریافت اطلاعات'
  }else if(!list.value.length && !canSearch.value){
    return 'عنوان شغل را وارد کنید'
  }else if(!list.value.length && isSearch.value){
    return 'اطلاعاتی برای نمایش نیست'
  } else if(!list.value.length && canSearch.value){
    return 'برای جستجو کلید enter را فشار دهید'
  }else{
    return 'اطلاعاتی برای نمایش نیست'
  }
})
</script>
