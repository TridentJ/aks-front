import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import HomeFilled from "@iconify-icons/ep/home-filled";
import InformationLine from "@iconify-icons/ri/information-line";
import Lollipop from "@iconify-icons/ep/lollipop";
import CustomerFilled from "@iconify-icons/ri/user-shared-fill";
import SupplierFilled from "@iconify-icons/ri/user-received-fill";
import GroupFilled from "@iconify-icons/ri/group-fill";
import PurchaseFilled from "@iconify-icons/ri/download-2-fill";
import SaleFilled from "@iconify-icons/ri/upload-2-fill";
import CargoFilled from "@iconify-icons/ri/archive-fill";
import User3Filled from "@iconify-icons/ri/user-3-fill";
import KeyFilled from "@iconify-icons/ri/key-2-fill";
import SuccessFilled from "@iconify-icons/ep/success-filled";

addIcon("homeFilled", HomeFilled);
addIcon("informationLine", InformationLine);
addIcon("lollipop", Lollipop);
addIcon("customerFilled", CustomerFilled);
addIcon("supplierFilled", SupplierFilled);
addIcon("groupFilled", GroupFilled);
addIcon("purchaseFilled", PurchaseFilled);
addIcon("saleFilled", SaleFilled);
addIcon("cargoFilled", CargoFilled);
addIcon("user3Filled", User3Filled);
addIcon("keyFilled", KeyFilled);
addIcon("successFilled", SuccessFilled);
