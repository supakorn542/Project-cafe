import { Timestamp } from 'firebase/firestore';
import { Product } from './product'; // นำเข้าตัว interface Product
import { OptionItem } from './optionItemInterface';
import { ReactNode } from 'react';

export interface CartInterface {
  id: string;
  status?: boolean;
  user_id: string;   
}