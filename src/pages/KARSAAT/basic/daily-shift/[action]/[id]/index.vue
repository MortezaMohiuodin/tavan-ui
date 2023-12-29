<template>
  <div>
    <form-page-header />
    <v-form-extend
      v-model="form"
      :loading="loading"
      :schema="schema"
      @on-submit="submit"
      @on-cancel="$router.back()"
    >
      <template
        v-for="(beforeSlot,index) in beforeSlots"
        #[beforeSlot.slot]
        :key="index"
      >
        <v-col cols="12">
          <v-divider-extend>
            <span class="v-divider__title">{{ beforeSlot.label }}</span>
          </v-divider-extend>
        </v-col>
      </template>
    </v-form-extend>
  </div>
</template>

<script setup>
import DepartmentSelect from '@/components/common/departmentSelect.vue'
import { calcTimeDiff, hmToMinute, minuteToHms } from '@/helper/utility'
 
const store = useAppStore()
const { params } = useRoute()
const form = ref({})
let requestPayload = { WorkspaceCode : store.WID }
let requestURL = ''
let loading = ref(false)
const router = useRouter()
const route = useRoute()


const beforeSlots = [
  { slot:'before.isRest',label:'شرایط استراحت شیفت' },
  { slot:'before.shiftType',label:'ساعت ورود و خروج' },
  { slot:'before.Overtime',label:'شرایط اضافه کاری' },
  { slot:'before.OvertimeCondition',label:'شرایط اضافه کاری' },
  { slot:'before.OvertimeInHoliday',label:'شرایط تعطیل کاری' },
  { slot:'before.OvertimeInFriday',label:'شرایط جمعه کاری' },
  { slot:'before.DelayPenalty',label:'شرایط تاخیر در ورود' },
  { slot:'before.Rush',label:'شرایط تعجیل (زود حاضر شدن سر کار) در ورود' },
  { slot:'before.Shortage',label:'شرایط کسر کار' },
  { slot:'before.NightWork',label:'شرایط شب کاری' },
  { slot:'before.RotateWork',label:'شرایط نوبت کاری (کار گردشی)' },
  { slot:'before.AutoAbsent',label:'عدم حضور اتوماتیک' },
  { slot:'before.IsPublic',label:'دپارتمان' },
]

