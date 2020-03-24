import { axios } from '@/core/api'

export default {
  auth: {
    login (params) {
      return axios.post('/auth/login', params)
    },
    logout () {
      return axios.post('/auth/logout')
    }
  },
  user: {
    init () {
      return axios.get('/admin/init')
    },
    info () {
      return axios.get('/admin/info')
    }
  }
}
