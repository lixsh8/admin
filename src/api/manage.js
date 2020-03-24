import { axios } from "@/core/api";

export default {
  advert: {
    list(params) {
      return axios.get("/ad/list", { params });
    },
    save(params) {
      return axios.post("/ad", params);
    },
    delete(params) {
      return axios.delete("/ad", { params });
    }
  },
  task: {
    list(params) {
      return axios.get("/task/list", { params });
    },
    save(params) {
      return axios.post("/task", params);
    },
    delete(params) {
      return axios.delete("/task", { params });
    }
  },
  config: {
    list(params) {
      return axios.get("/config/list", { params });
    },
    get(params) {
      return axios.get("/config", { params });
    },
    save(data) {
      return axios.post("/config", data);
    },
    update(data) {
      return axios.patch("/config", data);
    },
    delete(params) {
      return axios.delete("/config", { params });
    }
  },
  faqType: {
    list() {
      return axios.get("/faq/type/list");
    },
    save(data) {
      return axios.post("/faq/type", data);
    },
    delete(params) {
      return axios.delete("/faq/type", { params });
    }
  },
  faqQuestion: {
    list(type) {
      return axios.get("/faq/question/list", { params: { type } });
    },
    save(data) {
      return axios.post("/faq/question", data);
    },
    delete(params) {
      return axios.delete("/faq/question", { params });
    }
  },
  linkType: {
    get(id) {
      return axios.get("/link/type", { params: { id } });
    },
    list() {
      return axios.get("/link/type/list");
    },
    save(data) {
      return axios.post("/link/type", data);
    },
    delete(params) {
      return axios.delete("/link/type", { params });
    }
  },
  link: {
    list(type) {
      return axios.get("/link/list", { params: { type } });
    },
    save(data) {
      return axios.post("/link", data);
    },
    delete(params) {
      return axios.delete("/link", { params });
    }
  },
  form: {
    list(page) {
      return axios.get("/form/list", { params: { page } });
    },
    get(name) {
      return axios.get("/form", { params: { name } });
    },
    save(data) {
      return axios.post("/form", data);
    },
    delete(params) {
      return axios.delete("/form", { params });
    }
  },
  // 普通物品
  basicitem: {
    list(page) {
      return axios.get("/basicitem/list", { params: { page } });
    },
    save(data) {
      return axios.post("/basicitem/save", data);
    }
  },
  // 高级物品
  superitem: {
    list(page) {
      return axios.get("/superitem/list", { params: { page } });
    },
    save(data) {
      return axios.post("/superitem/save", data);
    }
  },
  // 广告费设置
  adfeesetting: {
    setting(page) {
      return axios.get("/ad/profit/setting", { params: { page } });
    },
    save(data) {
      return axios.post("/ad/profit/setting/save", data);
    }
  },
  // 广告收入设置
  adIncome: {
    setting(page) {
      return axios.get("/ad/actualincome", { params: { page } });
    },
    save(data) {
      return axios.post("/ad/actualincome/save", data);
    }
  },
  // 渠道
  agent: {
    list(params) {
      return axios.get("/agent/list", { params });
    },
    save(data) {
      return axios.post("/agent", data);
    }
  },
  // 渠道目标
  agentTarget: {
    list(params) {
      return axios.get("/agent/targets", { params });
    }
  },
  // 团队
  team: {
    list(params) {
      return axios.get("/team/list", { params });
    }
  },
  // 团队目标
  teamTarget: {
    list(params) {
      return axios.get("/team/targets", { params });
    }
  }
};