const schema = computed(()=>{
  return [
    // ****title****
    { model:'ShiftTitle', component : 'input', title : 'عنوان شیفت' , width: '300px',col : { cols: 12 } , required:true } ,

    //  ****شرایط استراحت شیفت****
    { model:'restShiftFirstTimeCheck', component : 'checkbox' , label:'مشمول استراحت شود' },
    { model:'IsSetSecondRest', component : 'checkbox' , label: 'در صورت حضور بیش از زمان تعیین شده استراحت دوم لحاظ شود'  },
    { model:'Rest', component : 'datepicker' , title: 'مدت زمان استراحت'  , condition: val=> val?.restShiftFirstTimeCheck , type:'time'  },
    { model:'MinWorkTimeForSecondRest', component : 'datepicker' , title: 'حداقل زمان کارکرد برای تثبیت زمان استراحت دوم' , initialValue: '00:00' ,condition: val=> val?.IsSetSecondRest && val?.restShiftFirstTimeCheck, type:'time'  },
    { model:'SecondRest', component : 'datepicker' , title: 'مدت استراحت دوم' , condition: val=> val?.IsSetSecondRest && val?.restShiftFirstTimeCheck ,initialValue: '00:00', type:'time' },
    
    // ****ساعت ورود و خروج****
    { model:'shiftType', component : 'radio-group'  , options: $enums.shiftType.map(val=>({ value:val.key,label:val.value }))  },
    
    { model:'Enter', component : 'datepicker' , title: 'ساعت ورود', condition: val=> (val?.shiftType === 1) , type:'time' , col:{ cols:12 , lg: 3 } },
    { model:'Exit', component : 'datepicker' , title: 'ساعت خروج', condition: val=> val?.shiftType === 1 , type:'time' , col:{ cols:12 , lg: 3 } },
    
    { model:'Enter', component : 'datepicker' , title: 'ساعت ورود اول', condition: val=> val?.shiftType === 2 , type:'time' , col:{ cols:12 , lg: 3 } },
    { model:'Exit', component : 'datepicker' , title: 'ساعت خروج اول', condition: val=> val?.shiftType === 2, type:'time' , col:{ cols:12 , lg: 3 } },
    { model:'Enter2', component : 'datepicker' , title: 'ساعت ورود دوم' , condition: val=> val?.shiftType === 2 , type:'time' , col:{ cols:12 , lg: 3 } },
    { model:'Exit2', component : 'datepicker' , title: 'ساعت خروج دوم' , condition: val=> val?.shiftType === 2 , type:'time' , col:{ cols:12 , lg: 3 } },
    
    { model:'Rest', component : 'datepicker' , title: 'زمان استراحت' , disabled:true , type:'time', col: { cols:12 , lg:3 } },
    { model:'WorkTime', component : 'datepicker' , title: 'مدت حضور', type:'time' , col: { cols:12 , lg:3 } },
    
    { model:'WorktimeDependsEnterExit', component : 'checkbox' , label: 'محاسبه مدت کارکرد شیفت به زمان سپری شده در بازه شروع و پایان شیفت وابسته باشد' , condition : val=>val.shiftType === 1 },
    { component : 'alert'  , condition: val=> val?.shiftType === 3  ,  text:'در حالت شیفت شناور ساعت و ورود و خروج مهم نیست و فقط مدت کارکرد مهم است و برای کاربر پارامترهای تاخیر و تعجیل محاسبه نمیشود.'  },
    { component : 'alert'  , condition: val=> val?.shiftType === 2  ,  text:'شیفت در 2 نوبت صبح و عصر آغاز میشود. به این معنا که کارمند صبح سر کار حاضر میشود و بعد از اتمام نوبت صبح و خروج از محل کار مجدد در نوبت عصر همان روز بر سر کار حاضر میشود.' },

    // **** شرایط اضافه کاری ****
    { model:'Overtime', component : 'checkbox' , label: 'مشمول اضافه کاری شود' },
    { model:'OvertimeNeedConfirm', component : 'checkbox' , label: 'اضافه کاری نیاز به تایید دارد'  ,condition: val=> val?.Overtime },
    { model:'OvertimeMin', component : 'datepicker' , title: 'حداقل زمان اضافه کاری'  , condition: val=> val?.Overtime  , type:'time'  },
    { model:'OvertimeMax', component : 'datepicker' , title: 'حداکثر زمان اضافه کاری'  , condition: val=> val?.Overtime  , type:'time'  },

    // **** شرایط تعطیل کاری ****
    { model:'OvertimeInHoliday', component : 'checkbox' , label: 'مشمول تعطیل کاری شود'  },
    { model:'OvertimeHolidayNeedConfirm', component : 'checkbox' , label: 'تعطیل کاری نیاز به تایید دارد' ,condition: val=> val?.OvertimeInHoliday },
    { model:'OvertimeHolidayMin', component : 'datepicker' , title: 'حداقل زمان تعطیل کاری' , condition: val=> val?.OvertimeInHoliday , type:'time' },
    { model:'OvertimeHolidayMax', component : 'datepicker' , title: 'حداکثر زمان تعطیل کاری' , condition: val=> val?.OvertimeInHoliday , type:'time' },

    // **** شرایط جمعه کاری****
    { model:'OvertimeInFriday', component : 'checkbox' , label: 'مشمول جمعه کاری شود'  },
    { model:'OvertimeFridayNeedConfirm', component : 'checkbox' , label: 'جمعه کاری نیاز به تایید دارد' ,condition: val=> val?.OvertimeInFriday },
    { model:'OvertimeInFridayMin', component : 'datepicker' , title: 'حداقل زمان جمعه کاری', condition: val=> val?.OvertimeInFriday  , type:'time'  },
    { model:'OvertimeInFridayMax', component : 'datepicker' , title: 'حداکثر زمان جمعه کاری'  , condition: val=> val?.OvertimeInFriday  , type:'time'  },

    // **** شرایط تاخیر در ورود ****
    { model:'DelayPenalty', component : 'checkbox' , label: 'مشمول جریمه تاخیر شود' ,condition:val=>!val?.IsInOutChange },
    { model:'DelayPenaltyNotCalcuInHoliday', component : 'checkbox' , label: 'روزهای تعطیل محاسبه نشود'  ,condition: val=> val?.DelayPenalty && !val.IsInOutChange },
    { model:'DelayCanForgiven', component : 'checkbox' , label: 'امکان بخشش توسط مدیر وجود دارد',condition: val=> val?.DelayPenalty && !val?.IsInOutChange },
    { model:'DelayForgivenCalc', component : 'checkbox' , label: 'زمان بخشید شده جزء کارکرد محاسبه شود' ,condition: val=> val?.DelayPenalty && !val?.IsInOutChange },
    { model:'DelayPenaltyTime', component : 'datepicker' , title: 'سقف زمان ارفاق در تاخیر'  , condition: val=> val?.DelayPenalty && !val?.IsInOutChange , type:'time'  },
    { model:'DelayPenaltyPunishCalcuType' , component : 'select' , title : 'تعیین مبنای محاسبه' , items: $enums.penaltyRuleType , condition: val=> val?.DelayPenalty && !val?.IsInOutChange },

    //  ****شرایط تعجیل (زود حاضر شدن سر کار) در ورود****
    { model:'Rush', component : 'checkbox' , label: 'مشمول تعجیل در ورود شود' , condition:val => !val?.IsInOutChange },
    { model:'RushTime', component : 'datepicker' ,type:'time', title: 'سقف زمان تعجیل'  ,condition: val=> val?.Rush && !val?.IsInOutChange },

    //  ****شرایط کسر کار****
    { model:'Shortage', component : 'checkbox' , label: 'مشمول کسری کار' },
    { model:'AutoShortage', component : 'checkbox' , label: 'در صورت عدم ثبت تردد و عدم حضور برای کارمند کسری ثبت شود'  ,condition: val=> val?.Shortage },
    { model:'ShortageNotCalcuInHoliday', component : 'checkbox' , label: 'روزهای تعطیل محاسبه نشود'  ,condition: val=> val?.Shortage },
    { model:'ShortageCanForgiven', component : 'checkbox' , label: 'امکان بخشش توسط مدیر وجود دارد' ,condition: val=> val?.Shortage },
    { model:'ShortageForgivenCalc', component : 'checkbox' , label: 'زمان بخشیده شده جزء کارکرد محاسبه شود'  , condition: val=> val?.Shortage   },
    { model:'ShortageTime', component : 'datepicker' , title: 'سقف زمان بخشش کسری کار'  , condition: val=> val?.Shortage  , type:'time'  },
    { model:'ShortagePunishCalcuType' , component : 'select' , title : 'تعیین مبنای محاسبه' , items: $enums.penaltyRuleType , condition: val=> val?.Shortage },

    //  ****شرایط شب کاری****
    { model:'NightWork', component : 'checkbox' , label: 'مشمول شب کاری'  },
    { model:'NightWorkSupportTomorrowIO', component : 'checkbox' , label: 'اولین تردد، روز بعد به روزی که مشمول شبکاری است منتقل شود' ,condition: val=> val?.NightWork },
    { model:'NightWorkStartTime', component : 'datepicker' , title: 'ساعت شروع شب کاری' , initialValue : '19:00:00' , condition: val=> val?.NightWork  , type:'time'  },
    { model:'NightWorkEndTime', component : 'datepicker' , title: 'ساعت پایان شب کاری' ,initialValue : '07:00:00' , condition: val=> val?.NightWork  , type:'time'  },

    //  ****شرایط نوبت کاری (کار گردشی)****
    { model:'RotateWork', component : 'checkbox' , label: 'مشمول نوبت کاری' },
    { model:'RotateWorkMinTime', component : 'datepicker' , title: 'حداقل زمان نوبت کاری' , condition: val=> val?.RotateWork  , type:'time'  },
    { model:'RotateWorkMaxTime', component : 'datepicker' , title: 'حداکثر زمان نوبت کاری'  , condition: val=> val?.RotateWork  , type:'time'  },
    { model: 'RotateWorkType' , component : 'select' , title : 'تعیین مبنای محاسبه' , items: $enums.rotateWorkType , condition: val=> val?.RotateWork },

    //  ****عدم حضور اتوماتیک****
    { model: 'AutoAbsent' , component : 'checkbox' , label : 'ثبت عدم حضور پیش فرض برای کارمند'  },

    //  ****دپارتمان****
    { model: 'IsPublic' , component : 'checkbox' , label : 'شیفت عمومی می باشد' },
    { model: 'DepartmentIds' , component : DepartmentSelect , title : 'دبارتمان ها', condition: val=>!val?.IsPublic , multiple:true },
  ]
})


