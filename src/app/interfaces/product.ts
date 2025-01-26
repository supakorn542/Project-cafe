export interface Product {
    imageProduct: string
    id?: string;          // ID ของผลิตภัณฑ์
    productType_id: string; // ID ของหมวดหมู่
    status_id:string;
    price: number;       // ราคา
    name: string; // ชื่อผลิตภัณฑ์
    calorie: number;
    description: string
    options?: string[];
  }