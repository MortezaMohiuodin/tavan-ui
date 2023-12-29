<template>
  <div>
    <v-row>
      <v-col>
        <h3 class="tw-text-xl lg:tw-text-2xl tw-font-semibold">
          افزودن کارمند جدید
        </h3>
        <p class="tw-text-neutral-800">
          بخش
          {{ sectionTitle }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-chip-group
          v-model="step"
          selected-class="selected-chip"
          class="customChipGroups tw-justify-end tw-gap-3"
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
        @next="handleNext"
        @prev="handlePrev"
      />
    </keep-alive>
  </div>
</template>

<script setup>
import IdentityForm from '@/components/KARPOOSHE/employees/forms/identityForm.vue'
import ContactForm from "@/components/KARPOOSHE/employees/forms/contactForm.vue"
import BankForm from '@/components/KARPOOSHE/employees/forms/bankForm.vue'
import AddressForm from '@/components/KARPOOSHE/employees/forms/addressForm.vue'
import SecurityForm from '@/components/KARPOOSHE/employees/forms/securityForm.vue'
import JobForm from '@/components/KARPOOSHE/employees/forms/jobForm.vue'

const SECTIONS = [
  { value: 1, title:'اطلاعات هویتی' , icon:'custom:user'  },
  { value: 2 , title:'اطلاعات ارتباطی' , icon:'custom:phone' },
  { value: 3 , title:'اطلاعات بانک' , icon:'custom:card' },
  { value: 4 , title:'آدرس' , icon:'custom:location' },
  { value: 5 , title:'بیمه و مالیات' , icon:'custom:security' },
  { value: 6 , title:'قرارداد' , icon:'custom:checklist' },
  { value: 7, title:'سایر اطلاعات' , icon:'custom:more' },
]

const form = ref({})
const step = ref(1)

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
  default:
    component = IdentityForm
  }

  return component
})

const sectionTitle = computed(()=>{
  return SECTIONS.find(item=>item.value === step.value)?.title || 'فرم'
})

const handleNext = val=>{
  step.value++
  form.value = { ...form.value , ...val }
}

const handlePrev = ()=>{
  step.value--
}
</script>
