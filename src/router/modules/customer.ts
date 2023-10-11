export default {
  path: "/customer",
  name: "Customer",
  redirect: "/customer/list",
  meta: {
    icon: "customerFilled",
    title: "客户管理",
    rank: 5
  },
  children: [
    {
      path: "/customer/list",
      name: "CustomerList",
      component: () => import("@/views/customer/list.vue"),
      meta: {
        title: "客户清单",
        keepAlive: true
      }
    },
    {
      path: "/customer/addition",
      name: "CustomerAddition",
      component: () => import("@/views/customer/addition.vue"),
      meta: {
        title: "添加客户"
      }
    },
    {
      path: "/customer/search",
      name: "CustomerSearch",
      component: () => import("@/views/customer/search.vue"),
      meta: {
        title: "搜索客户",
        keepAlive: true
      }
    },
    {
      path: "/customer/render",
      name: "CustomerRender",
      component: () => import("@/views/customer/render.vue"),
      meta: {
        title: "客户详情",
        showLink: false
        //activePath: "/customer"
      }
    },
    {
      path: "/customer/edit",
      name: "CustomerEdit",
      component: () => import("@/views/customer/edit.vue"),
      meta: {
        title: "修改客户",
        showLink: false
      }
    }
  ]
} as RouteConfigsTable;
