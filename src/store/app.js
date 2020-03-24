import Vue from "vue";
import { DEVICE_TYPE } from "@/config/constants";
import {
  SIDEBAR_TYPE,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR,
  DEFAULT_COLOR_WEAK,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB
} from "@/store/ls";

const app = {
  state: {
    sidebar: true,
    device: "desktop",
    theme: "",
    layout: "",
    contentWidth: "",
    fixedHeader: false,
    fixSidebar: false,
    autoHideHeader: false,
    color: null,
    weak: false,
    multiTab: false
  },
  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar = type;
      Vue.ls.set(SIDEBAR_TYPE, type);
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    TOGGLE_THEME: (state, theme) => {
      // setStore('_DEFAULT_THEME', theme)
      Vue.ls.set(DEFAULT_THEME, theme);
      state.theme = theme;
    },
    TOGGLE_LAYOUT_MODE: (state, layout) => {
      Vue.ls.set(DEFAULT_LAYOUT_MODE, layout);
      state.layout = layout;
    },
    TOGGLE_FIXED_HEADER: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER, fixed);
      state.fixedHeader = fixed;
    },
    TOGGLE_FIXED_SIDEBAR: (state, fixed) => {
      Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed);
      state.fixSidebar = fixed;
    },
    TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
      Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show);
      state.autoHideHeader = show;
    },
    TOGGLE_CONTENT_WIDTH: (state, type) => {
      Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type);
      state.contentWidth = type;
    },
    TOGGLE_COLOR: (state, color) => {
      Vue.ls.set(DEFAULT_COLOR, color);
      state.color = color;
    },
    TOGGLE_WEAK: (state, flag) => {
      Vue.ls.set(DEFAULT_COLOR_WEAK, flag);
      state.weak = flag;
    },
    TOGGLE_MULTI_TAB: (state, bool) => {
      Vue.ls.set(DEFAULT_MULTI_TAB, bool);
      state.multiTab = bool;
    }
  },
  actions: {
    setSidebar({ commit }, type) {
      commit("SET_SIDEBAR_TYPE", type);
    },
    toggleDevice({ commit }, deviceType) {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          commit("TOGGLE_DEVICE", deviceType);
          commit("SET_SIDEBAR_TYPE", true);
          break;
        case DEVICE_TYPE.TABLET:
          commit("TOGGLE_DEVICE", deviceType);
          commit("SET_SIDEBAR_TYPE", false);
          break;
        case DEVICE_TYPE.MOBILE:
        default:
          commit("TOGGLE_DEVICE", DEVICE_TYPE.MOBILE);
          commit("SET_SIDEBAR_TYPE", false);
          break;
      }
    },
    toggleTheme({ commit }, theme) {
      commit("TOGGLE_THEME", theme);
    },
    ToggleLayoutMode({ commit }, mode) {
      commit("TOGGLE_LAYOUT_MODE", mode);
    },
    ToggleFixedHeader({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit("TOGGLE_FIXED_HEADER_HIDDEN", false);
      }
      commit("TOGGLE_FIXED_HEADER", fixedHeader);
    },
    ToggleFixSidebar({ commit }, fixSidebar) {
      commit("TOGGLE_FIXED_SIDEBAR", fixSidebar);
    },
    ToggleFixedHeaderHidden({ commit }, show) {
      commit("TOGGLE_FIXED_HEADER_HIDDEN", show);
    },
    ToggleContentWidth({ commit }, type) {
      commit("TOGGLE_CONTENT_WIDTH", type);
    },
    ToggleColor({ commit }, color) {
      commit("TOGGLE_COLOR", color);
    },
    ToggleWeak({ commit }, weakFlag) {
      commit("TOGGLE_WEAK", weakFlag);
    },
    ToggleMultiTab({ commit }, bool) {
      commit("TOGGLE_MULTI_TAB", bool);
    }
  }
};

export default app;
