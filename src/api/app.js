import { axios } from "@/core/api";

export default {
  quiz: {
    list(params) {
      return axios.get("/app/quiz/list", { params });
    },
    save(params) {
      return axios.post("/app/quiz", params);
    },
    delete(params) {
      return axios.delete("/app/quiz", { params });
    }
  },
  config: {
    list(params) {
      return axios.get("/app/config/list", { params });
    },
    save(params) {
      return axios.post("/app/config/save", params);
    }
  }
};
