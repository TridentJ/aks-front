export type SupplierBaseSearchInfo = {
  id: number;
  supplierName: string;
  supplierNumber: string;
  telephone: string;
  phone: string;
  fax: string;
  companyAddress: string;
  deliveryAddress: string;
  alipayAccount: string;
  wepayAccount: string;
  state: number;
  createTimeStart: string;
  createTimeEnd: string;
  updateTimeStart: string;
  updateTimeEnd: string;
  comments: string;
  pageNum: Number;
  pageSize: Number;
};

export type InvoiceSearchInfo = {
  id: number;
  supplierId: number;
  searchType: number;
  supplierName: string;
  company: string;
  bank: string;
  bankAccount: string;
  taxAccount: string;
  address: string;
  phone: string;
  state: number;
  createTimeStart: string;
  createTimeEnd: string;
  updateTimeStart: string;
  updateTimeEnd: string;
  comments: string;
  pageNum: Number;
  pageSize: Number;
};

export type InvoiceSearchResult = {
  id: number;
  supplierId: number;
  supplierName: string;
  company: string;
  bank: string;
  bankAccount: string;
  taxAccount: string;
  address: string;
  phone: string;
  state: number;
  createTime: string;
  updateTime: string;
  comments: string;
};

export type SupplierContactSearchInfo = {
  id: number;
  supplierId: number;
  supplierName: string;
  scName: string;
  department: string;
  job: string;
  baseLocation: string;
  telephone: string;
  phone: string;
  mail: string;
  qq: string;
  wechat: string;
  state: number;
  createTimeStart: string;
  createTimeEnd: string;
  updateTimeStart: string;
  updateTimeEnd: string;
  comments: string;
  pageNum: Number;
  pageSize: Number;
};

export type SupplierContactSearchResult = {
  id: number;
  supplierId: number;
  supplierName: string;
  scName: string;
  department: string;
  job: string;
  baseLocation: string;
  telephone: string;
  phone: string;
  mail: string;
  qq: string;
  wechat: string;
  state: number;
  createTime: string;
  updateTime: string;
  comments: string;
};
