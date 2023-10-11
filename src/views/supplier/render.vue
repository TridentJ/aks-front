<script setup lang="ts">
//import axios from "axios";
import { ref } from "vue";
import { http } from "@/utils/http";
import { AjaxResponse } from "@/api/AjaxResponse";
import { ElMessage } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import {
  SupplierBaseInfo,
  InvoiceInfo,
  SupplierContactInfo
} from "@/interface/SupplierInterface";
import { useDetail } from "./supplierRouter";

defineOptions({
  name: "SupplierRender"
});

//获取传递的参数
const { initToDetail, getParameter, toDetail } = useDetail();
initToDetail("render");
//const route = useRoute();
const supplierId = getParameter.id;
//console.log("render supplierId:", supplierId);
if (supplierId == undefined) {
  ElMessage.error("需提供供应商信息！");
}
//console.log("route:" + route.query.id);

const baseInfoData = ref<SupplierBaseInfo>({
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
});
const invoiceInfoData = ref<InvoiceInfo[]>([]);
const supplierContactInfoData = ref<SupplierContactInfo[]>([]);

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
        console.log(response.data);
        invoiceInfoData.value = response.data;
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
        console.log(response.message);
        supplierContactInfoData.value = response.data;
      }
    });
};

const editSupplier = () => {
  let supplierNameLittle = baseInfoData.value.supplierName;
  if (baseInfoData.value.supplierName.length > 10) {
    supplierNameLittle = baseInfoData.value.supplierName.substring(0, 10) + "...";
  }
  toDetail(
    {
      id: supplierId,
      supplierName: supplierNameLittle
    },
    "edit"
  );
};
//获取基础信息
http
  .request<AjaxResponse>("get", "/api/supplier/show?id=" + supplierId)
  .then(function (response) {
    if (response.code != 0) {
      ElMessage.error(response.message);
    } else {
      console.log(response.data);
      baseInfoData.value = response.data;
      //获取发票信息
      getInvoiceInfo();
      //获取联系人信息
      getSupplierContacts();
    }
  });

</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-bold"
          >供应商信息&nbsp;&nbsp;<el-tag
            size="large"
            color="#40E0D0"
            effect="dark"
            >{{ baseInfoData.supplierName }}</el-tag
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
              <div class="cell-item">供应商名称</div>
            </template>
            {{ baseInfoData.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">供应商编号</div>
            </template>
            {{ baseInfoData.supplierNumber }}
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
            {{ baseInfoData.companyAddress }}
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
            {{ baseInfoData.deliveryAddress }}
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
        <template v-for="item in supplierContactInfoData">
          <br />
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="font-bold"
                  >联系人信息&nbsp;&nbsp;<el-tag
                    size="large"
                    type="warning"
                    effect="dark"
                    >{{ item.scName }}</el-tag
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
        <el-button type="primary" :icon="Edit" @click="editSupplier">编辑</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.header-font {
  font-weight: bold;
}
</style>
