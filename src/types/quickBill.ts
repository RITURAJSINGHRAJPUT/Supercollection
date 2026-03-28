export interface QuickEntry {
  id: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
  date: Date | string;
}

export interface QuickEntryFormData {
  category: string;
  price: number;
  quantity: number;
  date: string;
}
