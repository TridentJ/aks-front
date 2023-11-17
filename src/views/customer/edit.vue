<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Action, FormInstance, FormRules } from "element-plus";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import ContactFill from "@iconify-icons/ri/contacts-book-2-fill";
import InvoiceFill from "@iconify-icons/ri/coupon-3-fill";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  CustomerBaseInfo,
  InvoiceInfo,
  CustomerContactInfo
} from "@/interface/CustomerInterface";
import { AjaxResponse } from "@/api/AjaxResponse";
import { useDetail } from "./customerRouter";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { deleteTag } from "@/interface/AksTag";
import { AjaxResponseList } from "@/api/AjaxResponseList";

defineOptions({
  name: "CustomerEdit"
});

//let customerId = 0;
//const router = useRouter();

//获取传递的参数
const { initToDetail, getParameter, toDetail, router } = useDetail();
initToDetail("edit");
//const route = useRoute();
const customerId = getParameter.id;
//console.log("edit customerId:", customerId);
if (customerId == undefined) {
  ElMessage.error("需提供客户信息！");
}

const submitState = ref<boolean>(false);

const resetState = ref<boolean>(false);

const customerInitInfo = () => {
  return {
    id: 0,
    customerName: "",
    customerNumber: "",
    telephone: "",
    phone: "",
    fax: "",
    address: "",
    factoryAddress: "",
    alipayAccount: "",
    wepayAccount: "",
    state: 2,
    createTime: "",
    updateTime: "",
    comments: ""
  };
};

const formBase = ref<CustomerBaseInfo>(customerInitInfo());
//const formBase = ref<CustomerBaseInfo>();

const baseFormRef = ref<FormInstance>();

const baseRules = ref<FormRules>({
  customerName: [
    {
      required: true,
      message: "客户名称不能为空",
      whitespace: true,
      trigger: "blur"
    }
  ]
});

// 发票处理

const formInvoice = ref<InvoiceInfo[]>([]);

const formInvoiceEditState = ref<boolean[]>([]);
const changeInvoiceEditState = index => {
  formInvoiceEditState.value[index] = false;
};

const addInvoiceForm = () => {
  formInvoice.value.push({
    id: 0,
    customerId: 0,
    company: "",
    bank: "",
    bankAccount: "",
    taxAccount: "",
    address: "",
    phone: "",
    state: 2,
    createTime: "-",
    updateTime: "-",
    comments: ""
  });
};

const deleteInvoiceForm = (index: number) => {
  if (index >= 0) {
    const id = formInvoice.value[index].id;
    http
      .request<AjaxResponseList>("get", "/api/invoiceBase/delete?id=" + id)
      .then(function (response) {
        if (response.code == 0) {
          formInvoice.value.splice(index, 1);
          formInvoiceEditState.value.splice(index, 1);
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error(response.message);
        }
      });
  } else {
    ElMessage.error("需删除的目标不合法！");
  }
};

const formCustomerContact = ref<CustomerContactInfo[]>([]);

const formCustomerContactEditState = ref<boolean[]>([]);
const changeCustomerContactEditState = index => {
  formCustomerContactEditState.value[index] = false;
};

const addCustomerContactForm = () => {
  formCustomerContact.value.push({
    id: 0,
    customerId: 0,
    ccName: "",
    department: "",
    job: "",
    baseLocation: "",
    telephone: "",
    phone: "",
    mail: "",
    qq: "",
    wechat: "",
    state: 2,
    createTime: "-",
    updateTime: "-",
    comments: ""
  });
};

const deleteCustomerContactForm = (index: number) => {
  //const index = form_customer_contact.indexOf(item);
  if (index >= 0) {
    const id = formCustomerContact.value[index].id;
    http
      .request<AjaxResponseList>("get", "/api/customerContacts/delete?id=" + id)
      .then(function (response) {
        if (response.code == 0) {
          formCustomerContact.value.splice(index, 1);
          formCustomerContactEditState.value.splice(index, 1);
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error(response.message);
        }
      });
  } else {
    ElMessage.error("需删除的目标不合法！");
  }
};

