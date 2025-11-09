import React, { useState } from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, LogIn, Lock, ArrowRight, Loader } from "lucide-react";

// Components
import FormInput from "../components/FormInput";

// Stores
import { useUserStore } from "../stores/useUserStore.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, requestPasswordReset } = useUserStore();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ email, password });
      // Clear password field after successful login attempt
      setPassword("");
    } catch (error) {
      // Clear password field even if login fails for security
      setPassword("");
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const result = await requestPasswordReset(resetEmail);
    if (result) {
      setResetEmail("");
      setTimeout(() => {
        setShowResetPassword(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated heading using Framer Motion */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }} // Start slightly above and transparent
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        <h2 className="m-6 text-center text-3xl font-extrabold text-emerald-400">
          {showResetPassword ? "Reset Your Password" : "Welcome Back"}
        </h2>
        {showResetPassword && (
          <p className="mt-2 mb-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a reset link
          </p>
        )}
      </motion.div>

      {/* Animated form container using Framer Motion */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }} // Start slightly below and transparent
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
      >
        {/* space-y-6 for spacing between children */}
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!showResetPassword ? (
            // Login Form
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="text"
                  required
                  placeholder="johnny@example.com"
                  icon={Mail}
                  value={email}
                  // parent props method to update state - receives just the value
                  onChange={(value) => setEmail(value)}
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  required
                  placeholder="************"
                  icon={Lock}
                  value={password}
                  // parent props method to update state - receives just the value
                  onChange={(value) => setPassword(value)}
                />

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                    hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader
                        className="mr-2 h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                      Loading...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                      Log in
                    </>
                  )}
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-gray-400">
                Not a member?{" "}
                <Link
                  to="/register"
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Register Now <ArrowRight className="inline h-4 w-4" />
                </Link>
              </p>
            </>
          ) : (
            // Password Reset Form
            <>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  placeholder="johnny@example.com"
                  icon={Mail}
                  value={resetEmail}
                  onChange={(value) => setResetEmail(value)}
                />

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                    hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader
                        className="mr-2 h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">
                      Remember your password?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className="w-full flex justify-center py-2 px-4 border border-gray-600
                      rounded-md shadow-sm text-sm font-medium text-emerald-400
                      bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
                      focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
