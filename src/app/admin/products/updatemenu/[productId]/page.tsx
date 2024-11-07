"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Product } from '../../../../interfaces/product';
import { getCategories } from "../../../../services/getproductType";
import { getCoffeeOptionByProductId, updateCoffeeOption } from "../../../../services/getcoffeeOption";

const UpdateProduct = () => {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { id: string; category_name: string }[]
  >([]);
  const [formValues, setFormValues] = useState({
    product_name: '',
    description: '',
    price: 0,
    admin_id: '',
    category_id: '',
    intensity: [] as string[], // จัดการค่า intensity แยกจาก Product
    sweetness: [] as string[], // จัดการค่า sweetness แยกจาก Product
  });

  useEffect(() => {
    if (productId) {
      const productIdString = Array.isArray(productId) ? productId[0] : productId;

      const fetchProduct = async () => {
        try {
          const productRef = doc(db, 'products', productIdString);
          const docSnap = await getDoc(productRef);

          if (docSnap.exists()) {
            const data = { id: productIdString, ...docSnap.data() } as Product;
            setProduct(data);
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              product_name: data.product_name,
              description: data.description,
              price: data.base_price,
              admin_id: data.admin_id,
              category_id: data.category_id,
            }));

            // ดึงค่า intensity และ sweetness จาก coffee_option
            const coffeeOptionData = await getCoffeeOptionByProductId(productIdString);
            if (coffeeOptionData) {
              setFormValues((prevFormValues) => ({
                ...prevFormValues,
                intensity: coffeeOptionData.intensity || [],
                sweetness: coffeeOptionData.sweetness || [],
              }));
            }
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

    // ดึง category list
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, [productId]);

  // ฟังก์ชันจัดการการเปลี่ยนค่าในฟอร์ม
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // ฟังก์ชันจัดการการเลือกค่า intensity
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (formValues.intensity.includes(value)) {
      setFormValues({
        ...formValues,
        intensity: formValues.intensity.filter((item) => item !== value),
      });
    } else {
      setFormValues({
        ...formValues,
        intensity: [...formValues.intensity, value],
      });
    }
  };

  // ฟังก์ชันจัดการการเลือกค่า sweetness
  const handleSweetnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (formValues.sweetness.includes(value)) {
      setFormValues({
        ...formValues,
        sweetness: formValues.sweetness.filter((item) => item !== value),
      });
    } else {
      setFormValues({
        ...formValues,
        sweetness: [...formValues.sweetness, value],
      });
    }
  };

  // ฟังก์ชันจัดการการ submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productId) {
        const productIdString = Array.isArray(productId) ? productId[0] : productId;
        try {
            // อัปเดตข้อมูลใน collection product
            const productRef = doc(db, 'products', productIdString);
            await updateDoc(productRef, {
                product_name: formValues.product_name,
                description: formValues.description,
                base_price: formValues.price,
                admin_id: formValues.admin_id,
                category_id: formValues.category_id,
            });

            // ตรวจสอบว่ามี coffee_option สำหรับ product นี้หรือไม่
            const coffeeOptionData = await getCoffeeOptionByProductId(productIdString);
            if (coffeeOptionData) {
                // ถ้ามี coffee_option แล้ว ให้ทำการอัปเดต
                await updateCoffeeOption(coffeeOptionData.id, {
                    intensity: formValues.intensity,
                    sweetness: formValues.sweetness,
                });

                alert('Product and coffee option updated successfully!');
            } else {
                setError('Coffee option not found for this product.');
            }
        } catch (error) {
            console.error(error); // แสดงข้อผิดพลาดใน console
            setError('Error updating product or coffee option.'); // แจ้งข้อผิดพลาดให้ผู้ใช้ทราบ
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
            <select
              name="category_id"
              value={formValues.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <label>Intensity</label>
          <div>
            <input
              type="checkbox"
              value="คั่วอ่อน (Ethiopai)"
              checked={formValues.intensity.includes("คั่วอ่อน (Ethiopai)")}
              onChange={handleIntensityChange}
            />
            คั่วอ่อน (Ethiopai)
            <input
              type="checkbox"
              value="คั่วกลาง (Brazil + Colombia)"
              checked={formValues.intensity.includes("คั่วกลาง (Brazil + Colombia)")}
              onChange={handleIntensityChange}
            />
            คั่วกลาง (Brazil + Colombia)
            <input
              type="checkbox"
              value="คั่วเข้ม (ปางขอน)"
              checked={formValues.intensity.includes("คั่วเข้ม (ปางขอน)")}
              onChange={handleIntensityChange}
            />
            คั่วเข้ม (ปางขอน)
          </div>

          <label>Sweetness</label>
        <div>
          <input
            type="checkbox"
            value="ไม่ใส่ไซรัป"
            checked={formValues.sweetness.includes("ไม่ใส่ไซรัป")}
            onChange={handleSweetnessChange}
            />
          ไม่ใส่ไซรัป
          <input
            type="checkbox"
            value="ไซรัป 10 ml หวานนิดเดียว"
            checked={formValues.sweetness.includes("ไซรัป 10 ml หวานนิดเดียว")}
            onChange={handleSweetnessChange}
          />
          ไซรัป 10 ml หวานนิดเดียว
        </div>

          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProduct;
