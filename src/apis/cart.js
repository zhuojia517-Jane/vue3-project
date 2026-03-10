import request from '@/utils/http'
export function addCartAPI(skuId, count) {
    return request({
        url: '/member/cart',
        method: 'POST',
        params: {
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