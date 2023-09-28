export type CustomerBaseInfo = {
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
  createTime: string;
  updateTime: string;
  comments: string;
};

export type InvoiceInfo = {
  id: number;
  customerId: number;
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

export type CustomerContactInfo = {
  id: number;
  customerId: number;
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
