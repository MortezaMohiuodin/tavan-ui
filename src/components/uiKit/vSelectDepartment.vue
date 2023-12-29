<template>
  <v-autocomplete
    v-model="value"
    :items="list"
    :loading="loading"
    :no-data-text="loading ? 'در حال دریافت اطلاعات' : 'اطلاعاتی برای نمایش نیست'"
    v-bind="$attrs"
    item-title="Title"
    item-value="DepartmentCode"
    :chips="$attrs.multiple"
    closable-chips
    @update:focused="getOptions"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useAppStore } from '@/store/app'

const props = defineProps({
  modelValue : { type : [Number,Array] , default : null },
})

const emit = defineEmits(['update:modelValue'])
const store = useAppStore()
const list = ref([])
const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const getOptions =async ()=>{
  if(list.value.length) return
  loading.value = true
  try{
    const response = await useHttpGet('department/get-workspace-department', { params: { WorkspaceCode : store.WID } })

    loading.value = false
    list.value = response.Data.map(val=> ({ 'DepartmentCode' : val.DepartmentCode , 'Title' : val.Title }))
  }catch(e){
    console.log(e)
  }finally {
    loading.value = false
  }
}
</script>
