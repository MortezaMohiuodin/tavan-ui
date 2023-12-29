<template>
  <v-autocomplete
    v-model="value"
    :items="list"
    :loading="loading"
    :no-data-text="loading ? 'در حال دریافت اطلاعات' : 'اطلاعاتی برای نمایش نیست'"
    v-bind="$attrs"
    @update:focused="x"
  />
</template>

<script setup>
const props = defineProps({
  modelValue : { type : Number , default : null },
  url : { type : String , default : null , required: false },
  method : { type : String , default : 'get' , required: false },
  params : { type : Object , default: ()=>({}) , required : false },
  searchable : { type : Boolean , default : false , required : false },
  onMap : { type: Function , default : null , required : false },
  onFilter : { type: Function , default : null , required : false },
  items : { type: Array , default : null , required : false },
})

const emit = defineEmits(['update:modelValue'])
const list = ref([])
const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const getOptions =async ()=>{
  if(list.value.length) return
  loading.value = true
  try{
    let response
    if(props.method === 'get')
      response = await useHttpGet(props.url, { params: props.params })
    else
      response = await useHttpPost(props.url, { body: props.params })
    loading.value = false
    list.value = response.Data
    if(props.onFilter) {
      list.value = list.value.filter(val=>{
        return props.onFilter(val)
      })
    }
    if(props.onMap) {
      list.value = list.value.map(val=>{
        return props.onMap(val)
      })
    }

  }catch(e){
    console.log(e)
  }finally {
    loading.value = false
  }
}

const x = ()=>{
  if(props.items.value === null) getOptions()
  else {
    list.value = props.items
  }
}
</script>
