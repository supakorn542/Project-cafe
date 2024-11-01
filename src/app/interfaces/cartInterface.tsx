import { Product } from './product'; // นำเข้าตัว interface Product

export interface CartInterface {
    id: string;
  product_id: Product; // สินค้าในตะกร้า
  quantity: number; // จำนวนสินค้าที่มีในตะกร้า
  total_price : number;
  user_id: string;   // ID ของผู้ใช้ที่เป็นเจ้าของตะกร้า
}