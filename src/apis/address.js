import request from '@/utils/http'

export const getAddressListAPI = () => {
  return request({
    url: '/member/address'
  })
}

export const addAddressAPI = (data) => {
  return request({
    url: '/member/address',
    method: 'POST',
    data
  })
}

export const editAddressAPI = (data) => {
  return request({
    url: '/member/address',
    method: 'PUT',
    data
  })
}

export const delAddressAPI = (id) => {
  return request({
    url: '/member/address',
    method: 'DELETE',
    data: { id }
  })
}
