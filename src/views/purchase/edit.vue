<script setup lang="ts">
//import axios from "axios";
import { Delete } from "@element-plus/icons-vue";
import { onBeforeMount, onMounted, ref } from "vue";
import SaveFill from "@iconify-icons/ri/save-3-fill";
import EraseFill from "@iconify-icons/ri/delete-bin-5-fill";
import TruckFill from "@iconify-icons/ri/truck-fill";
import { http } from "@/utils/http";
import { AjaxResponse } from "@/api/AjaxResponse";
import { Action, ElMessage, ElMessageBox } from "element-plus";
import { PurchaseBaseInfo, PurchaseInfo } from "@/interface/PurchaseInterface";
import { PurchaseCargo, PurchaseCargoFull } from "@/interface/PurchaseCargoInterface";
import { useDetail } from "./purchaseRouter";
import { SupplierSelectList } from "@/interface/SupplierInterface";
import { CargoSelectList } from "@/interface/CargoInterface";
import { AjaxResponseList } from "@/api/AjaxResponseList";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { deleteTag } from "@/interface/AksTag";

defineOptions({
  name: "PurchaseEdit"
});

//获取传递的参数
const { initToDetail, getParameter, toDetail, router } = useDetail();
initToDetail("edit", "purchase");
const purchaseId = getParameter.id;

const purchaseInitInfo = () => {
  return {
    id: 0,
    purchaseName: null,
    supplierName: null,
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
    contactsName: null,
    salesmanId: null,
    salesmanName: null,
    expressCompany: null,
    expressId: null,
    operatorId: null,
    operatorName: null,
    purchaseState: 1,
    state: 2,
    createTime: null,
    updateTime: null,
    comments: null
  };
};
//let purchaseId = 0;
const supplierNameAddition = ref("");
const formPurchase = ref<PurchaseInfo>(purchaseInitInfo());

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

//cargo
//const cargoNameAddition = ref("");
const formPurchaseCargo = ref<PurchaseCargoFull[]>([]);
//const cargoInfo = ref<CargoSelectList[]>([]);
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
const cargoEditState = ref<boolean[]>([]);
let currentCargoIndex = 0;

//渲染完成后触发
onBeforeMount(() => {
  getPurchaseAndCargo();
  getSupplierList();
  getCargoList();
});

const getPurchaseAndCargo = () => {
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
          formPurchase.value = response.data;
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
      } else if (response.code != 0) {
        ElMessage.error(response.message);
      } else {
        formPurchaseCargo.value = response.data;
        for (let i = 0; i < formPurchaseCargo.value.length; i++) {
          cargoEditState.value.push(true);
        }
        //console.log(formPurchaseCargo.value);
      }
    });
};

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
  //supplierSelectButton.value = false;
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

const updatePurchase = () => {
  http
    .request<AjaxResponse>("post", "/api/purchase/update", {
      data: formPurchase.value
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        //formPurchase.value.id = Number(response.data);
        //purchaseId = Number(response.data);
        ElMessage.success("添加采购订单基础信息成功！");
        successUpdatePurchase();
      } else {
        ElMessage.error(response.message);
        failureUpdatePurchase();
      }
    });
};
const failureUpdatePurchase = () => {
  ElMessageBox.alert("更新采购订单基础信息失败！", "警告", {
    confirmButtonText: "继续更新"
    /*callback: (action: Action) => {}*/
  });
};

const successUpdatePurchase = () => {
  ElMessageBox.confirm("更新采购订单成功", "成功", {
    confirmButtonText: "查看详情",
    cancelButtonText: "关闭当前页",
    type: "success"
  })
    .then(() => {
      //删除标签
      //useMultiTagsStoreHook().handleTags("splice", "/purchase/edit");
      deleteTag("/purchase/edit", getParameter);
      //跳转到详情页
      redirectDetailPage();
    })
    .catch((action: Action) => {
      //保持不动，并清空内容
      //resetPurchase();
      deleteTag("/supplier/edit", getParameter);
      //切换到最后一个标签
      const newRoute = useMultiTagsStoreHook().handleTags("slice");
      if (newRoute[0]?.query) {
        router.push({ name: newRoute[0].name, query: newRoute[0].query });
      } else if (newRoute[0]?.params) {
        router.push({ name: newRoute[0].name, params: newRoute[0].params });
      } else {
        router.push({ path: newRoute[0].path });
      }
    });
};

