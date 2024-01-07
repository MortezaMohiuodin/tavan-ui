const enums = {
  userStatus : [
    { key : 0 , value : 'فعال' },
    { key : 1 , value : 'غیرفعال' },
  ],
  gender : [
    { key : 0 , value : 'مرد' },
    { key : 1 , value : 'زن' },
  ],
  role : [
    { key : 'admin' , value : 'ادمین' },
    { key : 'secretary' , value : 'منشی' },
    { key : 'patient' , value : 'توانجو' },
    { key : 'doctor' , value : 'توانبخش' },
    { key : 'user' , value : 'کاربر ساده' },
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
