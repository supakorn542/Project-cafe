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
} from "@/app/services/userCart";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

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
  const [pickupDate, setPickupDate] = useState<string>("");

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

    const pickupDateAsDate = new Date(pickupDate);

    const cart = await fetchCartByUserId(user.id);

    console.log("Cart", cart);

    let cartId: string;

    if (cart) {
      cartId = cart.id;
    } else {
      cartId = await createCart(user.id);
    }

    const cartItem = {
      cart_id: cartId,
      product_id: product.id!,
      quantity,
      optionitem_ids: Object.values(selectedOptions),
      pickupdate: pickupDateAsDate,
      description,
    };
    if (action.value === "add_to_cart") {
      console.log("Adding to cart...");
      await addCartItem(cartItem);
      alert("Added to cart successfully!");
      onClose();

    } else if (action.value === "buy_now") {

      console.log("Buying now...");
      await addCartItem(cartItem);
      alert("Added to cart successfully!");
      router.push("cart")

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

  console.log("Options : ", options);
  console.log("Grouped Option Items:", groupedOptionItems);
  console.log("Product: ", product);

  return (
    <>
      {/* Overlay ด้านหลัง */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Popup ที่แสดงตรงกลาง */}
      <div className="fixed inset-0 flex justify-center items-center z-50 w-full ">
        <div className="bg-white border border-1 p-4 rounded-3xl shadow-lg w-[35%] h-[90%] grid grid-cols-1  grid-rows-[auto,1fr]">
          <div>
            <AiOutlineCloseCircle
              className="text-3xl place-self-end cursor-pointer"
              onClick={onClose}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <div>
              <h1>{product?.name}</h1>
            </div>
            <form onSubmit={handleAddToCart}>
              <div>
                {options.map((option) => (
                  <div key={option.id}>
                    <h3>{option.name}</h3>
                    <ul>
                      {groupedOptionItems[option.id]?.map((item) => (
                        <li key={item.id}>
                          <input
                            type="radio"
                            id={item.id}
                            name={`option-${option.id}`}
                            value={item.id}
                            onChange={() =>
                              handleOptionChange(option.id, item.id)
                            }
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

              <div className="flex flex-col">
                <label htmlFor="">รายละเอียดเพิ่มเติม</label>
                <input
                  type="text"
                  className="border border-2 border-black rounded-lg p-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">วันและเวลาที่ต้องการรับสินค้า</label>
                <input
                  type="datetime-local"
                  className="border border-2 border-black rounded-lg p-1"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex  px-3 border border-1 border-black rounded-2xl gap-x-2 items-center">
                  <FaMinus
                    className="cursor-pointer"
                    onClick={handleDecrease}
                  />
                  <h3>{quantity}</h3>
                  <FaPlus className="cursor-pointer" onClick={handleIncrease} />
                </div>
                <input type="hidden" name="quantity" value={quantity} />
                <div>
                  <h3>${product?.price}</h3>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <button
                    type="submit"
                    name="action"
                    value="add_to_cart"
                    className="border border-1 border-black px-2 rounded-2xl"
                  >
                    ADD TO CART
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    name="action"
                    value="buy_now"
                    className="bg-black px-2 border border-1 border-black rounded-2xl text-white"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
