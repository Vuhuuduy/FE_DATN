import { Route, Routes } from "react-router";
import PrivateRouters from "./private.routers";
import Analytics from "@/pages/analytics/analytics";
import Category from "@/pages/categories/categories";
import AddCategory from "@/pages/categories/addCategories";
import EditCategory from "@/pages/categories/editCategories";

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
      </Route>
    </Routes>
  );
};

export default Routers;
