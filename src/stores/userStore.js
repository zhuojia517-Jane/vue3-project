import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, loginByMobileAPI } from "@/apis/user.js";
import { useCartStore } from "@/stores/cartStore.js";
import { mergeCartAPI } from "@/apis/cart.js";
export const useUserStore = defineStore('userStore', () => {
    const cartStore = useCartStore()
    const userInfo = ref({})
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        userInfo.value = res.result
        await mergeCart()
    }
    const loginByMobile = async ({ mobile, code }) => {
        const res = await loginByMobileAPI({ mobile, code })
        userInfo.value = res.result
        await mergeCart()
    }
    const mergeCart = async () => {
        await mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                count: item.count,
                selected: item.selected
            }
        }))
        cartStore.updateCartList()
    }
    const clearUserInfo = () => {
        userInfo.value = {}
        cartStore.clearCart()
    }
    return { userInfo, getUserInfo, loginByMobile, clearUserInfo }
},
    { persist: true }
) 