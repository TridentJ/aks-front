<script setup lang="ts">
//import axios from "axios";
import { onBeforeMount, onMounted, ref } from "vue";
import { http } from "@/utils/http";
import { AjaxResponse } from "@/api/AjaxResponse";
import { ElMessage } from "element-plus";
import { PurchaseInfo } from "@/interface/PurchaseInterface";
import { PurchaseCargo, PurchaseCargoFull } from "@/interface/PurchaseCargoInterface";
import { Edit } from "@element-plus/icons-vue";
import { useDetail } from "./PurchaseRouter";

defineOptions({
  name: "PurchaseRender"
});

//获取传递的参数
const { initToDetail, getParameter, toDetail } = useDetail();
initToDetail("render", "purchase");
//const route = useRoute();
const purchaseId = getParameter.id;
//console.log("render purchaseId:", purchaseId);

//console.log("route:" + route.query.id);
//渲染前触发
onBeforeMount(() => {
  getPurchase();
});

const purchaseCargoData = ref<PurchaseCargoFull[]>([]);
//const purchaseInfoData = ref<PurchaseInfo>();
const purchaseInfoData = ref<PurchaseInfo>({
  id: 0,
  purchaseName: null,
  supplierId: 0,
  supplierName: null,
  purchaseSelfId: null,
  purchasePeerId: null,
  signTime: null,
  description: null,
  attachment: null,
  deliverAddress: null,
  contractDeliveryDate: null,
  expectDeliveryDate: null,
  realDeliveryDate: null,
  priceIncludingTax: 0,
  taxPoint: 0,
  priceExcludingTax: 0,
  cargoPriceIncludingTax: 0,
  cost: 0,
  payMethod: 0,
  payType: 0,
  deposit: 0,
  depositBackDate: null,
  depositFlag: 0,
  realDepositBackDate: null,
  invoiceId: 0,
  invoiceSum: 0,
  includeFreight: 0,
  invoiceType: 0,
  invoice: 0,
  invoiceDate: null,
  receiveInvoiceDate: null,
  contactsId: 0,
  contactsName: null,
  salesmanId: 0,
  salesmanName: null,
  expressCompany: null,
  expressId: null,
  operatorId: 0,
  operatorName: null,
  purchaseState: 0,
  state: 0,
  createTime: null,
  updateTime: null,
  comments: null
});

const getPurchase = () => {
  //获取基础信息
  if (purchaseId == undefined) {
    ElMessage.error("需提供供应商信息！");
  } else {
    http
      .request<AjaxResponse>("get", "/api/purchase/show?id=" + purchaseId)
      .then(function (response) {
        if (response.code != 0) {
          ElMessage.error(response.message);
        } else {
          console.log(response.data);
          purchaseInfoData.value = response.data;
          getPurchaseCargo();
        }
      });
  }
};

const getPurchaseCargo = () => {
  http
    .request<AjaxResponse>(
      "get",
      "/api/purchaseCargo/show?purchaseId=" + purchaseId
    )
    .then(function (response) {
      if (response.code == 1344) {
        ElMessage.info(response.message);
      } else if (response.code == 0) {
        console.log(response.data);
        purchaseCargoData.value = response.data;
      } else {
        ElMessage.error(response.message);
      }
    });
};

