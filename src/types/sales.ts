export interface Sale {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  sellingPrice: number;
  total: number;
  date: Date;
}

export interface SaleFormData {
  productId: string;
  quantity: number;
  sellingPrice: number;
  date: string;
}
