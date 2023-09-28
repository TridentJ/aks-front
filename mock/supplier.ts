import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/supplier/list",
    method: "get",
    response: ({ body }) => {
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "ok",
        data: [
          {
            id: 123455556,
            supplierName: "杭州XXX有限责任公司",
            supplierNumber: "AKS-C-1011",
            telephone: "0571-12345678",
            address: "杭州市滨江区江陵路230号",
            orderQuantity: 2,
            state: 2,
            createTime: "2023-04-24 13:04:43"
          },
          {
            id: 7653922,
            supplierName: "南京XXX有限责任公司",
            supplierNumber: "AKS-C-1022",
            telephone: "025-74639898",
            address: "南京市江宁区双龙大道1523号",
            orderQuantity: 12,
            state: 2,
            createTime: "2023-04-24 14:23:41"
          },
          {
            id: 84943133400,
            supplierName: "上海ABC集团",
            supplierNumber: "AKS-C-1183",
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
    url: "/api/supplier/show",
    method: "get",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        message: "ok",
        data: {
          id: 7653922,
          supplierName: "上海ABC集团",
          supplierNumber: "AKS-C-1183",
          telephone: "021-87430909",
          phone: "",
          fax: "",
          companyAddress: "上海市浦东新区浦东大道3588号",
          deliveryAddress: "上海市浦东新区浦东大道1111号",
          alipayAccount: "",
          wepayAccount: "",
          createTimeStr: "2023-04-23 09:13:25"
        }
      };
    }
  },
  {
    url: "/api/supplier/update",
    method: "post",
    response: ({ body }) => {
      console.log("/api/supplier/update");
      console.log(body);
      return {
        code: 0,
        message: "ok"
      };
    }
  },
  {
    url: "/api/supplierContacts/show",
    method: "get",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        message: "ok",
        data: [
          {
            supplierId: 7653922,
            scName: "aaa",
            department: "a1",
            job: "a2",
            baseLocation: "a3",
            telephone: "",
            phone: "",
            mail: "",
            qq: "",
            wechat: "",
            state: 1,
            comments: ""
          },
          {
            supplierId: 7653922,
            scName: "bbb",
            department: "b1",
            job: "b2",
            baseLocation: "b3",
            telephone: "",
            phone: "",
            mail: "",
            qq: "",
            state: 2,
            wechat: "",
            comments: ""
          }
        ]
      };
    }
  },
  {
    url: "/api/invoiceBase/show",
    method: "get",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        message: "ok",
        data: [
          {
            supplierId: 7653922,
            company: "in1",
            bank: "111",
            bankAccount: "111",
            taxAccount: "111",
            address: "",
            phone: "",
            state: 1,
            comments: ""
          },
          {
            supplierId: 7653922,
            company: "in2",
            bank: "222",
            bankAccount: "222",
            taxAccount: "222",
            address: "",
            phone: "",
            state: 2,
            comments: ""
          }
        ]
      };
    }
  },
  {
    url: "/api/invoiceBase/update",
    method: "post",
    response: ({ body }) => {
      console.log("/api/invoiceBase/update");
      console.log(body);
      return {
        code: 0,
        message: "ok"
      };
    }
  },
  {
    url: "/api/supplier/add",
    method: "post",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "成功",
        data: 7653922
      };
    }
  },
  {
    url: "/api/InvoiceBase/add",
    method: "post",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "添加发票信息出现失败！发票信息共：2条，成功1条，失败1条",
        data: 123
        //code: 0,
        //message: "成功"
      };
    }
  },
  {
    url: "/api/supplierContacts/add",
    method: "post",
    response: ({ body }) => {
      console.log(body);
      return {
        code: 0,
        // 一个用户可能有多个角色
        message: "添加联系人信息出现失败！联系人信息共：2条，成功1条，失败1条",
        data: 456
      };
    }
  },
  {
    url: "/api/InvoiceBase/addOne",
    method: "post",
    response: ({ body }) => {
      console.log("/api/InvoiceBase/addOne");
      console.log(body);
      return {
        code: 0,
        message: "成功",
        data: 123
        //code: 0,
        //message: "成功"
      };
    }
  },
  {
    url: "/api/supplierContacts/addOne",
    method: "post",
    response: ({ body }) => {
      console.log("/api/supplierContacts/addOne");
      console.log(body);
      return {
        code: 0,
        message: "成功",
        data: 456
      };
    }
  },
  {
    url: "/api/supplierContacts/update",
    method: "post",
    response: ({ body }) => {
      console.log("/api/supplierContacts/update");
      console.log(body);
      return {
        code: 0,
        message: "ok"
      };
    }
  }
] as MockMethod[];
