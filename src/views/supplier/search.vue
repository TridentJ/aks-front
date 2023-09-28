<script setup lang="ts">
import { ref } from "vue";
import SearchLine from "@iconify-icons/ri/search-line";
import {
  SupplierBaseInfo,
  InvoiceInfo,
  SupplierContactInfo
} from "@/interface/SupplierInterface";
import {
  SupplierBaseSearchInfo,
  InvoiceSearchInfo,
  SupplierContactSearchInfo,
  InvoiceSearchResult,
  SupplierContactSearchResult
} from "@/interface/SupplierSearchInterface";
import { http } from "@/utils/http";
import { AjaxResponseList } from "@/api/AjaxResponseList";
import { ElMessage } from "element-plus";
import { useDetail } from "@/views/supplier/supplierRouter";

defineOptions({
  name: "SupplierSearch"
});

const collapseState = ref(["search-condition"]);
const searchResultCard = ref<Boolean>(false);
const { toDetail } = useDetail();
const totalNum = ref<Number>(10);
const currentPage = ref<Number>(1);
const currentPageSize = ref<Number>(10);
const pagShow = ref<Boolean>(false);
const pagChange = () => {
  //console.log("change");
  collapseState.value = [];
  if (searchState.value == 1) {
    formBase.value.pageNum = currentPage.value;
    searchSupplier();
  } else if (searchState.value == 2) {
    formInvoice.value.pageNum = currentPage.value;
    searchInvoice();
  } else if (searchState.value == 3) {
    formSupplierContacts.value.pageNum = currentPage.value;
    searchSupplierContacts();
  } else {
    ElMessage.error("跳转分页错误！");
  }
};

const showDetails = (supplierId: string, supplierName: string) => {
  let supplierNameLittle = supplierName;
  if (supplierName.length > 10) {
    supplierNameLittle = supplierName.substring(0, 10) + "...";
  }
  toDetail(
    {
      id: supplierId,
      supplierName: supplierNameLittle
    },
    "render"
  );
};
const supplierSearchInitInfo = () => {
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
    state: 100,
    createTimeStart: null,
    createTimeEnd: null,
    updateTimeStart: null,
    updateTimeEnd: null,
    comments: "",
    pageNum: currentPage.value,
    pageSize: currentPageSize.value
  };
};

const invoiceSearchInitInfo = () => {
  return {
    id: 0,
    supplierId: 0,
    searchType: 1,
    supplierName: "",
    company: "",
    bank: "",
    bankAccount: "",
    taxAccount: "",
    address: "",
    phone: "",
    state: 100,
    createTimeStart: "",
    createTimeEnd: "",
    updateTimeStart: "",
    updateTimeEnd: "",
    comments: "",
    pageNum: currentPage.value,
    pageSize: currentPageSize.value
  };
};
const supplierContactsSearchInitInfo = () => {
  return {
    id: 0,
    supplierId: 0,
    supplierName: "",
    scName: "",
    department: "",
    job: "",
    baseLocation: "",
    telephone: "",
    phone: "",
    mail: "",
    qq: "",
    wechat: "",
    state: 100,
    createTimeStart: "",
    createTimeEnd: "",
    updateTimeStart: "",
    updateTimeEnd: "",
    comments: "",
    pageNum: currentPage.value,
    pageSize: currentPageSize.value
  };
};

const formBase = ref<SupplierBaseSearchInfo>(supplierSearchInitInfo());
const formInvoice = ref<InvoiceSearchInfo>(invoiceSearchInitInfo());
const formSupplierContacts = ref<SupplierContactSearchInfo>(
  supplierContactsSearchInitInfo()
);

const supplierBaseCreateTime = ref();
const supplierBaseUpdateTime = ref();
const invoiceCreateTime = ref();
const invoiceUpdateTime = ref();
const supplierContactsCreateTime = ref();
const supplierContactsUpdateTime = ref();

const supplierBaseSearchResult = ref<SupplierBaseInfo[]>([]);
const invoiceSearchResult = ref<InvoiceSearchResult[]>([]);
const supplierContactsSearchResult = ref<SupplierContactSearchResult[]>([]);

//1：搜索基础信息 2：搜索发票 3：搜索联系人
const searchState = ref<Number>(1);

