

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
  )
}
export function autoCompleteOff(){
  let elements = document.querySelectorAll('[autocomplete="off"]')
  if (!elements) {
    return
  }
  elements.forEach(element => {
    element.setAttribute("readonly", "readonly")
    element.style.backgroundColor = "inherit"

    setTimeout(() => {
      element.removeAttribute("readonly")
    }, 500)
  })
}

export function secondToHms(val , format = 'HH:mm:ss'){
  if(!val) return '00:00:00'
  let d = Number(val)
  var h = Math.floor(d / 3600)
  var m = Math.floor(d % 3600 / 60)
  var s = Math.floor(d % 3600 % 60)

  var hDisplay = h
  var mDisplay = m + ':'
  var sDisplay = s
  
  return h + ':' + m + ':' + s
}

export function minuteToHms(val , format = 'HH:mm'){
  if(!val) return '00:00'
  let d = Number(val)
  var h = Math.floor(d / 60)
  var m = Math.floor(d % 60)
  if(h < 10){
   
    h = '0'+h.toString()
  }
  if(m < 10){
    m = '0'+m.toString()
  }
  
  return h + ':' + m
}
export function hmToMinute(val){
  if(val === '00:00') return 0
  let [h , m] = val.split(":")
  h = Number(h)
  m = Number(m)
  
  return h * 60 + m
}
export function calcTimeDiff(x , y ){
  if(!x || !y) return
  let start
  let end
  if($moment(x).isValid() && $moment(y).isValid()){
    start = x 
    end = y

    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    let diff = endTime - startTime
  
    return msToTime(diff)
  }else if($moment(x,['HH:mm:ss','HH:mm']).isValid() && $moment(y,['HH:mm:ss','HH:mm']).isValid()){
    let [h , m] = x.split(":")
    var a = $moment([h,m], "HH:mm")

    let hy = y.split(":")
    var b = $moment([hy[0],hy[1]], "HH:mm")
    let res = a.diff(b,'minutes') 
    res = Math.abs(res)
    res = res * 60000
    res = msToTime(res)
    
    return res
    
  }else{
    return
  }


}

export function msToTime(s) {
  var ms = s % 1000
  s = (s - ms) / 1000
  var secs = s % 60
  s = (s - secs) / 60
  var mins = s % 60
  if(mins < 10) mins = `0${mins}`
  var hrs = (s - mins) / 60
  if(hrs < 10) hrs = `0${hrs}`

  return hrs + ':' + mins
}

export function chunkArray(arr, chunkSize = 2) {
  return arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []
    }
    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}

export const bytesToSize = (bytes, short = true) => {
  let sizes = short
    ? ['KB', 'KB', 'MB', 'GB', 'TB']
    : ['کیلوبایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت']
  if (bytes === 0) return '0 Byte'
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  bytes = bytes / Math.pow(1024, i)
  if (i === 0) bytes = 1

  return Math.round(bytes) + ' ' + sizes[i]
}

// export const checkIfTokenNeedsRefresh = () => {
//   // Checks if time set in localstorage is past to check for refresh token
//   if (
//     window.localStorage.getItem('token') !== null &&
//     window.localStorage.getItem('tokenExpiration') !== null
//   ) {
//     if (
//       isPast(
//         new Date(
//           parseISO(JSON.parse(window.localStorage.getItem('tokenExpiration'))) *
//             1000,
//         ),
//       )
//     ) {
//       store.dispatch('refreshToken')
//     }
//   }
// }
