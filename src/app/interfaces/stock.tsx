export interface Stock {
    id?: string;             // ID ของสินค้า (ถ้ามี)
    name: string;            // ชื่อสินค้า
    quantity: number;        // ปริมาณสินค้า
    unit?: string;           // หน่วย เช่น ml, g, oz, Kg
    price: number;           // ราคาต่อหน่วย
    classifier?: string;     // ตัวบ่งบอกประเภท เช่น ถุง, ชิ้น, กล่อง
    totalPrice: number;      // ราคารวม
    description: string;     // หมายเหตุสินค้า
    addedDate: Date | string;
    manufactureDate: Date | string;
    expiryDate: Date | string;     // วันหมดอายุ
}
// export interface Stock {
//     id?: string;
//     name: string;
//     quantity: number;
//     description: string;
//     totalPrice: number;
//     price: number;
//     addedDate: Date | string;
//     manufactureDate: Date | string;
//     expiryDate: Date | string;
// }
