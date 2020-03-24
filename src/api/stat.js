import { axios } from "@/core/api";

export default {
  user: {
    active(params) {
      return axios.get("/stat/user/visitor", { params });
    },
    register(params) {
      return axios.get("/stat/user/visitor", { params });
    },
    left(params) {
      return axios.get("/stat/user/retention", { params });
    }
  },
  index: {
    list(params) {
      return axios.get("/stat/usernum", { params });
    },
    // 实时数据stat/realtime
    realTime(params) {
      return axios.get("/stat/realtime", { params });
    }
  },
  // 退休证
  bonus: {
    stat(params) {
      return axios.get("/bonus/stat", { params });
    }
  }
};
