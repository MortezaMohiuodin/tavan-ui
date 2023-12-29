import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
// @ts-ignore
import warning from "./warning.vue";
import success from "./success.vue";
import error from "./error.vue";
import trash from "./trash.vue";
import chevron_left_light from "./chevron_left_light.vue";
import chevron_right_light from "./chevron_right_light.vue";
import chevron_down_light from "./chevron_down_light.vue";
import eye from "./eye.vue"
import checkboxFalse from "./checkboxFalse.vue"
import checkboxTrue from "./checkboxTrue.vue"
import info from "./info.vue"
import KARSAAT from "./KARSAAT.vue"
import KARPOOSHE from "./KARPOOSHE.vue"
import dotinLogo from "./dotinLogo.vue"
import envelop from "./envelop.vue"
import calendar from "./calendar.vue"
import calendarCheck from "./calendarCheck.vue"
import emptyDocument from "./emptyDocument.vue";
import clock from "./clock.vue";
import IO from "./IO.vue";
import logOut from "./logOut.vue";
import arrowUp from "./arrowUp.vue"
import arrowDown from "./arrowDown.vue"
import dots from "./dots.vue"
import archive from "./archive.vue"
import remove from "./remove.vue"
import pen from "./pen.vue"
import description from "./description.vue"
import history from "./history.vue"
import report from "./report.vue"
import add from "./add.vue"
import calendar2 from "./calendar2.vue"
import chevronDown from "./chevronDown.vue"
import chevronUp from "./chevronUp.vue"
import home from './home.vue'
import building from './building.vue'
import arrowLeft from './arrowLeft.vue'
import clipboard from './clipboard.vue'
import card from './card.vue'
import checklist from './checklist.vue'
import location from './location.vue'
import more from './more.vue'
import phone from './phone.vue'
import security from './security.vue'
import user from './user.vue'
import filter from './filter.vue'
import plusCircle from './plusCircle.vue'
import edit from './edit.vue'
import checkCircle from './checkCircle.vue'
import exclamationMark from './exclamationMark.vue'
import infoCircle from './infoCircle.vue'
import legalWorkDays from './legalWorkDays.vue'
import workDaysCount from './workDaysCount.vue'
import restDays from './restDays.vue'
import missionHourly from './missionHourly.vue'
import mission from './mission.vue'
import rushTime from './rushTime.vue'
import delayTime from './delayTime.vue'
import absent from './absent.vue'
import vacationHourly from './vacationHourly.vue'
import vacation from './vacation.vue'
import rotateWork4 from './rotateWork4.vue'
import rotateWork3 from './rotateWork3.vue'
import rotateWork2 from './rotateWork2.vue'
import rotateWork1 from './rotateWork1.vue'
import shortageTime from './shortageTime.vue'
import overtimeFriday from './overtimeFriday.vue'
import overtimeHoliday from './overtimeHoliday.vue'
import project from './project.vue'
import weekCalendar from './weekCalendar.vue'
import clockWork from './clockWork.vue'
import dotinCircle from './dotinCircle.vue'
import dotin from './dotin.vue'
import tableArchive from './archive.vue'
import nightWork from "./nightWork.vue";
import excel from './excel.vue'
import link from './link.vue'
import close from './close.vue'
import year from './year.vue'
import addFile from './addFile.vue'
import flipHorizontal from './flipHorizontal.vue'
import flipVertical from './flipVertical.vue'
import KARSAAL from './KARSAAL.vue'
import camera from './camera.vue'

const customSvgNameToComponent: any = {
  warning,
  success,
  error,
  trash,
  chevron_left_light,
  chevron_right_light,
  chevron_down_light,
  eye,
  checkboxFalse,
  checkboxTrue,
  info,
  KARSAAT,
  KARPOOSHE,
  dotinLogo,
  envelop,
  pen,
  calendar,
  calendarCheck,
  emptyDocument,
  logOut,
  IO,
  clock,
  arrowUp,
  arrowDown,
  dots,
  archive,
  remove,
  description,
  history,
  report,
  add,
  calendar2,
  chevronDown,
  chevronUp,
  building,
  home,
  arrowLeft,
  clipboard,
  card,
  checklist,
  location,
  more,
  phone,
  security,
  user,
  filter,
  plusCircle,
  edit,
  checkCircle,
  exclamationMark,
  infoCircle,
  legalWorkDays,
  workDaysCount,
  restDays,
  missionHourly,
  mission,
  rushTime,
  delayTime,
  absent,
  vacationHourly,
  vacation,
  rotateWork4,
  rotateWork3,
  rotateWork2,
  rotateWork1,
  shortageTime,
  overtimeFriday,
  overtimeHoliday,
  project,
  weekCalendar,
  clockWork,
  dotinCircle,
  nightWork,
  dotin,
  tableArchive,
  excel,
  close,
  year,
  addFile,
  flipHorizontal,
  flipVertical,
  KARSAAL,
  camera
};

const customSVGs: IconSet = {
  component: (props: IconProps) => {
    if(props?.icon){
      return h(customSvgNameToComponent[props.icon])
    }
  },
};

export { customSVGs /* aliases */ };
export {customSvgNameToComponent}
