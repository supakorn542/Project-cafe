import { Payment } from "../interfaces/payment"
import { CartInterface } from "./cartInterface";
export interface Order {
    orderId: string;
    orderDate: Date;
    cart_id : CartInterface;
    total_price: number;
    statusOrder: string;
    payment_id: Payment;
}
  