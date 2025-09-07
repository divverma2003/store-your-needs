import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  LockOpen,
  User,
  ArrowRight,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { set } from "mongoose";

// Components
import FormInput from "../components/FormInput";

// Stores
import { useUserStore } from "../stores/useUserStore.js";

const RegisterPage = () => {
  // Placeholder state
  const { register, loading } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      await register(formData);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
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
          Create Your Account
        </h2>
      </motion.div>
      {/* Animated form container using Framer Motion */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }} // Start slightly bellow and transparent
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
      >
        {/* space-y-6 for spacing between children */}
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              // parent props method to update state - receives just the value
              onChange={(value) => setFormData({ ...formData, name: value })}
            />
            <FormInput
              label="Email Address"
              name="email"
              type="text"
              required
              placeholder="johnny@example.com"
              icon={Mail}
              value={formData.email}
              // parent props method to update state - receives just the value
              onChange={(value) => setFormData({ ...formData, email: value })}
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              required
              placeholder="************"
              icon={LockOpen}
              value={formData.password}
              // parent props method to update state - receives just the value
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
            />
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="************"
              icon={Lock}
              value={formData.confirmPassword}
              // parent props method to update state - receives just the value
              onChange={(value) =>
                setFormData({ ...formData, confirmPassword: value })
              }
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
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Register
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Have an Account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Login Instead <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
