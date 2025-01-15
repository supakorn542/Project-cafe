import { Payment } from "../interfaces/payment"
import { CartInterface } from "./cartInterface";
export interface Order {
    id: string;
    orderDate: Date;
    cart_id : string;
    total_price?: number;
    statusOrder: string;
    payment_id: string;
}
  