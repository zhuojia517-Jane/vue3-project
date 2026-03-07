import httpInstance from "@/utils/http";

export function getBannerApi() {
  return httpInstance({
    url:"/home/banner"
  })
}
export const findNewAPI = () => {
  return httpInstance({
    url:'/home/new'
  })
}
