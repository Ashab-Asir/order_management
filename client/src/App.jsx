import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProductsPage from "./pages/admin/ProductsPage";
import PromotionsPage from "./pages/admin/PromotionsPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import NewOrderPage from "./pages/user/NewOrderPage";
import UserOrdersPage from "./pages/user/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Authenticated user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/orders/new" />} />
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/promotions" element={<PromotionsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Route>

        {/* Unknown path → redirect */}
        <Route path="*" element={<Navigate to="/orders/new" />} />
      </Routes>
    </Layout>
  );
}
