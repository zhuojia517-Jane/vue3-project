import request from "@/utils/http.js";
export function loginAPI({ account, password }) {
    return request({
        url: '/login',
        method: 'POST',
        data: {
            account,
            password

        }
    })
}
export function getMobileCodeAPI(mobile) {
    return request({
        url: '/login/code',
        method: 'GET',
        params: { account: mobile }
    })
}
export function loginByMobileAPI({ mobile, code }) {
    return request({
        url: '/login/code',
        method: 'POST',
        data: { mobile, code }
    })
}
export const getLikeListAPI = ({ limit = 4 }) => {
  return request({
    url:'/goods/relevant',
    params: {
      limit
    }
  })
}
