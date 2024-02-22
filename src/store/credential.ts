import LocalStorage from '@/plugins/LocalStorage'
import AppContext from '@/scripts/lib/core/AppContext'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCredentialStore = defineStore('credential', () => {
  // local storage
  const appCtx = AppContext.getInstance()
  const localStorage: LocalStorage = appCtx.make('localStorage')

  // State
  const credentials = ref<Array<UserCredential>>([])
  const isEmptyCredential = computed(() => {
    return credentials.value.length === 0
  })

  // Actions
  function getCredentialById(index: number): UserCredential | undefined {
    return credentials.value.at(index)
  }
  function setCredentialList(credentialList: Array<UserCredential>) {
    credentials.value = credentialList
  }
  function addCredential(credential: UserCredential) {
    credentials.value.push(credential)
  }
  function deleteCredentialByIndex(index: number) {
    credentials.value.splice(index, 1)
  }
  async function init() {
    // Restore credentials
    let saveData = (await localStorage.getArray("credentials")) ?? [];
    credentials.value = saveData
  }
  async function commit() {
    await localStorage.setArray({ credentials: credentials.value })
  }

  return {
    credentials,
    isEmptyCredential,
    getCredentialById,
    setCredentialList,
    addCredential,
    deleteCredentialByIndex,
    commit,
    init
  }
})
