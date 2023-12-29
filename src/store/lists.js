import { defineStore } from 'pinia'

export const useLists = defineStore('lists',()=>{
  const lists = ref({})

  const updateLists = (key , array)=>{
    lists.value[key] = array
  }

  const getLists = key=>{
    return lists.value[key]
  }

  const reset =()=>{
    Object.keys(lists.value).forEach(key=>{
      lists.value[key] = null
    })

    return true
  }

  return {
    updateLists,
    getLists,
    lists,
    reset,
  }
})
