export interface CoffeeOption {
    id: string;
    product_id: string; // เพิ่มฟิลด์นี้หากยังไม่มี
    intensity: string[]; // ประเภทของ intensity
    sweetness: string[]; // ประเภทของ sweetness
  }