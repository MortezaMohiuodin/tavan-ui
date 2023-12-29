
const useDatatableServer = (service , payload ={})=>{
  const page = ref(1)
  const loading = ref(false)
  const items = ref([])
  const showPerPage = ref(10)
  const totalRows = ref(null)
  const filters = ref({})
  const isFirstLoading = ref(true)
  const store = useAppStore()

  const newPayload = computed(()=>{
    return {
      ...store.tableFilter,
      ...payload,
      ShowPerPage:showPerPage.value,
      Page : page.value,
    }
  })

  const totalPages = computed(()=>{
    return Math.ceil(totalRows.value/showPerPage.value)
  })

  const getData = async (val = {})=>{
    if(typeof service === 'object') {
      totalRows.value = service.length
      items.value = service
    }
    else{
      loading.value = true
      let response
      try{
        response = await service( { ...newPayload.value,...val })
        totalRows.value = response?.TotalRow || response?.Data?.length
        isFirstLoading.value = false
        items.value = response.Data
        loading.value = false
      }catch(e){
        loading.value = false
      }
    }
  }

  const reset = async val=>{
    if(loading.value) return
    page.value = 1
    totalRows.value = null
    filters.value = { ...filters.value,...val }
    await getData(val)
  }

  const reload = async val=>{
    if(loading.value) return

    await getData(filters.value)
  }

  watch(()=>page.value,async (olvVal , newVal)=>{
    console.log(page.value)
    await getData()
  })
  watch(()=>showPerPage.value,async (olvVal , newVal)=>{
    await getData()
  })
  onMounted(async()=>{
    await getData()
  })

  return {
    page,
    totalPages,
    totalRows,
    items,
    loading,
    isFirstLoading,
    showPerPage,
    reset,
    reload,
  }
}

export default useDatatableServer
