import { useStopwatch } from 'vue-timer-hook'
import { useAppStore } from '@/store/app'
import error from '@/assets/icon/error.vue'
import { ref } from "vue"
import { $moment } from "@/plugins/moment"
import useDayInfo from "@/composables/useDayInfo";
import {tr} from "vuetify/locale";

export const timer = useStopwatch()
export const loadingTimer = ref(false)
export const initTimer = (AdditionalTime,isTimerRunning)=>{
  const timeStamp = AdditionalTime.split(':')
  const momentTime = $moment({ hour: timeStamp[0], minute: timeStamp[1], seconds: timeStamp[2] })
  const startOfDay = $moment().startOf('day')
  const seconds = momentTime.diff(startOfDay, 'seconds')

  timer.reset(seconds,false)

  if(isTimerRunning) timer.start()

  return true
}

export const toggleTimer =async (AbsentConfirm=false)=>{
  const store = useAppStore()

  loadingTimer.value = true
  try {
    await useHttpPost('/InputOutput/add-input-output',
      { body:{ WorkspaceCode: store.WID,IO_Absent_Confirm:AbsentConfirm } })
    if(timer.isRunning.value) timer.pause()
    else timer.start()
    loadingTimer.value = false

    store.updatingIO = true

    return true
  }catch (err){
    loadingTimer.value = false

    return err
  }
}
