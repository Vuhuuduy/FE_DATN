import { Route, Routes } from "react-router";
import PrivateRouters from "./private.routers";
import Analytics from "@/pages/analytics/analytics";

const Routers = () => {
  const isAuthenticated = true;

  return (
    <Routes>
      <Route element={<PrivateRouters isAllowed={isAuthenticated ? true : false} redirectTo="/signin" />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Analytics />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers;
