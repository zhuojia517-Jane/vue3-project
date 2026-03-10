import request from '@/utils/http'
export function addCartAPI({ skuId, count }) {
    return request({
        url: '/member/cart',
        method: 'POST',
        data: {
            skuId,
            count
        }
    })
}
export function getCartListAPI() {
    return request({
        url: '/member/cart',
        method: 'GET',
    })
}
export function delCartListAPI(ids) {
    return request({
        url: '/member/cart',
        method: 'DELETE',
        data: { ids }
    })
}
