<script setup lang="ts">
import { ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import ContactFill from "@iconify-icons/ri/contacts-book-2-fill";
import InvoiceFill from "@iconify-icons/ri/coupon-3-fill";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
import {
  SupplierBaseInfo,
  InvoiceInfo,
  SupplierContactInfo
} from "@/interface/SupplierInterface";
import { AjaxResponse } from "@/api/AjaxResponse";
import { useDetail } from "./supplierRouter";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

defineOptions({
  name: "SupplierAddition"
});

let supplierId = 0;
//const router = useRouter();
const { toDetail } = useDetail();

const supplierInitInfo = () => {
  return {
    id: 0,
    supplierName: "",
    supplierNumber: "",
    telephone: "",
    phone: "",
    fax: "",
    companyAddress: "",
    deliveryAddress: "",
    alipayAccount: "",
    wepayAccount: "",
    state: 2,
    createTime: "",
    updateTime: "",
    comments: ""
  };
};

const formBase = ref<SupplierBaseInfo>(supplierInitInfo());

const baseFormRef = ref<FormInstance>();

const baseRules = ref<FormRules>({
  supplierName: [
    {
      required: true,
      message: "供应商名称不能为空",
      whitespace: true,
      trigger: "blur"
    }
  ]
});

//const invoiceFormRef = ref<FormInstance>();
/*

const invoiceRules = ref<FormRules>({
  company: [
    {
      type: "string",
      required: true,
      message: "抬头不能为空",
      whitespace: true,
      trigger: "blur"
    }
  ],
  bank: [
    {
      type: "string",
      required: true,
      message: "开户行不能为空",
      whitespace: true,
      trigger: "blur"
    }
  ],
  bankAccount: [
    {
      type: "number",
      required: true,
      message: "银行账号需全为数字",
      trigger: "change"
    }
  ],
  taxAccount: [
    { type: "string", required: true, message: "税号不能为空", trigger: "blur" }
  ]
});
*/

const formInvoice = ref<InvoiceInfo[]>([]);

const addInvoiceForm = () => {
  formInvoice.value.push({
    id: 0,
    supplierId: 0,
    company: "",
    bank: "",
    bankAccount: "",
    taxAccount: "",
    address: "",
    phone: "",
    state: 2,
    createTime: "",
    updateTime: "",
    comments: ""
  });
  //console.log(formInvoice);
};

const deleteInvoiceForm = (index: number) => {
  //const index = formInvoice.indexOf(item);
  // if (index === 0) {
  //   ElMessage.error("必须保留至少一个开票信息框！");
  // }
  if (index >= 0) {
    formInvoice.value.splice(index, 1);
  }
};

const formSupplierContact = ref<SupplierContactInfo[]>([]);

//const supplierContactFormRef = ref<FormInstance>();

/*
const supplierContactRules = reactive<FormRules>({
  scName: [
    {
      type: "string",
      required: true,
      message: "姓名不能为空",
      whitespace: true,
      trigger: "blur"
    }
  ]
});
*/

const addSupplierContactForm = () => {
  formSupplierContact.value.push({
    id: 0,
    supplierId: 0,
    scName: "",
    department: "",
    job: "",
    baseLocation: "",
    telephone: "",
    phone: "",
    mail: "",
    qq: "",
    wechat: "",
    state: 2,
    createTime: "",
    updateTime: "",
    comments: ""
  });
};

const deleteSupplierContactForm = (index: number) => {
  //const index = form_supplier_contact.indexOf(item);
  if (index >= 0) {
    formSupplierContact.value.splice(index, 1);
  }
};

//业务逻辑

//添加开票数据
const addInvoiceInfo = async () => {
  let code, message;
  if (formInvoice.value.length == 0) {
    return { code: -1, message: "数据为空" };
  } else {
    //将supplierId修改为对应的supplier表中的Id
    for (const index in formInvoice.value) {
      formInvoice.value[index].supplierId = supplierId;
    }
    const requestBody = JSON.stringify(formInvoice.value);
    await http
      .request<AjaxResponse>("post", "/api/invoiceBase/add", {
        data: requestBody
      })
      .then(function (response) {
        console.log("invoice:", response);
        if (response.code != 0) {
          ElMessage.error(response.message);
        } else {
          ElMessage.success("添加发票成功！");
        }
        code = response.code;
        message = response.message;
      })
      .catch(function (error) {
        ElMessage.error("添加发票失败！", error);
        code = 1;
        message = "添加发票失败";
        //return { code: 1, message: "添加发票失败" };
      });
    return { code: code, message: message };
  }
};

// 添加供应商联系人
const addSupplierContactsInfo = async () => {
  let code, message;
  if (formSupplierContact.value.length == 0) {
    return { code: -1, message: "数据为空" };
  } else {
    //将supplierId修改为对应的supplier表中的Id
    for (const index in formSupplierContact.value) {
      formSupplierContact.value[index].supplierId = supplierId;
    }
    const requestBody = JSON.stringify(formSupplierContact.value);
    await http
      .request<AjaxResponse>("post", "/api/supplierContacts/add", {
        data: requestBody
      })
      .then(function (response) {
        if (response.code != 0) {
          ElMessage.error(response.message);
        } else {
          ElMessage.success("添加供应商联系人成功！");
        }
        //return { code: response.code, message: response.message };
        code = response.code;
        message = response.message;
      })
      .catch(function (error) {
        ElMessage.error("添加联系人失败！", error);
        code = 1;
        message = "添加联系人失败";
        //return { code: 1, message: "添加联系人失败" };
      });
    return { code: code, message: message };
  }
};

const addSupplier = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  formEl.validate((valid, fields) => {
    if (valid) {
      //验证通过
      http
        .request<AjaxResponse>("post", "/api/supplier/add", {
          data: formBase.value
        })
        .then(async function (response) {
          if (response.code == 0) {
            //提交成功
            //获取ID
            supplierId = Number(response.data);
            ElMessage.success("添加供应商基础信息成功！");
            //console.log(supplierId);
            //const invoiceResponse: AjaxResponse = addInvoiceInfo();
            const invoiceResponse = addInvoiceInfo();
            const supplierResponse = addSupplierContactsInfo();
            let invoiceCode: number,
              invoiceMessage: string,
              supplierContactsCode: number,
              supplierContactsMessage: string;
            await invoiceResponse.then(response => {
              invoiceCode = response.code;
              invoiceMessage = response.message;
              console.log("invoiceCode:", invoiceCode);
            });
            await supplierResponse.then(response => {
              supplierContactsCode = response.code;
              supplierContactsMessage = response.message;
            });
            if (invoiceCode <= 0 && supplierContactsCode <= 0) {
              successAddInvoiceAndContacts();
            }
            if (invoiceCode > 0 && supplierContactsCode > 0) {
              failureAddInvoiceAndContacts(
                invoiceMessage,
                supplierContactsMessage
              );
            } else {
              if (invoiceCode > 0) {
                failureAddInvoice(invoiceMessage);
              }
              if (supplierContactsCode > 0) {
                failureAddContacts(supplierContactsMessage);
              }
            }
          } else {
            ElMessage.error(response.message);
            failureAddSupplier();
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
            ElMessage.error("添加供应商失败！", error.message);
          }
        });
    } else {
      //验证失败
      //console.log('失败:',fields);
      ElMessage.error("供应商信息不合法！");
    }
  });
};

