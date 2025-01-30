import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import { CartInterface } from "@/app/interfaces/cartInterface";
import { CartItemsInterface } from "../interfaces/cartItemInterface";

export async function fetchCartByUserId(
  userId: string
): Promise<CartInterface | null> {
  const cartsRef = collection(db, "carts");
  const userRef = doc(db, "users", userId);

  const q = query(cartsRef, where("user_id", "==", userRef));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const cartData = doc.data() as CartInterface;

    // ตรวจสอบว่า status เป็น true หรือ false
    if (cartData.status === true) {
      return { ...cartData, id: doc.id };
    }
  }

  return null; // คืนค่า null ถ้าไม่มี carts หรือ status เป็น false
}
export async function createCart(userId: string): Promise<string> {
  const cartRef = collection(db, "carts");
  const userRef = doc(db, "users", userId);

  const cartDoc = await addDoc(cartRef, {
    user_id: userRef,
    status: true,
    createAt: new Date()
  });
  return cartDoc.id;
}

export async function addCartItem(cartItem: CartItemsInterface) {
  const cartItemsRef = collection(db, "cartItems");

  if (!cartItem.cart_id || !cartItem.product_id) {
    throw new Error("Cart ID or Product ID is missing.");
  }

  const cartRef: DocumentReference = doc(db, "carts", cartItem.cart_id);
  const productRef: DocumentReference = doc(
    db,
    "products",
    cartItem.product_id
  );

  const optionItemRefs = cartItem.optionitem_ids.map((optionId) =>
    doc(db, "optionItems", optionId)
  );

  const newCartItem = {
    cart_id: cartRef,
    product_id: productRef,
    quantity: cartItem.quantity,
    optionitem_id: optionItemRefs,
    description: cartItem.description,
  };

  await addDoc(cartItemsRef, newCartItem);
}

export async function checkExistingCartItem(
  cartId: string,
  productId: string,
  selectedOptions: Record<string, string>
): Promise<{ id: string; cartItem: CartItemsInterface } | null> {
  const cartItemsRef = collection(db, "cartItems");

  const q = query(
    cartItemsRef,
    where("cart_id", "==", doc(db, "carts", cartId)),
    where("product_id", "==", doc(db, "products", productId)),
    where("optionitem_id", "array-contains", doc(db, "optionItems", Object.values(selectedOptions)[0]))
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const existingCartItemDoc = querySnapshot.docs[0];
    const existingCartItem = existingCartItemDoc.data() as CartItemsInterface;
    return { id: existingCartItemDoc.id, cartItem: existingCartItem };
  } else {
    return null;
  }
}