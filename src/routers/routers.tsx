import { Route, Routes } from "react-router";
import PrivateRouters from "./private.routers";
import Analytics from "@/pages/analytics/analytics";
import Category from "@/pages/categories/categories";
import AddCategory from "@/pages/categories/addCategories";
import EditCategory from "@/pages/categories/editCategories";
import Discounts from "@/pages/discounts/discounts";
import DiscountsAdd from "@/pages/discounts/discounts.add.pages";
import DiscountsUpdate from "@/pages/discounts/discounts.update.pages";
import Users from "@/pages/users/UserPage";
import AdminUserPage from "@/pages/users/user";
import Comments from "@/pages/comment/comment";
import ProductsAdd from "@/pages/products/products.add.pages";
import ProductsPage from "@/pages/products/products";
import ProductsUpdate from "@/pages/products/products.update.pages";
import Orders from "@/pages/orders/orders";
import OrderList from "@/pages/orders/orders";
import OrderDetailPage from "@/pages/orders/orderDetail";
import AddVariant from "@/pages/variants/variantsAdd";
import VariantsList from "@/pages/variants/variants";
import UpdateVariant from "@/pages/variants/variantsUpdate";
const Routers = () => {
  const isAuthenticated = true;

  return (
    <Routes>
      <Route element={<PrivateRouters isAllowed={isAuthenticated ? true : false} redirectTo="/signin" />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Analytics />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route path="/categories" element={<Category />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/categories/update/:id" element={<EditCategory />} />

        <Route path="/discounts" element={<Discounts />} />
        <Route path="/discounts/add" element={<DiscountsAdd />} />
        <Route path="/discounts/update/:id" element={<DiscountsUpdate />} />

        <Route path="/users" element={<Users />} />
        <Route path="/user" element={<AdminUserPage />} />
        <Route path="/comments" element={<Comments />} />

        <Route path="/products/add" element={<ProductsAdd />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/update/:id" element={<ProductsUpdate />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/list" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        <Route path="/variants" element={<VariantsList />} />
        <Route path="/variants/add" element={<AddVariant />} />
        <Route path="/variants/:id/edit" element={<UpdateVariant />} />
      </Route>
      
    </Routes>
  );
};

export default Routers;
