import { ref , computed,onMounted , reactive } from 'vue'
import { useRoute } from "vue-router"
import { useAppStore } from "@/store/app"

export default function useVFormExtent( namespace ,onRequestItem = null){
  const route = useRoute()
  const { WID } = useAppStore()
  const initialValue = ref({})  
  let form = ref({})
  const loading = ref(false)
  
  const isEdit = computed(()=>{
    return route.params.action === 'edit'
  })
  
  
  const id = computed(()=>{
    return route.params?.id
  })

  const getItem = async (payload = {})=>{
    let body = {
      "WorkspaceId": WID,
      "WorkspaceCode": WID,
      ...payload,
    }
    loading.value = true
    try{
      const res = await useHttpPost(`${namespace}/get-${namespace}`,{ body })
        
      loading.value = false
      
      return res
    }catch(e){
      loading.value = false
      throw new Error(e)
    }
  }

  const submit = async (val = {})=>{
    if(isEdit.value) {
      await editItem(val)
    }else{
      await addItem(val)
    }
  }

  const editItem = async (payload = {})=>{
    let body = {
      "WorkspaceId": WID,
      "WorkspaceRuleId":id.value,
      ...payload,
    }
    loading.value = true
    try{
      const res = await useHttpPost(`${namespace}/edit-${namespace}`,{ body })
  
      loading.value = false
      
      return res
    }catch(e){
      loading.value = false
      throw new Error(e)
    }
  }

  const addItem = async (payload = {})=>{
    let body = {
      "WorkspaceId": WID,
      ...payload,
    }
    loading.value = true
    try{
      const res = await useHttpPost(`${namespace}/add-new-${namespace}`,{ body })
  
      loading.value = false
      
      return res
    }catch(e){
      loading.value = false
      throw new Error(e)
    }
  }

  onMounted(async ()=>{
    let data
    if(isEdit.value && id.value){
      data = await getItem()
      if(data.Data){
        data = data.Data
      }
      if(onRequestItem){
        data = onRequestItem(data)
      }
      form.value = data
      initialValue.value = data
    }
  })
  
  return {
    form,
    loading,
    isEdit,
    id,
    getItem,
    editItem,
    addItem,
    submit,
    initialValue,
  }
}