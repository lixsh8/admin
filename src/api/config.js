import { axios } from "@/core/api";

export default {
  advertCode: {
    list(params) {
      return axios.get("/config/advert/codes", { params });
    },
    save(params) {
      return axios.post("/config/advert/code", params);
    },
    delete(params) {
      return axios.delete("/config/advert/code", { params });
    }
  },
  advertRate: {
    get() {
      return axios.get("/config/advert/rates");
    },
    save(params) {
      return axios.post("/config/advert/rates", params);
    }
  }
};
