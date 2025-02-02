export interface Stock {
    id?: string;             // ID 
    // idStock: string;         // ID Stock ที่ใช้ในการเบิก
    name: string;            // ชื่อสินค้า
    netQuantity: number;      // ปริมาณสินค้า
    unit?: string;           // หน่วย เช่น ml, g, oz, Kg
    price: number;           // ราคาต่อหน่วย
    classifier?: string;     // ตัวบ่งบอกประเภท เช่น ถุง, ชิ้น, กล่อง
    totalPrice: number;      // ราคารวม
    quantity: number;       //จำนวนสินค้า
    stockType: string;     //ประเภทของstock
    description: string;     // หมายเหตุสินค้า
    addedDate: Date | string; // วันที่เพิ่มstock
    manufactureDate: Date | string; //วันที่ผลิต
    expiryDate: Date | string;     // วันหมดอายุ
}
