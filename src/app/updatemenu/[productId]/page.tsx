"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../lib/interfaces/product';

const UpdateProduct = () => {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    product_name: '',
    description: '',
    price: 0,
    admin_id: '',
    category_id: '',
  });

  useEffect(() => {
    if (productId) {
      const productIdString = Array.isArray(productId) ? productId[0] : productId;
      const fetchProduct = async () => {
        try {
          const productRef = doc(db, 'product', productIdString);
          const docSnap = await getDoc(productRef);

          if (docSnap.exists()) {
            const data = { id: productIdString, ...docSnap.data() } as Product;
            setProduct(data);
            setFormValues({
              product_name: data.product_name,
              description: data.description,
              price: data.price,
              admin_id: data.admin_id,
              category_id: data.category_id,
            });
          } else {
            setError('No such product!');
          }
        } catch (error) {
          setError('Error fetching product details.');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productId) {
// ตรวจสอบและบังคับให้ productId เป็น string
      const productIdString = Array.isArray(productId) ? productId[0] : productId;
      try {
        const productRef = doc(db, 'product', productIdString);
        await updateDoc(productRef, formValues);
        alert('Product updated successfully!');
        router.push('/product'); // Redirect to product list or any other page
      } catch (error) {
        setError('Error updating product.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Update Product</h1>
      {product && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formValues.product_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Admin</label>
            <input
              type="text"
              name="admin_id"
              value={formValues.admin_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Category</label>
            <input
              type="text"
              name="category_id"
              value={formValues.category_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProduct;
