<script setup lang="ts">
import { ref } from "vue";
import SearchLine from "@iconify-icons/ri/search-line";
import { PurchaseBaseInfo } from "@/interface/PurchaseInterface";
import { http } from "@/utils/http";
import { AjaxResponseList } from "@/api/AjaxResponseList";
import { ElMessage } from "element-plus";
import { useDetail } from "@/views/purchase/purchaseRouter";

defineOptions({
  name: "PurchaseSearch"
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
    searchPurchase();
  } else if (searchState.value == 2) {
    formCargo.value.pageNum = currentPage.value;
    searchCargo();
  } else if (searchState.value == 3) {
    formPurchaseContacts.value.pageNum = currentPage.value;
    searchPurchaseContacts();
  } else {
    ElMessage.error("跳转分页错误！");
  }
};

const showDetails = (purchaseId: string, purchaseName: string) => {
  let purchaseNameLittle = purchaseName;
  if (purchaseName.length > 10) {
    purchaseNameLittle = purchaseName.substring(0, 10) + "...";
  }
  toDetail(
    {
      id: purchaseId,
      purchaseName: purchaseNameLittle
    },
    "render",
    "purchase"
  );
};
const purchaseSearchInitInfo = () => {
  return {
    id: 0,
    purchaseName: "",
    purchaseNumber: "",
    telephone: "",
    phone: "",
    fax: "",
    address: "",
    factoryAddress: "",
    alipayAccount: "",
    wepayAccount: "",
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

const cargoSearchInitInfo = () => {
  return {
    id: 0,
    purchaseId: 0,
    purchaseName: "",
    searchType: 2,
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
const purchaseContactsSearchInitInfo = () => {
  return {
    id: 0,
    purchaseId: 0,
    purchaseName: "",
    ccName: "",
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

const formBase = ref<PurchaseBaseSearchInfo>(purchaseSearchInitInfo());
const formCargo = ref<CargoSearchInfo>(cargoSearchInitInfo());
const formPurchaseContacts = ref<PurchaseContactSearchInfo>(
  purchaseContactsSearchInitInfo()
);

const purchaseBaseCreateTime = ref();
const purchaseBaseUpdateTime = ref();
const cargoCreateTime = ref();
const cargoUpdateTime = ref();
const purchaseContactsCreateTime = ref();
const purchaseContactsUpdateTime = ref();

const purchaseBaseSearchResult = ref<PurchaseBaseInfo[]>([]);
const cargoSearchResult = ref<CargoSearchResult[]>([]);
const purchaseContactsSearchResult = ref<PurchaseContactSearchResult[]>([]);

//1：搜索基础信息 2：搜索发票 3：搜索联系人
const searchState = ref<Number>(1);

const searchPurchase = () => {
  //console.log(purchaseBaseCreateTime.value);
  if (purchaseBaseCreateTime.value != undefined) {
    formBase.value.createTimeStart = purchaseBaseCreateTime.value[0];
    formBase.value.createTimeEnd = purchaseBaseCreateTime.value[1];
  }
  if (purchaseBaseUpdateTime.value != undefined) {
    formBase.value.updateTimeStart = purchaseBaseUpdateTime.value[0];
    formBase.value.updateTimeEnd = purchaseBaseUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/purchase/search", {
      data: formBase.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        purchaseBaseSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchState.value = 1;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(purchaseBaseSearchResult.value);
      } else {
        purchaseBaseSearchResult.value.length = 0;
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
        ElMessage.error("搜索客户失败！", error.message);
      }
    });
};

const searchCargo = () => {
  searchState.value = 2;
  if (cargoCreateTime.value != undefined) {
    formCargo.value.createTimeStart = cargoCreateTime.value[0];
    formCargo.value.createTimeEnd = cargoCreateTime.value[1];
  }
  if (cargoUpdateTime.value != undefined) {
    formCargo.value.updateTimeStart = cargoUpdateTime.value[0];
    formCargo.value.updateTimeEnd = cargoUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/cargoBase/search", {
      data: formCargo.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        cargoSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(purchaseBaseSearchResult.value);
      } else {
        cargoSearchResult.value.length = 0;
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
        ElMessage.error("搜索客户失败！", error.message);
      }
    });
};

const searchPurchaseContacts = () => {
  searchState.value = 3;
  if (purchaseContactsCreateTime.value != undefined) {
    formPurchaseContacts.value.createTimeStart = purchaseContactsCreateTime.value[0];
    formPurchaseContacts.value.createTimeEnd = purchaseContactsCreateTime.value[1];
  }
  if (purchaseContactsUpdateTime.value != undefined) {
    formPurchaseContacts.value.updateTimeStart = purchaseContactsUpdateTime.value[0];
    formPurchaseContacts.value.updateTimeEnd = purchaseContactsUpdateTime.value[1];
  }
  http
    .request<AjaxResponseList>("post", "/api/purchaseContacts/search", {
      data: formPurchaseContacts.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        purchaseContactsSearchResult.value = response.data;
        pagShow.value = true;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        searchResultCard.value = true;
        ElMessage.success("搜索成功！");
        //console.log(purchaseBaseSearchResult.value);
      } else {
        purchaseContactsSearchResult.value.length = 0;
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
        ElMessage.error("搜索客户失败！", error.message);
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
const cargoState = [
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
const purchaseContactsState = [
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
          <span class="font-bold">搜索采购单</span>
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
                    <el-form-item label="客户名称" prop="purchaseName">
                      <el-input
                        v-model="formBase.purchaseName"
                        placeholder="客户名称"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户编号">
                      <el-input
                        v-model="formBase.purchaseNumber"
                        placeholder="客户编号"
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
                        v-model="formBase.address"
                        placeholder="办公地址"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="交货地址">
                      <el-input
                        v-model="formBase.factoryAddress"
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
                        v-model="purchaseBaseCreateTime"
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
                        v-model="purchaseBaseUpdateTime"
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
                    <el-button type="primary" @click="searchPurchase">
                      <IconifyIconOffline :icon="SearchLine" />&nbsp;&nbsp;搜索
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane>
              <template #label>
                <span class="header-font">搜索货物信息</span>
              </template>
              <el-form
                :model="formCargo"
                label-width="100px"
                ref="baseFormRef"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="抬头">
                      <el-input
                        v-model="formCargo.company"
                        placeholder="抬头"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开户行">
                      <el-input
                        v-model="formCargo.bank"
                        placeholder="开户行"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="银行账号">
                      <el-input
                        v-model="formCargo.bankAccount"
                        placeholder="银行账号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="税号">
                      <el-input
                        v-model="formCargo.taxAccount"
                        placeholder="税号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="地址">
                      <el-input
                        v-model="formCargo.address"
                        placeholder="地址"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="电话">
                      <el-input
                        v-model="formCargo.phone"
                        placeholder="电话"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="状态">
                      <el-select
                        v-model="formCargo.state"
                        placeholder="状态"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="stateItem in cargoState"
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
                        v-model="cargoCreateTime"
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
                        v-model="cargoUpdateTime"
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
                    <el-button type="primary" @click="searchCargo">
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
              <template v-if="searchState === 1"> 客户基础信息 </template>
              <template v-else-if="searchState === 2">
                货物信息
              </template>
              <template v-else> - </template>
            </span>
            结果
          </span>
        </div>
      </template>
      <div>
        <template v-if="searchState === 1">
          <template v-for="(item, index) in purchaseBaseSearchResult">
            <el-row>
              <el-col :span="24">
                <el-button
                  style="margin-bottom: 5px"
                  size="large"
                  type="success"
                  @click="showDetails(item.id, item.purchaseName)"
                  >{{ item.purchaseName }}</el-button
                >
              </el-col>
              <br />
              <el-col :span="24">
                <el-descriptions border :column="3" direction="vertical">
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">客户名称</div>
                    </template>
                    {{ item.purchaseName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">客户编号</div>
                    </template>
                    {{ item.purchaseNumber }}
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
                    {{ item.address }}
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
                    {{ item.factoryAddress }}
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
          <template v-for="(item, index) in cargoSearchResult">
            <el-row>
              <el-col :span="24">
                <el-button style="margin-bottom: 5px" type="warning" size="large" disabled>{{item.company }}</el-button>
                <el-button
                  style="margin-bottom: 5px"
                  size="large"
                  type="success"
                  @click="showDetails(item.purchaseId, item.purchaseName)"
                  >{{ item.purchaseName }}</el-button
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
