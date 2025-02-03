import { db } from "../lib/firebase";
import { collection, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { OptionInterface } from "../interfaces/optioninterface";
import { OptionItem } from "../interfaces/optionItemInterface";
import { Product } from "../interfaces/product";

// ฟังก์ชันในการดึงข้อมูลสินค้าทั้งหมดจาก Firestore
export const getAllProducts = async () => {

    // ดึงข้อมูลจาก collection "status"
    const statusSnapshot = await getDocs(collection(db, "status"));

    // แปลงข้อมูล status ให้เป็น object ที่มี status_id เป็น key
    const statusMap: Record<string, string> = statusSnapshot.docs.reduce((acc, statusDoc) => {
      const statusData = statusDoc.data();
      
      // ใช้ statusDoc.id แทน statusData.id เพื่อให้ได้ id ของ document
      if (statusDoc.id) {
        acc[statusDoc.id] = statusData.name; // สร้าง map สำหรับ lookup โดยใช้ id
      } else {

      }
    
      return acc;
    }, {} as Record<string, string>);
    


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
      imageProduct : productData.imageProduct, //
    };
  });



  const availableProducts = products.filter(product => statusMap[product.status_id] === "available");

  return availableProducts; 
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
        imageProduct: data.imageProduct || "",
      };
    } else {
      return null;
    }
  } catch (error) {
    ;
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
    ;
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
    ;
    return {};
  }
};


export async function getProductsByType(productTypeName: string) {
  try {
    // 🔹 1. Query หา productType ID ตามชื่อ
    const productTypeQuery = query(
      collection(db, "productTypes"),
      where("name", "==", productTypeName)
    );
    const productTypeQuerySnapshot = await getDocs(productTypeQuery);
    

    if (productTypeQuerySnapshot.empty) return [];

    // 🔹 2. ดึง productType ID
    const productTypeId = productTypeQuerySnapshot.docs[0].id;

    // 🔹 3. Query หา products ที่อ้างอิง productTypeId
    const productsQuery = query(
      collection(db, "products"),
      where("productType_id", "==", doc(db, `productTypes/${productTypeId}`)) // ใช้ Firestore Reference
    );
    const productsQuerySnapshot = await getDocs(productsQuery);
    

    // 🔹 4. Map ข้อมูล products ออกมา
    return productsQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    ;
    return [];
  }
}