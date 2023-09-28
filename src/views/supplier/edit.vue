<script setup lang="ts">
import { ref } from "vue";
import { Action, FormInstance, FormRules } from "element-plus";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import ContactFill from "@iconify-icons/ri/contacts-book-2-fill";
import InvoiceFill from "@iconify-icons/ri/coupon-3-fill";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  SupplierBaseInfo,
  InvoiceInfo,
  SupplierContactInfo
} from "@/interface/SupplierInterface";
import { AjaxResponse } from "@/api/AjaxResponse";
import { useDetail } from "./supplierRouter";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

defineOptions({
  name: "SupplierEdit"
});

//let supplierId = 0;
//const router = useRouter();

//获取传递的参数
const { initToDetail, getParameter, toDetail, router } = useDetail();
initToDetail("edit");
//const route = useRoute();
const supplierId = getParameter.id;
//console.log("edit supplierId:", supplierId);
if (supplierId == undefined) {
  ElMessage.error("需提供供应商信息！");
}

const submitState = ref<boolean>(false);

const resetState = ref<boolean>(false);

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
//const formBase = ref<SupplierBaseInfo>();

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

// 发票处理

const formInvoice = ref<InvoiceInfo[]>([]);

const formInvoiceEditState = ref<boolean[]>([]);
const changeInvoiceEditState = index => {
  formInvoiceEditState.value[index] = false;
};

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
};

const deleteInvoiceForm = (index: number) => {
  if (index >= 0) {
    formInvoice.value.splice(index, 1);
  }
};

const formSupplierContact = ref<SupplierContactInfo[]>([]);

