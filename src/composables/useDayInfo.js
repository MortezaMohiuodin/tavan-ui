import { computed } from "vue"
import { $moment } from "@/plugins/moment"
import { useDisplay } from "vuetify"
import { dayTypes } from "@/components/inputOutput/js/dayTypes"

const useDayInfo = (from, to, employeeCode, showArchived = ref(false), isMine = true) => {

  const store = useAppStore()

  const { smAndDown } = useDisplay()

  const loading = ref(false)
  const daysObject = ref({})
  const report = ref(null)

  const isMobile = computed(() => {
    return smAndDown.value
  })

  const getData = async () => {
    if (!from.value || !to.value || (!isMine && !employeeCode.value)) return
    try {
      loading.value = true

      let data = {
        WorkspaceCode: store.WID,
        IsDelete: showArchived.value ? showArchived.value : null,
        FromDate: from.value.format('YYYY-MM-DD'),
        ToDate: to.value.format('YYYY-MM-DD'),
      }
      if (employeeCode.value) data.EmployeeCode = employeeCode.value

      const { Data: response } = await useHttpPost('/InputOutputCalcu/calcu-employee-time-and-total-work', {
        body: data,
      })

      const today = response.IO.filter(day => $moment().isDateToday(day.Date))[0]
      const time = today?.AdditionalInfo?.AdditionalTime
      const isTimerRunning = today?.AdditionalInfo?.IsPlay

      if (today?.AdditionalInfo) store.initTimer(time, isTimerRunning)

      store.updatingIO = false

      report.value = response.TotalWork

      loading.value = false

      setDayData(response.IO)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  function setDayData(data) {
    daysObject.value = {}
    data.forEach(day => {

      const inputOutputs = setInputOutput(day)
      const absents = setAbsent(day)
      const missions = setMission(day)

      const activities = showArchived.value ? inputOutputs : [...inputOutputs, ...absents, ...missions]

      const list = activities.sort((a, b) => (new Date(b.date) - new Date(a.date)) * -1)

      let dayType = null

      const dailyAbsent = day.AbsentList.find(absent => !absent.IsHourly)
      const dailyMission = day.MissionList.find(mission => !mission.IsHourly)

      if (day.IsHoliday) dayType = 'holiday'
      else if (day.IOList.length && day.IOList.length % 2 === 0) dayType = 'io'
      else if (day.IOList.length % 2 !== 0) dayType = 'inComplete'
      else if (dailyAbsent && !showArchived.value) dayType = dailyAbsent.AbsentType === 0 ? 'inOut' : 'absent'
      else if (dailyMission && !showArchived.value) dayType = 'mission'

      daysObject.value[$moment(day.Date).format('YYYY-MM-DD')] = {
        ...dayTypes[dayType],
        hasIo: !!list.length,
        isClose: data.length > 7 && !isMobile.value,
        data: {
          ...day,
          list: list,
        },
        type: dayType,
        absent: dailyAbsent,
        mission: dailyMission,
      }
    })
  }

  const setInputOutput = day => {
    const inputOutputs = []
    for (let i = 0; i < day.IOList.length; i += 2) {
      let io = {
        type: 'inputOutput',
        children: [],
      }
      const inputOutput = day.IOList.slice(i, i + 2)

      io.date = day.IOList[i].Time
      io.inComplete = inputOutput.length === 1
      io.action = null
      io.children.push(...inputOutput)
      inputOutputs.push(io)
    }

    return inputOutputs
  }

  const setAbsent = day => {
    return day.AbsentList.filter(absent => absent.IsHourly).map(absent => {
      return {
        type: 'absent',
        date: `${absent.Date.split('T')[0]}T${absent.StartTime}`,
        ...absent,
      }
    })
  }

  const setMission = day => {
    return day.MissionList.filter(mission => mission.IsHourly).map(mission => {
      return {
        type: 'mission',
        date: `${mission.Date.split('T')[0]}T${mission.StartTime}`,
        ...mission,
      }
    })
  }

  function reload() {
    getData()
  }

  function reset() {
    daysObject.value = {}
    report.value = null
  }

  function getDayData(date) {
    return daysObject[date]
  }

  watchEffect(() => {
    getData()
  })

  return {
    loading,
    report,
    daysObject,
    getDayData,
    reload,
    reset,
  }
}

export default useDayInfo
