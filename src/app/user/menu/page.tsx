"use client"

import { Product } from '../../interfaces/product';
import { productTypeInterface } from '../../interfaces/productType';
import { getProducts,  getProductType } from '../../services/getProduct';
import { deleteProduct } from '../../services/deleteProduct';
import { useState, useEffect } from 'react';

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const [productType, setproductType] = useState<productTypeInterface[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const productTypeData = await getProductType();
      setProducts(productsData);
      setproductType(productTypeData);
    };
    
    fetchData();
  }, []);

  const handleAddtocart = async (id: string) => {

  };

  console.log("products : ",products)
  
  const productTypeMap = Object.fromEntries(productType.map(productType => [productType.id, productType.name]));

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <strong>{product.name}</strong>: {product.price} ฿
            <br />
            colorie : {product.calorie}
            <br />
           productType: {productTypeMap[product.productType_id] || 'Unknown'}
            <br />
            <button onClick={() => handleAddtocart(product.id)}>add to cart</button> {/* Pass product.id */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
