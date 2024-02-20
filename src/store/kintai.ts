import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKintaiStore = defineStore('kintai', () => {
  let isCheckedIn = ref(false);
  let isCheckedOut = ref(false);

  return {
    isCheckedIn,
    isCheckedOut,
  }
})
