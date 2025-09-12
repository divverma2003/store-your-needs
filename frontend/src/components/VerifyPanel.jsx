import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  TriangleAlert,
  Loader,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
const VerifyPanel = (props) => {
  const { loading, resendVerification, logout } = useUserStore();
  const navigate = useNavigate();
  const email = props.user?.email;

  // Simple redirect on success (with brief delay for visual confirmation)
  useEffect(() => {
    if (props.verificationStatus === "success") {
      const timer = setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 1500); // 1.5 second delay to show success message

      return () => clearTimeout(timer);
    }
  }, [props.verificationStatus, navigate]);

  const handleResendVerification = async () => {
    setTimeout(async () => {
      await resendVerification();
    }, 2000);
  };

  const VerifyButton = () => (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={handleResendVerification}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                 text-white py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ease-in-out"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Resend Verification Email
          </>
        )}
      </button>

      {/* Email display */}
      {email && (
        <div className="text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            Sending to:{" "}
            <span className="font-medium text-gray-300">{email}</span>
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="text-center max-w-sm">
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {props.verificationStatus === "verifying" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-300">
              Please wait while we confirm your email address...
            </p>
          </div>
        </div>
      )}

      {props.verificationStatus === "success" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-300 mb-4">
              Your account has been activated. You can now access all features.
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">
                Welcome to Store Your Needs! Redirecting to login...
              </p>
            </div>
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-md 
                       transition duration-300 ease-in-out inline-block font-medium"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      )}

      {props.verificationStatus === "error" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong with your email verification. Try Again?
            </h2>
            <p className="text-red-400 mb-4">{props.errorMessage}</p>
            <VerifyButton />
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyPanel;
