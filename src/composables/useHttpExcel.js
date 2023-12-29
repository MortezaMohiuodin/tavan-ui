import { useAppStore } from '@/store/app'
import { uuidv4 } from '@/helper/utility'

export const useHttpExcel = (url,params,name = uuidv4(),extension) => {
  return new Promise((resolve,reject)=>{
    var xhttp = new XMLHttpRequest()
    xhttp.responseType = 'arraybuffer'

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status != 200) {
        const json = JSON.parse(new TextDecoder().decode(xhttp.response))

        reject(false)
      } else if (xhttp.readyState == 4) {
        var uInt8Array = new Uint8Array(xhttp.response)
        var i = uInt8Array.length
        var biStr = new Array(i)
        while (i--) {
          biStr[i] = String.fromCharCode(uInt8Array[i])
        }
        var data = biStr.join('')
        var base64 = window.btoa(data)

        var element = document.createElement('a')

        var contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        if (extension === '.xls') {
          contentType = 'application/vnd.ms-excel'
        }else  if (extension === '.txt'){
          contentType = 'text/plain'
        }

        element.setAttribute('href', 'data:' + contentType + ';base64,' + base64)

        if (!extension) {
          extension = '.xlsx'
        }

        element.setAttribute('download', name + extension)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        resolve(true)
      }
    }

    url += '?'
    Object.entries(params.params).forEach(x => {
      if(!x[1] && x[1] !== 0) return
      url += x[0] + '=' + x[1] + '&'
    })
    url += 'WorkspaceCode' + '=' + useAppStore().WID + '&'

    xhttp.open('GET', `/api/${url}`, true)

    xhttp.setRequestHeader('Authorization', useAppStore().token)

    xhttp.send()
  })
}
