<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Action, FormInstance, FormRules } from "element-plus";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";
import { PurchaseInfo, PurchaseBaseInfo } from "@/interface/PurchaseInterface";
import { SupplierSelectList } from "@/interface/SupplierInterface";
import { AjaxResponse } from "@/api/AjaxResponse";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useDetail } from "@/views/purchase/PurchaseRouter";
import { AjaxResponseList } from "@/api/AjaxResponseList";

defineOptions({
  name: "PurchaseAddition"
});

const { toDetail } = useDetail();
const purchaseInitInfo = () => {
  return {
    id: 0,
    purchaseName: null,
    //supplierName: null,
    supplierId: 0,
    purchaseSelfId: null,
    purchasePeerId: null,
    signTime: null,
    description: null,
    attachment: null,
    deliverAddress: null,
    contractDeliveryDate: null,
    expectDeliveryDate: null,
    realDeliveryDate: null,
    priceIncludingTax: null,
    taxPoint: null,
    priceExcludingTax: null,
    cargoPriceIncludingTax: null,
    cost: null,
    includeFreight: 0,
    payMethod: 0,
    payType: 0,
    deposit: 0,
    depositBackDate: null,
    depositFlag: 0,
    realDepositBackDate: null,
    invoiceId: null,
    invoiceSum: null,
    invoiceType: 0,
    invoice: 0,
    invoiceDate: null,
    receiveInvoiceDate: null,
    contactsId: null,
    //contactsName: null,
    salesmanId: null,
    //salesmanName: null,
    expressCompany: null,
    expressId: null,
    operatorId: null,
    //operatorName: null,
    purchaseState: 1,
    state: 2,
    createTime: null,
    updateTime: null,
    comments: null
  };
};
//let purchaseId = 0;
const supplierNameAddition = ref("");
const formPurchase = ref<PurchaseBaseInfo>(purchaseInitInfo());

//供应商选择框
const supplierTotalNum = ref<Number>(10);
const supplierCurrentPage = ref<Number>(1);
const supplierCurrentPageSize = ref<Number>(10);
const supplierItemKey = ref<number>(0);
let supplierTotalNumInit = 0;
//const supplierId = ref();
//const supplierName = ref();
const supplierTableDataShow = ref<SupplierSelectList[]>();
const supplierDialogVisible = ref<boolean>(false);
let supplierTableData: SupplierSelectList[];
let supplierTableSearchData: SupplierSelectList[];
const supplierSearchInfo = ref("");
const supplierSelectButton = ref<boolean>(true);

//渲染完成后触发
onMounted(() => {
  getSupplierList();
});

const supplierSearch = () => {
  if( supplierSearchInfo.value === ""){
    supplierTableSearchData = supplierTableData;
    supplierTotalNum.value = supplierTotalNumInit;
  } else {
    supplierTableSearchData = supplierTableData.filter(element =>
      element.supplierName
        .toLowerCase()
        .includes(supplierSearchInfo.value.toLowerCase())
    );
    console.log(supplierTableSearchData);
    supplierTotalNum.value = supplierTableSearchData.length;
  }
  supplierCurrentPage.value = 1;
  pagChange();
};

const getSelectedSupplier = (supplierId: string, supplierName: string) => {
  supplierNameAddition.value = supplierName;
  formPurchase.value.supplierId = Number(supplierId);
  supplierSelectButton.value = false;
  supplierDialogVisible.value = false;
};

const supplierDialogShow = () => {
  supplierTableSearchData = supplierTableData;
  supplierTotalNum.value = supplierTotalNumInit;
  supplierDialogVisible.value = true;
  pagChange();
};
const pagChange = () => {
  let endNum = 0;
  if ((supplierCurrentPage.value.valueOf() * supplierCurrentPageSize.value.valueOf()) > (supplierTotalNum.value.valueOf() + supplierCurrentPageSize.value.valueOf())){
    supplierCurrentPage.value = supplierTotalNum.value.valueOf() / supplierCurrentPageSize.value.valueOf();
  }
  if ((supplierCurrentPage.value.valueOf() * supplierCurrentPageSize.value.valueOf()) > supplierTotalNum.value.valueOf()){
    endNum = supplierTotalNum.value.valueOf();
  } else {
    endNum = supplierCurrentPage.value.valueOf() * supplierCurrentPageSize.value.valueOf();
  }
  supplierTableDataShow.value = supplierTableSearchData.slice(
    (supplierCurrentPage.value.valueOf() - 1) * supplierCurrentPageSize.value.valueOf(),
    endNum
  );
};

