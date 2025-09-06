import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  TriangleAlert,
  Loader2,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";

const VerifyPanel = (props) => {
  const [inputEmail, setInputEmail] = useState("");
  const { loading, resendVerification } = useUserStore();

  const providedEmail = props.user?.email;
  const email = providedEmail || inputEmail;

  const handleResendVerification = async () => {
    setTimeout(async () => {
      await resendVerification();
    }, 2000);
  };

  const VerifyButton = () => (
    <div className="flex flex-col items-center space-y-3">
      {/* Email input field when no email is provided */}
      {!providedEmail && (
        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Enter your email to resend verification:
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleResendVerification}
        disabled={loading || !email}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                 text-white py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ease-in-out"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
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
              <LoadingSpinner className="w-8 h-8 text-emerald-400 animate-spin" />
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
                Welcome to Store Your Needs! Redirecting to homepage in 10
                seconds...
              </p>
            </div>
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-md 
                       transition duration-300 ease-in-out inline-block font-medium"
            >
              Continue to Homepage
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
              Your email verification failed. Try Again?
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
