import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCartStore = defineStore('cartStore', () => {
    // 定义数据
    const cartList = ref([])
    // 定义方法
    const addList = (Good) => {
        const item = cartList.value.find((item) => item.skuId === Good.skuId)
        //如果已经添加过的 直接+1
        if (item) { item.count++ }
        else {
            cartList.value.push(Good)
        }

        //如果没添加，直接push

    }

    return {
        cartList,
        addList
    }
})