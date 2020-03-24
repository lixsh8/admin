import { axios } from '@/core/api'

export default {
  user: {
    list () {
      return axios.get('/rbac/user/list')
    },
    save (data) {
      return axios.post('/rbac/user', data)
    },
    delete (params) {
      return axios.delete('/rbac/user', { params })
    }
  },
  menu: {
    list () {
      return axios.get('/rbac/menu/list')
    },
    save (data) {
      return axios.post('/rbac/menu', data)
    },
    delete (params) {
      return axios.delete('/rbac/menu', { params })
    }
  },
  permission: {
    list () {
      return axios.get('/rbac/permission/list')
    },
    save (data) {
      return axios.post('/rbac/permission', data)
    },
    delete (params) {
      return axios.delete('/rbac/permission', { params })
    }
  },
  role: {
    list () {
      return axios.get('/rbac/role/list')
    },
    save (data) {
      return axios.post('/rbac/role', data)
    },
    delete (params) {
      return axios.delete('/rbac/role', { params })
    }
  }
}
