import { axios } from '@/core/api'

export default {
  announce: {
    list (params) {
      return axios.get('/announce/list', { params })
    },
    save (data) {
      return axios.post('/announce', data)
    },
    delete (params) {
      return axios.delete('/announce', { params })
    }
  },
  popup: {
    list (params) {
      return axios.get('/popup/list', { params })
    },
    save (data) {
      return axios.post('/popup', data)
    },
    delete (params) {
      return axios.delete('/popup', { params })
    }
  }
}