const searchSupplier = () => {
  //console.log(supplierBaseCreateTime.value);
  if (supplierBaseCreateTime.value != undefined) {
    formBase.value.createTimeStart = supplierBaseCreateTime.value[0];
    formBase.value.createTimeEnd = supplierBaseCreateTime.value[1];
  }
  if (supplierBaseUpdateTime.value != undefined) {
    formBase.value.updateTimeStart = supplierBaseUpdateTime.value[0];
    formBase.value.updateTimeEnd = supplierBaseUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/supplier/search", {
      data: formBase.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        supplierBaseSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchState.value = 1;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(supplierBaseSearchResult.value);
      } else {
        supplierBaseSearchResult.value.length = 0;
        ElMessage.warning(response.message);
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
        ElMessage.error("搜索供应商失败！", error.message);
      }
    });
};

const searchInvoice = () => {
  searchState.value = 2;
  if (invoiceCreateTime.value != undefined) {
    formInvoice.value.createTimeStart = invoiceCreateTime.value[0];
    formInvoice.value.createTimeEnd = invoiceCreateTime.value[1];
  }
  if (invoiceUpdateTime.value != undefined) {
    formInvoice.value.updateTimeStart = invoiceUpdateTime.value[0];
    formInvoice.value.updateTimeEnd = invoiceUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/invoiceBase/search", {
      data: formInvoice.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        invoiceSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(supplierBaseSearchResult.value);
      } else {
        invoiceSearchResult.value.length = 0;
        ElMessage.warning(response.message);
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
        ElMessage.error("搜索供应商失败！", error.message);
      }
    });
};

const searchSupplierContacts = () => {
  searchState.value = 3;
  if (supplierContactsCreateTime.value != undefined) {
    formSupplierContacts.value.createTimeStart = supplierContactsCreateTime.value[0];
    formSupplierContacts.value.createTimeEnd = supplierContactsCreateTime.value[1];
  }
  if (supplierContactsUpdateTime.value != undefined) {
    formSupplierContacts.value.updateTimeStart = supplierContactsUpdateTime.value[0];
    formSupplierContacts.value.updateTimeEnd = supplierContactsUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/supplierContacts/search", {
      data: formSupplierContacts.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        supplierContactsSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(supplierBaseSearchResult.value);
      } else {
        supplierContactsSearchResult.value.length = 0;
        ElMessage.warning(response.message);
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
        ElMessage.error("搜索供应商失败！", error.message);
      }
    });
};

