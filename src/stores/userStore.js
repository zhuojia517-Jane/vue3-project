import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    token: '',
    account: ''
  })

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    userInfo.value = {
      token: '',
      account: ''
    }
  }

  return { userInfo, setUserInfo, clearUserInfo }
})
