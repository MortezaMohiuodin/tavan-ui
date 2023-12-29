<template>
  <v-autocomplete
    v-model="value"
    :items="list"
    :loading="loading"
    :no-data-text="loading ? 'در حال دریافت اطلاعات' : 'اطلاعاتی برای نمایش نیست'"
    item-title="Title"
    item-value="EmployeesCode"
    :chips="false"
    v-bind="$attrs"
    @update:focused="getOptions"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useAppStore } from '@/store/app'

const props = defineProps({
  modelValue : { type : [Number,String] , default : null },
  depthLevelType: { type: [Number, String], default: null },
})

const emit = defineEmits(['update:modelValue'])
const store = useAppStore()
const list = ref([])
const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const getOptions =async ()=>{
  if(loading.value || list.value.length) return
  loading.value = true
  try{
    const response = await useHttpPost('employee/get-all', {
      body: {
        WorkspaceCode :store.WID,
        Status: null,
        DepthLevelType: props.depthLevelType,
      },
    })

    loading.value = false
    list.value = response.Data.map(val=> ({ 'Title' : `${val.Name} ${val.Family}` , 'EmployeesCode' : val.EmployeesCode }))
  }catch(e){
    console.log(e)
  }finally {
    loading.value = false
  }
}
</script>
