<template>
  <div class="tw-relative tw-pt-20">
    <div
      class="tw-text-center tw-absolute tw-z-10 tw-inset-0"
      style="height: 210px;"
    >
      <photo-upload
        id="avatar"
        v-model="form.uploadImage"
        :src="form.image"
      />
      <label
        for="avatar"
        class="fieldLabel tw-font-YEKAN-BAKH-MEDIUM !tw-text-center tw-mt-6 !tw-text-base"
      >
        ادیت عکس پروفایل
      </label>
    </div>
    <v-card-default
      class="tw-pt-20"
      :loading="submitLoading"
    >
      <div class="tw-mt-20">
        <v-form-extend
          v-model="form"
          :schema="formSchema"
          :loading="loading"
          :actions="false"
        />
      </div>
    </v-card-default>
  </div>
  <div
    class="tw-mt-8 tw-text-left"
  >
    <v-btn-cancel
      @click="$router.back()"
    >
      برگشت
    </v-btn-cancel>
    <v-btn-success
      class="tw-w-24 sm:tw-w-44"
      :loading="loading"
      @click="submit(form)"
    >
      ذخیره
    </v-btn-success>
  </div>
</template>
  
<script setup>
const store = useAppStore()
  
const route = useRoute()
const router = useRouter()
  
  
const form = ref({
})
  
const loading = ref(false)
const submitLoading = ref(false)
const avatarChanged = ref(false)
  
const formSchema = computed(()=>{
  return [
    { model: 'name' , component : 'input' , title : 'نام'  },
    { model: 'email' , component : 'input' , type: 'email' ,title : 'ایمیل'  },
    { model: 'role' , component : 'select' , title : 'نقش' , items : $enums.role },
    { model: 'gender' , component : 'select' , title : 'جنسیت' , items : $enums.gender },
    { model: 'phone' , component : 'input' , title : 'مویایل'  },
    { model: 'city' , component : 'input' , title : 'شهر'  },
    { model: 'country' , component : 'input' , title : 'کشور'  },
  ]
})

watch(()=> form.value.uploadImage , val=>{
  avatarChanged.value = true
})

const submit = async (payload = {})=>{
  let editBody = {}
  editBody = {
    "name" : payload.name,
    "email" : payload.email,
    "role" : payload.role,
    "phone" : payload.phone,
    "gender" : payload.gender,
    "city" : payload.city,
    "country" : payload.country,
  }
  if(avatarChanged.value && form.value.uploadImage){
    const formData = new FormData()
  
    formData.append('file',form.value.uploadImage,'image.jpeg')
    let avatarBody = formData
    try{
      const uploadRes = await useHttpPost('/upload',{ body:avatarBody  })

      console.log(uploadRes)
      editBody.image = uploadRes.dist
    }catch(e){
      console.log(e)
    }
  
  }
  
  submitLoading.value = true
  try{
    const editRes = await useHttpPost('/profile',{ body:editBody })
   
    setTimeout(() => {
      submitLoading.value = false
    }, 1000)
      
    return editRes
  }catch(e){
    setTimeout(() => {
      submitLoading.value = false
    }, 1000)
    throw new Error(e)
  }
}
  
  
const getUser = async ()=>{
  try{
    loading.value = true
  
    const res = await useHttpGet(`/profile`)
  
    loading.value = false
  
    return res
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}
  
onMounted(async ()=>{
  let data
  try{
    data = await getUser()
  
  }catch(e){
    data = store.userInfo
  }
  form.value = {
    "name" : data.name,
    "email" : data.email,
    "gender" :  data.gender,
    "city" : data.city,
    "phone" : data.phone,
    "country" : data.counry,
    "role" : data.role ,
    "image" : data.image,
    "verified" : data.verified,
    "uploadImage" : null,
  }
  
},
)
</script>
  
  <route>
  {
    meta: {
      title: "ویرایش پروفایل"
    }
  }
  </route>
  