const getSupplierList = () => {
  http
    .request<AjaxResponseList>("get", "/api/supplier/selectList")
    .then(function (response) {
      if (response.code == 0) {
        supplierTableData = response.data;
        supplierTotalNum.value = response.total;
        supplierTotalNumInit = response.total;
        supplierCurrentPage.value = response.pageNum;
        //supplierCurrentPageSize.value = response.pageSize;
        supplierItemKey.value++;
      } else {
        ElMessage.error(response.message);
      }
    });
};

const addPurchase = () => {
  http
    .request<AjaxResponse>("post", "/api/purchase/add", {
      data: formPurchase.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        formPurchase.value.id = Number(response.data);
        ElMessage.success("添加采购订单成功！");
        successAddPurchase();
      } else {
        ElMessage.error(response.message);
        failureAddPurchase();
      }
    });
};
const failureAddPurchase = () => {
  ElMessageBox.alert("添加采购订单失败！", "警告", {
    confirmButtonText: "重新添加"
    /*callback: (action: Action) => {}*/
  });
};

const successAddPurchase = () => {
  ElMessageBox.confirm("添加采购订单成功", "成功", {
    confirmButtonText: "查看详情",
    cancelButtonText: "继续添加",
    type: "success"
  })
    .then(() => {
      //删除编辑标签
      useMultiTagsStoreHook().handleTags("splice", "/purchase/addition");
      //跳转到详情页
      redirectDetailPage();
    })
    .catch((action: Action) => {
      //保持不动，并清空内容
      resetPurchase();
    });
};

const resetPurchase = () => {
  Object.assign(formPurchase.value, purchaseInitInfo());
};

const redirectDetailPage = () => {
  let purchaseNameLittle = formPurchase.value.purchaseName;
  if (purchaseNameLittle.length > 10) {
    purchaseNameLittle = purchaseNameLittle.substring(0, 10) + "...";
  }
  toDetail(
    { id: formPurchase.value.id, purchaseName: purchaseNameLittle, renderFlag: 1 },
    "render",
    "purchase"
  );
};

const freightSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "包含在合同中"
  },
  {
    value: 2,
    label: "不包含在合同中"
  }
];
const payMethodSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "对公转账"
  },
  {
    value: 2,
    label: "个人转账"
  },
  {
    value: 3,
    label: "现金支付"
  },
  {
    value: 4,
    label: "微信"
  },
  {
    value: 5,
    label: "支付宝"
  },
  {
    value: 6,
    label: "其他（备注）"
  }
];
const payTypeSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "一次性付款"
  },
  {
    value: 2,
    label: "分阶段付款"
  }
];
const depositFlagSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "冻结"
  },
  {
    value: 2,
    label: "不可申请"
  },
  {
    value: 3,
    label: "未申请"
  },
  {
    value: 4,
    label: "已申请"
  },
  {
    value: 5,
    label: "延期（未申请）"
  },
  {
    value: 6,
    label: "延期（已申请）"
  },
  {
    value: 7,
    label: "已到账"
  }
];
const invoiceTypeSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "普票"
  },
  {
    value: 2,
    label: "专票"
  }
];
const invoiceSelect = [
  {
    value: 0,
    label: "未设置"
  },
  {
    value: 1,
    label: "不开票"
  },
  {
    value: 2,
    label: "未开票"
  },
  {
    value: 2,
    label: "已收到"
  }
];
const purchaseStateSelect = [
  {
    value: 0,
    label: "合同取消"
  },
  {
    value: 1,
    label: "合同签订"
  },
  {
    value: 3,
    label: "代发货"
  },
  {
    value: 5,
    label: "已发货"
  },
  {
    value: 7,
    label: "已收货"
  },
  {
    value: 9,
    label: "阶段付款"
  },
  {
    value: 11,
    label: "货款结清"
  },
  {
    value: 13,
    label: "合同完成"
  }
];
const stateSelect = [
  {
    value: 1,
    label: "冻结"
  },
  {
    value: 2,
    label: "正常"
  },
  {
    value: 3,
    label: "归档"
  }
];
</script>

