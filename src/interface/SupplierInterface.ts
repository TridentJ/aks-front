export type SupplierBaseInfo = {
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
  createTime: string;
  updateTime: string;
  comments: string;
};

export type InvoiceInfo = {
  id: number;
  supplierId: number;
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

export type SupplierContactInfo = {
  id: number;
  supplierId: number;
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
export type SupplierSelectList = {
  id: number;
  supplierName: string;
  supplierNumber: string;
};
