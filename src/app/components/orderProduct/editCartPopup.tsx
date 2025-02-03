import { db } from "@/app/lib/firebase";
import {
  doc,
  getDoc,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import React, { FormEvent, useEffect, useState } from "react";
import { CartItemsInterface } from "../../interfaces/cartItemInterface";
import { CartInterface } from "../../interfaces/cartInterface";
import { OptionInterface } from "../../interfaces/optioninterface";
import { Product } from "../../interfaces/product";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { getOptions } from "@/app/services/options";
import { getProductOptionsByProductId } from "@/app/services/productOption";
import "./editCartPopup.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
function EditCartPopup({
  onClose,
  onSubmit,
  cartItemId,
}: {
  onClose: () => void;
  onSubmit: (formData: any) => void;
  cartItemId: string;
}) {
  interface cartstateinterface extends CartItemsInterface {
    option: any;
  }
  const [cartItem, setCartItems] = useState<cartstateinterface | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [allGroupedOptions, setallGroupedOptions] = useState<
    {
      productId: string | undefined;
      options: { option: OptionInterface; items: OptionItem[] }[];
    }[]
  >([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [checkedOptionItemIds, setCheckedOptionItemIds] = useState<string[]>(
    []
  );
  const [pickupdateTime, setPickupdateTime] = useState<string>("");
  
  useEffect(() => {
    const fetchCartItem = async () => {
      if (cartItemId) {
        try {
          const cartItemRef = doc(db, "cartItems", cartItemId);
          const cartItemSnapshot = await getDoc(cartItemRef);

          const { options, optionItemsMap } = await getOptions();

          if (cartItemSnapshot.exists()) {
            const cartItemData = cartItemSnapshot.data();

            // Check if the necessary properties exist in cartItemData
            if (
              cartItemData.cart_id &&
              cartItemData.optionitem_id && // Use the correct property name
              cartItemData.product_id
            ) {
              // Fetch cart data
              const cartRef =
                cartItemData.cart_id as DocumentReference<CartInterface>;
              const cartSnapshot = await getDoc(cartRef);

              // Fetch option data (assuming optionitem_id is an array of references)
              const optionItemRefs =
                cartItemData.optionitem_id as DocumentReference<OptionInterface>[];
              const optionSnapshots = await Promise.all(
                optionItemRefs.map((ref) => getDoc(ref))
              );
              const optionData = optionSnapshots.map((snapshot) =>
                snapshot.data()
              );

              // Fetch product data
              const productRef =
                cartItemData.product_id as DocumentReference<Product>;
              const productSnapshot = await getDoc(productRef);

              if (
                cartSnapshot.exists() &&
                optionSnapshots.every((snapshot) => snapshot.exists()) &&
                productSnapshot.exists()
              ) {
                const cartData = cartSnapshot.data();
                const productData = productSnapshot.data() as Product;
                ;

                // Now create the CartItemsInterface object
                const cartItem: cartstateinterface = {
                  id: cartItemSnapshot.id,
                  cart_id: cartData.id,
                  product_id: productData.id ?? "",
                  description: cartItemData.description,
                  option: optionData[0], // Assuming you want the first option
                  quantity: cartItemData.quantity,

                  optionitem_ids: cartItemData.optionitem_id.map(
                    (ref: { id: any }) => ref.id
                  ),
                };

                const productId = productSnapshot.id; // Get the document ID

                try {
                  const selectedOptionIds = await getProductOptionsByProductId(
                    productId
                  ); // Access productData.id directly
                  const relatedOptions = options
                    .filter((option: OptionInterface) =>
                      selectedOptionIds.includes(option.id)
                    )
                    .map((option: OptionInterface) => ({
                      option,
                      items: optionItemsMap[option.id] || [],
                    }));

                  setallGroupedOptions([
                    {
                      productId: productData.id, // Access productData.id directly
                      options: relatedOptions,
                    },
                  ]);
                } catch (error) {
                  setallGroupedOptions([]); // Or handle the error as needed
                }
                setCartItems(cartItem);
                setQuantity(cartItem.quantity); // Set initial quantity from cartItem
                setProduct(productData); // Set the product state

                setCheckedOptionItemIds(cartItem.optionitem_ids ?? []);

                // ... update other state variables
              } else {
                ;
              }
            } else {
            }
          } else {
            ;
          }
        } catch (error) {
          ;
        }
      }
    };

    fetchCartItem();
  }, [cartItemId]);
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  ;
  ;

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (cartItem) {
        const descriptionElement =
          event.currentTarget.elements.namedItem("description");
        const descriptionValue =
          descriptionElement instanceof HTMLTextAreaElement
            ? descriptionElement.value
            : "";
        // 1. อัปเดต cartItem ใน Firestore
        await updateDoc(doc(db, "cartItems", cartItem.id!), {
          optionitem_id: checkedOptionItemIds.map((id) =>
            doc(db, "optionItems", id)
          ),
          quantity: quantity,

          description: descriptionValue, // อัปเดต description
        });

        onSubmit(true);

        onClose();
      }
    } catch (error) {
      ;
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <form onSubmit={handleFormSubmit}>
        <div className="bg-white w-96 h-auto flex justify-start flex-col p-6 rounded-xl relative gap-y-3">
          <h2 className="text-2xl self-center">{product?.name}</h2>
          <h1 className="text-center text-sm ">{product?.calorie} Calories</h1>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-2 mr-4 text-3xl"
          >
            <IoIosCloseCircleOutline />
          </button>
          <div>
            {allGroupedOptions
              .find((selected) => selected.productId === product?.id)
              ?.options?.map(({ option, items }) => (
                <div key={option.id}>
                  <h3 className="font-bold flex self-start">
                    {option.name}{" "}
                    {option.require && (
                      <span className="font-normal">(ต้องเลือก)</span>
                    )}
                  </h3>

                  <ul className="mt-1 flex flex-col gap-y-[0.25rem]">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="">
                          <input
                            type="radio"
                            id={`radio-${item.id}`}
                            name={`option-${option.id}`} // ตั้งชื่อให้เหมือนกันในแต่ละกลุ่ม option
                            onChange={() =>
                              setCheckedOptionItemIds((prevChecked) => [
                                ...prevChecked.filter(
                                  (checkedId) =>
                                    !items.some(
                                      (optionItem) =>
                                        optionItem.id === checkedId
                                    )
                                ), // ลบตัวเลือกอื่นในกลุ่มเดียวกัน
                                item.id, // เพิ่มตัวเลือกที่เลือก
                              ])
                            }
                            required={option.require}
                            checked={checkedOptionItemIds.includes(item.id)} // เช็คว่าเลือกตัวเลือกนี้ไหม
                            className="mr-2"
                          />
                          {item.name}
                        </div>
                        <label
                          htmlFor={`checkbox-${item.id}`}
                          className="flex-grow"
                        >
                          ${item.priceModifier}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="flex flex-col justify-start">
            <label className="self-start font-semibold text-sm">
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
              className="border-black border-2 rounded-xl"
              name="description" // เพิ่ม name ให้กับ textarea
              defaultValue={cartItem?.description} // ใช้ defaultValue แทน value
            />
          </div>

          <div>
            <div className="flex justify-between">
              <div className="flex border rounded-full px-2 border-black w-fit">
                <button
                  type="button"
                  className="mx-2 block"
                  onClick={() =>
                    handleQuantityChange(quantity > 1 ? quantity - 1 : 1)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  className="max-w-7 text-center no-arrows"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value, 10) || 1)
                  }
                />
                <button
                  type="button"
                  className="mx-2 block"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="">
                <span>${product?.price}</span>
              </div>
            </div>
            <button
              type="submit"
              className="border border-black rounded-lg py-1 px-3 bg shadow-xl bg-black hover:animate-pulse text-white  mt-3 w-full text-center"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default EditCartPopup;
