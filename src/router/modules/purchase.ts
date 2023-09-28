export default {
  path: "/purchase",
  name: "Purchase",
  redirect: "/purchase/list",
  meta: {
    icon: "purchaseFilled",
    title: "采购管理",
    rank: 25
  },
  children: [
    {
      path: "/purchase/list",
      name: "PurchaseList",
      component: () => import("@/views/purchase/list.vue"),
      meta: {
        title: "采购清单",
        keepAlive: true
      }
    },
    {
      path: "/purchase/addition",
      name: "PurchaseAddition",
      component: () => import("@/views/purchase/addition.vue"),
      meta: {
        title: "添加采购"
      }
    },
    {
      path: "/purchase/search",
      name: "PurchaseSearch",
      component: () => import("@/views/purchase/search.vue"),
      meta: {
        title: "搜索采购",
        keepAlive: true
      }
    },
    {
      path: "/purchase/render",
      name: "PurchaseRender",
      component: () => import("@/views/purchase/render.vue"),
      meta: {
        title: "采购详情",
        showLink: false
      }
    },
    {
      path: "/purchase/edit",
      name: "PurchaseEdit",
      component: () => import("@/views/purchase/edit.vue"),
      meta: {
        title: "修改采购",
        showLink: false
      }
    }
  ]
} as RouteConfigsTable;
