import { Product } from '../lib/interfaces/product';
import { Admin } from '../lib/interfaces/admin';
import { Category } from '../lib/interfaces/category';
import { getProducts, getAdmins, getCategories } from '../lib/services/getProduct';

const MenuPage = async () => {
  const products = await getProducts();
  const admins = await getAdmins();
  const categories = await getCategories();

  const adminMap = Object.fromEntries(admins.map(admin => [admin.id, `${admin.firstname} ${admin.lastname}`]));
  const categoryMap = Object.fromEntries(categories.map(category => [category.id, category.category_name]));


 
  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <strong>{product.product_name}</strong>: {product.price} ฿
            <br />
            Description: {product.description}
            <br />
            Admin: {adminMap[product.admin_id] || 'Unknown'} {/* ใช้ admin_id จาก product */}
            <br />
            Category: {categoryMap[product.category_id] || 'Unknown'} {/* ใช้ category_id จาก product */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;