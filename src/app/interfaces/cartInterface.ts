import { Timestamp } from 'firebase/firestore';
import { Product } from './product'; // นำเข้าตัว interface Product
import { OptionItem } from './optionItemInterface';
import { ReactNode } from 'react';

export interface CartInterface {
  quantity: ReactNode;
    id: string;
  product_id: Product[]; // สินค้าในตะกร้า
  optionItems: OptionItem, 
  status?: boolean;
  totalPrice: number
  description?: string;

  user_id: string;   // ID ของผู้ใช้ที่เป็นเจ้าของตะกร้า
}