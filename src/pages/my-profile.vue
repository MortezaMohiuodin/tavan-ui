<template>
  <div class="tw-text-left">
    <v-btn-back
      text="بازگشت"
      @click="$router.back()"
    />
  </div>
  <v-card-default
    class="tw-mx-auto tw-max-w-[500px] tw-p-4 sm:tw-p-6"
    :loading="loading"
  >
    <div
      class="tw-text-center"
    >
      <v-avatar
        :size="100"
        :image="preview"
        class="tw-mb-3"
      />

      <div
        v-show="preview"
        class="tw-flex tw-gap-2 tw-justify-center"
      >
        <v-btn
          size="small"
          variant="tonal"
          color="error"
          icon="custom:trash"
          @click="preview = AvatarPlaceholder;file = null"
        />
        <v-btn
          size="small"
          color="secondary"
          icon="fa fa-pen"
          elevation="0"
          :loading="submitLoading"
          :variant="file ? 'elevated':'tonal'"
          :disabled="!file"
          @click="setAvatar"
        />
      </div>
    </div>
    <v-file-input
      ref="fileRef"
      v-model="file"
      class="tw-mt-3"
      label="بارگزاری عکس"
      accept="image/*"
    />

    <v-list>
      <v-list-item v-for="field in userSchema">
        <span class="tw-font-YEKAN-BAKH-MEDIUM tw-text-base tw-test-slate-600"> {{ field.title }} </span>
        <template #append>
          <span class="tw-font-YEKAN-BAKH-LIGHT tw-text-base">
            {{ userProfile && userProfile[field.key] }}
          </span>
        </template>
      </v-list-item>
    </v-list>
    <v-overlay
      :model-value="loading"
      scrim="white"
      contained=""
    />
  </v-card-default>
</template>

<script setup>
import AvatarPlaceholder from '@/assets/images/profile/avatar-placeholder.png'

const userProfile = ref({})
const loading = ref(false)
const file = ref(null)
const active = ref(false)
const fileRef = ref()
const submitLoading = ref(false)
const preview = ref(AvatarPlaceholder)

watch(file , val=>{
  if(val){
    const blob = new Blob([val[0]], { type: "image/png" })

    preview.value = URL.createObjectURL(blob)
  }

})

const userSchema = [
  { key : 'Name' , title : 'نام' },
  { key : 'Family' , title : 'نام خانوادگی' },
  { key : 'Gender' , title : 'جنسیت' },
  { key : 'Mobile' , title : 'موبایل' },
  { key : 'Email' , title : 'ایمیل' },
  { key : 'JobGroup' , title : 'گروه شغلی' },
  { key : 'JobSubGroup' , title : 'زیرگروه شغلی' },
  { key : 'Birthday' , title : 'تاریخ تولد' },
  { key : 'State' , title : 'استان' },
  { key : 'City' , title : 'شهر' },
]

const getUserProfile = async ()=>{
  loading.value = true
  try{
    const res = await useHttpGet('user/get-user-profile')

    loading.value = false

    return {
      ...res.Data,
      "Birthday" : $moment(res.Data.Birthday).isValid() ? $moment(res.Data.Birthday).format('jDD jMMMM jYYYY') : '',
      "Gender" : res.Data.Gender === 0 ? 'مرد' : res.Data.Gender === 1 ? "خانم" : 'نامعلوم',
    }
  }catch(e){
    console.error(e)
  }
}

const setAvatar = async ()=>{
  if(!file.value) {
    useSnackbar('فایلی انتخاب نشده است','error')

    return
  }
  const formData = new FormData()
  const blob = new Blob([file.value[0]], { type: 'application/octet-stream' })

  formData.append('Logo',blob,'image.jpeg')
  let body = formData
  try{
    submitLoading.value = true

    const res = useHttpPost('user/set-avatar', { body })

    useSnackbar('عکس آواتار با موفقیت تغییر یافت' , 'success')
    setTimeout(()=>{
      submitLoading.value = false
    },500)

  }catch(e){
    setTimeout(()=>{
      submitLoading.value = false
    },500)
    console.error(e)
  }
}

onMounted(async()=>{
  try{
    userProfile.value = await getUserProfile()
    preview.value = userProfile.value.Pic
  }catch(e){
    userProfile.value =  useAppStore().userInfo
  }
})
</script>
