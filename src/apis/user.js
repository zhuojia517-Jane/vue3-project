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