//业务逻辑
const getInvoiceInfo = () => {
  http
    .request<AjaxResponse>(
      "get",
      "/api/invoiceBase/show?id=" + customerId + "&type=2"
    )
    .then(function (response) {
      if (response.code == 1169) {
        ElMessage.info(response.message);
      } else if (response.code != 0) {
        ElMessage({
          message: String(response.message),
          type: "error"
        });
      } else {
        //console.log(response.data);
        formInvoice.value = response.data;
        for (let i = 0; i < formInvoice.value.length; i++) {
          formInvoiceEditState.value.push(true);
        }
      }
    });
};

const getCustomerContacts = () => {
  http
    .request<AjaxResponse>(
      "get",
      "/api/customerContacts/show?customerId=" + customerId
    )
    .then(function (response) {
      if (response.code == 1281) {
        ElMessage.info(response.message);
      } else if (response.code != 0) {
        ElMessage({
          message: String(response.message),
          type: "error"
        });
      } else {
        //console.log(response.data);
        formCustomerContact.value = response.data;
        for (let i = 0; i < formCustomerContact.value.length; i++) {
          formCustomerContactEditState.value.push(true);
        }
      }
    });
};

onBeforeMount(() => {
  getCustomer();
});

const getCustomer = () => {
  if (customerId == undefined) {
    ElMessage.error("需提供客户信息！");
  } else {
    //获取基础信息
    http
      .request<AjaxResponse>("get", "/api/customer/show?id=" + customerId)
      .then(function (response) {
        if (response.code != 0) {
          ElMessage.error(response.message);
        } else {
          //console.log(response.data);
          //baseInfoData.value = response.data;
          formBase.value = response.data;
          //获取发票信息
          getInvoiceInfo();
          //获取联系人信息
          getCustomerContacts();
        }
      });
  }
};

const addOrUpdateInvoiceInfo = async index => {
  let result = 0;
  if (formInvoice.value[index].id == 0) {
    //add
    await addInvoiceInfo(index).then(response => {
      result = response;
    });
  } else {
    await updateInvoiceInfo(index).then(response => {
      result = response;
    });
  }
  //console.log(formInvoice);
  if (result == 1) {
    formInvoiceEditState.value[index] = true;
  }
};

const updateInvoiceInfo = async index => {
  let result = 0;
  //formInvoice.value[index].customerId = Number(customerId);
  formInvoice.value[index].createTime = null;
  formInvoice.value[index].updateTime = null;
  const requestBody = JSON.stringify(formInvoice.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/invoiceBase/update", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        ElMessage.success("更新发票成功！");
        result = 1;
      }
    })
    .catch(function (error) {
      ElMessage.error("更新发票失败！", error);
    });
  return result;
};

//添加开票数据
const addInvoiceInfo = async index => {
  let result = 0;
  formInvoice.value[index].customerId = Number(customerId);
  const requestBody = JSON.stringify(formInvoice.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/invoiceBase/addOne", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        if (Number(response.data) > 0) {
          ElMessage.success("添加发票成功！");
          formInvoice.value[index].id = Number(response.data);
          result = 1;
        } else {
          ElMessage.error("添加发票失败！返回值不合法！");
          result = 0;
        }
      }
    })
    .catch(function (error) {
      ElMessage.error("添加发票失败！", error);
    });
  return result;
};

// 客户联系人

const addOrUpdateCustomerContactsInfo = async index => {
  let result = 0;
  if (formCustomerContact.value[index].id == 0) {
    //add
    //formCustomerContact.value[index].customerId = Number(customerId);
    await addCustomerContactsInfo(index).then(response => {
      result = response;
    });
  } else {
    await updateCustomerContactsInfo(index).then(response => {
      result = response;
    });
  }
  if (result == 1) {
    formCustomerContactEditState.value[index] = true;
  }
};

const updateCustomerContactsInfo = async index => {
  let result = 0;
  //formCustomerContact.value[index].customerId = Number(customerId);
  formCustomerContact.value[index].createTime = null;
  formCustomerContact.value[index].updateTime = null;
  const requestBody = JSON.stringify(formCustomerContact.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/customerContacts/update", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        ElMessage.success("更新客户联系人成功！");
        result = 1;
      }
    })
    .catch(function (error) {
      ElMessage.error("更新客户联系人失败！", error);
    });
  return result;
};

