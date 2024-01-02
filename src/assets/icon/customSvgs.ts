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
import envelop from "./envelop.vue"
import calendar from "./calendar.vue"
import emptyDocument from "./emptyDocument.vue";
import clock from "./clock.vue";
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
import tableArchive from './archive.vue'
import excel from './excel.vue'
import close from './close.vue'
import addFile from './addFile.vue'
import flipHorizontal from './flipHorizontal.vue'
import flipVertical from './flipVertical.vue'
import camera from './camera.vue'
import medical from './medical.vue'
import logo from './logo.vue'



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
  envelop,
  pen,
  calendar,
  emptyDocument,
  logOut,
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
  tableArchive,
  excel,
  close,
  addFile,
  flipHorizontal,
  flipVertical,
  camera,
  medical,
  logo
};

const customSVGs: IconSet = {
  component: (props: IconProps) => {
    if (props?.icon) {
      return h(customSvgNameToComponent[props.icon])
    }
  },
};

export { customSVGs /* aliases */ };
export { customSvgNameToComponent }
