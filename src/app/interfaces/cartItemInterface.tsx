import { CartInterface } from "./cartInterface";
import { Product } from "./product";

interface Option {
    [key: string]: any; // คีย์เป็น string และค่าสามารถเป็นประเภทใดก็ได้
}
export interface CartItemsInterface {
    id : string;
    cart_id : CartInterface;
    product_id : Product;
    option : Option
    
}