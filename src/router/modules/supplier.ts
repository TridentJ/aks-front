export default {
  path: "/supplier",
  name: "Supplier",
  redirect: "/supplier/list",
  meta: {
    icon: "supplierFilled",
    title: "供应商管理",
    rank: 20
  },
  children: [
    {
      path: "/supplier/list",
      name: "SupplierList",
      component: () => import("@/views/supplier/list.vue"),
      meta: {
        title: "供应商清单",
        keepAlive: true
      }
    },
    {
      path: "/supplier/addition",
      name: "SupplierAddition",
      component: () => import("@/views/supplier/addition.vue"),
      meta: {
        title: "添加供应商"
      }
    },
    {
      path: "/supplier/search",
      name: "SupplierSearch",
      component: () => import("@/views/supplier/search.vue"),
      meta: {
        title: "搜索供应商",
        keepAlive: true
      }
    },
    {
      path: "/supplier/render",
      name: "SupplierRender",
      component: () => import("@/views/supplier/render.vue"),
      meta: {
        title: "供应商详情",
        showLink: false,
        dynamicLevel: 3
        //activePath: "/supplier/list"
      }
    },
    {
      path: "/supplier/edit",
      name: "SupplierEdit",
      component: () => import("@/views/supplier/edit.vue"),
      meta: {
        title: "修改供应商",
        showLink: false,
        dynamicLevel: 3
      }
    }
  ]
} as RouteConfigsTable;
