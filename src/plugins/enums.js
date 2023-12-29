const enums = {
  userStatus : [
    { key : 0 , value : 'فعال' },
    { key : 1 , value : 'غیرفعال' },
  ],
  sortByArticles: [
    { key: '0', value: 'Id' },
    { key: '1', value: 'Title' },
  ],
  imageSize: [
    { key: 'Small', value: 0 },
    { key: 'Medium', value: 1 },
    { key: 'Large', value: 2 },
  ],
  active : [
    { key : 0 , value : 'غیر فعال' },
    { key : 1 , value : 'فعال' },
  ],
  quitWork: [
    { key : 0 , value : 'بدون تاریخ ترک کار' },
    { key : 1 , value : 'با تاریخ ترک کار' },
    { key : 2 , value : 'تاریخ ترک کار در ماه جاری' },
    { key : 3 , value : 'تاریخ ترک کار در ماه قبل' },
  ],
  isEdited : [
    { key : 0 , value : 'درخواست ها' },
    { key : 1 , value : 'بدون درخواست' },
    { key : 2 , value : 'همه' },
  ],
  DegreeOfEducation:[
    { key : 0 , value : 'زیر دیپلم' },
    { key : 1 , value : 'دیپلم' },
    { key : 2 , value : 'کاردانی' },
    { key : 3 , value : 'کارشناسی' },
    { key : 4 , value : 'کارشناسی ارشد' },
    { key : 5 , value : 'دکترا' },
    { key : 6 , value : 'فوق دکترا' },
  ],
  IsMarried : [
    { key : false , value : 'مجرد' },
    { key : true , value : 'متاهل' },
  ],
  NationalityType : [
    { key : 0 , value : 'ایرانی' },
    { key : 1 , value : 'خارجی' },
  ],
  insuranceType:[
    { key : 0  , value : 'خدمات درمانی' },
    { key :1 , value : 'تامین اجتماعی' },
    { key : 2 , value : 'بیمه سلامت' },
    { key : 3 , value : 'سایر' },
    { key : 4 , value : 'ندارد' },
  ],
  missionStatus: [
    { key : 0 , title: 'inProgress' },
    { key : 1 , title: 'accepted' },
    { key : 2 , title: 'rejected' },
  ],
  absentStatus: [
    { key : 0 , value: 'منتظر پاسخ' , color : 'info' },
    { key : 1 , value: 'تایید شده' , color : 'success' },
    { key : 2 , value: 'رد شده' , color : 'error' },
  ],
  inputOutputType: [
    { key : 0 , value : 'دستی' },
    { key : 1 , value : 'سرپرست' },
    { key : 2 , value : 'دستگاه ساعت زن' },
    { key : 3 , value : 'کارتیک' },
    { key : 4 , value : 'جی پی اس' },
    { key : 5 , value : 'کارتیک' },
    { key : 6 , value : 'تغییر پروژه' },
    { key : 7 , value : 'اتوماتیک' },
    { key : 8 , value : 'فراموش شده' },
  ],
  inputOutputStatus: [
    { key : 0 , value : 'تایید شده', text: 'verified' },
    { key : 1 , value : 'موقتی', text: '' },
    { key : 2 , value : 'ویرایش شده', text: 'edited' },
    { key : 3 , value : 'حذف شده', text: 'deleted' },
  ],
  noticeArchive : [
    { key : 0,  value:'ارشیو' },
    { key : 1,  value:'نمایش در صندوق' },
    { key : 2,value: 'نمایش در داشبورد' },
    { key : 3, value: 'نمایش در صفحه لاگین' },
    { key : 4,  value:'نمایش با نوتیف ویندوز' },
  ],
  rotateWorkType : [
    { key : 0,  value:'نوبت کاری صبح عصر' },
    { key : 1,  value:'نوبت کاری صبح شب' },
    { key : 2,value: 'نوبت کاری عصر شب' },
    { key : 3, value: 'نوبت کاری صبح عصر شب' },
  ],
  archived : [
    { key : 0,  value:'ارشیو نشده' },
    { key : 1,  value:'ارشیو شده' },
  ],
  deleted : [
    { key : 0,  value:'حذف نشده' },
    { key : 1,  value:'حذف شده' },
  ],
  deleteActive : [
    { key : 0,  value:'همه' },
    { key : 1,  value:'حذف نشده' },
  ],
  replyStatus : [
    { key : 0,  value:'منتظر پاسخ' , color: 'info' },
    { key : 1,  value:'تایید شده' , color: 'success' },
    { key : 2,  value:'رد شده'  , color: 'error' },
  ],
  OvertimeStatus : [
    { key : 0,  value:'در حال بررسی' },
    { key : 1,  value:'تایید شده' },
    { key : 2,  value:'رد شده' },
    { key : 4,  value:'کارکرد عادی' },
  ],
  overtimeStatus : [
    { key : 0,  value:'کسری' },
    { key : 1,  value:'تاخیر' },
  ],
  forgiveStatus : [
    { key : 0,  value:'بدون بخشش' },
    { key : 1,  value:'با بخشش' },
  ],
  workTermStatus : [
    { key : true,  value:'تایید شده' },
    { key : false,  value:'در حال بررسی' },
  ],
  absentOutcomeType : [
    { key : 0,  value:'انتقال از سال قبل' },
    { key : 1,  value:'کسر از مانده سال' },
    { key : 2,  value:'اضافه به مانده سال' },
  ],
  isDelete : [
    { key : 0,  value:'فعال' },
    { key : 1,  value:'حذف شده' },
  ],
  absentType : [
    { key : 0,  value:'مرخصی ساعتی' },
    { key : 1,  value:'مرخصی روزانه' },
    { key : 2,  value:'استعلاجی' },
    { key : 3,  value:'غیبت' },
  ],
  absentReplyStatus : [
    { key : 0,  value:'در حال بررسی' },
    { key : 1,  value:'تایید شده' },
    { key : 2,  value:'رد شده' },
    { key : 3,  value:'کارکرد عادی' },
  ],
  employeeAbsence: [
    { key : 0,  value:'زمان شیفت رسیده و کارمند غایب است' },
    { key : 1,  value:'زمان شروع شیفت نرسیده است و کارمند غایب است' },
    { key : 2,  value:'زمان شیفت رسیده و کارمند حاضر است' },
    { key : 3,  value:'زمان شروع شیفت نرسیده و کارمند حاضر است' },
    { key : 4,  value:'کارمند شیفت ندارد و غایب است' },
    { key : 5,  value:'کارمند شیفت ندارد ولی حاضر است' },
    { key : 6,  value:'زمان ورود و خروج شناور و کارمند حاضر است' },
    { key : 7,  value:'کارمند مرخصی می باشد' },
    { key : 8,  value:'زمان ورود و خروج شناور و کارمند غایب است' },
  ],
  /*inputOutputType : [
    { key : 0,  value:'ثبت دستی توسط کارمند' },
    { key : 1,  value:'ثبت دستی توسط سرپرست' },
    { key : 2,  value: 'ثبت توسط دستگاه ساعت زن' },
    { key : 3,  value:'ثبت با جی پی اس' },
    { key : 4,  value:'اتوماتیک' },
    { key : 5,  value:'فراموش شده' },
  ],*/
  shiftType : [
    { key : 1,  value:'شیفت دارای یک نوبت کاری است' },
    { key : 2,  value:'شیفت دارای دو نوبت صبح و عصر است' },
    { key : 3,  value: 'شیفت شناوراست' },
  ],
  penaltyRuleType : [
    { key : 0,  value:'با زمان بخشش' },
    { key : 1,  value:'بدون زمان بخشش' },
  ],
  weekDays : [
    { key : 0,  value: 'شنبه' },
    { key : 1,  value:'یکشنبه' },
    { key : 2,  value:'دوشنبه' },
    { key : 3,  value:'سه شنبه' },
    { key : 4,  value:'چهارشنبه' },
    { key : 5,  value:'پنجشنبه' },
    { key : 6,  value:'جمعه' },
  ],
  weekDaysShort : [
    { key : 0,  value: 'ش' },
    { key : 1,  value:'یک' },
    { key : 2,  value:'دو' },
    { key : 3,  value:'س' },
    { key : 4,  value:'چ' },
    { key : 5,  value:'پ' },
    { key : 6,  value:'ج' },
  ],
  absentTypeAdd: [
    { key : 0,  value: 'غیبت' },
    { key : 1,  value:'مرخصی' },
    { key : 2,  value:'استعلاجی' },
    { key : 3,  value:'استراحت' },
  ],
  monthType : [
    { key : 0,  value: '31 روزه' },
    { key : 1,  value:'30 روزه' },
    { key : 2,  value:'29 روزه' },
  ],
  months : [
    { key : 0,  value: 'فروردین' },
    { key : 1,  value:'اردیبهشت' },
    { key : 2,  value:'خرداد' },
    { key : 3,  value:'تیر' },
    { key : 4,  value:'مرداد' },
    { key : 5,  value:'شهریور' },
    { key : 6,  value:'مهر' },
    { key : 7,  value:'آبان' },
    { key : 8,  value:'آذر' },
    { key : 9,  value:'دی' },
    { key : 10,  value:'بهمن' },
    { key : 11,  value:'اسفند' },
  ],
  missionType : [
    { key : 0,  value: 'روزانه' },
    { key : 1,  value:'ساعتی' },
  ],
  Gender : [
    { key : 0,  value: 'مرد' },
    { key : 1,  value:'زن' },
  ],
  ioReportStatus : [
    { key : 0,  value: 'مرخصی',color:'primary' },
    { key : 1,  value: 'غیبت',color:'secondary' },
    { key : 2,  value: 'تعطیلات رسمی' ,color:'info' },
    { key : 3,  value: 'تردد ناقص',color:'success' },
    { key : 4,  value: 'دارای توضیحات' ,color:'warning' },
    { key : 5,  value: 'مرخصی در حال بررسی',color:'#ddd' },
  ],
  reportChart : [
    { key : 'IsHoliday',  value: 'تعطیلات رسمی',color:'primary' },
    { key : 'VacationTime',  value: 'تعطیلات رسمی',color:'primary' },
  ],
  res : [
    { key:'AbsentDelay' , value: 'تاخیر' },
    { key:'Overtime' , value: 'اضافه کاری' },
    { key:'NightWorkTime' , value: 'شب کاری' },
    { key:'ShortageTime' , value: 'کسری کار' },
    { key:'OvertimeHoliday' , value: 'تعطیل کاری' },
    { key:'OvertimeFriday' , value: 'جمعه کاری' },
    { key:'RushTime' , value: 'تعجیل' },
    { key:'OvertimeFriday' , value: 'نوبت صبح عصر' },
    { key:'OvertimeFriday' , value: 'تعطیل کاری' },
  ],
  depthLevel : [
    { key : 0,  value: 'مرخصی' },
    { key : 1,  value: 'ورود و خروج' },
  ],
  errorStatus : [
    { key : 0,  value: 'هردو' },
    { key : 1,  value: 'خطا دارد' },
    { key : 2,  value: 'خطا ندارد' },
  ],
  filterType : [
    { key : 'TotalWorkTime',  value: 'کل کارکرد' },
    { key : 'WorkTime',  value: 'کارکرد شیفت' },
    { key : 'Overtime',  value: 'اضافه کاری' },
    { key : 'OvertimeHoliday',  value: 'تعطیل کاری' },
    { key : 'OvertimeFriday',  value: 'جمعه کاری' },
    { key : 'RushTime',  value: 'تعجیل' },
    { key : 'RotateWork1',  value: 'صبح عصر' },
    { key : 'RotateWork2',  value: 'صبح شب' },
    { key : 'RotateWork3',  value: 'عصر شب' },
    { key : 'NightWork',  value: 'شب کاری' },
    { key : 'VacationHourly',  value: 'مرخصی ساعتی' },
    { key : 'Vacation',  value: 'مرخصی روزانه' },
    { key : 'MissionTime',  value: 'ماموریت' },
    { key : 'AbsentTime',  value: 'عیبت' },
    { key : 'DelayTime',  value: 'تاخیر' },
    { key : 'ShortageTime',  value: 'کسری کار' },
  ],
  unconfirmedIoStatus : [
    { key : 0,  value: 'تایید شده' },
    { key : 1,  value: 'ثبت موقتی' },
    { key : 2,  value: 'ویرایش موقتی' },
    { key : 3,  value: 'حذف موقتی' },
  ],
  notificationSender: [
    { key: 'SignalR' , faTitle:"سیگنال ار",value:0 },
    { key: 'Email' , faTitle:"ایمیل",value:1 },
    { key: 'Mobile' , faTitle:"موبایل",value: 2 },
  ],
  NotifType:[
    { key:'InputOutputTracking',faTitle:'ثبت ورود و خروج',value:0 },
    { key:'Absent',faTitle:'عدم حضور',value:1 },
    { key:'Mission',faTitle: 'ماموریت',value:2 },
    { key:'Loan',faTitle: 'وام',value:3 },
    { key:'AdvanceMoney',faTitle: 'مساعده',value:4 },
    { key:'RewardAndPunish',faTitle: 'مزایا و کسورات',value:5 },
    { key:'IoReminder',faTitle: 'یادآور ورود و خروج',value:6 },
    { key:'Reminder',faTitle: 'یادآور رویداد',value:7 },
    { key:'Shift',faTitle: 'تغییر شیفت',value:8 },
  ],
  depthLevelType : [
    { key : 0 , value : 'مرخصی' },
    { key : 1 , value : 'ورود و خروج' },
  ],
  moodConditon : [
    { key : 0 , value : 'اعصابم خورده' },
    { key : 1 , value : 'ناراحتم' },
    { key : 2 , value : 'حسی ندارم' },
    { key : 3 , value : 'خوشحالم' },
    { key : 4 , value : 'در پوستم نمی گنجم' },
  ],
}

const getEnum = (from = null, where = null, is = null, select = null) => {
  let result = ''
  if (from === null) result = null
  else if (select === null && where === null) result = from
  else if (select === null && where !== null) result = from.find(candidature => candidature[where] === is)
  else result = from.find(candidature => candidature[where] === is)?.[select]

  return result
}

export default {
  install: app => {
    // inject a globally available $getEnum method and $enums object
    app.config.globalProperties.$getEnum = getEnum
    app.config.globalProperties.$enums = enums
  },
}

/**
 * @namespace
 * @property {Array}  sortByArticles               - The default values for parties.
 * @property {Array}  imageSize               - The default values for parties.
 */
export const $enums  = enums
export const $getEnum = getEnum
