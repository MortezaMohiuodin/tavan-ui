<template>
  <div class="tw-relative tw-pt-20">
    <div
      class="tw-text-center tw-absolute tw-z-10 tw-inset-0"
      style="height: 210px;"
    >
      <photo-upload
        id="avatar"
        v-model="form.avatar"
        :src="form.pic"
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
import provinceSelect from '@/components/common/provinceSelect.vue'
import citySelect from '@/components/common/citySelect.vue'

const store = useAppStore()

const route = useRoute()
const router = useRouter()

console.log(store.showDeactiveUser)

const form = ref({})

const loading = ref(false)
const submitLoading = ref(false)
const avatarChanged = ref(false)

const formSchema = computed(()=>{
  return [
    { model: 'Name' , component : 'input' , title : 'نام'  },
    { model: 'Family' , component : 'input' , title : 'نام خانوادگی'  },
    { model: 'Gender' , component : 'select' , title : 'جنسیت' , items : $enums.Gender },
    { model: 'Email' , component : 'input' , title : 'ایمیل'  },
    { model: 'Mobile' , component : 'input' , title : 'مویایل'  },
    { model: 'EmployeeCode' , component : 'input' , title : 'کد پرسنلی'  },
    { model: 'JobGroup' , component : 'input' , title : 'گروه شغلی' , disabled : true  },
    { model: 'JobSubGroup' , component : 'input' , title : 'زیرگروه شغلی' ,  disabled : true  },
    { model: 'Birthday' , component : 'datepicker' , title : 'تاریخ تولد'  },
    { model:'StateId', component : provinceSelect, title : 'استان'  },
    { model: 'CityId' , component : citySelect , title : 'شهر'  , stateId: form.value['StateId'] },
    { model : 'showDeactiveUser' , component : 'checkbox' , label : 'نمایش کاربران غیر فعال' , condition : val => store.permits.includes('LogManager') },
  ]
})

const submit = async (payload = {})=>{
  if(form.value.showDeactiveUser !== store.showDeactiveUser){
    await toggleShowDeactiveUser()
  }
  let editBody = {}
  let avatarBody = {}
  editBody = {
    "Mobile" : payload.Mobile,
    "Email" : payload.Email,
    "Name" : payload.Name,
    "Family" : payload.Family,
    "Gender" : payload.Gender || 0,
    "Birthday" : payload.Birthday ,
    "CityId" : payload.CityId,
    "StateId" : payload.StateId,
    "JobGroupId" : payload.JobGroupId,
    "JobSubGroupId" : payload.JobSubGroupId,
    "IsMobileRegister" : payload.IsMobileRegister,
    "IsEmailRegister" :payload.IsEmailRegister,
  }
  if(avatarChanged.value && form.value.avatar){
    const formData = new FormData()

    formData.append('Logo',form.value.avatar,'image.jpeg')
    avatarBody = formData
  }

  submitLoading.value = true
  try{
    const editRes = await useHttpPost('user/edit',{ body:editBody })
    if(avatarChanged.value && form.value.avatar){
      const avatarRes = await useHttpPost('user/set-avatar',{ body:avatarBody })
    }
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

    const res = await useHttpGet(`user/get-user-profile`)

    loading.value = false

    return res.Data
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

async function toggleShowDeactiveUser(){
  let body = {
    WorkspaceId : store.WID,
  }
  try{
    await useHttpPost('workspace/toggle-deactive-user',{ body })
    store.showDeactiveUser = !store.showDeactiveUser
  }catch(e){
    console.log(e)
  }
}

watch(()=>form.value.avatar,val=>{
  if(val){
    avatarChanged.value = true
  }
})

onMounted(async ()=>{
  let data
  try{
    data = await getUser()

  }catch(e){
    data = store.userInfo
  }
  form.value = {
    "Mobile" : data.Mobile,
    "Email" : data.Email,
    "Name" :  data.Name,
    "Family" : data.Family,
    "Gender" : data.Gender,
    "Birthday" : data.Birthday ,
    "CityId" : data.CityId,
    "StateId" : data.StateId,
    "JobSubGroup" : data.JobSubGroup,
    "JobGroup" : data.JobGroup,
    "JobSubGroupId" : data.JobSubGroupId,
    "JobGroupId" : data.JobGroupId,
    "IsMobileRegister" : data.IsMobileRegister,
    "IsEmailRegister" :data.IsEmailRegister,
    "pic" : data.Pic,
    "avatar" : null,
    "showDeactiveUser" : store.showDeactiveUser,
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
