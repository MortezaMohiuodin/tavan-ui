

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