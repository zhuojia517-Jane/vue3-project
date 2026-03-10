import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCartStore = defineStore('cartStore', () => {
    // 定义数据
    const cartList = ref([])  //注意这里是空数组，后续find，push操作都是数组的方法
    // 定义方法
    const addList = (Good) => {
        const item = cartList.value.find((item) => item.skuId === Good.skuId)  //item.skuId === Good.skuId 这个条件一定重点理解
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

},
    { persist: true })