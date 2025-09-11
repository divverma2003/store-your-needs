import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// hooks
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore.js";
import { useCartStore } from "./stores/useCartStore.js";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// pages
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  // since we want the user to remain signed in after refresh, we'll have to use a useEffect

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Empty dependency array - only run once on mount

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]); // Depend on user, not getCartItems function

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient (non-interactive, sits above bg) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.28)_0%,rgba(10,80,60,0.18)_45%,rgba(0,0,0,0.08)_100%)]" />
      </div>

      {/* App content */}
      <div className="relative z-10">
        <Navbar />
        <div className="pt-25">
          {/* Add top padding to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Redirect to HomePage if user is logged in */}
            <Route
              path="/register"
              element={!user ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route
              path="secret-dashboard"
              element={
                user?.role === "admin" && user?.isVerified ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route
              path="/verify-email/:token"
              element={
                user && !user.isVerified ? (
                  <VerifyEmailPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/verify-email"
              element={
                user && !user.isVerified ? (
                  <VerifyEmailPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/purchase-success"
              element={
                user ? <PurchaseSuccessPage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/purchase-cancel"
              element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};

// TODO: Add Order History Page (must add backend routing too), Add Azure Foundry Integration
export default App;
