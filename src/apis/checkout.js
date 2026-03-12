import request from '@/utils/http'
export function getCheckoutInfoAPI() {
    return request({
        url: '/member/order/pre',
    })
}
//创建订单
export function createOrderAPI(data) {
    return request({
        url: '/member/order',
        method: 'POST',
        data
    })
}