import { Route, Routes } from "react-router";
import PrivateRouters from "./private.routers";
import Analytics from "@/pages/analytics/analytics";
import Category from "@/pages/categories/categories";
import AddCategory from "@/pages/categories/addCategories";
import EditCategory from "@/pages/categories/editCategories";
import Discounts from "@/pages/discounts/discounts";
import DiscountsAdd from "@/pages/discounts/discounts.add.pages";
import DiscountsUpdate from "@/pages/discounts/discounts.update.pages";

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
      </Route>
    </Routes>
  );
};

export default Routers;
