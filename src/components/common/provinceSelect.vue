<template>
  <v-autocomplete
    v-model="value"
    :items="list"
    :loading="loading"
    :no-data-text="loading ? 'در حال دریافت اطلاعات' : 'اطلاعاتی برای نمایش نیست'"
    v-bind="$attrs"
    @update:focused="getOptions"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useLists } from '@/store/lists'

const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : null },
})

const emit = defineEmits(['update:modelValue'])

const { getLists , updateLists } = useLists()

const list = computed({
  get(){
    const tempList = getLists('states')
    if(!tempList) return []

    return tempList.map(val=>({ value : val.Id , title : val.Name }))
  },
  set(val){
    updateLists('states',val)
  },
})

const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const getOptions =async ()=>{
  if(!!list.value && list.value.length) return
  loading.value = true
  try{
    const response = await useHttpGet('city/get-state')

    list.value = response.Data

    loading.value = false
  }catch(e){
  }finally {
    loading.value = false
  }
}

getOptions()
</script>