const addCustomerContactsInfo = async index => {
  let result = 0;
  formCustomerContact.value[index].customerId = Number(customerId);
  const requestBody = JSON.stringify(formCustomerContact.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/customerContacts/addOne", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        if (Number.isInteger(response.data)) {
          formCustomerContact.value[index].id = Number(response.data);
          ElMessage.success("添加客户联系人成功！");
          result = 1;
        } else {
          ElMessage.error("添加客户联系人失败！返回值不合法！");
          result = 0;
        }
      }
    })
    .catch(function (error) {
      ElMessage.error("添加客户联系人失败！" + error);
    });
  return result;
};

const updateCustomer = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formEl.validate((valid, fields) => {
    if (valid) {
      //验证通过
      http
        .request<AjaxResponse>("post", "/api/customer/update", {
          data: formBase.value
        })
        .then(async function (response) {
          if (response.code == 0) {
            //提交成功
            ElMessage.success("更新客户基础信息成功！");
            successUpdateCustomer();
          } else {
            ElMessage.error(response.message);
            failureUpdateCustomer();
          }
        })
        .catch(function (error) {
          if (error.response) {
            //请求成功发出，服务器也相应，但状态码不是200
            //console.log(error.response.state);
            ElMessage.error("服务器错误！", error.response.state);
          } else if (error.request) {
            //请求成功发出，服务器无响应
            //console.log(error.request);
            ElMessage.error("服务器无响应！", error.request);
          } else {
            //请求发送失败
            //console.log("Error", error.message);
            ElMessage.error("更新客户失败！", error.message);
          }
        });
    } else {
      //验证失败
      //console.log('失败:',fields);
      ElMessage.error("客户信息不合法！");
    }
  });
};

const resetCustomer = () => {
  Object.assign(formBase.value, customerInitInfo());
  formInvoice.value.length = 0;
  formCustomerContact.value.length = 0;
};

const redirectDetailPage = () => {
  let customerNameLittle = formBase.value.customerName;
  if (customerNameLittle.length > 10) {
    customerNameLittle = customerNameLittle.substring(0, 10) + "...";
  }
  toDetail({ id: customerId, customerName: customerNameLittle, renderFlag: 1 }, "render");
};

const successUpdateCustomer = () => {
  ElMessageBox.confirm("更新客户信息成功", "成功", {
    confirmButtonText: "查看详情",
    cancelButtonText: "关闭当前页",
    type: "success"
  })
    .then(() => {
      //删除编辑标签
      //useMultiTagsStoreHook().handleTags("splice", "/customer/edit");
      deleteTag("/customer/edit", getParameter);
      //跳转到详情页
      redirectDetailPage();
    })
    .catch((action: Action) => {
      //保持不动
      //resetCustomer();
      //删除标签
      //useMultiTagsStoreHook().handleTags("splice", "/customer/edit");
      deleteTag("/customer/edit", getParameter);
      //切换到最后一个标签
      const newRoute = useMultiTagsStoreHook().handleTags("slice");
      //console.log(newRoute);
      if (newRoute[0]?.query) {
        router.push({ name: newRoute[0].name, query: newRoute[0].query });
      } else if (newRoute[0]?.params) {
        router.push({ name: newRoute[0].name, params: newRoute[0].params });
      } else {
        router.push({ path: newRoute[0].path });
      }
    });
};

const failureUpdateCustomer = () => {
  ElMessageBox.alert("更新客户基础信息失败！", "警告", {
    confirmButtonText: "重新更新"
    /*callback: (action: Action) => {}*/
  });
};

const changeTabState = index => {
  //console.log(tab);
  if (index == 1 || index == 2) {
    submitState.value = true;
    resetState.value = true;
  } else {
    submitState.value = false;
    resetState.value = false;
  }
};
const invoiceState = [
  {
    value: 1,
    label: "作废"
  },
  {
    value: 2,
    label: "正常"
  }
];
const customerContactsState = [
  {
    value: 1,
    label: "离职"
  },
  {
    value: 2,
    label: "正常"
  }
];
</script>

