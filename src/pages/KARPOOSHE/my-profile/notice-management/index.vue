<template>
  <div>
    <form-page-header :back-btn="false" />
    <v-card-default>
      <v-row justify="center">
        <v-col
          cols="12"
          md="6"
        >
          <v-table
            class="defaultVuetify"
          >
            <thead>
              <tr>
                <th>عنوان</th>
                <th>
                  ارسال نوتیفیکیشن
                </th>
                <th>
                  ارسال ایمیل
                </th>
                <th v-if="permits.includes('SMS_Sending')">
                  ارسال پیامک
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alarm in ALARMS">
                <td>{{ alarm.title }}</td>
                <td>
                  <div
                    v-if="alarm.media.includes('SignalR')"
                  >
                    <v-switch
                      v-if="alarm.needSetDate"
                      v-model="alarm.turnOnSignalR"
                      :loading="alarm.loading"
                      color="success"
                      hide-details
                      @click="openSettingDialog(alarm,'SignalR')"
                    />
                    <v-switch
                      v-else
                      v-model="alarm.turnOnSignalR"
                      :loading="alarm.loading"
                      color="success"
                      hide-details
                      @update:modelValue="changeAlarmStatus($event,alarm,'SignalR')"
                    />
                  </div>
                </td>
                <td>
                  <div v-if="alarm.media.includes('Email')">
                    <v-switch
                      v-if="alarm.needSetDate"
                      v-model="alarm.turnOnEmail"
                      color="success"
                      hide-details
                      @click="openSettingDialog(alarm,'Email')"
                    />
                    <v-switch
                      v-else
                      v-model="alarm.turnOnEmail"
                      color="success"
                      hide-details
                      @update:modelValue="changeAlarmStatus($event,alarm,'Email')"
                    />
                  </div>
                </td>
                <td v-if="permits.includes('SMS_Sending')">
                  <div v-if="alarm.media.includes('Mobile')">
                    <v-switch
                      v-if="alarm.needSetDate"
                      v-model="alarm.turnOnMobile"
                      color="success"
                      hide-details
                      @click="openSettingDialog(alarm,'Mobile')"
                    />
                    <v-switch
                      v-else
                      v-model="alarm.turnOnMobile"
                      color="success"
                      hide-details
                      @update:modelValue="changeAlarmStatus($event,alarm,'Mobile')"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-default>
    <v-dialog-extend
      v-model="showSettingDataDialog"
      :persistent="true"
    >
      <v-form-extend
        v-model="settingData"
        :schema="formSchema"
        @on-cancel="closeSettingDialog"
        @on-submit="changeAlarmStatus(true,alarmWhichCallingDialog,alarmsSenderWhichCallingDialog)"
      />
    </v-dialog-extend>
  </div>
</template>

<script setup>
const form = ref({})
const loading = ref(false)

const ALARMS = ref([
  {
    title: 'یادآور ورود و خروج',
    media: ['Email', 'Mobile', 'SignalR'],
    NotifType: 'IoReminder',
    turnOnEmail:false,
    turnOnMobile:false,
    turnOnSignalR: false,
    needSetDate:true,
    loading: false,
  },
  {
    title: 'اعلان ورود و خروج',
    media: ['Email', 'Mobile', 'SignalR'],
    NotifType: 'InputOutputTracking',
    turnOnEmail:false,
    turnOnMobile:false,
    turnOnSignalR: false,
    needSetDate:false,
    loading: false,
  },
  // {
  //   title: 'اعلان مساعده',
  //   media: ['Email', 'Mobile', 'SignalR'],
  //   NotifType: 'AdvanceMoney',
  //   turnOnEmail:false,
  //   turnOnMobile:false,
  //   turnOnSignalR: false,
  //   needSetDate:false,
  //   loading: false,
  // },
  // {
  //   title:  'اعلان وام',
  //   media: ['Email', 'Mobile', 'SignalR'],
  //   NotifType: 'Loan',
  //   turnOnEmail:false,
  //   turnOnMobile:false,
  //   turnOnSignalR: false,
  //   needSetDate:false,
  //   loading: false,
  // },
  {
    title:  'اعلان عدم حضور',
    media: ['Email', 'Mobile', 'SignalR'],
    NotifType: 'Absent',
    turnOnEmail:false,
    turnOnMobile:false,
    turnOnSignalR: false,
    needSetDate:false,
    loading: false,
  },
  {
    title: 'اعلان ماموریت',
    media: ['Email', 'Mobile', 'SignalR'],
    NotifType: 'Mission',
    turnOnEmail:false,
    turnOnMobile:false,
    turnOnSignalR: false,
    needSetDate:false,
    loading: false,
  },
])

const { WID,permits }=useAppStore()

const getLastSavedAlarmsStatus = async ()=>{
  let params = {
    "WorkspaceCode": WID,
  }
  const info =  await useHttpGet('notif/get-notif-list',{ params })

  info.Data.forEach(i=>{
    ALARMS.value.forEach(val=>{
      if(val.NotifType === $getEnum($enums.NotifType,'value',i.NotifType,'key')){
        val[`turnOn${$getEnum($enums.notificationSender,'value',i.NotifSender,'key')}`]=true
      }
    })
  })
}

getLastSavedAlarmsStatus()

//code related to settingData dialog
const showSettingDataDialog = ref(false)
let settingData = ref({
  startTime:null,
  endTime:null,
})
const alarmWhichCallingDialog = ref()
const alarmsSenderWhichCallingDialog = ref('')

const formSchema =ref([
  { model: 'startTime' , component:'datepicker' ,title:'زمان شروع' , type : 'time' ,col:{ cols:12 } },
  { model: 'endTime' , component:'datepicker' ,title:'زمان پایان' , type : 'time' ,col:{ cols:12 } },
])

const closeSettingDialog = ()=>{
  // this code will reach to one of alarm[x].turnOnMobile or alarm[x].turnOnSignalR or alarm[x].turnOnEmail
  alarmWhichCallingDialog.value[`turnOn${alarmsSenderWhichCallingDialog.value}`]=false
  showSettingDataDialog.value = false
}

const openSettingDialog=(alarm,alarmType)=>{
  showSettingDataDialog.value = true
  alarmWhichCallingDialog.value = alarm
  alarmsSenderWhichCallingDialog.value= alarmType
}

// code related to submit change alarm status
const changeAlarmStatus=async (val,alarm,NotifSender)=>{
  let params ={
    NotifType:alarm.NotifType,
    NotifSender:NotifSender,
    IsShow:val,
    WorkspaceCode:WID,
  }
  if(alarm.needSetDate){
    params.SettingData=`${settingData.value.startTime}:${settingData.value.endTime}`
  }
  try{
    alarm.loading = true
    await useHttpPost('/notif/set-notif-on-off',{ body:{ ...params } })
    alarm.loading = false
    showSettingDataDialog.value = false
  }catch (error){
    alarm.loading = false
    console.log(error)
  }
}
</script>

<route>
{
meta: {
title: "تنظیمات اعلان"
}
}
</route>

<style>
.switchPosition {
  direction: ltr;
  text-align: center;
}
.switchPosition .v-input__control .v-selection-control{
  display: flex;
  justify-content: space-between;
}
.switchPosition .v-input__control .v-selection-control .v-label{
  width: fit-content;
}
</style>
