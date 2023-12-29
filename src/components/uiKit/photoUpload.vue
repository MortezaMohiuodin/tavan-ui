<template>
  <div class="tw-relative">
    <div
      class="tw-text-center tw-relative tw-w-[180px] tw-mx-auto"
    >
      <v-avatar
        :size="150"
        :image="preview"
        class="tw-mb-3"
        style="border-radius: 40px"
      />
      <v-file-input
        ref="fileRef"
        v-model="file"
        class="file-uploader tw-mt-3"
        prepend-icon="custom:camera"
        label="بارگزاری عکس"
        accept="image/*"
      />
    </div>
  </div>
</template>

<script setup>
import AvatarPlaceholder from '@/assets/images/profile/avatar-placeholder.png'

const props = defineProps({
  modelValue : { type : [Object,Array,String] , default : null },
  src : { type : [String] , default : AvatarPlaceholder },
})

const emit = defineEmits(['update:modelValue'])
const preview = ref(null)
const file = ref(null)
const loading = ref(false)

const fileRef = ref()

watch(file , val=>{
  if(val){
    const blob = new Blob([val[0]], { type: "image/png" })

    preview.value = URL.createObjectURL(blob)
    emit('update:modelValue',blob)
  }else{
    emit('update:modelValue',null)
  }

})

const setAvatar = async ()=>{
  if(!file.value) {
    useSnackbar('فایلی انتخاب نشده است','error')

    return
  }
  const blob = new Blob([file.value[0]], { type: 'application/octet-stream' })


  // formData.append('Logo',blob,'image.jpeg')
  // let body = formData
}

watch(()=>props.src,val=>{
  preview.value = val
},{ immediate:true })
</script>

<style lang="scss">
.file-uploader{

  grid-template-areas: none;
  position: absolute;
  left: 0;
  bottom: -3px;
  .v-input__control{
    display: none;
  }
  .v-input__details{
    display: none;
  }
  .v-input__prepend{
    background-color: #ffb162;
    box-shadow: 0px 5px 25px 0px rgba(246, 139, 31, 0.40);
    margin-inline-end: initial!important;
    width: 50px;
    height: 50px;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
      opacity: 1;
      font-size: 32px;
      color: white;
    }
  }
}
</style>
