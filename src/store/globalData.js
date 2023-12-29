import { defineStore } from 'pinia'

export const useGlobalDataStore = defineStore('global-data', {
  state: () => {
    return {
      absentTypes: [],
      missionTypes: [],
      substitutes: [],
    }
  },
  actions: {
    updateData(key, data) {
      this[key] = data
    },
  },
})
