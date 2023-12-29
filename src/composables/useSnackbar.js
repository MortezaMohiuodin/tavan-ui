let snackbars = ref([])
export const useSnackbar = (text,variant='success')=> {
  if (text !== undefined) {
    snackbars.value.unshift({ show: true,text: text,variant:variant, key: Math.random() })
  } else {
    return {
      snackbars,
    }
  }
}
