import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import {
  fetchOptionsByProductId,
  fetchOptionItemsByOptionIds,
  fetchProductById,
} from "@/app/services/userProduct";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { Product } from "@/app/interfaces/product";
import {
  fetchCartByUserId,
  createCart,
  addCartItem,
  checkExistingCartItem,
} from "@/app/services/userCart";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface OptionPopupProps {
  onClose: () => void;
  productId: string;
}

export default function OptionPopup({ onClose, productId }: OptionPopupProps) {
  const { user } = useAuth();
  const [options, setOptions] = useState<OptionInterface[]>([]);
  const [groupedOptionItems, setGroupedOptionItems] = useState<
    Record<string, OptionItem[]>
  >({});
  const [product, setProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [description, setDescription] = useState<string>("");


  const router = useRouter()

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleOptionChange = (optionId: string, itemId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: itemId }));
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user || !product) {
      alert("Please log in or select a product.");
      return;
    }
  
    const action = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
  
    let cart = await fetchCartByUserId(user.id); // ดึง cart ที่ status: true
    
    if (!cart) {
      const cartId = await createCart(user.id);
      cart = { id: cartId, user_id: user.id, status: true }; // mock ข้อมูล cart ใหม่
    }
  
    const cartItem = {
      cart_id: cart.id,
      product_id: product.id!,
      quantity,
      optionitem_ids: Object.values(selectedOptions),
      description,
    };
  
    const existingCartItem = await checkExistingCartItem(
      cart.id,
      product.id!,
      selectedOptions
    );
  
    if (existingCartItem) {
      const updatedQuantity = existingCartItem.cartItem.quantity + quantity;
      const cartItemRef = doc(db, "cartItems", existingCartItem.id);
      await updateDoc(cartItemRef, { quantity: updatedQuantity });
      alert("Cart item updated successfully!");
    } else {
      await addCartItem(cartItem);
      alert("Added to cart successfully!");
    }
  
    if (action.value === "add_to_cart") {
      onClose();
    } else if (action.value === "buy_now") {
      router.push("/user/cart");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProduct = await fetchProductById(productId);
      setProduct(fetchedProduct);

      const fetchedOptions = await fetchOptionsByProductId(productId);
      setOptions(fetchedOptions);

      const optionIds = fetchedOptions.map((option) => option.id);
      const fetchedGroupedOptionItems = await fetchOptionItemsByOptionIds(
        optionIds
      );
      setGroupedOptionItems(fetchedGroupedOptionItems);
    };

    fetchData();
  }, [productId]);

  ;
  ;
  ;

  return (
    <>
      {/* Overlay ด้านหลัง */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
  
      {/* Popup ที่แสดงตรงกลาง */}
      <div className="fixed inset-0 flex justify-center items-center z-50 w-full px-4">
        <div className="bg-white border border-1 p-4 rounded-3xl shadow-lg w-full sm:w-[80%] md:w-[50%] lg:w-[35%] max-h-[90vh] overflow-y-auto grid grid-cols-1 grid-rows-[auto,1fr]">
          {/* ปุ่มปิด */}
          <div className="flex justify-end">
            <AiOutlineCloseCircle
              className="text-3xl cursor-pointer"
              onClick={onClose}
            />
          </div>
  
          {/* เนื้อหา Popup */}
          <div className="flex flex-col gap-y-2">
            <div>
            <h1 className="text-center text-xl font-bold">{product?.name}</h1>
            <h1 className="text-center text-sm ">{product?.calorie} Calories</h1>

            </div>

  
            <form onSubmit={handleAddToCart}>
              {/* ตัวเลือกสินค้า */}
              <div>
                {options.map((option: any) => (
                  <div key={option.id}>
                    <h3 className="font-bold">{option.name} {option.require && <span className="font-normal">(ต้องเลือก)</span>}</h3>
                    <ul>
                      {groupedOptionItems[option.id]?.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={item.id}
                            name={`option-${option.id}`}
                            value={item.id}
                            required={option.require}
                            onChange={() => handleOptionChange(option.id, item.id)}
                          />
                          <label htmlFor={item.id}>
                            {item.name} (+${item.priceModifier})
                          </label>
                        </li>
                      )) || <li>No items available</li>}
                    </ul>
                  </div>
                ))}
              </div>
  
              {/* รายละเอียดเพิ่มเติม */}
              <div className="flex flex-col mt-4">
                <label htmlFor="description">รายละเอียดเพิ่มเติม</label>
                <input
                  id="description"
                  type="text"
                  className="border-2 border-black rounded-lg p-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
  
              {/* ปุ่มเพิ่มลดจำนวน + ราคา */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex px-3 border border-black rounded-2xl gap-x-3 items-center">
                  <FaMinus className="cursor-pointer" onClick={handleDecrease} />
                  <h3>{quantity}</h3>
                  <FaPlus className="cursor-pointer" onClick={handleIncrease} />
                </div>
                <h3 className="text-lg font-bold">${product?.price}</h3>
              </div>
  
              {/* ปุ่มกด Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <button
                  type="submit"
                  name="action"
                  value="add_to_cart"
                  className="border border-black px-4 py-2 rounded-2xl w-full sm:w-auto"
                >
                  ADD TO CART
                </button>
                <button
                  type="submit"
                  name="action"
                  value="buy_now"
                  className="bg-black text-white px-4 py-2 border border-black rounded-2xl w-full sm:w-auto"
                >
                  BUY NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  
}
