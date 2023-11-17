<script setup lang="ts">
//import axios from "axios";
import { onBeforeMount, ref } from "vue";
import { http } from "@/utils/http";
import { AjaxResponse } from "@/api/AjaxResponse";
import { ElMessage } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import {
  CustomerBaseInfo,
  InvoiceInfo,
  CustomerContactInfo
} from "@/interface/CustomerInterface";
import { useDetail } from "./customerRouter";
import { deleteTag } from "@/interface/AksTag";

defineOptions({
  name: "CustomerRender"
});

//获取传递的参数
const { initToDetail, getParameter, toDetail } = useDetail();
initToDetail("render");
//const route = useRoute();
const customerId = getParameter.id;
//console.log("render customerId:", customerId);

//console.log("route:" + route.query.id);

const baseInfoData = ref<CustomerBaseInfo>({
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
});
const invoiceInfoData = ref<InvoiceInfo[]>([]);
const customerContactInfoData = ref<CustomerContactInfo[]>([]);

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
        console.log(response.data);
        invoiceInfoData.value = response.data;
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
        console.log(response.message);
        customerContactInfoData.value = response.data;
      }
    });
};

const editCustomer = () => {
  let customerNameLittle = baseInfoData.value.customerName;
  if (baseInfoData.value.customerName.length > 10) {
    customerNameLittle = baseInfoData.value.customerName.substring(0, 10) + "...";
  }
  deleteTag("/customer/render", getParameter);
  toDetail(
    {
      id: customerId,
      customerName: customerNameLittle
    },
    "edit"
  );
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
          console.log(response.data);
          baseInfoData.value = response.data;
          //获取发票信息
          getInvoiceInfo();
          //获取联系人信息
          getCustomerContacts();
        }
      });
  }
};

const changeTable = (tab, event) => {
  if (tab.index == 1) {
    //获取发票信息
    //getInvoiceInfo();
  } else if (tab.index == 2) {
    //获取联系人信息
    //getCustomerContacts();
  }
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-bold"
          >客户信息&nbsp;&nbsp;<el-tag
            size="large"
            color="#40E0D0"
            effect="dark"
            >{{ baseInfoData.customerName }}</el-tag
          ></span
        >
      </div>
    </template>

    <el-tabs type="border-card">
      <el-tab-pane>
        <template #label>
          <span class="header-font">基础信息</span>
        </template>
        <el-descriptions border :column="3">
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">客户名称</div>
            </template>
            {{ baseInfoData.customerName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">客户编号</div>
            </template>
            {{ baseInfoData.customerNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">传真</div>
            </template>
            {{ baseInfoData.fax }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">固定电话</div>
            </template>
            {{ baseInfoData.telephone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">支付宝账号</div>
            </template>
            {{ baseInfoData.alipayAccount }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">办公地址</div>
            </template>
            {{ baseInfoData.address }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">手机</div>
            </template>
            {{ baseInfoData.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">微信账号</div>
            </template>
            {{ baseInfoData.wepayAccount }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">交货地址</div>
            </template>
            {{ baseInfoData.factoryAddress }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">创建时间</div>
            </template>
            {{ baseInfoData.createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">更新时间</div>
            </template>
            {{ baseInfoData.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">状态</div>
            </template>
            <template v-if="baseInfoData.state === 2"> 正常 </template>
            <template v-else-if="baseInfoData.state === 1"> 冻结 </template>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">备注</div>
            </template>
            {{ baseInfoData.comments }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane>
        <template #label>
          <span class="header-font">发票信息</span>
        </template>
        <template v-for="item in invoiceInfoData">
          <br />
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="font-bold"
                  >开票信息&nbsp;&nbsp;<el-tag
                    size="large"
                    color="#626aef"
                    effect="dark"
                    >{{ item.company }}</el-tag
                  >
                </span>
                <template v-if="item.state === 1">
                  &nbsp;&nbsp;<el-tag size="large" type="danger">作废</el-tag>
                </template>
                <template v-else-if="item.state === 2">
                  &nbsp;&nbsp;<el-tag type="success" size="large">正常</el-tag>
                </template>
                <template v-else>
                  &nbsp;&nbsp;<el-tag size="large" type="info">异常</el-tag>
                </template>
              </div>
            </template>
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
          </el-card>
        </template>
      </el-tab-pane>

      <el-tab-pane>
        <template #label>
          <span class="header-font">联系人信息</span>
        </template>
        <template v-for="item in customerContactInfoData">
          <br />
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="font-bold"
                  >联系人信息&nbsp;&nbsp;<el-tag
                    size="large"
                    type="warning"
                    effect="dark"
                    >{{ item.ccName }}</el-tag
                  ></span
                >
                <template v-if="item.state === 1">
                  &nbsp;&nbsp;<el-tag size="large" type="danger">离职</el-tag>
                </template>
                <template v-else-if="item.state === 2">
                  &nbsp;&nbsp;<el-tag type="success" size="large">正常</el-tag>
                </template>
                <template v-else>
                  &nbsp;&nbsp;<el-tag size="large" type="info">异常</el-tag>
                </template>
              </div>
            </template>
            <el-descriptions border :column="3">
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">姓名</div>
                </template>
                {{ item.ccName }}
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
                  <div class="cell-item">创建时间</div>
                </template>
                {{ item.createTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
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
          </el-card>
        </template>
      </el-tab-pane>
    </el-tabs>
    <br/>
    <el-row justify="center">
      <el-col :span="4">
        <el-button type="primary" :icon="Edit" @click="editCustomer">编辑</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.header-font {
  font-weight: bold;
}
</style>