<template>
  <el-card>
    <template #header>
      <span class="font-bold"
        >修改客户信息&nbsp;&nbsp;<el-tag
          size="large"
          color="#40E0D0"
          effect="dark"
          >{{ formBase.customerName }}</el-tag
        ></span
      >
    </template>

    <el-tabs type="border-card" @tab-change="changeTabState">
      <el-tab-pane label="基础信息">
        <template #label>
          <span class="header-font">基础信息</span>
        </template>
        <!-- <el-card> -->
        <el-form
          :model="formBase"
          label-width="100px"
          :rules="baseRules"
          ref="baseFormRef"
        >
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="formBase.customerName"
              placeholder="客户名称"
            />
          </el-form-item>
          <el-input v-model="formBase.id" type="hidden" />
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户编号">
                <el-input
                  v-model="formBase.customerNumber"
                  placeholder="客户编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input v-model="formBase.fax" placeholder="传真" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="固定电话">
                <el-input v-model="formBase.telephone" placeholder="固定电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="移动电话">
                <el-input v-model="formBase.phone" placeholder="移动电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="办公地址">
                <el-input
                  v-model="formBase.address"
                  placeholder="办公地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交货地址">
                <el-input
                  v-model="formBase.factoryAddress"
                  placeholder="交货地址"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="支付宝账号">
                <el-input
                  v-model="formBase.alipayAccount"
                  placeholder="支付宝账号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微信账号">
                <el-input
                  v-model="formBase.wepayAccount"
                  placeholder="微信账号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formBase.comments"
                  placeholder="备注（字数不超过200）"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- </el-card> -->
      </el-tab-pane>

      <el-tab-pane>
        <template #label>
          <span class="header-font">发票信息</span>
        </template>
        <el-button
          type="primary"
          name="add-invoice-button"
          @click="addInvoiceForm"
          ><IconifyIconOffline
            :icon="InvoiceFill"
          />&nbsp;&nbsp;添加开票信息</el-button
        >
        <br />
        <div>
          <template v-for="(invoice, index) in formInvoice">
            <br />
            <el-card>
              <template #header>
                <div class="card-header">
                  <div>
                    <span class="font-bold"
                      >开票信息&nbsp;&nbsp;<el-tag
                        size="large"
                        color="#626aef"
                        effect="dark"
                        >{{ invoice.company }}</el-tag
                      ></span
                    >
                    <template v-if="invoice.state === 1">
                      &nbsp;&nbsp;<el-tag size="large" type="danger"
                        >作废</el-tag
                      >
                    </template>
                    <template v-else-if="invoice.state === 2">
                      &nbsp;&nbsp;<el-tag type="success" size="large" >正常</el-tag>
                    </template>
                    <template v-else>
                      &nbsp;&nbsp;<el-tag size="large" type="info">异常</el-tag>
                    </template>
                  </div>
                  <div>
                    <template v-if="formInvoiceEditState[index] === true">
                      <el-button
                        type="primary"
                        @click="changeInvoiceEditState(index)"
                        >编辑</el-button
                      >
                    </template>
                    <template v-else>
                      <el-button
                        type="success"
                        @click="addOrUpdateInvoiceInfo(index)"
                        >保存</el-button
                      >
                    </template>
                    <el-popconfirm
                      title="确认删除？"
                      confirm-button-text="删除"
                      confirm-button-type="danger"
                      cancel-button-type="primary"
                      cancel-button-text="取消"
                      @confirm="deleteInvoiceForm(index)"
                    >
                      <template #reference>
                        <el-button type="danger" title="删除">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </template>
              <el-form
                label-width="100px"
                :disabled="formInvoiceEditState[index]"
                ref="invoiceRules"
              >
                <el-input v-model="invoice.customerId" type="hidden" />
                <el-input v-model="invoice.id" type="hidden" />
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="抬头">
                      <el-input v-model="invoice.company" placeholder="抬头" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="开户行">
                      <el-input v-model="invoice.bank" placeholder="开户行" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="银行账号">
                      <el-input
                        v-model="invoice.bankAccount"
                        placeholder="银行账号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="税号">
                      <el-input
                        v-model="invoice.taxAccount"
                        placeholder="税号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="地址">
                      <el-input v-model="invoice.address" placeholder="地址" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电话">
                      <el-input v-model="invoice.phone" placeholder="电话" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="状态">
                      <el-select
                        v-model="invoice.state"
                        placeholder="状态"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="stateItem in invoiceState"
                          :key="stateItem.value"
                          :label="stateItem.label"
                          :value="stateItem.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input
                        v-model="invoice.comments"
                        placeholder="备注(字数不超过200)"
                        type="textarea"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
          </template>
        </div>
      </el-tab-pane>

      <el-tab-pane>
        <template #label>
          <span class="header-font">联系人信息</span>
        </template>
        <el-button
          type="primary"
          name="add-customer-contact-button"
          @click="addCustomerContactForm"
          ><IconifyIconOffline
            :icon="ContactFill"
          />&nbsp;&nbsp;添加联系人</el-button
        >
        <el-form
          :model="formCustomerContact"
          label-width="100px"
          ref="customerContactFormRef"
        >
          <div>
            <template v-for="(contact, index) in formCustomerContact">
              <br />
              <el-card>
                <template #header>
                  <div class="card-header">
                    <div>
                      <span class="font-bold"
                        >联系人&nbsp;&nbsp;<el-tag
                          size="large"
                          type="warning"
                          effect="dark"
                          >{{ contact.ccName }}</el-tag
                        ></span
                      >
                      <template v-if="contact.state === 1">
                        &nbsp;&nbsp;<el-tag size="large" type="danger"
                          >离职</el-tag
                        >
                      </template>
                      <template v-else-if="contact.state === 2">
                        &nbsp;&nbsp;<el-tag type="success" size="large">正常</el-tag>
                      </template>
                      <template v-else>
                        &nbsp;&nbsp;<el-tag size="large" type="info"
                          >异常</el-tag
                        >
                      </template>
                    </div>
                    <div>
                      <template
                        v-if="formCustomerContactEditState[index] === true"
                      >
                        <el-button
                          type="primary"
                          @click="changeCustomerContactEditState(index)"
                          >编辑</el-button
                        >
                      </template>
                      <template v-else>
                        <el-button
                          type="success"
                          @click="addOrUpdateCustomerContactsInfo(index)"
                          >保存</el-button
                        >
                      </template>
                      <el-popconfirm
                        title="确认删除？"
                        confirm-button-text="删除"
                        confirm-button-type="danger"
                        cancel-button-type="primary"
                        cancel-button-text="取消"
                        @confirm="deleteCustomerContactForm(index)"
                      >
                        <template #reference>
                          <el-button type="danger" title="删除">删除</el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </div>
                </template>
                <el-form
                  :disabled="formCustomerContactEditState[index]"
                  label-width="100px"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="姓名">
                        <el-input v-model="contact.ccName" placeholder="姓名" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="部门">
                        <el-input
                          v-model="contact.department"
                          placeholder="部门"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="职位">
                        <el-input v-model="contact.job" placeholder="职位" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="工作地">
                        <el-input
                          v-model="contact.baseLocation"
                          placeholder="工作地"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="固定电话">
                        <el-input
                          v-model="contact.telephone"
                          placeholder="固定电话"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="手机">
                        <el-input v-model="contact.phone" placeholder="手机" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="邮箱">
                        <el-input v-model="contact.mail" placeholder="邮箱" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="QQ">
                        <el-input v-model="contact.qq" placeholder="QQ" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="微信">
                        <el-input v-model="contact.wechat" placeholder="微信" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="状态">
                        <el-select
                          v-model="contact.state"
                          placeholder="状态"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="stateItem in customerContactsState"
                            :key="stateItem.value"
                            :label="stateItem.label"
                            :value="stateItem.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="备注">
                    <el-input
                      v-model="contact.comments"
                      placeholder="备注(字数不超过200)"
                      type="textarea"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </template>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br />
    <el-row justify="center">
      <el-col :span="8">
        <el-button
          type="primary"
          @click="updateCustomer(baseFormRef)"
          :disabled="submitState"
          ><IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;更新</el-button
        >
        <el-button
          type="warning"
          @click="resetCustomer()"
          :disabled="resetState"
          ><IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;重置</el-button
        >
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-font {
  font-weight: bold;
}
</style>
