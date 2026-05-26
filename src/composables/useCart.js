import { useCartStore } from '@/stores/cartStore'
import { storeToRefs } from 'pinia'

export function useCart() {
  const cartStore = useCartStore()
  const { cartList, allCount, selectedCount, selectedPrice, isAll } = storeToRefs(cartStore)

  const addCart = (item) => {
    cartStore.addList(item)
  }

  const delCart = (skuId) => {
    cartStore.delCart(skuId)
  }

  const singleCheck = (skuId, selected) => {
    cartStore.singleCheck(skuId, selected)
  }

  const allCheck = (selected) => {
    cartStore.allCheck(selected)
  }

  const updateCount = (skuId, count) => {
    cartStore.updateCount(skuId, count)
  }

  return {
    cartList,
    allCount,
    selectedCount,
    selectedPrice,
    isAll,
    addCart,
    delCart,
    singleCheck,
    allCheck,
    updateCount
  }
}
