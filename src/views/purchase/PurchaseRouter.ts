import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;

  function toDetail(
    parameter: LocationQueryRaw | RouteParamsRaw,
    model: "render" | "edit",
    module: "purchase" | "supplier"
  ) {
    // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
    // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    if( module == "purchase"){
      if (model === "render") {
        // 保存信息到标签页
        useMultiTagsStoreHook().handleTags("push", {
          path: `/purchase/render`,
          name: "PurchaseRender",
          query: parameter,
          meta: {
            title: `采购单详情 - ${parameter.purchaseName}`,
            // 如果使用的是非国际化精简版title可以像下面这么写
            // title: `No.${index} - 详情信息`,
            // 最大打开标签数
            dynamicLevel: 3
          }
        });
        // 路由跳转
        router.push({ name: "PurchaseRender", query: parameter });
      } else if (model === "edit") {
        useMultiTagsStoreHook().handleTags("push", {
          path: `/purchase/edit`,
          name: "PurchaseEdit",
          query: parameter,
          meta: {
            title: `修改采购单 - ${parameter.purchaseName}`
            // 如果使用的是非国际化精简版title可以像下面这么写
            // title: `No.${index} - 详情信息`,
          }
        });
        router.push({ name: "PurchaseEdit", query: parameter });
      }
    } else if (module === "supplier") {
      // 保存信息到标签页
      useMultiTagsStoreHook().handleTags("push", {
        path: `/supplier/render`,
        name: "SupplierRender",
        query: parameter,
        meta: {
          title: `采购单详情 - ${parameter.supplierName}`,
          // 如果使用的是非国际化精简版title可以像下面这么写
          // title: `No.${index} - 详情信息`,
          // 最大打开标签数
          dynamicLevel: 3
        }
      });
      // 路由跳转
      router.push({ name: "SupplierRender", query: parameter });
    }
  }

  // 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
  const initToDetail = (model: "render" | "edit", module: "purchase" | "supplier") => {
    if (getParameter) toDetail(getParameter, model, module);
  };

  return { toDetail, initToDetail, getParameter, router };
}
