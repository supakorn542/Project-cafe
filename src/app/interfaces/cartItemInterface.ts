

export interface CartItemsInterface {
    id? : string;
    cart_id : string;
    product_id : string;
    quantity: number;
    optionitem_ids?: string[];
    description: string
    
}