const resetPurchase = () => {
  Object.assign(formPurchase.value, purchaseInitInfo());
  Object.assign(formPurchaseCargo.value, purchaseCargoInit());
  //清空数组
  cargoSelectButton.value.splice(0);
  //cargoInfo.value.splice(0);
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

const addCargo = (index: number) => {
  formPurchaseCargo.value[index].purchaseId = Number(purchaseId);
  const requestBody = JSON.stringify(formPurchaseCargo.value[index]);
  http
    .request<AjaxResponse>("post", "/api/purchaseCargo/addOne", {
      data: requestBody
    })
    .then(function (response) {
      if (response.code == 0) {
        //成功
        ElMessage.success("添加采购货物信息成功！");
        cargoEditState.value[index] = true;
        formPurchaseCargo.value[index].id = Number(response.data);
      } else {
        ElMessage.error(response.message);
      }
    });
};

const updateCargo = (index: number) => {
  if (
    formPurchaseCargo.value[index].id == 0 ||
    formPurchaseCargo.value[index].cargoId == 0 ||
    formPurchaseCargo.value[index].purchaseId == 0
  ) {
    ElMessage.error("待更新采购单货物信息错误！");
  } else {
    const requestBody = JSON.stringify(formPurchaseCargo.value[index]);
    http
      .request<AjaxResponse>("post", "/api/purchaseCargo/update", {
        data: requestBody
      })
      .then(function (response) {
        if (response.code == 0) {
          //成功
          ElMessage.success("更新采购货物信息成功！");
          cargoEditState.value[index] = true;
        } else {
          ElMessage.error(response.message);
        }
      });
  }
};

const purchaseCargoInit = () => {
  return {
    id: 0,
    purchaseId: 0,
    cargoId: 0,
    cargoName: null,
    cargoType: null,
    description: null,
    brand: null,
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
  cargoEditState.value.push(false);
  /*
  cargoInfo.value.push({
    id: 0,
    cargoName: null,
    cargoType: null,
    description: null,
    brand: null
  });
  */
};

const deleteCargoForm = (index: number) => {
  //const index = form_customer_contact.indexOf(item);
  if (index >= 0) {
    const id = String(formPurchaseCargo.value[index].id);
    http
      .request<AjaxResponseList>("get", "/api/purchaseCargo/delete?id=" + id)
      .then(function (response) {
        if (response.code == 0) {
          formPurchaseCargo.value.splice(index, 1);
          cargoSelectButton.value.splice(index, 1);
          //cargoInfo.value.splice(index, 1);
          cargoEditState.value.splice(index, 1);
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error(response.message);
        }
      });
  } else {
    ElMessage.error("需删除的目标不合法！");
  }
};

const changeCargoEditState = (index: number) => {
  cargoEditState.value[index] = false;
};

const addOrUpdateCargoInfo = (index: number) => {
  console.log(formPurchaseCargo);
  if (formPurchaseCargo.value[index].id == 0) {
    addCargo(index);
  } else {
    updateCargo(index);
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
    cargo.brand.toLowerCase().includes(cargoSearchInfo.value.toLowerCase())
  ) {
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
  formPurchaseCargo.value[currentCargoIndex].cargoName = cargoName;
  formPurchaseCargo.value[currentCargoIndex].cargoType = cargoType;
  formPurchaseCargo.value[currentCargoIndex].brand = brand;
  formPurchaseCargo.value[currentCargoIndex].description = description;
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
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-bold"
          >采购单信息&nbsp;&nbsp;<el-tag
            size="large"
            type="success"
            effect="dark"
            >{{ formPurchase.purchaseName }}</el-tag
          ></span
        >
      </div>
    </template>
    <el-tabs type="border-card">
      <el-tab-pane label="基础信息">
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
                  formPurchase.supplierName
                }}</el-tag>
                <el-button
                  size="small"
                  type="primary"
                  @click="supplierDialogShow"
                >
                  修改供应商
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
        <el-row justify="center">
          <el-col :span="4">
            <el-button type="primary" @click="updatePurchase()">
              <IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;更新
            </el-button>
            <el-button type="warning" @click="resetPurchase()">
              <IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;重置
            </el-button>
            <!--        <el-button type="warning" @click="test()">
                      <IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;test
                    </el-button>-->
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="货物信息">
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
                      {{ purchaseCargo.cargoName }}
                    </el-tag>
                  </span>
                  <div>
                    <template v-if="cargoEditState[index] === true">
                      <el-button
                        type="primary"
                        @click="changeCargoEditState(index)"
                      >编辑</el-button>
                    </template>
                    <template v-else>
                      <el-button
                        type="success"
                        @click="addOrUpdateCargoInfo(index)"
                      >保存</el-button>
                    </template>
                    <el-popconfirm
                      title="确认删除？"
                      confirm-button-text="删除"
                      confirm-button-type="danger"
                      cancel-button-type="primary"
                      cancel-button-text="取消"
                      @confirm="deleteCargoForm(index)"
                    >
                      <template #reference>
                        <el-button type="danger" title="删除">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </template>
              <el-form label-width="100px" :disabled="cargoEditState[index]">
                <el-input type="hidden" v-model="purchaseCargo.purchaseId" />
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="货物信息">
                      <el-popover
                        width="300"
                        placement="top-start"
                        trigger="hover"
                        :title="purchaseCargo.cargoName"
                      >
                        <template #default>
                          品牌：{{ purchaseCargo.brand }}<br />
                          型号：{{ purchaseCargo.cargoType }}<br />
                          描述：{{ purchaseCargo.description }}
                        </template>
                        <template #reference>
                          <el-button class="m-2">{{
                            purchaseCargo.cargoName
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
                          type="danger"
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
      </el-tab-pane>
    </el-tabs>
    <br />
<!--
    <el-row justify="center">
      <el-col :span="4">
        <el-button type="primary" @click="updatePurchase()">
          <IconifyIconOffline :icon="SaveFill" />&nbsp;&nbsp;更新
        </el-button>
        <el-button type="warning" @click="resetPurchase()">
          <IconifyIconOffline :icon="EraseFill" />&nbsp;&nbsp;重置
        </el-button>
      </el-col>
    </el-row>
    -->
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
