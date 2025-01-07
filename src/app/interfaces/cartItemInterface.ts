import { Timestamp } from "firebase-admin/firestore";
import { CartInterface } from "./cartInterface";
import { OptionInterface } from "./optioninterface";
import { Product } from "./product";


export interface CartItemsInterface {
    id : string;
    cart_id : CartInterface;
    product_id : Product;
    option? : OptionInterface
    quantity: number;
    optionitem_ids: string[];
    pickupdate : Timestamp
    description: string
    
}