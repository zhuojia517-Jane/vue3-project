import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI } from "@/apis/user.js";
import { useCartStore } from "@/stores/cartStore.js";
import { mergeCartAPI } from "@/apis/cart.js";
export const useUserStore = defineStore('userStore', () => {
    const cartStore = useCartStore()
    //准备state
    const userInfo = ref({})
    // 准备action
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password })
        userInfo.value = res.result
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
    return { userInfo, getUserInfo, clearUserInfo }
},
    // 持久化配置，存进localstorage ，用的是pinia -Plugin -persistedstate
    { persist: true }
) 