const shortcuts = [
  {
    text: "最近1周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "最近1个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "最近3个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];
const baseState = [
  {
    value: 100,
    label: "所有"
  },
  {
    value: 1,
    label: "冻结"
  },
  {
    value: 2,
    label: "正常"
  }
];
const invoiceState = [
  {
    value: 100,
    label: "所有"
  },
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
    value: 100,
    label: "所有"
  },
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
  <div>
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span class="font-bold">搜索供应商</span>
        </div>
      </template>
      <el-collapse v-model="collapseState">
        <el-collapse-item name="search-condition">
          <template #title>
            <div class="search-title">搜索条件</div>
          </template>
          <el-tabs type="border-card">
            <el-tab-pane>
              <template #label>
                <span class="header-font">搜索基础信息</span>
              </template>
              <el-form :model="formBase" label-width="100px" ref="baseFormRef">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="供应商名称" prop="supplierName">
                      <el-input
                        v-model="formBase.supplierName"
                        placeholder="供应商名称"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供应商编号">
                      <el-input
                        v-model="formBase.supplierNumber"
                        placeholder="供应商编号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="传真">
                      <el-input v-model="formBase.fax" placeholder="传真" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="固定电话">
                      <el-input
                        v-model="formBase.telephone"
                        placeholder="固定电话"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="移动电话">
                      <el-input
                        v-model="formBase.phone"
                        placeholder="移动电话"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="办公地址">
                      <el-input
                        v-model="formBase.companyAddress"
                        placeholder="办公地址"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="交货地址">
                      <el-input
                        v-model="formBase.deliveryAddress"
                        placeholder="交货地址"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="支付宝账号">
                      <el-input
                        v-model="formBase.alipayAccount"
                        placeholder="支付宝账号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="微信账号">
                      <el-input
                        v-model="formBase.wepayAccount"
                        placeholder="微信账号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="状态">
                      <el-select
                        v-model="formBase.state"
                        placeholder="状态"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="stateItem in baseState"
                          :key="stateItem.value"
                          :label="stateItem.label"
                          :value="stateItem.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建时间">
                      <el-date-picker
                        v-model="supplierBaseCreateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="更新时间">
                      <el-date-picker
                        v-model="supplierBaseUpdateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="10">
                    <el-button type="primary" @click="searchSupplier">
                      <IconifyIconOffline :icon="SearchLine" />&nbsp;&nbsp;搜索
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane>
              <template #label>
                <span class="header-font">搜索发票信息</span>
              </template>
              <el-form
                :model="formInvoice"
                label-width="100px"
                ref="baseFormRef"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="抬头">
                      <el-input
                        v-model="formInvoice.company"
                        placeholder="抬头"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开户行">
                      <el-input
                        v-model="formInvoice.bank"
                        placeholder="开户行"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="银行账号">
                      <el-input
                        v-model="formInvoice.bankAccount"
                        placeholder="银行账号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="税号">
                      <el-input
                        v-model="formInvoice.taxAccount"
                        placeholder="税号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="地址">
                      <el-input
                        v-model="formInvoice.address"
                        placeholder="地址"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="电话">
                      <el-input
                        v-model="formInvoice.phone"
                        placeholder="电话"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="状态">
                      <el-select
                        v-model="formInvoice.state"
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
                  <el-col :span="8">
                    <el-form-item label="创建时间">
                      <el-date-picker
                        v-model="invoiceCreateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="更新时间">
                      <el-date-picker
                        v-model="invoiceUpdateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="10">
                    <el-button type="primary" @click="searchInvoice">
                      <IconifyIconOffline :icon="SearchLine" />&nbsp;&nbsp;搜索
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane>
              <template #label>
                <span class="header-font">搜索联系人信息</span>
              </template>
              <el-form
                :model="formSupplierContacts"
                label-width="100px"
                ref="supplierContactsFormRef"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="姓名">
                      <el-input
                        v-model="formSupplierContacts.scName"
                        placeholder="姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="部门">
                      <el-input
                        v-model="formSupplierContacts.department"
                        placeholder="部门"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="职位">
                      <el-input
                        v-model="formSupplierContacts.job"
                        placeholder="职位"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="工作地">
                      <el-input
                        v-model="formSupplierContacts.baseLocation"
                        placeholder="工作地"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="固定电话">
                      <el-input
                        v-model="formSupplierContacts.telephone"
                        placeholder="固定电话"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="手机">
                      <el-input
                        v-model="formSupplierContacts.phone"
                        placeholder="手机"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="邮箱">
                      <el-input
                        v-model="formSupplierContacts.mail"
                        placeholder="邮箱"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="QQ">
                      <el-input
                        v-model="formSupplierContacts.qq"
                        placeholder="QQ"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="微信">
                      <el-input
                        v-model="formSupplierContacts.wechat"
                        placeholder="QQ"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="状态">
                      <el-select
                        v-model="formSupplierContacts.state"
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
                  <el-col :span="8">
                    <el-form-item label="创建时间">
                      <el-date-picker
                        v-model="supplierContactsCreateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="更新时间">
                      <el-date-picker
                        v-model="supplierContactsUpdateTime"
                        type="daterange"
                        unlink-panels
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD"
                        :shortcuts="shortcuts"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="10">
                    <el-button type="primary" @click="searchSupplierContacts">
                      <IconifyIconOffline :icon="SearchLine" />&nbsp;&nbsp;搜索
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card v-show="searchResultCard">
      <template #header>
        <div class="card-header">
          <span class="font-bold">
            搜索
            <span class="red">
              <template v-if="searchState === 1"> 供应商基础信息 </template>
              <template v-else-if="searchState === 2">
                发票信息
              </template>
              <template v-else-if="searchState === 3">
                联系人信息
              </template>
              <template v-else> - </template>
            </span>
            结果
          </span>
        </div>
      </template>
      <div>
        <template v-if="searchState === 1">
          <template v-for="(item, index) in supplierBaseSearchResult">
            <el-row>
              <el-col :span="24">
                <el-button
                  style="margin-bottom: 5px"
                  size="large"
                  type="success"
                  @click="showDetails(item.id, item.supplierName)"
                  >{{ item.supplierName }}</el-button
                >
              </el-col>
              <br />
              <el-col :span="24">
                <el-descriptions border :column="3" direction="vertical">
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">供应商名称</div>
                    </template>
                    {{ item.supplierName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">供应商编号</div>
                    </template>
                    {{ item.supplierNumber }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">传真</div>
                    </template>
                    {{ item.fax }}
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">固定电话</div>
                    </template>
                    {{ item.telephone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">支付宝账号</div>
                    </template>
                    {{ item.alipayAccount }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">办公地址</div>
                    </template>
                    {{ item.companyAddress }}
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">手机</div>
                    </template>
                    {{ item.phone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">微信账号</div>
                    </template>
                    {{ item.wepayAccount }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">交货地址</div>
                    </template>
                    {{ item.deliveryAddress }}
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">创建时间</div>
                    </template>
                    {{ item.createTime }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">更新时间</div>
                    </template>
                    {{ item.updateTime }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">状态</div>
                    </template>
                    <template v-if="item.state === 2"> 正常 </template>
                    <template v-else-if="item.state === 1"> 冻结 </template>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">备注</div>
                    </template>
                    {{ item.comments }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-divider />
            </el-row>
          </template>
        </template>
        <template v-else-if="searchState === 2">
          <template v-for="(item, index) in invoiceSearchResult">
            <el-row>
              <el-col :span="24">
                <el-button style="margin-bottom: 5px" type="warning" size="large" disabled>{{item.company }}</el-button>
                <el-button
                  style="margin-bottom: 5px"
                  size="large"
                  type="success"
                  @click="showDetails(item.supplierId, item.supplierName)"
                  >{{ item.supplierName }}</el-button
                >
              </el-col>
              <br />
              <el-col :span="24">
                <el-descriptions border :column="3">
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">抬头</div>
                    </template>
                    {{ item.company }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">开户行</div>
                    </template>
                    {{ item.bank }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">银行账号</div>
                    </template>
                    {{ item.bankAccount }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">税号</div>
                    </template>
                    {{ item.taxAccount }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">地址</div>
                    </template>
                    {{ item.address }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">电话</div>
                    </template>
                    {{ item.phone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">状态</div>
                    </template>
                    <template v-if="item.state === 1">
                      <el-tag size="large" type="danger">作废</el-tag>
                    </template>
                    <template v-else-if="item.state === 2">
                      <el-tag type="success" size="large">正常</el-tag>
                    </template>
                    <template v-else>
                      &nbsp;&nbsp;<el-tag size="large" type="info">异常</el-tag>
                    </template>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">创建时间</div>
                    </template>
                    {{ item.createTime }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">更新时间</div>
                    </template>
                    {{ item.updateTime }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">备注</div>
                    </template>
                    {{ item.comments }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-divider />
            </el-row>
          </template>
        </template>
        <template v-else-if="searchState === 3">
          <template v-for="(item, index) in supplierContactsSearchResult">
            <el-row>
              <el-col :span="24">
                <el-button style="margin-bottom: 5px" type="warning" size="large" disabled>{{item.scName }}</el-button>
                <el-button
                  style="margin-bottom: 5px"
                  size="large"
                  type="success"
                  @click="showDetails(item.supplierId, item.supplierName)"
                  >{{ item.supplierName }}</el-button
                >
              </el-col>
              <br />
              <el-col :span="24">
                <el-descriptions border :column="3">
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">姓名</div>
                    </template>
                    {{ item.scName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">部门</div>
                    </template>
                    {{ item.department }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">职位</div>
                    </template>
                    {{ item.job }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">工作地</div>
                    </template>
                    {{ item.baseLocation }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">固定电话</div>
                    </template>
                    {{ item.telephone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">手机</div>
                    </template>
                    {{ item.phone }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">邮箱</div>
                    </template>
                    {{ item.mail }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">QQ</div>
                    </template>
                    {{ item.qq }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">微信</div>
                    </template>
                    {{ item.wechat }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">备注</div>
                    </template>
                    {{ item.comments }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-divider />
            </el-row>
          </template>
        </template>

        <el-row v-if="pagShow">
          <el-col :offset="9" :span="6">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="totalNum"
              v-model:current-page="currentPage"
              :page-size="currentPageSize"
              @current-change="pagChange"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<style lang="css">
.search-card {
  margin-bottom: 20px;
}
.font-bold {
  font-weight: bold;
  font-size: larger;
}

.search-title {
  font-weight: bold;
  font-size: larger;
  color: blue;
}
.button-bottom {
  margin-bottom: 5px;
}
.red {
  color: red;
}
</style>
