<template>
  <div>
    <form-page-header />
    <v-form-extend
      v-model="form"
      :schema="schema"
      :loading="loading"
      @on-submit="submit(form)"
      @on-cancel="$router.back()"
    />
  </div>
</template>
  
<script setup>
const route = useRoute()
const router = useRouter()
const form = ref({})
const initialValue = ref({})
const loading = ref(false)
  
const isEdit = computed(()=>{
  return route.params.action === 'edit'
})
  
const id = computed(()=>{
  return route.params?.id
})
  
const schema = computed(()=>{
  let array = [
    { model:'name', component : 'input', title : 'نام' , required:true  },
    { model:'email', component : 'input', title : 'ایمیل'  , type : 'email' , required: true },
    { model:'role', component : 'select' , title : 'نقش' , items: $enums.role , required: true },
    { model:'phone', component : 'input' , title : 'موبایل'  },
    { model:'city', component : 'input' , title : 'شهر'  },
    { model:'country', component : 'input' , title : 'کشور' },
  ]
  if(!isEdit.value){
    array.push( { model:'password', component : 'input' , title : 'رمز عبور',type : 'password' , required: true  })
  }
  
  return array
})
  
const getItem = async (payload = {})=>{
  
  loading.value = true
  try{
    const res = await useHttpGet(`/users/${id.value}`)
  
    loading.value = false
  
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
  
const submit = async (payload = {})=>{
  let url = isEdit.value ? `/users/${id.value}` : '/users'
  let body = {
    ...payload,
  }
  
  loading.value = true
  try{
    const res = await useHttpPost(url,{ body , method: isEdit.value ? 'PATCH' : 'POST' })
  
    loading.value = false
    router.push('/dashboard/users')
  
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
  
onMounted(async ()=>{
  let data
  if(isEdit.value && id.value){
    data = await getItem()
    form.value = data
    initialValue.value = data
  }
})
</script>
  
  <route>
  {
  meta: {
  title: "افزودن یا ویرایش کاربر"
  }
  }
  </route>
  