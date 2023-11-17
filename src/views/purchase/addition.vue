<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Action, FormInstance, FormRules } from "element-plus";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import TruckFill from "@iconify-icons/ri/truck-fill";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";
import { PurchaseInfo, PurchaseBaseInfo } from "@/interface/PurchaseInterface";
import { SupplierSelectList } from "@/interface/SupplierInterface";
import { CargoSelectList } from "@/interface/CargoInterface";
import { AjaxResponse } from "@/api/AjaxResponse";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useDetail } from "@/views/purchase/purchaseRouter";
import { AjaxResponseList } from "@/api/AjaxResponseList";
import { PurchaseCargo } from "@/interface/PurchaseCargoInterface";

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

let purchaseId = 0;

const stepActive = ref(0);
const baseCard = ref(true);
const cargoCard = ref(false);

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

//cargo
//const cargoNameAddition = ref("");
const formPurchaseCargo = ref<PurchaseCargo[]>([]);
const cargoInfo = ref<CargoSelectList[]>([]);
//货物选择框
const cargoTotalNum = ref<Number>(10);
const cargoCurrentPage = ref<Number>(1);
const cargoCurrentPageSize = ref<Number>(10);
const cargoItemKey = ref<number>(0);
let cargoTotalNumInit = 0;
const cargoTableDataShow = ref<CargoSelectList[]>();
const cargoDialogVisible = ref<boolean>(false);
let cargoTableData: CargoSelectList[];
let cargoTableSearchData: CargoSelectList[];
const cargoSearchInfo = ref("");
const cargoSelectButton = ref<boolean[]>([]);
let currentCargoIndex = 0;

//渲染完成后触发
onMounted(() => {
  getSupplierList();
});

