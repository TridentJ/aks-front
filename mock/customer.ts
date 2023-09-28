import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/customer/getCustomerList",
    method: "get",
    response: ({ body }) => {
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "ok",
        content: [
          {
            id: 123455556,
            customerName: "杭州XXX有限责任公司",
            customerNumber: "AKS-C-1011",
            telephone: "0571-12345678",
            address: "杭州市滨江区江陵路230号",
            orderQuantity: 2,
            state: 2,
            createTime: "2023-04-24 13:04:43"
          },
          {
            id: 7653922,
            customerName: "南京XXX有限责任公司",
            customerNumber: "AKS-C-1022",
            telephone: "025-74639898",
            address: "南京市江宁区双龙大道1523号",
            orderQuantity: 12,
            state: 2,
            createTime: "2023-04-24 14:23:41"
          },
          {
            id: 84943133400,
            customerName: "上海ABC集团",
            customerNumber: "AKS-C-1183",
            telephone: "021-87430909",
            address: "上海市浦东新区浦东大道3588号",
            orderQuantity: 6,
            state: 2,
            createTime: "2023-04-23 09:13:25"
          }
        ]
      };
    }
  },
  {
    url: "/api/customer/addCustomer",
    method: "post",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "ok",
        content: "123456"
      };
    }
  },
  {
    url: "/api/customer/addInvoice",
    method: "post",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "ok"
      };
    }
  }
] as MockMethod[];
