"use client"

import { Product } from '../../../lib/interfaces/product';
import { Admin } from '../../../lib/interfaces/admin';
import { Category } from '../../../lib/interfaces/category';
import { getProducts, getAdmins, getCategories } from '../../../lib/services/getProduct';
import { deleteProduct } from '../../../lib/services/deleteProduct';
import { useState, useEffect } from 'react';

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  console.log("product :",products)
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

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    // Optionally, update the state to reflect the deletion
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  const adminMap = Object.fromEntries(admins.map(admin => [admin.id, `${admin.firstname} ${admin.lastname}`]));
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
            Admin: {adminMap[product.admin_id] || 'Unknown'}
            <br />
            Category: {categoryMap[product.category_id] || 'Unknown'}
            <br />
            <button onClick={() => handleDelete(product.id)}>Delete</button> {/* Pass product.id */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