const supplierCallBack = supplier => {
  if (
    supplier.supplierName != undefined &&
    supplier.supplierName != "" &&
    supplier.supplierName
      .toLowerCase()
      .includes(supplierSearchInfo.value.toLowerCase())
  ) {
    return true;
  }
  if (
    supplier.supplierNumber != undefined &&
    supplier.supplierNumber != "" &&
    supplier.supplierNumber
      .toLowerCase()
      .includes(supplierSearchInfo.value.toLowerCase())
  ) {
    return true;
  }
};
const supplierSearch = () => {
  if (supplierSearchInfo.value === "") {
    supplierTableSearchData = supplierTableData;
    supplierTotalNum.value = supplierTotalNumInit;
  } else {
    /*
    supplierTableSearchData = supplierTableData.filter(element =>
      element.supplierName
        .toLowerCase()
        .includes(supplierSearchInfo.value.toLowerCase())
    );
    */
    supplierTableSearchData = supplierTableData.filter(supplierCallBack);
    //console.log(supplierTableSearchData);
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
  if (
    supplierCurrentPage.value.valueOf() *
      supplierCurrentPageSize.value.valueOf() >
    supplierTotalNum.value.valueOf() + supplierCurrentPageSize.value.valueOf()
  ) {
    supplierCurrentPage.value =
      supplierTotalNum.value.valueOf() /
      supplierCurrentPageSize.value.valueOf();
  }
  if (
    supplierCurrentPage.value.valueOf() *
      supplierCurrentPageSize.value.valueOf() >
    supplierTotalNum.value.valueOf()
  ) {
    endNum = supplierTotalNum.value.valueOf();
  } else {
    endNum =
      supplierCurrentPage.value.valueOf() *
      supplierCurrentPageSize.value.valueOf();
  }
  supplierTableDataShow.value = supplierTableSearchData.slice(
    (supplierCurrentPage.value.valueOf() - 1) *
      supplierCurrentPageSize.value.valueOf(),
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
/*

const test = () => {
  stepActive.value = 1;
  baseCard.value = false;
  cargoCard.value = true;
  purchaseId = 0;
  getCargoList();
};
*/

const addPurchase = () => {
  http
    .request<AjaxResponse>("post", "/api/purchase/add", {
      data: formPurchase.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        formPurchase.value.id = Number(response.data);
        purchaseId = Number(response.data);
        ElMessage.success("添加采购订单基础信息成功！");
        stepActive.value = 1;
        baseCard.value = false;
        cargoCard.value = true;
        //successAddPurchase();
        getCargoList();
      } else {
        ElMessage.error(response.message);
        failureAddPurchase();
      }
    });
};
const failureAddPurchase = () => {
  ElMessageBox.alert("添加采购订单基础信息失败！", "警告", {
    confirmButtonText: "重新添加"
    /*callback: (action: Action) => {}*/
  });
};

const failureAddPurchaseCargo = message => {
  ElMessageBox.alert("添加采购订单基础信息成功！但" + message, "警告", {
    confirmButtonText: "前往补填",
    type: "warning",
    dangerouslyUseHTMLString: true,
    callback: (action: Action) => {
      if (action === "confirm") {
        //删除编辑标签
        useMultiTagsStoreHook().handleTags("splice", "/purchase/addition");
        redirectEditPage();
      } else {
        ElMessage.error("请知晓：采购货物添加存在失败！！！" + message);
      }
    }
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
  Object.assign(formPurchaseCargo.value, purchaseCargoInit());
  stepActive.value = 0;
  baseCard.value = true;
  cargoCard.value = false;
  //清空数组
  cargoSelectButton.value.splice(0);
  cargoInfo.value.splice(0);
  getSupplierList();
};

const redirectEditPage = () => {
  let purchaseNameLittle = formPurchase.value.purchaseName;
  if (purchaseNameLittle.length > 10) {
    purchaseNameLittle = purchaseNameLittle.substring(0, 10) + "...";
  }
  toDetail(
    { id: formPurchase.value.id, purchaseName: purchaseNameLittle },
    "edit",
    "purchase"
  );
};

const redirectDetailPage = () => {
  let purchaseNameLittle = formPurchase.value.purchaseName;
  if (purchaseNameLittle.length > 10) {
    purchaseNameLittle = purchaseNameLittle.substring(0, 10) + "...";
  }
  toDetail(
    {
      id: formPurchase.value.id,
      purchaseName: purchaseNameLittle,
      renderFlag: 1
    },
    "render",
    "purchase"
  );
};

const noPurchaseCargoAlert = () => {
  ElMessageBox.confirm("未添加采购单货物信息！", "确认信息", {
    confirmButtonText: "确认提交",
    cancelButtonText: "返回添加",
    type: "warning"
  })
    .then(() => {
      successAddPurchase();
    })
    .catch((action: Action) => {
      //保持不动
    });
};

const addCargo = () => {
  if (formPurchaseCargo.value.length == 0) {
    //successAddPurchase();
    noPurchaseCargoAlert();
  } else {
    for (const index in formPurchaseCargo.value) {
      formPurchaseCargo.value[index].purchaseId = purchaseId;
    }
    http
      .request<AjaxResponse>("post", "/api/purchaseCargo/add", {
        data: formPurchaseCargo.value
      })
      .then(function (response) {
        if (response.code == 0) {
          //成功
          ElMessage.success("添加采购订单信息成功！");
          stepActive.value = 2;
          successAddPurchase();
        } else {
          ElMessage.error(response.message);
          failureAddPurchaseCargo(response.message);
        }
      });
  }
};

const purchaseCargoInit = () => {
  return {
    id: 0,
    purchaseId: 0,
    cargoId: 0,
    num: null,
    usedNum: null,
    availableNum: null,
    price: null,
    totalPrice: null,
    balanceCost: null,
    balanceCostSaleCargoId: null,
    expressCompany: "",
    expressId: "",
    deliverAddress: "",
    createTime: "",
    updateTime: "",
    comments: "",
    state: 2
  };
};

const addPurchaseCargoForm = () => {
  formPurchaseCargo.value.push(purchaseCargoInit());
  cargoSelectButton.value.push(true);
  cargoInfo.value.push({
    id: 0,
    cargoName: null,
    cargoType: null,
    description: null,
    brand: null
  });
};

const deleteCargoForm = (index: number) => {
  //const index = form_customer_contact.indexOf(item);
  if (index >= 0) {
    formPurchaseCargo.value.splice(index, 1);
    cargoSelectButton.value.splice(index, 1);
    cargoInfo.value.splice(index, 1);
  } else {
    ElMessage.error("删除失败！");
  }
};

const cargoCallBack = cargo => {
  if (
    cargo.cargoName != undefined &&
    cargo.cargoName != "" &&
    cargo.cargoName.toLowerCase().includes(cargoSearchInfo.value.toLowerCase())
  ) {
    return true;
  }
  if (
    cargo.cargoType != undefined &&
    cargo.cargoType != "" &&
    cargo.cargoType.toLowerCase().includes(cargoSearchInfo.value.toLowerCase())
  ) {
    return true;
  }
  if (
    cargo.brand != undefined &&
    cargo.brand != "" &&
    cargo.brand.toLowerCase().includes(cargoSearchInfo.value.toLowerCase())) {
    return true;
  }
  if (
    cargo.description != undefined &&
    cargo.description != "" &&
    cargo.description
      .toLowerCase()
      .includes(cargoSearchInfo.value.toLowerCase())
  ) {
    return true;
  }
};

const cargoSearch = () => {
  if (cargoSearchInfo.value === "") {
    cargoTableSearchData = cargoTableData;
    cargoTotalNum.value = cargoTotalNumInit;
  } else {
    cargoTableSearchData = cargoTableData.filter(cargoCallBack);
    //console.log(cargoTableSearchData);
    cargoTotalNum.value = cargoTableSearchData.length;
  }
  cargoCurrentPage.value = 1;
  cargoPagChange();
};

const getSelectedCargo = (
  cargoId: string,
  cargoName: string,
  cargoType: string,
  brand: string,
  description: string
) => {
  //cargoNameAddition.value = cargoName;
  //formPurchase.value.cargoId = Number(cargoId);
  cargoInfo.value[currentCargoIndex].cargoName = cargoName;
  cargoInfo.value[currentCargoIndex].id = Number(cargoId);
  cargoInfo.value[currentCargoIndex].cargoType = cargoType;
  cargoInfo.value[currentCargoIndex].brand = brand;
  cargoInfo.value[currentCargoIndex].description = description;
  formPurchaseCargo.value[currentCargoIndex].cargoId = Number(cargoId);
  cargoSelectButton.value[currentCargoIndex] = false;
  cargoDialogVisible.value = false;
};

const cargoDialogShow = index => {
  currentCargoIndex = index;
  //console.log("currentCargoIndex:" + currentCargoIndex.valueOf());
  cargoTableSearchData = cargoTableData;
  cargoTotalNum.value = cargoTotalNumInit;
  cargoDialogVisible.value = true;
  cargoPagChange();
};

const cargoPagChange = () => {
  let endNum = 0;
  if (
    cargoCurrentPage.value.valueOf() * cargoCurrentPageSize.value.valueOf() >
    cargoTotalNum.value.valueOf() + cargoCurrentPageSize.value.valueOf()
  ) {
    cargoCurrentPage.value =
      cargoTotalNum.value.valueOf() / cargoCurrentPageSize.value.valueOf();
  }
  if (
    cargoCurrentPage.value.valueOf() * cargoCurrentPageSize.value.valueOf() >
    cargoTotalNum.value.valueOf()
  ) {
    endNum = cargoTotalNum.value.valueOf();
  } else {
    endNum =
      cargoCurrentPage.value.valueOf() * cargoCurrentPageSize.value.valueOf();
  }
  cargoTableDataShow.value = cargoTableSearchData.slice(
    (cargoCurrentPage.value.valueOf() - 1) *
      cargoCurrentPageSize.value.valueOf(),
    endNum
  );
};

const getCargoList = () => {
  http
    .request<AjaxResponseList>("get", "/api/cargo/selectList")
    .then(function (response) {
      if (response.code == 0) {
        cargoTableData = response.data;
        cargoTotalNum.value = response.total;
        cargoTotalNumInit = response.total;
        cargoCurrentPage.value = response.pageNum;
        //cargoCurrentPageSize.value = response.pageSize;
        cargoItemKey.value++;
      } else {
        ElMessage.error(response.message);
      }
    });
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
    value: 3,
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
  <div>
    <el-card>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-steps :active="stepActive" finish-status="success" align-center>
            <el-step title="基础信息" description="添加采购单基础信息" />
            <el-step title="货物信息" description="添加采购单货物信息" />
          </el-steps>
        </el-col>
      </el-row>
    </el-card>
    <br />
    <el-card v-if="baseCard">
      <template #header>
        <span class="font-bold">添加采购单基础信息</span>
      </template>

      <el-dialog v-model="supplierDialogVisible" title="选择供应商">
        <el-row>
          <el-col :span="8">
            <el-input
              v-model="supplierSearchInfo"
              placeholder="搜索供应商名称或编号"
              @input="supplierSearch"
            />
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

      <el-form :model="formPurchase" label-width="130px" ref="baseFormRef">
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
              <el-tag class="ml-2" type="success">{{
                supplierNameAddition
              }}</el-tag>
              <template v-if="supplierSelectButton">
                <el-button
                  size="small"
                  type="primary"
                  @click="supplierDialogShow"
                >
                  选择供应商
                </el-button>
              </template>
              <template v-else>
                <el-button
                  size="small"
                  type="success"
                  @click="supplierDialogShow"
                >
                  修改供应商
                </el-button>
              </template>
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
              <el-input v-model="formPurchase.cost" placeholder="其他费用" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税点">
              <el-input v-model="formPurchase.taxPoint" placeholder="税点" />
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
              <el-input v-model="formPurchase.deposit" placeholder="保证金" />
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
        <el-col :span="4">
          <el-button type="primary" @click="addPurchase()">
            <IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;提交
          </el-button>
          <el-button type="warning" @click="resetPurchase()">
            <IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="cargoCard">
      <template #header>
        <span class="font-bold">添加采购单货物信息</span>
      </template>

      <el-dialog v-model="cargoDialogVisible" title="选择货物">
        <el-row>
          <el-col :span="8">
            <el-input
              v-model="cargoSearchInfo"
              placeholder="请输入搜索内容"
              @input="cargoSearch"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="cargoTableDataShow"
              :key="cargoItemKey"
              style="width: 100%"
            >
              <el-table-column v-if="false" prop="id" />
              <el-table-column label="品牌" prop="brand" />
              <el-table-column label="货物名称" prop="cargoName" />
              <el-table-column label="型号" prop="cargoType" />
              <el-table-column label="描述" prop="description" />
              <el-table-column lable="操作">
                <template v-slot="columnData">
                  <el-button
                    type="success"
                    size="small"
                    @click="
                      getSelectedCargo(
                        columnData.row.id,
                        columnData.row.cargoName,
                        columnData.row.cargoType,
                        columnData.row.brand,
                        columnData.row.description
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
              :total="cargoTotalNum"
              v-model:current-page="cargoCurrentPage"
              :page-size="cargoCurrentPageSize"
              @current-change="cargoPagChange"
            />
          </el-col>
        </el-row>
      </el-dialog>

      <div>
        <el-button
          type="primary"
          name="add-invoice-button"
          @click="addPurchaseCargoForm"
        >
          <IconifyIconOffline :icon="TruckFill" />&nbsp;&nbsp;添加货物
        </el-button>
        <br />
        <template v-for="(purchaseCargo, index) in formPurchaseCargo">
          <br />
          <el-card>
            <template #header>
              <div class="card-header">
                <span class="font-bold">
                  <el-tag size="large" type="warning" effect="dark">
                    {{ cargoInfo[index].cargoName }}
                  </el-tag>
                </span>
                <div>
                  <!-- <el-button type="primary" @click="addInvoice">添加</el-button> -->
                  <el-button type="danger" @click="deleteCargoForm(index)">
                    删除
                  </el-button>
                </div>
              </div>
            </template>
            <el-form label-width="100px">
              <el-input type="hidden" v-model="purchaseCargo.purchaseId" />
              <el-row>
                <el-col :span="8">
                  <el-form-item label="货物信息">
                    <el-popover
                      width="300"
                      placement="top-start"
                      trigger="hover"
                      :title="cargoInfo[index].cargoName"
                    >
                      <template #default>
                        品牌：{{ cargoInfo[index].brand }}<br />
                        型号：{{ cargoInfo[index].cargoType }}<br />
                        描述：{{ cargoInfo[index].description }}
                      </template>
                      <template #reference>
                        <el-button class="m-2">{{
                          cargoInfo[index].cargoName
                        }}</el-button>
                      </template>
                    </el-popover>
                    <template v-if="cargoSelectButton[index]">
                      <el-button
                        size="small"
                        type="primary"
                        @click="cargoDialogShow(index)"
                      >
                        选择货物
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button
                        size="small"
                        type="success"
                        @click="cargoDialogShow(index)"
                      >
                        修改货物
                      </el-button>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="采购数量">
                    <el-input
                      v-model="purchaseCargo.num"
                      placeholder="采购数量"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单价">
                    <el-input
                      v-model="purchaseCargo.price"
                      placeholder="单价"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="总价">
                    <el-input
                      v-model="purchaseCargo.totalPrice"
                      placeholder="总价"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="收货地址">
                    <el-input
                      v-model="purchaseCargo.deliverAddress"
                      placeholder="收货地址"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物流公司">
                    <el-input
                      v-model="purchaseCargo.expressCompany"
                      placeholder="物流公司"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物流单号">
                    <el-input
                      v-model="purchaseCargo.expressId"
                      placeholder="物流单号"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      v-model="purchaseCargo.comments"
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
      <br />
      <el-row justify="center">
        <el-col :span="4">
          <el-button type="primary" @click="addCargo()">
            <IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;提交
          </el-button>
          <el-button type="warning" @click="resetCargo()">
            <IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
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
