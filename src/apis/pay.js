import request from '@/utils/http'
export function getOrderAPI(id) {
    return request({
        url: `/member/order/${id}`,
        //请求参数附加到url里面了
    })
}