<template>
  <v-autocomplete
    v-model="value"
    :items="list"
    :no-data-text="stateId ? 'اطلاعاتی برای نمایش نیست' : 'استانی انتخاب نشده است'"
    v-bind="$attrs"
  />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useLists } from '@/store/lists'

const props = defineProps({
  modelValue : { validator: val=>(['string','object','undefined','number','boolean'].includes(typeof val)) , default : null },
  stateId : { type: Number, default :null , required : false },
})

const emit = defineEmits(['update:modelValue'])

const { lists } = useLists()

const list = computed(()=>{
  if(!props.stateId) return []
  const tempList = lists.states

  const cityList = tempList?.find(val=>val.Id === props.stateId)?.Cites

  if(!cityList) return []

  return cityList.map(val=>({ value : val.Id , title : val.Name }))
})

const value = useVModel(props , 'modelValue',emit)
</script>
