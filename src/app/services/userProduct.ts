import { db } from "../lib/firebase";
import { collection, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { OptionInterface } from "../interfaces/optioninterface";
import { OptionItem } from "../interfaces/optionItemInterface";
import { Product } from "../interfaces/product";

// ฟังก์ชันในการดึงข้อมูลสินค้าทั้งหมดจาก Firestore
export const getAllProducts = async () => {
  // ดึงข้อมูลสินค้าทั้งหมดจากคอลเลกชัน "products"
  const productsSnapshot = await getDocs(collection(db, "products"));

  // map ข้อมูลจากแต่ละ document ในคอลเลกชัน products
  const products = productsSnapshot.docs.map((productDoc) => {
    const productData = productDoc.data();

    // กรณีที่คุณอยากให้ได้แค่ id และข้อมูลบางอย่างจาก product
    return {
      id: productDoc.id,  // เพิ่ม id ของเอกสาร
      name: productData.name,  // ชื่อผลิตภัณฑ์
      description: productData.description,  // คำอธิบาย
      price: productData.price,  // ราคา
      calorie: productData.calorie,  // แคลอรี่
      productType_id: productData.productType_id.id  || productData.productType_id,  // ID ของประเภทสินค้า
      status_id: productData.status_id.id || productData.status_id,  // ID ของสถานะ
    };
  });

  return products;  // คืนค่ารายการสินค้าทั้งหมด
}

export const getAllProductTypes = async () => {
  const productTypesSnapshot = await getDocs(collection(db, "productTypes")); // แทน "productTypes" ด้วยชื่อคอลเลกชันจริงของคุณ
  return productTypesSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};


export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const data = productDoc.data();

      // คืนค่าที่ตรงกับ Product interface
      return {
        id: productDoc.id, // id มาจาก document
        name: data.name || "Unnamed Product",
        description: data.description || "",
        price: data.price || 0,
        calorie: data.calorie || 0,
        productType_id: data.productType_id || "",
        status_id: data.status_id || "",
      };
    } else {
      console.warn(`No product found for ID: ${productId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};




export const fetchOptionsByProductId = async (productId: string): Promise<OptionInterface[]> => {
  try {
    const productOptionsQuery = query(
      collection(db, "productOptions"),
      where("product_id", "==", doc(db, "products", productId))
    );
    const productOptionsSnapshot = await getDocs(productOptionsQuery);

    const optionRefs = productOptionsSnapshot.docs.flatMap(doc => doc.data().option_id || []);
    if (optionRefs.length === 0) {
      console.warn("No options found for productId:", productId);
      return [];
    }

    const options = await Promise.all(
      optionRefs.map(async (optionRef) => {
        const optionDoc = await getDoc(optionRef);
        if (!optionDoc.exists()) return null;

        const data = optionDoc.data();
        if (!data || typeof data !== "object") return null;

        return { id: optionDoc.id, ...data } as OptionInterface;
      })
    );

    return options.filter((option): option is OptionInterface => option !== null);
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
};

export const fetchOptionItemsByOptionIds = async (
  optionIds: string[]
): Promise<Record<string, OptionItem[]>> => {
  try {
    if (optionIds.length === 0) {
      return {};
    }

    const optionItemsQuery = query(
      collection(db, "optionItems"),
      where("option_id", "in", optionIds.map(id => doc(db, "options", id)))
    );
    const optionItemsSnapshot = await getDocs(optionItemsQuery);

    const groupedOptionItems: Record<string, OptionItem[]> = {};

    optionItemsSnapshot.docs.forEach(doc => {
      const data = doc.data() as OptionItem;
      const optionId = (data.option_id as any).id; // Extract the `option_id` reference
    
      // ตรวจสอบว่า `optionId` มีอยู่หรือไม่ในกลุ่ม
      if (!groupedOptionItems[optionId]) {
        groupedOptionItems[optionId] = [];
      }
    
      // เพิ่ม item โดยรวม `id` ที่ไม่ซ้ำกัน
      groupedOptionItems[optionId].push({ ...data, id: doc.id });
    });
    

    return groupedOptionItems;
  } catch (error) {
    console.error("Error fetching option items:", error);
    return {};
  }
};
