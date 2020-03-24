import { PageView } from "@/components/layouts";

import { routeComponents, routeRoot, routeNotFound } from "@/config/routes";

/**
 * 将菜单列表 转换成 树形路由
 */
export const menusToRoutes = menus => {
  listToTree(menus, routeRoot);
  console.log("tree => ", routeRoot);
  routeRoot.children = itemToRoute(routeRoot.children);
  return [routeRoot, routeNotFound];
};

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param items
 * @param parent
 * @returns {*}
 */
const itemToRoute = (items, parent) => {
  return items.map(item => {
    const { title, icon, path, isHideHeader } = item;
    const route = {
      path: "/" + path,
      // 路由名称，建议唯一
      name: path || item.id + "|" + item.title,
      meta: { title, icon, isHideHeader }
    };

    if (path) {
      if (!(path.startsWith("http://") || path.startsWith("https://"))) {
        const [key, qs] = path.split("?");
        route.component =
          routeComponents[key] ||
          (() =>
            new Promise((resolve, reject) => {
              // const p = '@/pages/$' + key
              import("@/pages/" + key)
                .then(component => resolve(component))
                .catch(_ => {
                  if (route.children && route.children.length > 0) {
                    resolve(PageView);
                  } else {
                    routeComponents["404"]().then(component =>
                      resolve(component)
                    );
                  }
                });
            }));

        if (qs) {
          const props = {};
          qs.split("&").forEach(item => {
            const [k, v] = item.split("=");
            props[k] = v;
          });
          // console.log('query => ', qs, props)
          route.props = props;
        }
      }
    }

    // 在导航菜单中隐藏此路由
    if (item.isHideInMenu === true) {
      route.hideInMenu = true;
    }
    // 在导航菜单中隐藏此路由的子路由
    if (item.isHideChildrenInMenu === true) {
      route.hideChildrenInMenu = true;
    }
    // console.log('route => ', route)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      route.children = itemToRoute(item.children, route);
    }
    return route;
  });
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, parent) => {
  list.forEach(item => {
    if (item.parentId === parent.id) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
      listToTree(list, item);
    }
  });
  // const result = {}
  // list.forEach(item => {
  //   if (!result[item.parentId]) {
  //     result[item.parentId] = [item]
  //   } else {
  //     result[item.parentId].push(item)
  //   }
  // })
  // list.forEach(item => {
  //   if (result[item.id]) {
  //     item.children = result[item.id]
  //   }
  // })
};
