import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  // Placeholder state
  const loading = true;
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Get Started
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
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      RegisterPage
    </div>
  );
};

export default RegisterPage;
