"use client"

import { Product } from '../../interfaces/product';
import { Admin } from '../../interfaces/admin';
import { Category } from '../../interfaces/category';
import { getProducts, getAdmins, getCategories } from '../../services/getProduct';
import { deleteProduct } from '../../services/deleteProduct';
import { useState, useEffect } from 'react';

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const adminsData = await getAdmins();
      const categoriesData = await getCategories();
      setProducts(productsData);
      setAdmins(adminsData);
      setCategories(categoriesData);
    };
    
    fetchData();
  }, []);

  const handleAddtocart = async (id: string) => {

  };

  
  const categoryMap = Object.fromEntries(categories.map(category => [category.id, category.category_name]));

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <strong>{product.product_name}</strong>: {product.base_price} ฿
            <br />
            Description: {product.description}
            <br />
            Category: {categoryMap[product.category_id] || 'Unknown'}
            <br />
            <button onClick={() => handleAddtocart(product.id)}>add to cart</button> {/* Pass product.id */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
