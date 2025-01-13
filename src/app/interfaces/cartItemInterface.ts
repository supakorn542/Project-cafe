
import { CartInterface } from "./cartInterface";
import { OptionInterface } from "./optioninterface";
import { Product } from "./product";


export interface CartItemsInterface {
    id : any;
    cart_id : CartInterface;
    product_id : Product;
    quantity: number;
    optionitem_ids: string[];
    pickupdate : Date
    description: string
    
}