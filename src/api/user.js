import { axios } from "@/core/api";

export default {
  list(params) {
    return axios.get("/user/list", { params });
  },
  checklist: {
    list(params) {
      return axios.get("/user/checklist/list", { params });
    },
    save(data) {
      return axios.post("/user/checklist", data);
    },
    delete(params) {
      return axios.delete("/user/checklist", { params });
    }
  },
  // 邀请关系
  invite: {
    list(params) {
      return axios.get("/user/invitation", { params });
    }
  },
  // 统计
  stat: {
    list(params) {
      return axios.get("/user/stat", { params });
    }
  },
  // 资产
  property: {
    list(params) {
      return axios.get("/user/finance", { params });
    }
  }
};
