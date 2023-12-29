<template>
  <div>
    <form-page-header />
    <v-row
      class="tw-mb-1"
      align="center"
    >
      <v-col cols="auto">
        <v-chip-group
          v-model="step"
          selected-class="selected-chip"
          class="customChipGroups tw-gap-3"
          mandatory
        >
          <v-chip
            v-for="(item , index) in SECTIONS"
            :key="index"
            :prepend-icon="item.icon"
            :ripple="false"
            :value="item.value"
          >
            {{ item.title }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <keep-alive>
      <component
        :is="formComponent"
        :key="step"
        v-model="form"
        :loading="loading"
        :disabled="!permits.includes('UpdateEmployeeInfo')"
        @next="handleNext"
        @prev="handlePrev"
      />
    </keep-alive>
    <v-row
      class="mt-3 tw-w-full"
    >
      <!--    <v-col -->
      <!--      cols="12" -->
      <!--      lg="6" -->
      <!--      class="lg:tw-text-left" -->
      <!--    > -->
      <!--      <v-btn -->
      <!--        color="secondary" -->
      <!--        class="tw-mx-[4px] tw-w-[180px]" -->
      <!--        size="large" -->
      <!--        rounded="xl" -->
      <!--        @click="handleNext" -->
      <!--      > -->
      <!--        مرحله بعدی -->
      <!--      </v-btn> -->
      <!--    </v-col> -->
      <v-col
        cols="12"
        class="tw-text-center"
      >
        <v-btn-cancel @click="$router.back()">
          انصراف
        </v-btn-cancel>
        <v-btn
          color="secondary"
          class="tw-mx-[4px] tw-w-[180px]"
          size="large"
          rounded="xl"
          :loading="loading"
          :disabled="!permits.includes('UpdateEmployeeInfo')"
          @click="submit"
        >
          ذخیره
        </v-btn>
      </v-col>
    <!--    <v-col -->
    <!--      cols="12" -->
    <!--      lg="6" -->
    <!--    > -->
    <!--      <v-btn -->
    <!--        color="secondary" -->
    <!--        variant="outlined" -->
    <!--        class="tw-mx-[4px] tw-w-[180px]" -->
    <!--        size="large" -->
    <!--        rounded="xl" -->
    <!--        @click="handlePrev" -->
    <!--      > -->
    <!--        مرحله قبلی -->
    <!--      </v-btn> -->
    <!--    </v-col> -->
    </v-row>
  </div>
</template>

<script setup>
import IdentityForm from '@/components/KARPOOSHE/employees/forms/identityForm.vue'
import ContactForm from "@/components/KARPOOSHE/employees/forms/contactForm.vue"
import BankForm from '@/components/KARPOOSHE/employees/forms/bankForm.vue'
import AddressForm from '@/components/KARPOOSHE/employees/forms/addressForm.vue'
import SecurityForm from '@/components/KARPOOSHE/employees/forms/securityForm.vue'
import JobForm from '@/components/KARPOOSHE/employees/forms/jobForm.vue'
import MoreForm from '@/components/KARPOOSHE/employees/forms/moreForm.vue'
import FormPageHeader from '@/components/organisms/formPage/formPageHeader.vue'


const SECTIONS = [
  { value: 1, title:'اطلاعات هویتی' , icon:'custom:user'  },
  { value: 2 , title:'اطلاعات ارتباطی' , icon:'custom:phone' },
  { value: 3 , title:'اطلاعات بانک' , icon:'custom:card' },
  { value: 4 , title:'آدرس' , icon:'custom:location' },
  { value: 5 , title:'بیمه و مالیات' , icon:'custom:security' },
  { value: 6 , title:'شغل' , icon:'custom:checklist' },
  { value: 7, title:'دسترسی' , icon:'custom:add' },
]

const { WID,permits } = useAppStore()
const route = useRoute()
const router = useRouter()

const form = ref({})

const step = ref(1)
const initialValue = ref({})
const loading = ref(false)

const isEdit = computed(()=>{
  return route.params.action === 'edit'
})

const id = computed(()=>{
  return route.params?.id
})

const formComponent = computed(()=>{
  let component = null
  switch (step.value) {
  case 1:
    component = IdentityForm
    break
  case 2:
    component = ContactForm
    break
  case 3:
    component = BankForm
    break
  case 4:
    component = AddressForm
    break
  case 5:
    component = SecurityForm
    break
  case 6:
    component = JobForm
    break
  case 7:
    component = MoreForm
    break
  default:
    component = IdentityForm
  }

  return component
})

const sectionTitle = computed(()=>{
  return SECTIONS.find(item=>item.value === step.value)?.title || 'فرم'
})

const handleNext = val=>{
  form.value = { ...form.value , ...val }
  if(step.value > 6){
    submit(form.value)
  }else{
    step.value++
  }
}

const handlePrev = ()=>{
  step.value--
}

const getItem = async (payload = {})=>{
  let body = {
    "WorkspaceCode": WID,
    "EmployeeCode" : id.value,
    ...payload,
  }
  loading.value = true
  try{
    const res = await useHttpPost(`employee/get-info`,{ body })

    loading.value = false

    return {
      ...res.Data,
      "InsuranceJob" : {
        JobCodeInTamin : res.Data.JobCodeInTamin,
        JobDescription : res.Data.JobDescription,
        Title : res.Data.JobDescription,
        InsuranceJobCode : res.Data.InsuranceJobCode,
      },
    }
  }catch(e){
    loading.value = false
    throw new Error(e)
  }
}

const submit = async (payload = {})=>{
  let url = isEdit.value ? 'employee/set-info' : 'employee/add-new-employee'
  let { InsuranceJob , ...params } = form.value

  let body = {
    "WorkspaceCode": WID,
    ...(isEdit.value && { "EmployeeCode" : id.value }),
    ...params,
    SendJoinMsg:'false',
    "InsuranceJobCode" : InsuranceJob?.InsuranceJobCode,
    "JobDescription" : InsuranceJob?.Title,
  }

  loading.value = true
  try{
    const res = await useHttpPost(url,{ body })

    loading.value = false
    router.push('/KARPOOSHE/basic/employees')

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
        title: "پروفایل کاربر"
      }
    }
</route>
