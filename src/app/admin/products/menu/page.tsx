"use client";

import { Product } from "../../../interfaces/product";
import { productTypeInterface } from "../../../interfaces/productType";
import { getProducts, getProductType } from "../../../services/getProduct";
import { deleteProduct } from "../../../services/deleteProduct";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteProductOptionsByProductId } from "@/app/services/deleteProductOption";
import AddProductForm from "../addmenu/page";

const EditButton = ({ productId }: { productId: string }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/products/updatemenu/${productId}`);
  };

  return <button onClick={handleEdit}>Edit</button>;
};

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productType, setProductType] = useState<productTypeInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const productTypeData = await getProductType();
      setProducts(productsData);
      setProductType(productTypeData);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    try {
      await deleteProductOptionsByProductId(id);
      console.log("Product options deleted successfully.");
    } catch (error) {
      console.error("Error deleting product options:", error);
    }
  };

  const [createpopup, setCreatepopup] = useState(false)
  const productTypeMap = Object.fromEntries(
    productType.map((productType) => [productType.id, productType.name])
  );

 
  return (
    <div>
      <h1>Product List</h1>
      <button onClick={() => setCreatepopup(true)}>create</button>
      {createpopup && (
        <AddProductForm />
      )}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong>: {product.price} ฿
            <br />
            Calorie: {product.calorie}
            <br />
            Product Type: {productTypeMap[product.productType_id] || "Unknown"}
            <br />
            <button onClick={() => handleDelete(product.id || "")}>
              Delete
            </button>
            <EditButton productId={product.id || ""} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
