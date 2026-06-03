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
export function updateCartItemAPI({ skuId, selected, count }) {
    return request({
        url: '/member/cart',
        method: 'PUT',
        data: { skuId, selected, count }
    })
}
export function updateCartSelectAllAPI({ selected, ids }) {
    return request({
        url: '/member/cart/selected',
        method: 'PUT',
        data: { selected, ids }
    })
}
export function mergeCartAPI(data) {
    return request({
        url: '/member/cart/merge',
        method: 'POST',
        data
    })
}