const resetSupplier = () => {
  Object.assign(formBase.value, supplierInitInfo());
  formInvoice.value.length = 0;
  formSupplierContact.value.length = 0;
};

const redirectDetailPage = () => {
  let supplierNameLittle = formBase.value.supplierName;
  if (supplierNameLittle.length > 10) {
    supplierNameLittle = supplierNameLittle.substring(0, 10) + "...";
  }
  toDetail({ id: supplierId, supplierName: supplierNameLittle, renderFlag: 1 }, "render");
};

const successAddInvoiceAndContacts = () => {
  ElMessageBox.confirm("添加供应商信息成功", "成功", {
    confirmButtonText: "查看详情",
    cancelButtonText: "继续添加",
    type: "success"
  })
    .then(() => {
      //删除编辑标签
      useMultiTagsStoreHook().handleTags("splice", "/supplier/addition");
      //跳转到详情页
      redirectDetailPage();
    })
    .catch((action: Action) => {
      //保持不动，并清空内容
      resetSupplier();
    });
};

const failureAddSupplier = () => {
  ElMessageBox.alert("添加供应商基础信息失败！", "警告", {
    confirmButtonText: "重新添加"
    /*callback: (action: Action) => {}*/
  });
};

const failureAddInvoiceAndContacts = (invoiceMessage, supplierMessage) => {
  ElMessageBox.alert(
    "添加供应商基础信息成功！<br/>但" + invoiceMessage + "," + supplierMessage,
    "警告",
    {
      confirmButtonText: "前往补添",
      type: "warning",
      dangerouslyUseHTMLString: true
    }
  );
};
const failureAddInvoice = invoiceMessage => {
  ElMessageBox.alert(
    "添加供应商基础信息成功！<br/>但" + invoiceMessage,
    "警告",
    {
      confirmButtonText: "前往补添",
      type: "warning",
      dangerouslyUseHTMLString: true,
      callback: (action: Action) => {
        if (action === "confirm") {
          redirectDetailPage();
        } else {
          ElMessage.error(
            "请知晓：供应商发票添加存在失败！！！" + invoiceMessage
          );
          //清空现有内容
          resetSupplier();
        }
      }
    }
  );
};
const failureAddContacts = supplierMessage => {
  ElMessageBox.alert(
    "添加供应商基础信息成功！<br/>但" + supplierMessage,
    "警告",
    {
      confirmButtonText: "前往补添",
      type: "warning",
      dangerouslyUseHTMLString: true,
      callback: (action: Action) => {
        if (action === "confirm") {
          redirectDetailPage();
        } else {
          ElMessage.error(
            "请知晓：供应商联系人添加存在失败！！！" + supplierMessage
          );
          //清空现有内容
          resetSupplier();
        }
      }
    }
  );
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
const supplierContactsState = [
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
      <span class="font-bold">添加供应商</span>
    </template>

    <el-tabs type="border-card">
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
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input
              v-model="formBase.supplierName"
              placeholder="供应商名称"
            />
          </el-form-item>
          <el-input v-model="formBase.id" type="hidden" />
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商编号">
                <el-input
                  v-model="formBase.supplierNumber"
                  placeholder="供应商编号"
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
                  v-model="formBase.companyAddress"
                  placeholder="办公地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交货地址">
                <el-input
                  v-model="formBase.deliveryAddress"
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

        <div>
          <template v-for="(invoice, index) in formInvoice">
            <br />
            <el-card>
              <template #header>
                <div class="card-header">
                  <span class="font-bold"
                    >开票信息&nbsp;&nbsp;<el-tag
                      size="large"
                      type="success"
                      effect="dark"
                      >{{ invoice.company }}</el-tag
                    ></span
                  >
                  <div>
                    <!-- <el-button type="primary" @click="addInvoice">添加</el-button> -->
                    <el-button type="danger" @click="deleteInvoiceForm(index)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </template>
              <el-form label-width="100px">
                <el-input v-model="invoice.supplierId" type="hidden" />
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="抬头" prop="company">
                      <el-input v-model="invoice.company" placeholder="抬头" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="开户行" prop="bank">
                      <el-input v-model="invoice.bank" placeholder="开户行" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="银行账号" prop="bankAccount">
                      <el-input
                        v-model="invoice.bankAccount"
                        placeholder="银行账号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="税号" prop="taxAccount">
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
          name="add-supplier-contact-button"
          @click="addSupplierContactForm"
          ><IconifyIconOffline
            :icon="ContactFill"
          />&nbsp;&nbsp;添加联系人</el-button
        >
        <div>
          <template v-for="(contact, index) in formSupplierContact">
            <br />
            <el-card>
              <template #header>
                <div class="card-header">
                  <span class="font-bold"
                    >联系人&nbsp;&nbsp;<el-tag
                      size="large"
                      type="warning"
                      effect="dark"
                      >{{ contact.scName }}</el-tag
                    ></span
                  >
                  <div>
                    <!-- <el-button type="primary" @click="addInvoice">添加</el-button> -->
                    <el-button
                      type="danger"
                      @click="deleteSupplierContactForm(index)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </template>
              <el-form label-width="100px" ref="supplierContactFormRef">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="姓名">
                      <el-input v-model="contact.scName" placeholder="姓名" />
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
                          v-for="stateItem in supplierContactsState"
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
      </el-tab-pane>
    </el-tabs>

    <br />
    <el-row justify="center">
      <el-col :span="8">
        <el-button type="primary" @click="addSupplier(baseFormRef)"
          ><IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;提交</el-button
        >
        <el-button type="warning" @click="resetSupplier()"
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
