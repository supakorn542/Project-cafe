import { addDoc, collection, deleteDoc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from '../lib/firebase';
import { Stock } from '../interfaces/stock';
import { assert } from "console";

export const createStocks = async (stockData: Stock, details: Array<{ idStock: string, manufactureDate: Date, expiryDate: Date }>) => {
  try {
    // เพิ่มเอกสารในคอลเลกชัน "stocks"
    const stockDocRef = await addDoc(collection(db, "stocks"), {
      name: stockData.name,
      netQuantity: stockData.netQuantity,
      unit: stockData.unit,
      price: stockData.price,
      classifier: stockData.classifier,
      totalPrice: stockData.totalPrice,
      quantity: stockData.quantity,
      description: stockData.description,
      stockType: stockData.stockType,
      addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
    });

    // บันทึกข้อมูลที่แตกต่างกัน (หน้า 2)
    const stockDetailsPromises = details.map((detail) =>
      addDoc(collection(db, "stocks", stockDocRef.id, "details"), {
        idStock: detail.idStock,
        manufactureDate: detail.manufactureDate instanceof Date ? detail.manufactureDate : new Date(detail.manufactureDate),
        expiryDate: detail.expiryDate instanceof Date ? detail.expiryDate : new Date(detail.expiryDate),
        name: stockData.name,
        netQuantity: stockData.netQuantity,
        unit: stockData.unit,
        price: stockData.price,
        classifier: stockData.classifier,
        totalPrice: stockData.totalPrice,
        quantity: stockData.quantity,
        description: stockData.description,
        stockType: stockData.stockType,
        addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
      })
    );
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

export const createPackages = async (stockData: Stock, details: Array<{ idStock: string }>) => {
  try {
    // เพิ่มเอกสารในคอลเลกชัน "stocks"
    const stockDocRef = await addDoc(collection(db, "stocks"), {
      name: stockData.name,
      netQuantity: stockData.netQuantity,
      unit: stockData.unit,
      price: stockData.price,
      classifier: stockData.classifier,
      totalPrice: stockData.totalPrice,
      quantity: stockData.quantity,
      description: stockData.description,
      stockType: stockData.stockType,
      addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
    });

    // บันทึกข้อมูลที่แตกต่างกัน (หน้า 2)
    const stockDetailsPromises = details.map((detail) =>
      addDoc(collection(db, "stocks", stockDocRef.id, "details"), {
        idStock: detail.idStock,
        name: stockData.name,
        netQuantity: stockData.netQuantity,
        unit: stockData.unit,
        price: stockData.price,
        classifier: stockData.classifier,
        totalPrice: stockData.totalPrice,
        quantity: stockData.quantity,
        description: stockData.description,
        stockType: stockData.stockType,
        addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
      })
    );
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

// export const createIngredientByID = async (stockData: Stock, details: Array<{ idStock: string, manufactureDate: Date, expiryDate: Date }>) => {
//   try {
//      // ระบุ collection ที่ต้องการดึงข้อมูล
//      const stockCollection = collection(db, "stocks");
//      // ดึงเอกสารทั้งหมดใน collection
//      const stockSnapshot = await getDocs(query(stockCollection, where('stockType', '==',"packaging")));

//     // เพิ่มเอกสารในคอลเลกชัน "stocks"
//     const stockDocRef = await addDoc(collection(db, "stocks"), {
//       name: stockData.name,
//       netQuantity: stockData.netQuantity,
//       unit: stockData.unit,
//       price: stockData.price,
//       classifier: stockData.classifier,
//       totalPrice: stockData.totalPrice,
//       quantity: stockData.quantity,
//       description: stockData.description,
//       stockType: stockData.stockType,
//       addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
//     });

//     // บันทึกข้อมูลที่แตกต่างกัน (หน้า 2)
//     const stockDetailsPromises = details.map((detail) =>
//       addDoc(collection(db, "stocks", stockDocRef.id, "details"), {
//         idStock: detail.idStock,
//         manufactureDate: detail.manufactureDate instanceof Date ? detail.manufactureDate : new Date(detail.manufactureDate),
//         expiryDate: detail.expiryDate instanceof Date ? detail.expiryDate : new Date(detail.expiryDate),
//         name: stockData.name,
//         netQuantity: stockData.netQuantity,
//         unit: stockData.unit,
//         price: stockData.price,
//         classifier: stockData.classifier,
//         totalPrice: stockData.totalPrice,
//         quantity: stockData.quantity,
//         description: stockData.description,
//         stockType: stockData.stockType,
//         addedDate: stockData.addedDate instanceof Date ? stockData.addedDate : new Date(stockData.addedDate),
//       })
//     );
//     // คืนค่า ID ของเอกสารที่สร้างขึ้น
//     return {
//       success: true,
//       message: "Stock created successfully",
//       id: stockDocRef.id,
//     };
//   } catch (error) {
//     console.error("Error creating stock: ", error);

//     // คืนค่าข้อผิดพลาด
//     return {
//       success: false,
//       message: "Failed to create stock",
//     };
//   }
// };

export const addStockDetailsByID = async (
  stockId: string,
  details: Array<{ idStock: string; manufactureDate: Date; expiryDate: Date }>
) => {
  try {
    // อ้างอิงเอกสาร stock ที่มีอยู่
    const stockRef = doc(db, "stocks", stockId);

    // ตรวจสอบว่า stock มีอยู่หรือไม่
    const stockSnapshot = await getDoc(stockRef);
    if (!stockSnapshot.exists()) {
      return {
        success: false,
        message: "Stock not found",
      };
    }

    // เพิ่มข้อมูลในคอลเลกชัน "details" ของ stock ที่มีอยู่
    const detailsPromises = details.map((detail) =>
      addDoc(collection(db, "stocks", stockId, "details"), {
        idStock: detail.idStock,
        manufactureDate: detail.manufactureDate instanceof Date ? detail.manufactureDate : new Date(detail.manufactureDate),
        expiryDate: detail.expiryDate instanceof Date ? detail.expiryDate : new Date(detail.expiryDate),
        // เพิ่มข้อมูลอื่น ๆ ที่จำเป็น
      })
    );

    // รอให้เพิ่มข้อมูลเสร็จสิ้น
    await Promise.all(detailsPromises);

    return {
      success: true,
      message: "Details added successfully",
    };
  } catch (error) {
    console.error("Error adding details to stock: ", error);

    return {
      success: false,
      message: "Failed to add details",
    };
  }
};

export const getIngredientById = async (stockId: string) => {
  try {
    console.log(stockId);
    const ingredientRef = doc(db, "stocks", stockId); // อ้างอิงเอกสารด้วย stockId
    const docSnap = await getDoc(ingredientRef); // ดึงเอกสาร

    if (docSnap.exists()) {
      // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
      console.log("name")
      console.log("Document data:", docSnap.data());
      return docSnap.data(); // คืนค่าข้อมูลของเอกสาร
    } else {
      console.log("No such document!");
      return null; // คืนค่า null ถ้าเอกสารไม่มี
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // โยน error ถ้ามีข้อผิดพลาด
  }
};


export const getStockPackags = async (): Promise<Stock[]> => {
  try {
    // ระบุ collection ที่ต้องการดึงข้อมูล
    const stockCollection = collection(db, "stocks");
    // ดึงเอกสารทั้งหมดใน collection
    const stockSnapshot = await getDocs(query(stockCollection, where('stockType', '==', "packaging")));

    if (stockSnapshot.empty) {
      console.warn("No stocks found in the collection.");
      return []; // หากไม่มีข้อมูลใน collection ให้คืนค่า array เปล่า
    }

    const stocks = await Promise.all(stockSnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      //-----------------------------------------------------------------
      return {
        id: docSnapshot.id,
        idStock: data.idStock,         // ID Stock ที่ใช้ในการเบิก
        name: data.name,            // ชื่อสินค้า
        netQuantity: data.netQuantity,      // ปริมาณสินค้า
        unit: data.unit,           // หน่วย เช่น ml, g, oz, Kg
        price: data.price,           // ราคาต่อหน่วย
        classifier: data.classifier,     // ตัวบ่งบอกประเภท เช่น ถุง, ชิ้น, กล่อง
        totalPrice: data.totalPrice,      // ราคารวม
        quantity: data.quantity,       //จำนวนสินค้า
        stockType: data.stockType,     //ประเภทของstock
        description: data.description,     // หมายเหตุสินค้า
        addedDate: data.addedDate, // วันที่เพิ่มstock
        // manufactureDate: data.manufactureDate,//วันที่ผลิต
        // expiryDate: data.expiryDate    // ID Stock ที่ใช้ในการเบิก
      } as Stock

    }));
    console.log("Stocks:", stocks);
    return stocks;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error; // โยน error เพื่อจัดการในที่ที่เรียกฟังก์ชัน
  }
};

export const getStockIngredients = async (): Promise<Stock[]> => {
  try {
    // ระบุ collection ที่ต้องการดึงข้อมูล
    const stockCollection = collection(db, "stocks");
    // ดึงเอกสารทั้งหมดใน collection
    const stockSnapshot = await getDocs(query(stockCollection, where('stockType', '==', "ingredient")));

    if (stockSnapshot.empty) {
      console.warn("No stocks found in the collection.");
      return []; // หากไม่มีข้อมูลใน collection ให้คืนค่า array เปล่า
    }

    // // แปลงข้อมูลเป็น array
    // const stockData = stockSnapshot.docs.map((doc) => ({
    //   id: doc.id, // เพิ่ม id ของเอกสารเพื่อใช้งาน
    //   // ...doc.data(), // ข้อมูลในเอกสาร
    // }));

    // console.log("Stock Data:", stockData);
    // return stockData;

    const stocks = await Promise.all(stockSnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      //-----------------------------------------------------------------
      return {
        id: docSnapshot.id,
        idStock: data.idStock,         // ID Stock ที่ใช้ในการเบิก
        name: data.name,            // ชื่อสินค้า
        netQuantity: data.netQuantity,      // ปริมาณสินค้า
        unit: data.unit,           // หน่วย เช่น ml, g, oz, Kg
        price: data.price,           // ราคาต่อหน่วย
        classifier: data.classifier,     // ตัวบ่งบอกประเภท เช่น ถุง, ชิ้น, กล่อง
        totalPrice: data.totalPrice,      // ราคารวม
        quantity: data.quantity,       //จำนวนสินค้า
        stockType: data.stockType,     //ประเภทของstock
        description: data.description,     // หมายเหตุสินค้า
        addedDate: data.addedDate, // วันที่เพิ่มstock
        manufactureDate: data.manufactureDate,//วันที่ผลิต
        expiryDate: data.expiryDate    // ID Stock ที่ใช้ในการเบิก
      } as Stock

    }));
    console.log("Stocks:", stocks);
    return stocks;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error; // โยน error เพื่อจัดการในที่ที่เรียกฟังก์ชัน
  }
};

export const deletedStock = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'stocks', id));
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};


