export type CustomerBaseSearchInfo = {
  id: number;
  customerName: string;
  customerNumber: string;
  telephone: string;
  phone: string;
  fax: string;
  address: string;
  factoryAddress: string;
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
  customerId: number;
  customerName: string;
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
  customerId: number;
  customerName: string;
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

export type CustomerContactSearchInfo = {
  id: number;
  customerId: number;
  customerName: string;
  ccName: string;
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

export type CustomerContactSearchResult = {
  id: number;
  customerId: number;
  customerName: string;
  ccName: string;
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
