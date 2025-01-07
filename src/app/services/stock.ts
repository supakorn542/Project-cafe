import { addDoc, collection, deleteDoc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from '../lib/firebase';
import { Stock } from '../interfaces/stock';
import { assert } from "console";

export const createStocks = async (stockData: Stock, details: Array<{ idStock: string, manufactureDate: String, expiryDate: String }>) => {
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
        manufactureDate: detail.manufactureDate,
        expiryDate: detail.expiryDate,
        // name: stockData.name,
        // netQuantity: stockData.netQuantity,
        // unit: stockData.unit,
        // price: stockData.price,
        // classifier: stockData.classifier,
        // totalPrice: stockData.totalPrice,
        // quantity: stockData.quantity,
        // description: stockData.description,
        // stockType: stockData.stockType,
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

export const createWithdrawal = async (
  stockId: string,
  selectedDetails: Array<any>,
  newData: Array<any>,
  data: { userName: string, withdrawDate: string, description: string, quantity: number }
) => {
  try {
    if (newData.length === 0) {
      return { success: false, message: "No data provided for creation" };
    }

    // สร้างเอกสารใหม่ใน `Withdrawal` 
    const withdrawalData = {
      stockId, // เก็บ stockId
      data,
      details: newData, // เก็บข้อมูล selectedDetails เป็น array
      createdAt: new Date(), // เพิ่มเวลาในการสร้าง
    };

    // สร้างเอกสารในคอลเลกชัน Withdrawal
    const withdrawalCollectionRef = collection(db, "withdrawals");
    await addDoc(withdrawalCollectionRef, withdrawalData);

    // อัปเดตข้อมูล Stock
    // อัปเดตข้อมูล Stock quantity ให้ลดลง จากจำนวนของ Withdrawal quantity 
    const stockRef = doc(db, "stocks", stockId); // ใช้ stockId ที่ได้รับ

    // ดึงข้อมูล stock ปัจจุบันจาก Firestore
    const stockSnapshot = await getDoc(stockRef);

    if (stockSnapshot.exists()) {
      const stockData = stockSnapshot.data(); // ข้อมูลปัจจุบันของ stock
      const currentQuantity = stockData.quantity || 0; // ตรวจสอบว่า quantity มีค่าหรือไม่

      if (currentQuantity >= data.quantity) {
        // ลดจำนวน quantity
        await updateDoc(stockRef, {
          quantity: currentQuantity - data.quantity,
        });
      } else {
        throw new Error("Not enough stock quantity available.");
      }
    } else {
      throw new Error("Stock document does not exist.");
    }


    // ลบเอกสารใน `details` ที่เกี่ยวข้องกับ stockId และรายการที่เลือก
    const deletePromises = selectedDetails.map((detail) => {
      const detailRef = doc(db, "stocks", stockId, "details", detail.id); // อ้างอิงถึงแต่ละเอกสารใน `details`
      return deleteDoc(detailRef); // ลบเอกสารใน `details`
    });

    await Promise.all(deletePromises); // รอให้ลบเอกสารเสร็จสิ้น

    return { success: true, message: "Creation in Withdrawal and withdrawal from details completed successfully" };
  } catch (error) {
    console.error("Error during creation in Withdrawal and withdrawal:", error);
    return { success: false, message: "Failed to complete creation in Withdrawal and withdrawal", error };
  }
};



// ฟังก์ชันสำหรับอัปเดตข้อมูล Stock และเพิ่มรายละเอียดใหม่
export const updateIngredientByIDAndAddDetail = async (
  stockId: string,
  updatedStockData: {
    quantity: number;
    addedDate: string;
    description: string;
  },
  newDetails: Array<{
    idStock: string;
    manufactureDate: Date;
    expiryDate: Date;
  }>) => {
  try {
    console.log(stockId)
    // ตรวจสอบว่า Stock ที่ระบุมีอยู่ในฐานข้อมูลหรือไม่
    const stockRef = doc(db, "stocks", stockId);
    const stockSnapshot = await getDoc(stockRef);

    // if (!stockSnapshot.exists()) {
    //   return { success: false, message: "Stock not found" };
    // }

    // อัปเดตข้อมูล Stock
    // if (Object.keys(updatedStockData).length > 0) {
    //   await updateDoc(stockRef, updatedStockData);
    // }

    if (stockSnapshot.exists()) {
      const stockData = stockSnapshot.data(); // ข้อมูลปัจจุบันของ stock
      const currentQuantity = stockData.quantity || 0; // ตรวจสอบว่า quantity มีค่าหรือไม่

      if (Object.keys(updatedStockData).length > 0 || currentQuantity <= updatedStockData.quantity) {
        // เพิ่มจำนวน quantity
        await updateDoc(stockRef, {
          quantity: currentQuantity + updatedStockData.quantity,
          addedDate:updatedStockData.addedDate,
          description: updatedStockData.description,
        });
      } else {
        throw new Error("Not enough stock quantity available.");
      }
    } else {
      throw new Error("Stock document does not exist.");
    }

    // เพิ่มรายละเอียดใหม่ในคอลเลกชัน `details`
    const detailsPromises = newDetails.map((detail) =>
      addDoc(collection(db, "stocks", stockId, "details"), {
        idStock: detail.idStock,
        manufactureDate: detail.manufactureDate,
        expiryDate: detail.expiryDate,
        addedDate: new Date(), // หรือข้อมูลเพิ่มเติมอื่น ๆ
      })
    );

    await Promise.all(detailsPromises);

    return { success: true, message: "Stock updated and details added successfully" };
  } catch (error) {
    console.error("Error updating stock and adding details:", error);
    return { success: false, message: "Failed to update stock or add details", error };
  }
};

// ฟังก์ชันเพื่ออัปเดตข้อมูลสต็อก
export const updateIngredientByID = async (
  stockId: string,
  updatedStockData: any,  // ข้อมูลที่ได้รับจากแบบฟอร์ม
  newDetails: Array<{
    id: string
    idStock: string;
    manufactureDate: Date;
    expiryDate: Date;
  }>
) => {
  try {
    // ตรวจสอบว่า Stock ที่ระบุมีอยู่ในฐานข้อมูลหรือไม่
    const stockRef = doc(db, "stocks", stockId);
    const stockSnapshot = await getDoc(stockRef);

    if (!stockSnapshot.exists()) {
      return { success: false, message: "Stock not found" };
    }

    // อัปเดตข้อมูล Stock
    if (Object.keys(updatedStockData).length > 0) {
      await updateDoc(stockRef, updatedStockData);
    }

    // // อัปเดตรายละเอียดใหม่ใน stock
    // if (newDetails.length > 0) {
    //   const detailsRef = doc(db, "stocks", stockId, "details", "details.id"); // ชื่อ collection สำหรับรายละเอียด
    //   await updateDoc(detailsRef, { details: newDetails });
    // }

    // อัปเดตหรือเพิ่มข้อมูลใน subcollection "details"
    if (newDetails.length > 0) {
      for (const detail of newDetails) {
        const detailRef = doc(db, "stocks", stockId, "details", detail.id); // ใช้ id ของรายละเอียดที่ต้องการอัปเดต
        await updateDoc(detailRef, {
          idStock: detail.idStock,
          manufactureDate: detail.manufactureDate,
          expiryDate: detail.expiryDate,
        });
      }
    }

    return { success: true, message: "Stock updated and details added successfully" };
  } catch (error) {
    console.error("Error updating stock and adding details:", error);
    return { success: false, message: "Failed to update stock or add details", error };
  }
};


export const getIngredientById = async (stockId: string) => {
  try {
    console.log(stockId);
    const ingredientRef = doc(db, "stocks", stockId); // อ้างอิงเอกสารด้วย stockId
    const docSnap = await getDoc(ingredientRef); // ดึงเอกสาร

    // if (docSnap.exists()) {
    //   // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    //   console.log("Document data:", docSnap.data());
    //   return docSnap.data(); // คืนค่าข้อมูลของเอกสาร
    // } else {
    //   console.log("No such document!");
    //   return null; // คืนค่า null ถ้าเอกสารไม่มี
    // }

    if (!docSnap.exists()) {
      console.log("No such document!");
      return null; // คืนค่า null ถ้าเอกสารไม่มี
    }

    // ดึงข้อมูลของเอกสารหลัก
    const ingredientData = docSnap.data();

    // อ้างอิงไปยังคอลเลกชันย่อย "details"
    const detailsRef = collection(db, "stocks", stockId, "details");
    const detailsSnap = await getDocs(detailsRef); // ดึงข้อมูลจากคอลเลกชันย่อย

    // ดึงข้อมูลทั้งหมดจากคอลเลกชันย่อย
    const details = detailsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // รวมข้อมูลเอกสารหลักและข้อมูลคอลเลกชันย่อย
    return {
      id: stockId,
      data: ingredientData,
      details, // เพิ่มข้อมูลจากคอลเลกชันย่อย
    };
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


//ลบได้หมด
// export const deletedStock = async (id: string) => {
//   try {
//     // อ้างอิงถึง subcollection `details` ในเอกสาร `stocks`
//     const detailsCollectionRef = collection(db, 'stocks', id, 'details');

//     // ดึงเอกสารทั้งหมดใน subcollection `details`
//     const detailsSnapshot = await getDocs(detailsCollectionRef);

//     // ลบเอกสารใน `details` ทีละรายการ
//     const deletePromises = detailsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
//     await Promise.all(deletePromises); // รอให้ลบเอกสารทั้งหมดเสร็จสิ้น

//     // ลบเอกสารหลักใน `stocks`
//     await deleteDoc(doc(db, 'stocks', id));
//     console.log('Document and its subcollection deleted successfully');
//   } catch (error) {
//     console.error('Error deleting document and its subcollection: ', error);
//   }
// };



