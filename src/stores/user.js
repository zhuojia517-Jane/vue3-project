import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI } from "@/apis/user.js";
export const useUserStore = defineStore('userStore', () => {
    //准备state
    const userInfo = ref({})
    // 准备action
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        userInfo.value = res.result
    }
    const clearUserInfo = () => {
        userInfo.value = {}
    }
    return { userInfo, getUserInfo, clearUserInfo }


},
    // 持久化配置，存进localstorage ，用的是pinia -Plugin -persistedstate
    { persist: true }
) 