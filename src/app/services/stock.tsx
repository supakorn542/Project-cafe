import { addDoc, collection, deleteDoc } from "firebase/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from '../lib/firebase';
import { Stock } from '../interfaces/stock';
import { assert } from "console";

export const createStocks = async (productData: Stock) => {
  try {
    // เพิ่มเอกสารในคอลเลกชัน "stocks"
    const stockDocRef = await addDoc(collection(db, "stocks"), {
      // name: productData.name,
      // quantity: productData.quantity,
      // unit: productData.unit,
      // price: productData.price,
      // classifier: productData.classifier,
      // totalPrice: productData.totalPrice,
      // addedDate: productData.addedDate,
      // manufactureDate: productData.manufactureDate,
      // expiryDate: productData.expiryDate,
      // description: productData.description,
      name: productData.name,
      quantity: productData.quantity,
      unit: productData.unit,
      price: productData.price,
      classifier: productData.classifier,
      totalPrice: productData.totalPrice,
      description: productData.description,
      addedDate: productData.addedDate instanceof Date ? productData.addedDate : new Date(productData.addedDate),
      manufactureDate: productData.manufactureDate instanceof Date ? productData.manufactureDate : new Date(productData.manufactureDate),
      expiryDate: productData.expiryDate instanceof Date ? productData.expiryDate : new Date(productData.expiryDate),
    });

    // คืนค่า ID ของเอกสารที่สร้างขึ้น
    return {    
      success: true,
      message: "Stock created successfully",
      id: stockDocRef.id,
    };
  } catch (error) {
    console.error("Error creating stock: ", error);

    // คืนค่าข้อผิดพลาด
    return {
      success: false,
      message: "Failed to create stock",
    };
  }
};

export const deletedStock = async (id : string) => {
    try{
        await deleteDoc(doc(db, 'stock', id));
        console.log('Document deleted successfully');
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
};


