import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, ArrowRight, Loader } from "lucide-react";
import FormInput from "../components/FormInput";

const ResetPasswordForm = () => {
  const { passwordReset, loading } = useUserStore();
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL params

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    const result = await passwordReset(
      token,
      formData.newPassword,
      formData.confirmNewPassword
    );

    if (result) {
      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              required={true}
              placeholder="Enter your new password"
              icon={Lock}
              value={formData.newPassword}
              onChange={(value) =>
                setFormData({ ...formData, newPassword: value })
              }
            />

            <FormInput
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              required={true}
              placeholder="Confirm your new password"
              icon={Lock}
              value={formData.confirmNewPassword}
              onChange={(value) =>
                setFormData({ ...formData, confirmNewPassword: value })
              }
            />

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed
                         transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
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
                onClick={() => navigate("/login")}
                className="w-full flex justify-center py-2 px-4 border border-gray-600
                           rounded-md shadow-sm text-sm font-medium text-emerald-400
                           bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
                           focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
