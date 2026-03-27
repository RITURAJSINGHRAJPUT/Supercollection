export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}
