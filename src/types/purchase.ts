export interface Purchase {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  costPrice: number;
  total: number;
  date: Date;
}

export interface PurchaseFormData {
  productId: string;
  quantity: number;
  costPrice: number;
  date: string;
}
