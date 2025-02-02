
import Image from "next/image";
import { FaCirclePlus } from "react-icons/fa6";

const ProductCard = ({ product, index, togglePopup }: { product: any; index: number; togglePopup: (id: string) => void }) => (
    <div className="bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl w-72">
      <Image
        src={product.imageProduct}
        layout="responsive"
        width={1}
        height={1}
        style={{ aspectRatio: "1 / 1" }}
        alt={product.name}
        className="rounded-lg"
      />
      <h3 className="text-xl font-serif4 pt-2">
        {(index + 1).toString().padStart(2, "0")}
      </h3>
      <div className="flex justify-between pb-1">
        <h2 className="text-xl font-serif4 font-semibold">{product.name}</h2>
        <h3 className="font-serif4 text-xl font-semibold">${product.price}</h3>
      </div>
      <hr className="border-black" />
      <div className="flex pt-1 justify-between items-end">
        <p className="text-black text-md font-serif4">{product.description}</p>
        <div>
          <FaCirclePlus className="text-xl cursor-pointer" 
          onClick={() => togglePopup(product.id)}
          />
        </div>
      </div>
    </div>
  );
  

export default ProductCard;