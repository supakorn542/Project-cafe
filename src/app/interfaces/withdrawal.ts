export interface Withdrawal {
    id?: string;             // ID 
    stockId: string; //
    userName: string;            // ชื่อสินค้า
    name: string; // 
    quantity: number;       //จำนวนสินค้า
    stockType: string;     //ประเภทของstock
    description: string;     // หมายเหตุสินค้า
    withdrawalDate:  Date | string; // วันที่เพิ่มstock
    details: string[]; //
}