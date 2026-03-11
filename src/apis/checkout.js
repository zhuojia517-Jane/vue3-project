import request from '@/utils/http'
export function getCheckoutInfoAPI() {
    return request({
        url: '/member/order/pre',
    })
}