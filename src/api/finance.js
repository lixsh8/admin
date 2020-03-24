import { axios } from "@/core/api";

export default {
  withdraw: {
    list(params) {
      return axios.get("/payment/withdraw/list", { params });
    },
    audit(params) {
      return axios.post("/payment/withdraw/audit", params);
    },
    remit(params) {
      return axios.post("/payment/withdraw/remit", params);
    }
  },
  stat: {
    list(params) {
      return axios.get("/stat/finance", { params });
    },
    subsidy(params) {
      return axios.get("/stat/subsidy", { params });
    },
    withdraw(params) {
      return axios.get("/stat/withdraw", { params });
    }
  },
  // 汇总
  summary: {
    list(params) {
      return axios.get("/stat/finance/summary", { params });
    }
  },
  adFee: {
    // 广告费统计
    summary(params) {
      return axios.get("/stat/advertFee", { params });
    }
  },
  channel: {
    list(params) {
      return axios.get("/payment/channel/list", { params });
    },
    save(data) {
      return axios.post("/payment/channel", data);
    },
    delete(params) {
      return axios.delete("/payment/channel", params);
    }
  },
  zfb: {
    list(params) {
      return axios.get("/finance/alipay/list", { params });
    }
  }
};
