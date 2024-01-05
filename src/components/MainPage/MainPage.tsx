import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageLoading from "../../common/PageLoading";
import PageNotFound from "../../common/PageNotFound";
import DashboardPage from "../DashboardPage/DashboardPage";
import LoginPage from "../LoginPage/LoginPage";
import OrdersPage from "../OrdersPage/OrdersPage";
import ProductsPage from "../ProductsPage/ProductsPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import ProfilePage from "../ProfilePage/ProfilePage";

const MainPage = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  const loginRedirect = isAuthenticated ? <Navigate to="/dashboard" /> : null;
  const loginComponent = <LoginPage />;


  if (isLoading) return <PageLoading />
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={loginRedirect || loginComponent} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
};

export default MainPage;