const formSupplierContactEditState = ref<boolean[]>([]);
const changeSupplierContactEditState = index => {
  formSupplierContactEditState.value[index] = false;
};

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
const getInvoiceInfo = () => {
  http
    .request<AjaxResponse>(
      "get",
      "/api/invoiceBase/show?id=" + supplierId + "&type=1"
    )
    .then(function (response) {
      if (response.code == 1161) {
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

const getSupplierContacts = () => {
  http
    .request<AjaxResponse>(
      "get",
      "/api/supplierContacts/show?supplierId=" + supplierId
    )
    .then(function (response) {
      if (response.code == 1191) {
        ElMessage.info(response.message);
      } else if (response.code != 0) {
        ElMessage({
          message: String(response.message),
          type: "error"
        });
      } else {
        //console.log(response.data);
        formSupplierContact.value = response.data;
        for (let i = 0; i < formSupplierContact.value.length; i++) {
          formSupplierContactEditState.value.push(true);
        }
      }
    });
};
//获取信息
http
  .request<AjaxResponse>("get", "/api/supplier/show?id=" + supplierId)
  .then(function (response) {
    if (response.code != 0) {
      ElMessage.error(response.message);
    } else {
      //console.log(response.data);
      formBase.value = response.data;
      //获取发票信息
      getInvoiceInfo();
      //获取联系人信息
      getSupplierContacts();
    }
  });

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
  //formInvoice.value[index].supplierId = Number(supplierId);
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
  formInvoice.value[index].supplierId = Number(supplierId);
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

// 供应商联系人

const addOrUpdateSupplierContactsInfo = async index => {
  let result = 0;
  if (formSupplierContact.value[index].id == 0) {
    //add
    //formSupplierContact.value[index].supplierId = Number(supplierId);
    await addSupplierContactsInfo(index).then(response => {
      result = response;
    });
  } else {
    await updateSupplierContactsInfo(index).then(response => {
      result = response;
    });
  }
  if (result == 1) {
    formSupplierContactEditState.value[index] = true;
  }
};

const updateSupplierContactsInfo = async index => {
  let result = 0;
  //formSupplierContact.value[index].supplierId = Number(supplierId);
  formSupplierContact.value[index].createTime = null;
  formSupplierContact.value[index].updateTime = null;
  const requestBody = JSON.stringify(formSupplierContact.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/supplierContacts/update", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        ElMessage.success("更新供应商联系人成功！");
        result = 1;
      }
    })
    .catch(function (error) {
      ElMessage.error("更新供应商联系人失败！", error);
    });
  return result;
};

const addSupplierContactsInfo = async index => {
  let result = 0;
  formSupplierContact.value[index].supplierId = Number(supplierId);
  const requestBody = JSON.stringify(formSupplierContact.value[index]);
  await http
    .request<AjaxResponse>("post", "/api/supplierContacts/addOne", {
      data: requestBody
    })
    .then(function (response) {
      //console.log("invoice:", response);
      if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        if (Number.isInteger(response.data)) {
          formSupplierContact.value[index].id = Number(response.data);
          ElMessage.success("添加供应商联系人成功！");
          result = 1;
        } else {
          ElMessage.error("添加供应商联系人失败！返回值不合法！");
          result = 0;
        }
      }
    })
    .catch(function (error) {
      ElMessage.error("添加供应商联系人失败！" + error);
    });
  return result;
};

const updateSupplier = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formEl.validate((valid, fields) => {
    if (valid) {
      //验证通过
      formBase.value.createTime = null;
      formBase.value.updateTime = null;
      http
        .request<AjaxResponse>("post", "/api/supplier/update", {
          data: formBase.value
        })
        .then(async function (response) {
          if (response.code == 0) {
            //提交成功
            ElMessage.success("更新供应商基础信息成功！");
            successUpdateSupplier();
          } else {
            ElMessage.error(response.message);
            failureUpdateSupplier();
          }
        })
        .catch(function (error) {
          if (error.response) {
            //请求成功发出，服务器也相应，但状态码不是200
            console.log(error.response.state);
            ElMessage.error("服务器错误！", error.response.state);
          } else if (error.request) {
            //请求成功发出，服务器无响应
            console.log(error.request);
            ElMessage.error("服务器无响应！", error.request);
          } else {
            //请求发送失败
            console.log("Error", error.message);
            ElMessage.error("更新供应商失败！", error.message);
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

const successUpdateSupplier = () => {
  ElMessageBox.confirm("更新供应商信息成功", "成功", {
    confirmButtonText: "查看详情",
    cancelButtonText: "关闭当前页",
    type: "success"
  })
    .then(() => {
      //删除编辑标签
      useMultiTagsStoreHook().handleTags("splice", "/supplier/edit");
      //跳转到详情页
      redirectDetailPage();
    })
    .catch((action: Action) => {
      //保持不动
      //resetSupplier();
      //删除标签
      useMultiTagsStoreHook().handleTags("splice", "/supplier/edit");
      //切换到最后一个标签
      const newRoute = useMultiTagsStoreHook().handleTags("slice");
      router.push({ path: newRoute[0].path });
    });
};

const failureUpdateSupplier = () => {
  ElMessageBox.alert("更新供应商基础信息失败！", "警告", {
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
      <span class="font-bold"
        >修改供应商信息&nbsp;&nbsp;<el-tag
          size="large"
          color="#40E0D0"
          effect="dark"
          >{{ formBase.supplierName }}</el-tag
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
                    <el-button type="danger" @click="deleteInvoiceForm(index)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </template>
              <el-form
                label-width="100px"
                :disabled="formInvoiceEditState[index]"
                ref="invoiceRules"
              >
                <el-input v-model="invoice.supplierId" type="hidden" />
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
          name="add-supplier-contact-button"
          @click="addSupplierContactForm"
          ><IconifyIconOffline
            :icon="ContactFill"
          />&nbsp;&nbsp;添加联系人</el-button
        >
        <el-form
          :model="formSupplierContact"
          label-width="100px"
          ref="supplierContactFormRef"
        >
          <div>
            <template v-for="(contact, index) in formSupplierContact">
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
                          >{{ contact.scName }}</el-tag
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
                        v-if="formSupplierContactEditState[index] === true"
                      >
                        <el-button
                          type="primary"
                          @click="changeSupplierContactEditState(index)"
                          >编辑</el-button
                        >
                      </template>
                      <template v-else>
                        <el-button
                          type="success"
                          @click="addOrUpdateSupplierContactsInfo(index)"
                          >保存</el-button
                        >
                      </template>
                      <el-button
                        type="danger"
                        @click="deleteSupplierContactForm(index)"
                        >删除</el-button
                      >
                    </div>
                  </div>
                </template>
                <el-form
                  :disabled="formSupplierContactEditState[index]"
                  label-width="100px"
                >
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
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br />
    <el-row justify="center">
      <el-col :span="8">
        <el-button
          type="primary"
          @click="updateSupplier(baseFormRef)"
          :disabled="submitState"
          ><IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;更新</el-button
        >
        <el-button
          type="warning"
          @click="resetSupplier()"
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
