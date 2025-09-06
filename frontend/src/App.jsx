import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// hooks
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore.js";

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

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useUserStore();
  // since we want the user to remain signed in after refresh, we'll have to use a useEffect

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Empty dependency array - only run once on mount

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
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
            path="secret-dashboard"
            element={
              user?.role === "admin" && user?.isVerified ? (
                <AdminPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
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

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

// TODO: Add 404 Page Not Found Route, Add Email Verification Page, Add Order History Page (must add backend routing too), Add Azure Foundry Integration
export default App;
