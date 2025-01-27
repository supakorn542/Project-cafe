import { Timestamp } from "firebase-admin/firestore";
import { DocumentReference, FieldValue } from "firebase/firestore";

export interface Product {
    imageProduct: string
    id?: string;          // ID ของผลิตภัณฑ์
    productType_id: string | DocumentReference; // ID ของหมวดหมู่
    status_id:string | DocumentReference ;
    price: number;       // ราคา
    name: string; // ชื่อผลิตภัณฑ์
    calorie: number;
    description: string
    options?: string[];
    updateAt?: Timestamp | FieldValue
  }