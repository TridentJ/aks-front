<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";

import { Delete, Edit, View, User, DataLine } from "@element-plus/icons-vue";
import { AjaxResponse } from "@/api/AjaxResponse";
import { AjaxResponseList} from "@/api/AjaxResponseList";
import { useDetail } from "./supplierRouter";
import { ElMessage } from "element-plus";

defineOptions({
  name: "SupplierList"
});
const { toDetail } = useDetail();
//const router = useRouter();
const supplierData = ref();
const itemKey = ref<number>(0);

const totalNum = ref<Number>(10);
const currentPage = ref<Number>(1);
const currentPageSize = ref<Number>(10);
//获取信息
/*
axios.get("/api/supplier/list?pageNum=1&pageSize=10").then(function (response) {
  supplierData.value = response.data.content;
  itemKey.value++;
});
*/
const getList = (pageNum, pageSize) => {
  http
    .request<AjaxResponseList>(
      "get",
      "/api/supplier/list?pageNum=" + pageNum + "&pageSize=" + pageSize
    )
    .then(function (response) {
      if (response.code == 0) {
        supplierData.value = response.data;
        totalNum.value = response.total;
        currentPageSize.value = response.pageSize;
        currentPage.value = response.pageNum;
        itemKey.value++;
      } else {
        ElMessage.error(response.message);
      }
    });
};
getList(currentPage.value, currentPageSize.value);

const deleteSupplier = (supplierId: string) => {
  http
    .request<AjaxResponse>("get", "/api/supplier/delete?id=" + supplierId)
    .then(response => {
      if (response.code == 0) {
        //删除成功
        ElMessage.success("删除供应商成功！");
        getList(currentPage.value, currentPageSize.value);
      } else {
        //失败
        ElMessage.error(response.message);
      }
    })
    .catch(error => {
      if (error.response) {
        //请求成功发出，服务器也相应，但状态码不是200
        ElMessage.error("服务器错误！", error.response.state);
      } else if (error.request) {
        //请求成功发出，服务器无响应
        ElMessage.error("服务器无响应！", error.request);
      } else {
        //请求发送失败
        ElMessage.error("删除请求发送失败！", error.message);
      }
    });
};

const showOrEditDetails = (
  supplierId: string,
  supplierName: string,
  type: string
) => {
  //console.log("supplierId:" + supplierId);
  let supplierNameLittle = supplierName;
  if (supplierName.length > 10) {
    supplierNameLittle = supplierName.substring(0, 10) + "...";
  }
  if (type === "render") {
    toDetail(
      {
        id: supplierId,
        supplierName: supplierNameLittle,
        renderFlag: 1
      },
      "render"
    );
  } else if (type === "edit") {
    toDetail(
      {
        id: supplierId,
        supplierName: supplierNameLittle
      },
      "edit"
    );
  } else {
    ElMessage.error("操作错误！");
  }
};

const pagChange = () => {
  //console.log("change");
  getList(currentPage.value, currentPageSize.value);
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-bold">供应商清单</span>
      </div>
    </template>

    <el-row>
      <el-col :span="24">
        <el-table
          :data="supplierData"
          :key="itemKey"
          border
          style="width: 100%"
        >
          <el-table-column v-if="false" prop="id" />
          <el-table-column fixed prop="supplierName" label="供应商名称" />
          <el-table-column prop="supplierNumber" label="供应商编号" />
          <el-table-column prop="orderQuantity" width="70" label="订单量" />
          <el-table-column prop="telephone" label="联系方式" />
          <el-table-column prop="address" label="地址" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作">
            <template v-slot="columnData">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  title="修改"
                  :icon="Edit"
                  @click="
                    showOrEditDetails(
                      columnData.row.id,
                      columnData.row.supplierName,
                      'edit'
                    )
                  "
                />
                <el-button
                  type="warning"
                  size="small"
                  title="查看详情"
                  :icon="View"
                  @click="
                    showOrEditDetails(
                      columnData.row.id,
                      columnData.row.supplierName,
                      'render'
                    )
                  "
                />
                <el-button
                  type="success"
                  size="small"
                  title="采购订单清单"
                  :icon="DataLine"
                />
                <el-popconfirm
                  title="确认删除？"
                  confirm-button-text="删除"
                  confirm-button-type="danger"
                  cancel-button-type="primary"
                  cancel-button-text="取消"
                  @confirm="deleteSupplier(columnData.row.id)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      size="small"
                      title="删除"
                      :icon="Delete"
                    />
                  </template>
                </el-popconfirm>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :offset="8" :span="8">
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
  </el-card>
</template>