resetForm()





function resetForm() {
  form.value = {
    WorkspaceCode: store.WID,
    WorktimeDependsEnterExit: false,
    ShiftTitle: '',
    IsInOutChange: false,
    Enter: '08:00:00',
    Exit: '14:00:00',

    IsInOutInTwoPart: false,
    Enter2: '17:00:00',
    Exit2: '21:00:00',

    WorkTime: '05:30:00',

    Overtime: false,
    OvertimeNeedConfirm: false,
    OvertimeMax: '04:00:00',
    OvertimeMin: '00:00:00',

    OvertimeInHoliday: false,
    OvertimeHolidayNeedConfirm: false,
    OvertimeHolidayMax: '12:00:00',
    OvertimeHolidayMin: '00:00:00',

    OvertimeInFriday: false,
    OvertimeFridayNeedConfirm: false,
    OvertimeInFridayMax: '12:00:00',
    OvertimeInFridayMin: '00:00:00',
    RotateWork: false,
    RotateWorkMaxTime: '08:00:00',
    RotateWorkMinTime: '00:00:00',
    RotateWorkType: 0,
    NightWork: false,
    NightWorkStartTime: '01:00:00',
    NightWorkEndTime: '07:00:00',
    NightWorkCalcuType: 2,
    NightWorkSupportTomorrowIO: false,
    Shortage: false,
    ShortageCanForgiven: false,
    ShortageTime: '00:30:00',
    ShortagePunishCalcuType: 0,
    ShortageNotCalcuInHoliday: false,
    ShortageForgivenCalc: false,
    DelayPenalty: false,
    DelayCanForgiven: false,
    DelayPenaltyTime: '00:10:00',
    DelayPenaltyNotCalcuInHoliday: false,
    DelayPenaltyPunishCalcuType: 0,
    DelayForgivenCalc: false,
    Rush: false,
    RushTime: '00:45:00',

    AutoAbsent: false,
    AutoShortage: false,

    Rest: '00:00:00',
    IsSetSecondRest: false,
    SecondRest: null,
    MinWorkTimeForSecondRest: null,
    DepartmentIds: [],

    IsPublic: true,
    shiftType : 1,
  }
}
async function getSingleShift() {
  loading.value=true
  let shiftForm = await useHttpPost('/shift/get-single-shift',{ body:{
    Code: params.id,
    WorkspaceCode: store.WID,
  } })
  form.value = { ...form.value,...shiftForm.Data }
  if (
    form.value.IsInOutChange === false &&
    form.value.IsInOutInTwoPart === false
  ) {
    form.value.shiftType = 1
  } else if (
    form.value.IsInOutChange === false &&
    form.value.IsInOutInTwoPart === true
  ) {
    form.value.shiftType = 2
  } else if (
    form.value.IsInOutChange === true &&
    form.value.IsInOutInTwoPart === false
  ) {
    form.value.shiftType = 3
  }
  if (form.value.Rest !== '00:00:00') {
    form.value.restShiftFirstTimeCheck = true
  }
  if (form.value.MinWorkTimeForSecondRest) {
    form.value.IsSetSecondRest = true
  }
  loading.value=false
}
watch(()=>form.value.restShiftFirstTimeCheck,val=>{
  if(!form.value.restShiftFirstTimeCheck && form.value.IsSetSecondRest){
    form.value.IsSetSecondRest = false
  }
})
watch(()=>form.value.IsSetSecondRest,val=>{
  if(form.value.IsSetSecondRest && !form.value.restShiftFirstTimeCheck){
    form.value.restShiftFirstTimeCheck = true
  }
})
watch(()=> form.value.shiftType,newvalue =>{
  if (newvalue === 1) {
    form.value.IsInOutChange = false
    form.value.IsInOutInTwoPart = false
  } else if (newvalue === 2) {
    form.value.IsInOutChange = false
    form.value.IsInOutInTwoPart = true
  } else if (newvalue === 3) {
    form.value.IsInOutChange = true
    form.value.IsInOutInTwoPart = false
  }
})

