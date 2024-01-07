<template>
  <v-autocomplete
    v-model="value"
    :items="options"
    :loading="loading"
    item-value="key"
    item-title="value"
    :no-data-text="loading ? 'در حال دریافت اطلاعات' : 'اطلاعاتی برای نمایش نیست'"
    :chips="$attrs.multiple"
    :closable-chips="$attrs.multiple"
    v-bind="$attrs"
    @update:menu="getOptions"
  />
</template>

<script setup>
import { uuidv4 } from '@/helper/utility'

const props = defineProps({
  modelValue : { type : [Boolean,null,Number,Object,String,Array] , default : null },

  // static options
  items : { type: Array , default : null , required : false },

  // url address for requesting options
  url : { type : String , default : null , required: false },

  // method for url , used in case url is passed
  method : { type : String , default : 'get' , required: false },

  // payload for url request, used in case url is passed
  params : { type : Object , default: ()=>({}) , required : false },

  // respond callback for formatting options,used in case url is passed
  resCallback : { type : Function , default : null , required : false },

  // full request for options list , response should have Data parameter
  service : { type :Function ,default : null ,required:false },

  // list key in list store
  name : { type : String , default : uuidv4() },
})

const emit = defineEmits(['update:modelValue'])

const options = computed(()=>{
  return props.items !== null ? props.items : list.value
})

const list = ref([])


const loading = ref(false)

const value = useVModel(props , 'modelValue',emit)

const isItemsFromServer = computed(()=>{
  return !props.items
})


onMounted(()=>{
  if(isItemsFromServer.value && value.value){
    getOptions()
  }
})

async function getOptions(){
  if(!isItemsFromServer.value) return
  if(props.items?.length) return
  if(list.value?.length) return
  loading.value = true
  try{
    let array
    if(props.service){
      array = await props.service(props.params)
    }else if(props.method === 'get'){
      const { Data } = await useHttpGet(props.url, { params: props.params })

      array = Data
    }else if(props.method === 'post'){
      const { Data } = await useHttpPost(props.url, { body: props.params })

      array = Data
    }
    list.value = array
    if(props.resCallback) {
      list.value = props.resCallback(array)
    }
    loading.value = false
  }catch(e){
    console.log(e)
    loading.value = false
  }finally {
    loading.value = false
  }
}
</script>
