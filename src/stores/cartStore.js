import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
    const delCart = (skuId) => {
        const idx = cartList.value.findIndex((item) => item.skuId === skuId)
        cartList.value.splice(idx, 1)
    }
    //计算属性 结算个数和金额
    const allCount = computed(() => { return cartList.value.reduce((a, c) => a + c.count, 0) })
    const allPrice = computed(() => { return cartList.value.reduce((a, c) => a + c.count * c.price, 0) })

    //计算属性 结算勾选的个数和金额
    const selectedCount = computed(() => { return cartList.value.filter((item) => item.selected).reduce((a, c) => a + c.count, 0) })
    const selectedPrice = computed(() => { return cartList.value.filter((item) => item.selected).reduce((a, c) => a + c.count * c.price, 0) })

    const singleCheck = (skuId, selected) => {
        const item = cartList.value.find((item) => item.skuId == skuId)
        item.selected = selected
    }

    // 是否全选
    const isAll = computed(() => cartList.value.every((item => item.selected)))


    //全选功能
    const allCheck = (selected) => {
        cartList.value.forEach((item) => { item.selected = selected })
    }
    return {
        cartList,
        addList,
        delCart,
        allCount,
        allPrice,
        singleCheck,
        allCheck,
        isAll,
        selectedPrice,
        selectedCount
    }
},
    { persist: true }
)