const submit = async ()=>{
  loading.value = true
  try{
    await useHttpPost(requestURL,{ body:{
      ...form.value,
      ...requestPayload,
    } })
    loading.value = false
    router.push('/KARSAAT/basic/daily-shift')
  }catch(e){
    loading.value = false
    console.log(e)
  }

}

onMounted(()=>{
  if(params.action === 'add'){
    requestURL = 'shift/add-new-shift'
    if(params.id === 'copy'){
      if(!store.lastItem) {
        router.push('/KARSAAT/basic/daily-shift')
      }
  
      form.value = store.lastItem
      form.value.ShiftTitle = `${store?.lastItem?.ShiftTitle} کپی`
      if (
        form.value.IsInOutChange === false &&
    form.value.IsInOutInTwoPart === false
      ) {
        form.value.shiftType = 1
      } else if (
        form.value.IsInOutChange === false &&
    form.value.IsInOutInTwoPart === true
      ) {
        form.value.shiftType = 2
      } else if (
        form.value.IsInOutChange === true &&
    form.value.IsInOutInTwoPart === false
      ) {
        form.value.shiftType = 3
      }
      if (form.value.Rest !== '00:00:00') {
        form.value.restShiftFirstTimeCheck = true
      }
      if (form.value.MinWorkTimeForSecondRest) {
        form.value.IsSetSecondRest = true
      }
    }
  } else{
    requestPayload.ShiftCode = params.id
    requestURL = '/shift/edit-shift'
    getSingleShift()
  }
})
watchEffect( () => {
  if(form.value.shiftType === 1){
    form.value.WorkTime = calcTimeDiff(calcTimeDiff(form.value.Enter, form.value.Exit),form.value.Rest)
  }else if(form.value.shiftType === 2){
    let sec = calcTimeDiff(form.value.Enter2, form.value.Exit2) 
    let first = calcTimeDiff(form.value.Enter, form.value.Exit) 
    let minutes = hmToMinute(first) + hmToMinute(sec) + hmToMinute(form.value.Rest)

    form.value.WorkTime = minuteToHms(minutes)
  }
})
</script>

<route>
    {
      meta: {
        title: "افزودن شیفت روزانه"
      }
    }
</route>
