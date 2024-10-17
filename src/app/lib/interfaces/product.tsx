export interface Product {
    id: string;          // ID ของผลิตภัณฑ์
    admin_id: string;    // ID ของผู้ดูแลระบบ
    category_id: string; // ID ของหมวดหมู่
    description: string; // คำอธิบายผลิตภัณฑ์
    price: number;       // ราคา
    product_name: string; // ชื่อผลิตภัณฑ์
  }