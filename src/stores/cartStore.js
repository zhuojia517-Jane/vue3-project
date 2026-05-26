import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { addCartAPI, getCartListAPI, delCartListAPI, updateCartItemAPI, updateCartSelectAllAPI } from '@/apis/cart'
export const useCartStore = defineStore('cartStore', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    // 定义数据
    const cartList = ref([])  //注意这里是空数组，后续find，push操作都是数组的方法
    // 定义方法
    const updateCartList = async () => {
        const res = await getCartListAPI()
        cartList.value = res.result
    }
    const addList = async (Good) => {
        const { skuId, count } = Good
        if (isLogin.value) {
            await addCartAPI({ skuId, count });
            updateCartList()
        }
        else {

            const item = cartList.value.find((item) => item.skuId === Good.skuId)  //item.skuId === Good.skuId 这个条件一定重点理解
            //如果已经添加过的 直接+1
            if (item) { item.count++ }
            else {
                cartList.value.push(Good)
            }
            //如果没添加，直接push
        }
    }

    const delCart = async (skuId) => {
        if (isLogin.value) {
            await delCartListAPI([skuId]);
            updateCartList()
        }
        else {
            const idx = cartList.value.findIndex((item) => item.skuId === skuId)
            cartList.value.splice(idx, 1)
        }

    }
    const clearCart = () => {
        cartList.value = []
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
        if (isLogin.value) {
            updateCartItemAPI({ skuId, selected, count: item.count })
        }
    }

    const updateCount = (skuId, count) => {
        const item = cartList.value.find((item) => item.skuId == skuId)
        if (item) item.count = count
        if (isLogin.value) {
            updateCartItemAPI({ skuId, selected: item.selected, count })
        }
    }

    // 是否全选
    const isAll = computed(() => cartList.value.every((item => item.selected)))


    //全选功能
    const allCheck = (selected) => {
        cartList.value.forEach((item) => { item.selected = selected })
        if (isLogin.value) {
            const ids = cartList.value.map(item => item.skuId)
            updateCartSelectAllAPI({ selected, ids })
        }
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
        selectedCount,
        clearCart,
        updateCartList,
        updateCount
    }
},
    { persist: true }
)