<template>
  <el-card>
    <template #header>
      <span class="font-bold">添加采购单</span>
    </template>

    <el-dialog v-model="supplierDialogVisible" title="选择供应商">
      <el-row>
        <el-col :span="8">
          <el-input v-model="supplierSearchInfo" placeholder="请输入搜索内容" @input="supplierSearch"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="supplierTableDataShow"
            :key="supplierItemKey"
            style="width: 100%"
          >
            <el-table-column v-if="false" prop="id" />
            <el-table-column label="供应商编号" prop="supplierNumber" />
            <el-table-column label="供应商名称" prop="supplierName" />
            <el-table-column lable="操作">
              <template v-slot="columnData">
                <el-button
                  type="success"
                  size="small"
                  @click="
                    getSelectedSupplier(
                      columnData.row.id,
                      columnData.row.supplierName
                    )
                  "
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="8" :span="8">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="supplierTotalNum"
            v-model:current-page="supplierCurrentPage"
            :page-size="supplierCurrentPageSize"
            @current-change="pagChange"
          />
        </el-col>
      </el-row>
    </el-dialog>

    <el-form
      :model="formPurchase"
      label-width="130px"
      ref="baseFormRef"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购单名称" prop="purchaseName">
            <el-input
              v-model="formPurchase.purchaseName"
              placeholder="供应商名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-tag class="ml-2" type="success">{{ supplierNameAddition }}</el-tag>
            <el-button size="small" type="primary" @click="supplierDialogShow">
              <template v-if="supplierSelectButton"> 选择供应商 </template>
              <template v-else> 修改供应商 </template>
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签署时间">
            <el-date-picker
              v-model="formPurchase.signTime"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-input v-model="formPurchase.id" type="hidden" />
      <el-input v-model="formPurchase.supplierId" type="hidden" />
      <el-row>
        <el-col :span="8">
          <el-form-item label="AKS采购单编号">
            <el-input
              v-model="formPurchase.purchaseSelfId"
              placeholder="AKS采购单编号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商采购单编号">
            <el-input
              v-model="formPurchase.purchasePeerId"
              placeholder="供应商采购单编号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收货地址">
            <el-input
              v-model="formPurchase.deliverAddress"
              placeholder="收货地址"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="约定交付时间">
            <el-date-picker
              v-model="formPurchase.contractDeliveryDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预期交货时间">
            <el-date-picker
              v-model="formPurchase.expectDeliveryDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="含税总价">
            <el-input
              v-model="formPurchase.priceIncludingTax"
              placeholder="含税总价"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="货物含税价">
            <el-input
              v-model="formPurchase.cargoPriceIncludingTax"
              placeholder="货物含税价"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="其他费用">
            <el-input
              v-model="formPurchase.cost"
              placeholder="其他费用"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税点">
            <el-input
              v-model="formPurchase.taxPoint"
              placeholder="税点"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="不含税价">
            <el-input
              v-model="formPurchase.priceExcludingTax"
              placeholder="不含税价"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流费用">
            <el-select
              v-model="formPurchase.includeFreight"
              placeholder="物流费用"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in freightSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款方式">
            <el-select
              v-model="formPurchase.payMethod"
              placeholder="付款方式"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in payMethodSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="付款类型">
            <el-select
              v-model="formPurchase.payType"
              placeholder="付款类型"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in payTypeSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保证金">
            <el-input
              v-model="formPurchase.deposit"
              placeholder="保证金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预期保证金时间">
            <el-date-picker
              v-model="formPurchase.depositBackDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="保证金状态">
            <el-select
              v-model="formPurchase.depositFlag"
              placeholder="保证金状态"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in depositFlagSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际保证金时间">
            <el-date-picker
              v-model="formPurchase.realDepositBackDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票信息">
            <el-input
              v-model="formPurchase.invoiceId"
              placeholder="开票信息"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="开票金额">
            <el-input
              v-model="formPurchase.invoiceSum"
              placeholder="开票金额"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票类型">
            <el-select
              v-model="formPurchase.invoiceType"
              placeholder="发票类型"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in invoiceTypeSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发票类型">
            <el-select
              v-model="formPurchase.invoice"
              placeholder="发票类型"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in invoiceSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开票时间">
            <el-date-picker
              v-model="formPurchase.invoiceDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收到发票时间">
            <el-date-picker
              v-model="formPurchase.receiveInvoiceDate"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商联系人">
            <el-input
              v-model="formPurchase.contactsId"
              placeholder="供应商联系人"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购员">
            <el-input
              v-model="formPurchase.salesmanId"
              placeholder="采购员"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流公司">
            <el-input
              v-model="formPurchase.expressCompany"
              placeholder="物流公司"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流单号">
            <el-input
              v-model="formPurchase.expressId"
              placeholder="物流公司"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购单状态">
            <el-select
              v-model="formPurchase.purchaseState"
              placeholder="采购单状态"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in purchaseStateSelect"
                :key="stateItem.value"
                :label="stateItem.label"
                :value="stateItem.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select
              v-model="formPurchase.state"
              placeholder="状态"
              style="width: 100%"
            >
              <el-option
                v-for="stateItem in stateSelect"
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
              v-model="formPurchase.comments"
              placeholder="备注（字数不超过200）"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <el-row justify="center">
      <el-col :span="8">
        <el-button type="primary" @click="addPurchase()"
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

</style>