const gotoSupplier = () => {
  let supplierNameLittle = purchaseInfoData.value.supplierName;
  if (supplierNameLittle.length > 10) {
    supplierNameLittle = supplierNameLittle.substring(0, 10) + "...";
  }
  toDetail(
    { id: purchaseInfoData.value.supplierId, supplierName: supplierNameLittle, renderFlag: 1 },
    "render",
    "supplier"
  );
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-bold"
          >采购单信息&nbsp;&nbsp;<el-tag
            size="large"
            type="success"
            effect="dark"
            >{{ purchaseInfoData.purchaseName }}</el-tag
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
              <div class="cell-item">采购单名称</div>
            </template>
            {{ purchaseInfoData.purchaseName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">供应商名称</div>
            </template>
            <el-button type="primary" @click="gotoSupplier">{{ purchaseInfoData.supplierName }}</el-button>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">签署时间</div>
            </template>
            {{ purchaseInfoData.signTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">AKS方合同编号</div>
            </template>
            {{ purchaseInfoData.purchaseSelfId }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">供应商合同编号</div>
            </template>
            {{ purchaseInfoData.purchasePeerId }}
          </el-descriptions-item>
    <!--      <el-descriptions-item>
            <template #label>
              <div class="cell-item">概述</div>
            </template>
            {{ purchaseInfoData.description }}
          </el-descriptions-item>-->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">收货地址</div>
            </template>
            {{ purchaseInfoData.deliverAddress }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">约定交付时间</div>
            </template>
            {{ purchaseInfoData.contractDeliveryDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">AKS期望交付时间</div>
            </template>
            {{ purchaseInfoData.expectDeliveryDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">实际交付时间</div>
            </template>
            {{ purchaseInfoData.realDeliveryDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">含税总价</div>
            </template>
            {{ purchaseInfoData.priceIncludingTax }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">税点</div>
            </template>
            {{ purchaseInfoData.taxPoint }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">不含税总价</div>
            </template>
            {{ purchaseInfoData.priceExcludingTax }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">货物含税总价</div>
            </template>
            {{ purchaseInfoData.cargoPriceIncludingTax }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">其他费用</div>
            </template>
            {{ purchaseInfoData.cost }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">物流费用</div>
            </template>
            <template v-if="purchaseInfoData.includeFreight === 0"><el-tag class="ml-2" type="info">未设置</el-tag></template>
            <template v-else-if="purchaseInfoData.includeFreight === 1"><el-tag class="ml-2" type="success">包含在合同内</el-tag></template>
            <template v-else-if="purchaseInfoData.includeFreight === 2"><el-tag class="ml-2" type="danger">不包含在合同</el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">付款方式</div>
            </template>
            <template v-if="purchaseInfoData.payMethod === 0">未设置</template>
            <template v-else-if="purchaseInfoData.payMethod === 1">对公转账</template>
            <template v-else-if="purchaseInfoData.payMethod === 2">个人转账</template>
            <template v-else-if="purchaseInfoData.payMethod === 3">现金支付</template>
            <template v-else-if="purchaseInfoData.payMethod === 4">微信</template>
            <template v-else-if="purchaseInfoData.payMethod === 5">支付宝</template>
            <template v-else-if="purchaseInfoData.payMethod === 6">其他</template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">付款类型</div>
            </template>
            <template v-if="purchaseInfoData.payType === 0"><el-tag class="ml-2" type="info">未设置</el-tag></template>
            <template v-else-if="purchaseInfoData.payType === 1"><el-tag class="ml-2" type="danger">一次性付款</el-tag></template>
            <template v-else-if="purchaseInfoData.payType === 2"><el-tag class="ml-2" type="success">分阶段付款</el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">保证金</div>
            </template>
            <template v-if="purchaseInfoData.deposit === 0">无保证金</template>
            <template v-else>{{ purchaseInfoData.deposit }}}</template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">保证金返还时间</div>
            </template>
            {{ purchaseInfoData.depositBackDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">保证金状态</div>
            </template>
            <template v-if="purchaseInfoData.depositFlag === 0"><el-tag class="ml-2" type="info">未设置</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 1"><el-tag class="ml-2" type="danger">冻结</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 2"><el-tag class="ml-2" color="#CCCCFF">不可申请</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 3"><el-tag class="ml-2" color="#FFD700">未申请</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 4"><el-tag class="ml-2" color="#00BFFF">已申请</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 5"><el-tag class="ml-2" color="#CCCCFF">延期（未申请）</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 6"><el-tag class="ml-2" color="#33CCFF">延期（已申请）</el-tag></template>
            <template v-else-if="purchaseInfoData.depositFlag === 7"><el-tag class="ml-2" type="success">已到账</el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">保证金实际返还时间</div>
            </template>
            {{ purchaseInfoData.realDepositBackDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">开票金额</div>
            </template>
            {{ purchaseInfoData.invoiceSum }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">发票类型</div>
            </template>
            <template v-if="purchaseInfoData.invoiceType === 0"><el-tag class="ml-2" type="info">未设置</el-tag></template>
            <template v-else-if="purchaseInfoData.invoiceType === 1"><el-tag class="ml-2" color="#00FFCC">普票</el-tag></template>
            <template v-else-if="purchaseInfoData.invoiceType === 2"><el-tag class="ml-2" type="success">专票</el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">发票状态</div>
            </template>
            <template v-if="purchaseInfoData.invoice === 0"><el-tag class="ml-2" type="info">未设置</el-tag></template>
            <template v-else-if="purchaseInfoData.invoice === 1"><el-tag class="ml-2" type="danger">不开票</el-tag></template>
            <template v-else-if="purchaseInfoData.invoice === 2"><el-tag class="ml-2" type="warning">未开票</el-tag></template>
            <template v-else-if="purchaseInfoData.invoice === 3"><el-tag class="ml-2" type="success">已收到</el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">开票时间</div>
            </template>
            {{ purchaseInfoData.invoiceDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">收到发票时间</div>
            </template>
            {{ purchaseInfoData.receiveInvoiceDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">供应商联系人</div>
            </template>
            {{ purchaseInfoData.contactsName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">采购员</div>
            </template>
            {{ purchaseInfoData.salesmanName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">快递公司</div>
            </template>
            {{ purchaseInfoData.expressCompany }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">快递单号</div>
            </template>
            {{ purchaseInfoData.expressId }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">订单状态</div>
            </template>
            <template v-if="purchaseInfoData.purchaseState === 0"><el-tag class="ml-2" type="info"> 合同取消 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 1"><el-tag class="ml-2" type="danger"> 合同签订</el-tag> </template>
            <template v-else-if="purchaseInfoData.purchaseState === 3"><el-tag class="ml-2" color="#CCFF00"> 待发货 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 5"><el-tag class="ml-2" color="#0066CC"> 已发货 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 7"><el-tag class="ml-2" color="#00FFCC"> 已收货 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 9"><el-tag class="ml-2" color="#CC0099"> 阶段付款 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 11"><el-tag class="ml-2" color="#99FF66"> 货款结清 </el-tag></template>
            <template v-else-if="purchaseInfoData.purchaseState === 13"><el-tag class="ml-2" type="success"> 合同完成 </el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">状态</div>
            </template>
            <template v-if="purchaseInfoData.state === 1"><el-tag class="ml-2" type="info"> 冻结 </el-tag></template>
            <template v-else-if="purchaseInfoData.state === 2"><el-tag class="ml-2" color="#CCFF33"> 正常</el-tag> </template>
            <template v-else-if="purchaseInfoData.state === 3"><el-tag class="ml-2" type="success"> 归档 </el-tag></template>
            <template v-else-if="purchaseInfoData.state === 0"><el-tag class="ml-2" type="danger"> 删除 </el-tag></template>
            <template v-else><el-tag class="ml-2" color="#FFFF00">数据错误</el-tag></template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">创建时间</div>
            </template>
            {{ purchaseInfoData.createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">更新时间</div>
            </template>
            {{ purchaseInfoData.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template #label>
              <div class="cell-item">备注</div>
            </template>
            {{ purchaseInfoData.comments }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="header-font">货物信息</span>
        </template>
        <template v-for="item in purchaseCargoData">
          <br/>
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="font-bold"
                ><el-tag
                  size="large"
                  color="#626aef"
                  effect="dark"
                >{{ item.cargoName }}</el-tag
                >
                </span>
                <template v-if="item.state === 1">
                  &nbsp;&nbsp;<el-tag size="large" type="danger">冻结</el-tag>
                </template>
                <template v-else-if="item.state === 2">
                  &nbsp;&nbsp;<el-tag type="success" size="large">正常</el-tag>
                </template>
                <template v-else-if="item.state === 3">
                  &nbsp;&nbsp;<el-tag type="info" size="large">归档</el-tag>
                </template>
                <template v-else>
                  &nbsp;&nbsp;<el-tag size="large" type="info">异常</el-tag>
                </template>
              </div>
            </template>
            <el-descriptions border :column="3">
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">货物名称</div>
                </template>
                {{ item.cargoName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">品牌</div>
                </template>
                {{ item.brand }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">型号</div>
                </template>
                {{ item.cargoType }}
              </el-descriptions-item>
              <el-descriptions-item :span="3">
                <template #label>
                  <div class="cell-item">描述</div>
                </template>
                {{ item.cargoType }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">数量</div>
                </template>
                {{ item.num }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">已用数量</div>
                </template>
                {{ item.usedNum }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">可用数量</div>
                </template>
                {{ item.availableNum }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">单价</div>
                </template>
                {{ item.price }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">总价</div>
                </template>
                {{ item.totalPrice }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">价差</div>
                </template>
                {{ item.balanceCost }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">物流公司</div>
                </template>
                {{ item.expressCompany }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">物流单号</div>
                </template>
                {{ item.expressId }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">收货地址</div>
                </template>
                {{ item.deliverAddress }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">状态</div>
                </template>
                <template v-if="item.state === 1"><el-tag class="ml-2" type="info"> 冻结 </el-tag></template>
                <template v-else-if="item.state === 2"><el-tag class="ml-2" color="#CCFF33"> 正常</el-tag> </template>
                <template v-else-if="item.state === 3"><el-tag class="ml-2" type="success"> 归档 </el-tag></template>
                <template v-else-if="item.state === 0"><el-tag class="ml-2" type="danger"> 删除 </el-tag></template>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">创建时间</div>
                </template>
                {{ item.createTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">最后更新时间</div>
                </template>
                {{ item.updateTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="3">
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
        <el-button type="primary" :icon="Edit" @click="editPurchase">编辑</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.header-font {
  font-weight: bold;
}
</style>
