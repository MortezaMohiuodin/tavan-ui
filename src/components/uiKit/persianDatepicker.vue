<template>
  <div class="persian-datepicker-custom">
    <persian-datepicker
      ref="datepicker"
      v-model="value"
      :show="show"
      append-to="body"
      color="#1ABC9C"
      v-bind="{
        ...default_props,
        ...$attrs
      }"
      :type="type"
      @close="show = false"
    >
      <template #close-btn="{ vm }">
        <v-btn-close-window />
      </template>
      <template #header-year="{ vm, selectedDate }">
        <span class="tw-text-sm tw-relative tw-top-1">انتخاب سال</span>
      </template>
      <!-- slot for "month-name" -->
      <template #month-name="{ vm, date, color }">
        {{ date.xFormat('jMMMM jYYYY') }}
      </template>
    </persian-datepicker>
    <v-text-field
      v-model="inputValue"
      readonly
      validate-on="input"
      :rules="rules"
      persistent-clear
      class="!tw-cursor-pointer"
      clearable
      clear-icon="fa-solid fa-xmark tw-text-[15px]"
      v-bind="$attrs"
      :disabled="$attrs.disabled"
      @click="show=true"
      @click:clear="value = null"
    >
      <template #append-inner>
        <v-btn
          size="x-small"
          class="tw-relative -tw-left-1.5"
          variant="tonal"
          :icon="type === 'time' ? 'custom:clock' : 'custom:calendar2'"
          color="secondary"
          rounded="full"
          @click="show=true"
        />
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import PersianDatepicker from 'vue3-persian-datetime-picker'

const props = defineProps({
  modelValue : { type: [Boolean,String,Object,null,Number], default : null , required : true },
  type : { type : String , default : 'date' , required : false },
  rules : { type : Array , default : ()=>([]) , required : false },
  displayFormat :  { type : String , default : 'jYYYY/jMM/jDD' , required : false },
  format :  { type : String , default : 'YYYY-MM-DD' , required : false },
})

const emit = defineEmits(['update:modelValue'])
const show = ref(false)

const default_props = computed(()=>{
  return {
    format: props.type === 'time' ? 'HH:mm:00' : props.format,
    displayFormat: props.type === 'time' ? 'HH:mm' : props.displayFormat,
    editable: false,
    altFormat: 'YYYY-MM-DD',
    autoSubmit: true,
    ...(props.type === 'time' ? { initialValue : '00:00' } : {}),
  }
})

const datepicker = ref(null)
const inputValue = ref(props.modelValue)
let time = null

//If the `type` is "data", we should parse the `value` and display it in a human-readable format.
// However, if the `type` is "time", we should display it in the format 'hh:mm:ss' without using the 'moment' library.



const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
    if(!value){
      inputValue.value = null

      return
    }
    const tempVal = props.type === 'time' ? `2000-10-10T${value}` : value

    inputValue.value = tempVal ? $moment(tempVal).format(default_props.value.displayFormat) : null
  },
})

watch(value,val=>{
  const tempVal = props.type === 'time' ? `2000-10-10T${val}` : val
  if(!val){
    inputValue.value = null

    return
  }
  inputValue.value = tempVal ? $moment(tempVal).format(default_props.value.displayFormat) : null
},{ immediate: true })
</script>

<style lang="scss">
.persian-datepicker-custom{
  .vpd-main{
    visibility: hidden;
    display: none;
  }
}
.vpd-wrapper{
  .vpd-next{
    svg{
      margin-right: auto!important;
    }
  }
}
.vpd-content{
  border-radius: 20px;
}

.vpd-header{
  border-radius: 20px 20px 0 0;
  background-color: #F5F8FE!important;
  .vpd-year-label{
    color: black;
  }
  .vpd-date{
    display: none;
  }
}
.vpd-close-addon{
  border-radius: 50%;
}

.vpd-wrapper[data-type='time']{
  .vpd-header{
    visibility: hidden;
  }
 .vpd-addon-list{
   height: calc(100% - 110px);
 }
 .vpd-time-column{
   margin-top:0!important;
 }
 .vpd-up-arrow-btn,.vpd-down-arrow-btn{
   display: flex;
   align-items: center;
   justify-content: center;
 }
 .vpd-content{
   height: 260px;
 }
 .vpd-body {
   &:first-child div{
     height: 255px!important;
   }
 }
 .vpd-actions{
   text-align: right;
   padding: 8px;
   position: relative;
   top: -63px;
   z-index: 3;
 }
}
//.vpd-week{
//  margin-top: 11px;
//  color: #959499;
//  font-size: 14px;
//}
//.vpd-clearfix{
//  padding: 0;
//}
//.vpd-weekday{
//  width: 50px;
//}
//.vpd-day{
//  color: #212121;
//  width: 50px;
//}
//.vpd-clearfix .vpd-week{
//  padding: 0;
//  display: flex;
//  justify-content: center;
//}
//.vpd-days {
//  padding: 0!important;
//  .vpd-clearfix{
//    padding: 0;
//    display: flex;
//    justify-content: center;
//  }
//
//}
//.vpd-day-effect{
//  left:4px
//}
//.vpd-addon-list{
//  bottom: initial;
//  height: calc(100% - 30px);
//  border-radius: 25px;
//  z-index: 5;
//}
</style>
