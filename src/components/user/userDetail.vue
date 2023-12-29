<template>
  <div class="tw-p-2">
    <div class="tw-flex tw-bg-[#F5F7FC] tw-rounded-3xl tw-py-8 tw-px-4 tw-mb-6">
      <v-avatar
        v-if="!item.Pic"
        class="!tw-rounded-xl tw-me-3"
        rounded="initial"
        size="75"
        :image="item.Pic"
      />
      <v-avatar
        v-else
        class="!tw-rounded-xl tw-me-3"
        rounded="initial"
        size="50"
        :image="avatarPlaceholder"
      />
      <div>
        <h4 class="tw-text-lg tw-font-YEKAN-BAKH-HEAVY">
          {{ item.Name }} {{ item.Family }}
        </h4>
        <span class="tw-text-[#959499] tw-text-base tw-font-YEKAN-BAKH-Medium">
          کد پرسنلی
          :
          {{ item.OrgPositionCode || '-' }}
        </span>
      </div>
    </div>
    <div>
      <div class="tw-mt-4">
        <template
          v-for="(setting,index) in settingModalRecords"
          :key="index"
        >
          <div class="tw-mb-4 tw-ms-6">
            <div class="tw-text-base tw-text-gray-350 tw-font-medium">
              {{ setting.title }}
            </div>
            <div class="tw-text-base tw-black tw-font-medium">
              <v-btn
                v-if="setting.click"
                variant="text"
                :prepend-icon="setting.icon"
                size="small"
                @click="setting.click"
              >
                <span class="tw-text-[16px]">{{ setting.value }}</span>
              </v-btn>
              <span
                v-else
                class="tw-text-[16px]"
              >{{ setting.value }}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="tw-flex tw-flex-col tw-mt-8 tw-gap-4">
        <v-btn-info
          v-if="edit"
          style="width: 100%!important;"
          size="x-large"
          color="secondary"
          variant="outlined"
          class="!tw-w-[120px] !sm:tw-w-[180px]"
          to="/profile/edit"
        >
          ویرایش اطلاعات
        </v-btn-info>
        <v-btn-info
          style="width: 100%!important;"
          size="x-large"
          class="!tw-w-[120px] !sm:tw-w-[180px]"
          :loading="loading_showSettingModal"
          @click="redirectToUserProfile"
        >
          ورود به پروفایل کاربر
        </v-btn-info>
      </div>
    </div>
  </div>
</template>


<script setup>
import avatarPlaceholder from "@/assets/images/profile/avatar-placeholder.png"

const props = defineProps({
  item : { type: Object , default : ()=>({}) , required: true },
  actions : { type : Boolean , default : true },
  exit : { type : Boolean , default : false },
  edit : { type : Boolean , default : false },
})

const { logout } = useAppStore()


const loading = ref(false)

const handleLogout = ()=>{
  loading.value = true
  setTimeout(()=>{
    loading.value = false
  },4000)
  logout()
}

const { WID,permits } = useAppStore()
const  router  = useRouter()
const route = useRoute()
const loading_showSettingModal = ref(false)
let settingModalRecords = computed(()=>{
  return [
    {
      title:' شماره همراه' ,
      value:`${props.item.AccountMobile || "ندارد" }`,
      show: true,
    },
    {
      title:'کد پرسنلی' ,
      value:`${props.item.OrgPositionCode || "ندارد" }`,
      show: true,
    },
    {
      title:'پست الکترونیک' ,
      value:`${props.item.AccountEmail || "ندارد" }`,
      show: true,
    },
    {
      title:'جنسیت',
      value:`${props.item.Gender !== null ? $getEnum($enums.gender , 'key' , props.item.Gender,'value') : 'نامشخص'  }`,
      show: true,
    },
    {
      title:'گروه شغلی',
      value:`${props.item.OrgPositionTitle || 'نامشخص' } `,
      show: true,
    },
    {
      title:'تاریخ تولد',
      value:`${props.item.Birthday !== null ? $moment(props.item.Birthday).format('jYYYY/jM/jD')  :  'نامشخص' }`,
      show: true,
    },
    {
      title:'دسترسی' , icon:'fa-solid fa-arrow-up-right-from-square', value:`${props.item.Role?.Title || "ندارد" }`,
      click:()=>{
        props.item.RoleName ?
          router.push(`/KARPOOSHE/assign/role`):
          router.push(`/KARPOOSHE/assign/role/add/new`)
      },
      show: true,
    },
    {
      title:'پست سازمانی' , icon:'fa-solid fa-arrow-up-right-from-square', value:`${props.item.OrgPosition?.Title || "ندارد" }`,
      click:()=>{
        props.item.OrgPositionTitle ?
          router.push(`/KARPOOSHE/assign/orgPosition`):
          router.push(`/KARPOOSHE/assign/orgPosition/add/new`)
      },
      show: true,
    },
    {
      title:'دپارتمان' ,  icon:'fa-solid fa-arrow-up-right-from-square', value:`${props.item?.Department?.length ?
        'دارد'
        :
        'ندارد'
      }`,
      click:()=>{
        props.item.Department.length ?
          router.push(`/KARPOOSHE/assign/department`):
          router.push(`/KARPOOSHE/assign/department/add/new`)
      },
      show: permits.includes('DepartmentManager'),
    },
    {
      title:'شیفت کاری' ,
      icon:'fa-solid fa-arrow-up-right-from-square',
      value:`${props.item.HaveShift? 'دارد': "ندارد" }`,
      click:()=>{
        props.item.HaveShift ?
          router.push(`/KARSAAT/assign/shift/edit/${props.item.EmployeesCode}`) :
          router.push(`/KARSAAT/assign/shift/multi-assign/default`)
      },
      show: permits.includes('ShiftManager'),
    },
  ]
})

const redirectToUserProfile = async ()=>{
  if(permits.includes('LoginByAdmin'))


    try{
      loading_showSettingModal.value=true


      const data = await useHttpPost('/user/login-by-admin',{ body: { Username:props.item.Username,WorkspaceId:WID } })
      const { copy } = useClipboard()

      copy( window.location.host + '/login?t=' + data.Data.Key)
      loading_showSettingModal.value=false
      useSnackbar('لینک ورود به پنل کاربر در کیپ بورد ذخیره شد','success')
    }catch (error){
      useSnackbar('مشکلی پیش امده','error')
    }
  else useSnackbar('شما دسترسی ورود با کاربر دیگر را ندارید' , 'error')
}
</script>
